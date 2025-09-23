import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any,
    @Query('format') format: string,
  ) {
    if (!['test', 'odi', 't20'].includes(format)) {
      throw new BadRequestException('Invalid format. Use test, odi, or t20.');
    }

    return this.uploadService.processCSV(file.buffer, format);
  }
}
