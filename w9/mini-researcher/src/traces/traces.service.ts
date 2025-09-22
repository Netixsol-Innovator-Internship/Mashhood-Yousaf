import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TracesService {
  constructor(@InjectModel('Trace') private traceModel: Model<any>) {}

  async saveTrace(questionId: string, steps: any[]) {
    return this.traceModel.create({ questionId, steps });
  }

  async getTrace(questionId: string) {
    return this.traceModel.findOne({ questionId }).lean();
  }
}
