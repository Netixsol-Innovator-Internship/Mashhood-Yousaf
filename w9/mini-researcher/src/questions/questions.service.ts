import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class QuestionsService {
  constructor(@InjectModel('Question') private questionModel: Model<any>) {}

  async create(questionText: string) {
    return this.questionModel.create({ questionText });
  }

  async updateAnswer(id: string, answer: string) {
    return this.questionModel.findByIdAndUpdate(id, { finalAnswer: answer });
  }

  async findById(id: string) {
    return this.questionModel.findById(id).lean();
  }
}
