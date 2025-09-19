import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as pdfParse from 'pdf-parse';
import axios from 'axios';
// import { PdfDocument } from './schemas/pdf.schema';
import { PdfDocument } from './schemas/pdfSchema';
import { Session } from './schemas/session.schema';



@Injectable()
export class PdfService {
  constructor(
    @InjectModel(PdfDocument.name) private pdfModel: Model<PdfDocument>,
    @InjectModel(Session.name) private sessionModel: Model<Session>,
  ) {}

  async extractAndSave(buffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(buffer);
      const text = data.text;

      if (!text || text.trim().length === 0) {
        throw new InternalServerErrorException(
          'Failed to extract text from PDF',
        );
      }

      // Save the PDF text
      const pdfDoc = await this.pdfModel.create({ text });

      // Create session with TTL
      const session = await this.sessionModel.create({
        pdf: pdfDoc._id,
        createdAt: new Date(),
      });

      return session._id.toString();
    } catch (error) {
      console.error('extractAndSave error:', error);
      throw new InternalServerErrorException('PDF processing failed');
    }
  }

  async ask(sessionId: string, question: string): Promise<string> {
    try {
      const session = await this.sessionModel
        .findById(sessionId)
        .populate('pdf')
        .exec();

      if (!session || !session.pdf) {
        throw new InternalServerErrorException('Session or PDF not found');
      }

      const context = (session.pdf as any).text;

      // Send to Gemini
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Answer the quesDtion ONLY using this PF context:\n\n${context}\n\nQuestion: ${question}`,
                },
              ],
            },
          ],
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const candidates = response.data.candidates;
      if (!candidates || candidates.length === 0) {
        return 'No response from Gemini';
      }

      return candidates[0].content.parts[0].text || 'No answer text';
    } catch (error) {
  console.error('ask error full:', error.response?.data || error.message);
  throw new InternalServerErrorException(
    error.response?.data || 'Gemini request failed',
  );
}
}
}