// src/symptom-mapper/symptom-mapper.service.ts
import { Injectable } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

@Injectable()
export class SymptomMapperService {
  private model: ChatGoogleGenerativeAI;

  constructor() {
    this.model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY!,
      model: 'gemini-2.5-flash',
    });
  }

  async analyzeSymptoms(symptoms: string): Promise<{
    categories: string[];
    keywords: string[];
    explanation: string;
    confidence: number;
  }> {
    const prompt = `
You are a healthcare assistant that analyzes symptoms and maps them to relevant supplement categories.

SYMPTOMS: "${symptoms}"

Analyze the symptoms and determine which supplement categories would be most relevant. Consider:

1. Common nutritional deficiencies linked to these symptoms
2. Evidence-based supplement recommendations
3. Product categories that address the root causes

Return a JSON response with:
- categories: array of relevant supplement categories (e.g., ["Vitamin B Complex", "Iron Supplements", "Omega-3"])
- keywords: array of search keywords for product matching
- explanation: brief medical reasoning (2-3 sentences)
- confidence: number between 0-1 indicating match confidence

Examples:

Symptoms: "I feel tired and weak all the time"
Response: {
  "categories": ["Vitamin B Complex", "Iron Supplements", "Multivitamin"],
  "keywords": ["energy", "fatigue", "vitamin b", "iron"],
  "explanation": "Fatigue and weakness can be linked to iron deficiency anemia or B-vitamin deficiencies which are essential for energy production.",
  "confidence": 0.85
}

Symptoms: "My hair is falling out and breaking easily"
Response: {
  "categories": ["Biotin", "Zinc", "Collagen", "Multivitamin"],
  "keywords": ["hair", "biotin", "zinc", "collagen", "keratin"],
  "explanation": "Hair loss can be associated with biotin, zinc, or protein deficiencies which are crucial for hair follicle health and growth.",
  "confidence": 0.8
}

Symptoms: "I have joint pain and inflammation"
Response: {
  "categories": ["Omega-3", "Glucosamine", "Turmeric", "MSM"],
  "keywords": ["joint", "inflammation", "omega-3", "glucosamine", "turmeric"],
  "explanation": "Joint pain and inflammation often respond well to anti-inflammatory supplements like omega-3s and turmeric, or joint support compounds like glucosamine.",
  "confidence": 0.9
}

Now analyze the provided symptoms and return ONLY the JSON response:
`;

    try {
      const response = await this.model.invoke(prompt);
      const responseText = this.extractContent(response);
      const cleanedResponse = this.cleanJsonResponse(responseText);
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('❌ Error analyzing symptoms:', error);
      // Fallback to generic analysis
      return {
        categories: ['Multivitamin', 'General Health'],
        keywords: this.extractKeywords(symptoms),
        explanation:
          'Based on your symptoms, here are some general health supplements that might help.',
        confidence: 0.5,
      };
    }
  }

  private extractContent(response: any): string {
    if (typeof response.content === 'string') {
      return response.content;
    }
    if (Array.isArray((response.content as any)?.parts)) {
      return (
        (response.content as any).parts.map((p: any) => p.text).join('\n') || ''
      );
    }
    return JSON.stringify(response.content) || '';
  }

  private cleanJsonResponse(responseText: string): string {
    let cleaned = responseText.trim();

    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3);
    }

    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3);
    }

    const lastBrace = Math.max(
      cleaned.lastIndexOf('}'),
      cleaned.lastIndexOf(']'),
    );
    if (lastBrace !== -1) {
      cleaned = cleaned.slice(0, lastBrace + 1);
    }

    return cleaned;
  }

  private extractKeywords(symptoms: string): string[] {
    const commonWords = new Set([
      'i',
      'feel',
      'have',
      'am',
      'my',
      'the',
      'and',
      'or',
      'but',
      'with',
    ]);
    const words = symptoms
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((word) => word.length > 2 && !commonWords.has(word));

    return [...new Set(words)]; // Remove duplicates
  }
}
