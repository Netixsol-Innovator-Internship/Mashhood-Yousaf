import { Injectable } from '@nestjs/common';
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from '@langchain/google-genai';

@Injectable()
export class GeminiService {
  private llm: ChatGoogleGenerativeAI;
  private embedder: GoogleGenerativeAIEmbeddings;

  constructor() {
    this.llm = new ChatGoogleGenerativeAI({
      model: 'gemini-2.0-flash',
      apiKey: process.env.GEMINI_API_KEY,
    });

  }

  async generateText(prompt: string): Promise<string> {
    const res = await this.llm.invoke(prompt);
    return res.content.toString();
  }

}
