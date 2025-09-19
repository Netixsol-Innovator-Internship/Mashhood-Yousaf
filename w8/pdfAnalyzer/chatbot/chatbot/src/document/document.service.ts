import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import pdfParse from 'pdf-parse';
import { PdfDocModel } from './schema/document.schema';
import { GeminiService } from '../gemini.service';

import { StateGraph, Annotation } from '@langchain/langgraph';

@Injectable()
export class PdfProcessingService {
  constructor(
    @InjectModel(PdfDocModel.name)
    private readonly pdfDocModel: Model<PdfDocModel>,
    private readonly geminiService: GeminiService,
  ) {}

  async extractAndSave(file: Express.Multer.File) {
    const parsedPdf = await pdfParse(file.buffer);
    const entireText = parsedPdf.text;

    // Define document annotations state
    const DocumentState = Annotation.Root({
      fullText: Annotation<string>,
      textChunks: Annotation<string[]>,
      summaryText: Annotation<string>,
      documentType: Annotation<string>,
      keyHighlights: Annotation<string[]>,
    });

    // Build processing graph
    const pipelineGraph = new StateGraph(DocumentState)
      .addNode('splitText', async (state) => {
        const chunks: string[] = [];
        for (let i = 0; i < state.fullText.length; i += 1000) {
          chunks.push(state.fullText.slice(i, i + 1000));
        }
        return { textChunks: chunks };
      })

      .addNode('generateSummary', async (state) => {
        const summaryOutput = await this.geminiService.generateText(
          `Please summarize the following content:\n${state.fullText.substring(0, 3500)}`,
        );
        return { summaryText: summaryOutput };
      })

      .addNode('identifyCategory', async (state) => {
        const categoryOutput = await this.geminiService.generateText(
          `Classify the document as one of: Research Paper, Resume, Business Report, User Manual, Other.\nContent snippet:\n${state.fullText.substring(0, 1000)}`,
        );
        return { documentType: categoryOutput };
      })

      .addNode('extractHighlights', async (state) => {
        const highlightsRaw = await this.geminiService.generateText(
          `List  2 to 5 key bullet points from the document:\n${state.fullText.substring(0, 3000)}`,
        );
        const highlightsArr = highlightsRaw
          .split('\n')
          .filter((line) => line.trim());
        return { keyHighlights: highlightsArr };
      });

    pipelineGraph
      .addEdge('__start__', 'splitText')
      .addEdge('splitText', 'generateSummary')
      .addEdge('generateSummary', 'identifyCategory')
      .addEdge('identifyCategory', 'extractHighlights')
      .addEdge('extractHighlights', '__end__');

    const compiledPipeline = pipelineGraph.compile();

    const processedData = await compiledPipeline.invoke({
      fullText: entireText,
    });

    const newDocumentEntry = new this.pdfDocModel({
      filename: file.originalname,
      summary: processedData.summaryText,
      category: processedData.documentType,
      highlights: processedData.keyHighlights,
    });

    return newDocumentEntry.save();
  }

  async answerUserQuery(documentId: string, question: string) {
    const storedDoc = await this.pdfDocModel.findById(documentId);
    if (!storedDoc) return { answer: 'Document not found' };

    const combinedContext = [
      storedDoc.summary,
      storedDoc.category,
      ...storedDoc.highlights,
    ].join('\n');

    const promptText = `Using only the content below, answer the question. If information is missing, respond with "please write a more detailed query or make sure the query is related to extracted text".

Context:
${combinedContext}

Question: What is ${question}?`;

    const response = await this.geminiService.generateText(promptText);
    return { answer: response };
  }
}
