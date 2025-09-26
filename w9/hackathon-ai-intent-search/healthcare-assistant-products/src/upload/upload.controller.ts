import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  // BadRequestException,
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
    return this.uploadService.processCSV(file.buffer, format);
  }
}
