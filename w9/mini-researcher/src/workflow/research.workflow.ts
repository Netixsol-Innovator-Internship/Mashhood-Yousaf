import { Injectable } from '@nestjs/common';
import { DocumentsService } from '../documents/documents.service';
import { QuestionsService } from '../questions/questions.service';
import { TracesService } from '../traces/traces.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Escape special characters in regex
function escapeRegex(word: string) {
  return word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class WorkflowService {
  private gemini: GoogleGenerativeAI;

  constructor(
    private documentsService: DocumentsService,
    private questionsService: QuestionsService,
    private tracesService: TracesService,
  ) {
    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }

  async runWorkflow(questionText: string) {
    const question = await this.questionsService.create(questionText);

    type TraceStep = {
      stepName: string;
      input: any;
      output: any;
    };

    const traceSteps: TraceStep[] = [];

    // Step 1 - Question Splitter
    const splitPrompt = `
      Split this question into smaller, clear sub-questions (bullet list):
      Question: "${questionText}"
    `;

    const chatSession = this.gemini.getGenerativeModel({
      model: 'gemini-2.0-flash',
    });

    const splitResponse = await chatSession.generateContent(splitPrompt);
    const rawSplit = splitResponse.response.text();

    const subQuestions = rawSplit
      .split('\n')
      .map((line) => line.replace(/^[\-\*\d\.\s]+/, '').trim())
      .filter(Boolean);

    traceSteps.push({
      stepName: 'Question Splitter',
      input: questionText,
      output: subQuestions,
    });

    // Step 2 & 3 - Document Finder & Ranker
    const allSummaries: string[] = [];

    for (const subQ of subQuestions) {
      const docs = await this.documentsService.findDocsByKeyword(subQ);

      const scoredDocs = docs.map((doc) => {
        const score = subQ
          .toLowerCase()
          .split(/\s+/)
          .reduce((acc, word) => {
            const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'gi'); // ✅ FIXED
            return acc + (doc.content.match(regex) || []).length;
          }, 0);
        return { doc, score };
      });

      scoredDocs.sort((a, b) => b.score - a.score);
      const topDocs = scoredDocs.slice();

      traceSteps.push({
        stepName: 'Document Finder & Ranker',
        input: subQ,
        output: topDocs.map(({ doc, score }) => ({
          title: doc.title,
          score,
        })),
      });

      // Step 4 - Summarizer
      for (const { doc } of topDocs) {
        const sentences = doc.content.match(/[^\.!\?]+[\.!\?]+/g) || [
          doc.content,
        ];
        const sentenceScores = sentences.map((sentence) => {
          const score = subQ
            .toLowerCase()
            .split(/\s+/)
            .reduce((acc, word) => {
              const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'gi'); // ✅ FIXED
              return acc + (sentence.match(regex) || []).length;
            }, 0);
          return { sentence, score };
        });
        sentenceScores.sort((a, b) => b.score - a.score);
        const summary = sentenceScores
          .slice()
          .map((s) => s.sentence.trim())
          .join(' ');

        allSummaries.push(summary);
      }
    }

    traceSteps.push({
      stepName: 'Summarizer',
      input: subQuestions,
      output: allSummaries,
    });

    // Step 5 - Final Answer Generator
    const finalPrompt = `
      Using the following summarized information, answer this question clearly:

      Question: ${questionText}

      Information:
      ${allSummaries.join('\n\n')}
    `;

    const finalResponse = await chatSession.generateContent(finalPrompt);
    const finalAnswer = finalResponse.response.text();

    await this.questionsService.updateAnswer(question._id, finalAnswer);

    traceSteps.push({
      stepName: 'Answer Generator',
      input: finalPrompt,
      output: finalAnswer,
    });

    // Save trace
    await this.tracesService.saveTrace(question._id, traceSteps);

    return {
      questionId: question._id,
      answer: finalAnswer,
      trace: traceSteps,
    };
  }
}
