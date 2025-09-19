/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import pdfParse from 'pdf-parse';
import { PDFDocument } from './schema/document.schema';
import { GeminiService } from '../gemini.service';

import { StateGraph, Annotation } from '@langchain/langgraph';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(PDFDocument.name) private docModel: Model<PDFDocument>,
    private gemini: GeminiService,
  ) {}

  async processPDF(file: Express.Multer.File) {
    const pdfData = await pdfParse(file.buffer);
    const text = pdfData.text;

    //  State  
    const DocState = Annotation.Root({
      text: Annotation<string>,
      chunks: Annotation<string[]>,
      summary: Annotation<string>,
      category: Annotation<string>,
      highlights: Annotation<string[]>,
    });

    //  Graph  
    const graph = new StateGraph(DocState)
      // Split PDF into streams
      .addNode('split', async (state) => {
        const chunks: string[] = [];
        for (let i = 0; i < state.text.length; i += 1000) {
          chunks.push(state.text.slice(i, i + 1000));
        }
        console.log(chunks);
        return { chunks };
      })

      .addNode('summarize', async (state) => {
        const summary = await this.gemini.generateText(
          `Summarize this document:\n${state.text.substring(0, 3000)}`,
        );
        // console.log(summary);
        return { summary };
      })

      .addNode('categorize', async (state) => {
        const category = await this.gemini.generateText(
          `Classify into: Research Paper, Resume , Business Report, User Manual, Other:\n${state.text.substring(0, 1000)}`,
        );
        return { category };
      })

      .addNode('highlight', async (state) => {
        const highlightsRaw = await this.gemini.generateText(
          `Give 5 bullet highlights:\n${state.text.substring(0, 2000)}`,
        );
        const highlights = highlightsRaw.split('\n').filter(Boolean);
        return { highlights };
      });

    graph
      .addEdge('__start__', 'split')
      .addEdge('split', 'summarize')
      .addEdge('summarize', 'categorize')
      .addEdge('categorize', 'highlight')
      .addEdge('highlight', '__end__');

    const app = graph.compile();

    // langgraph Pipeline
    const result = await app.invoke({ text });

    const newDoc = new this.docModel({
      filename: file.originalname,
      summary: result.summary,
      category: result.category,
      highlights: result.highlights,
    });

    return newDoc.save();
  }

  async askQuestion(docId: string, question: string) {
    const doc = await this.docModel.findById(docId);
    if (!doc) return { answer: 'Document not found' };

    const context =
      doc.summary + '\n' + doc.category + '\n' + doc.highlights.join('\n');
   const prompt = `Respond only using the provided document content. Write . If the information is missing, reply with "Answer not found in document".

    Context:
    ${context}

    Question: What is  ${question}?`;

    const answer = await this.gemini.generateText(prompt);
    return { answer };
  }
}
