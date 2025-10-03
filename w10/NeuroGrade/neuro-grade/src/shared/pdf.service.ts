import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class PdfService {
  async extractTextFromPdf(
    filePath: string,
  ): Promise<{ text: string; wordCount: number }> {
    try {
      // Use require for pdf-parse which works better in Node.js
      const pdfParse = require('pdf-parse');
      const dataBuffer = fs.readFileSync(filePath);

      const data = await pdfParse(dataBuffer);
      const text = data.text;
      const wordCount = text
        .split(/\s+/)
        .filter((word: string) => word.length > 0).length;

      return { text, wordCount };
    } catch (error: any) {
      console.error('PDF Extraction Error:', error);
      throw new Error(`Failed to extract PDF text: ${error.message}`);
    }
  }
}
