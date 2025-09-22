import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DocumentsService {
  constructor(@InjectModel('Document') private documentModel: Model<any>) {}

  // Helper function to escape special regex characters
  private escapeRegex(word: string): string {
    return word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async uploadDoc(data: { title: string; topic: string; content: string }) {
    return this.documentModel.create(data);
  }

  async findDocsByKeyword(keyword: string) {
    const escapedPhrase = this.escapeRegex(keyword.trim());
    const phraseRegex = new RegExp(escapedPhrase, 'i');

    const words = keyword
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => new RegExp(this.escapeRegex(word), 'i'));

    return this.documentModel
      .find({
        $or: [
          { content: { $regex: phraseRegex } },
          ...words.map((regex) => ({ content: { $regex: regex } })),
        ],
      })
      .limit(10)
      .lean();
  }
}
