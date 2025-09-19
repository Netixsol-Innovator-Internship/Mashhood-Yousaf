/* eslint-disable prettier/prettier */
// backend/src/gemini/gemini.service.ts
import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeminiService {
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  private apiKey: string;
  private bearer: string | undefined;
  private model: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    // Optional: if you have an OAuth Bearer token (rare); if you don't set this, leave undefined
    this.bearer = process.env.GEMINI_BEARER_TOKEN || undefined;
    this.model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

    if (!this.apiKey && !this.bearer) {
      console.warn(
        'No Gemini credentials found in env (GEMINI_API_KEY or GEMINI_BEARER_TOKEN). Calls will fail.',
      );
    }
    if (!this.model) {
      console.warn('No GEMINI_MODEL set, defaulting to gemini-2.0-flash');
      this.model = 'gemini-2.0-flash';
    }
  }

  private buildUrl() {
    // Use key param when apiKey is present. It's ok to include even if bearer exists.
    const keyPart = this.apiKey
      ? `?key=${encodeURIComponent(this.apiKey)}`
      : '';
    return `${this.baseUrl}/models/${encodeURIComponent(this.model)}:generateContent${keyPart}`;
  }

  private buildHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.bearer) headers['Authorization'] = `Bearer ${this.bearer}`;
    // Note: if you only have an API key (the common case for AI Studio keys), the key= query param above is used.
    return headers;
  }

  /**
   * Ask Gemini with strict system instruction to limit answers to the provided context.
   * Returns trimmed text or throws an exception on failure.
   */
  async ask(pdfText: string, question: string): Promise<string> {
    if (!pdfText || !question) {
      throw new HttpException('pdfText and question required', 400);
    }

    const url = this.buildUrl();
    const headers = this.buildHeaders();

    const systemInstruction = `You are a strict assistant. Use ONLY the provided PDF text below to answer the user's question.
If the answer cannot be found or inferred from the PDF text, reply exactly: "Not found in PDF".
Do not add any extra information, do not hallucinate, be concise.`;

    // Combine but keep the prompt short — caller is expected to pass small PDFs.
    // If your PDF is long, chunk it or pass relevant parts only.
    const prompt = [
      { role: 'system', content: systemInstruction },
      {
        role: 'user',
        content: `PDF TEXT START\n\n${pdfText}\n\nPDF TEXT END\n\nQuestion: ${question}\n\nAnswer:`,
      },
    ];

    const body = {
      system_instruction: { parts: [{ text: systemInstruction }] },
      // `contents` is the main text to generate from
      contents: [
        {
          parts: [
            {
              text: `PDF Text:\n${pdfText}\n\nQuestion: ${question}\n\nAnswer:`,
            },
          ],
        },
      ],
      // Optional low temperature for deterministic answers
      // generationConfig: { temperature: 0.0, maxOutputTokens: 512 },
    };

    try {
      const res = await axios.post(url, body, {
        headers,
        timeout: 20000,
        validateStatus: (s) => s < 500, // let 4xx be handled below
      });

      if (res.status >= 400) {
        const errMsg = res.data?.error?.message || `HTTP ${res.status}`;
        throw new Error(`Gemini API error: ${errMsg}`);
      }

      const data = res.data;

      // Robust parsing — different SDK/versions vary
      // 1) new: data.candidates[0].content[0].parts[0].text
      // 2) fallback: data.candidates[0].content[0].text
      // 3) fallback: data.text
      let text: string | undefined;

      const candidate = data?.candidates?.[0];
      if (candidate) {
        const content = candidate?.content?.[0];
        text = content?.parts?.[0]?.text || content?.text || candidate?.text;
      }

      if (!text && data?.text) text = data.text;
      if (!text) {
        // debug log for troubleshooting
        console.error(
          'Gemini raw response:',
          JSON.stringify(data).slice(0, 2000),
        );
        throw new Error('Empty response from Gemini');
      }

      return String(text).trim();
    } catch (err: any) {
      const message =
        err?.response?.data?.error?.message ||
        err?.message ||
        'Unknown Gemini error';
      console.error('GeminiService error:', message);
      throw new HttpException(`Gemini API request failed: ${message}`, 500);
    }
  }
}
