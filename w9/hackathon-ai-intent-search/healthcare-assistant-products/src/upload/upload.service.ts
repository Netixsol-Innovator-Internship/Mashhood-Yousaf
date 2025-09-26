import { Injectable } from '@nestjs/common';
import { MongoService } from '../mongo/mongo.service';
import  csv from 'csvtojson';

@Injectable()
export class UploadService {
  constructor(private readonly mongoService: MongoService) {}

  async processCSV(buffer: Buffer, format: string) {
    const csvStr = buffer.toString('utf-8');
    const jsonData = await csv().fromString(csvStr);

    await this.mongoService.insertMany(format, jsonData);

    return {
      message: 'Upload and import successful',
      inserted: jsonData.length,
    };
  }
}
