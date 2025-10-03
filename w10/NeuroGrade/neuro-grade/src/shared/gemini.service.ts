import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    });
  }

  async evaluateAssignment(
    assignmentInstructions: string,
    studentText: string,
    gradingMode: 'strict' | 'loose',
    minLength: number,
  ): Promise<{ score: number; remarks: string; details: string }> {
    const prompt = this.buildEvaluationPrompt(
      assignmentInstructions,
      studentText,
      gradingMode,
      minLength,
    );

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseEvaluationResponse(text);
    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        score: 0,
        remarks: 'Evaluation failed',
        details: 'AI evaluation service unavailable',
      };
    }
  }

  private buildEvaluationPrompt(
    instructions: string,
    studentText: string,
    gradingMode: string,
    minLength: number,
  ): string {
    return `
    You are an assignment evaluation AI. Evaluate the student's submission based on the following criteria:

    ASSIGNMENT INSTRUCTIONS: ${instructions}
    MINIMUM LENGTH: ${minLength} words
    GRADING MODE: ${gradingMode}

    STUDENT SUBMISSION:
    ${studentText}

    Please evaluate and provide response in EXACTLY this format:
    SCORE: [number between 0-100]
    REMARKS: [brief feedback]
    DETAILS: [detailed evaluation covering: relevance to topic, structure, length compliance, quality of content]

    For ${gradingMode} marking:
    ${
      gradingMode === 'strict'
        ? 'Penalize heavily for off-topic content, insufficient length, poor structure'
        : 'Be more flexible, reward effort, focus on key ideas rather than perfection'
    }
    `;
  }

  private parseEvaluationResponse(response: string): {
    score: number;
    remarks: string;
    details: string;
  } {
    const lines = response.split('\n');
    let score = 0;
    let remarks = '';
    let details = '';

    for (const line of lines) {
      if (line.startsWith('SCORE:')) {
        const scoreMatch = line.match(/SCORE:\s*(\d+)/);
        score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
      } else if (line.startsWith('REMARKS:')) {
        remarks = line.replace('REMARKS:', '').trim();
      } else if (line.startsWith('DETAILS:')) {
        details = line.replace('DETAILS:', '').trim();
      }
    }

    // If we couldn't parse properly, provide defaults
    if (score === 0 && remarks === '' && details === '') {
      remarks = 'Unable to parse evaluation response';
      details = response;
    }

    return { score, remarks, details };
  }
}
