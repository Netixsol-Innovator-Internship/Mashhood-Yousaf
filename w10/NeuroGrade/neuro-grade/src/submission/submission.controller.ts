import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SubmissionService } from './submission.service';
import { EvaluateSubmissionsDto } from './dto/evaluate-submissions.dto';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + '-' + file.originalname);
        },
      }),
    }),
  )
  async uploadSubmissions(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: { assignmentId: string },
  ) {
    return this.submissionService.processUploads(files, body.assignmentId);
  }

  @Post('evaluate')
  async evaluateSubmissions(@Body() evaluateDto: EvaluateSubmissionsDto) {
    return this.submissionService.evaluateSubmissions(evaluateDto);
  }

  @Get('assignment/:assignmentId')
  async getSubmissionsByAssignment(
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.submissionService.findByAssignment(assignmentId);
  }

  @Get('marksheet/:assignmentId')
  async generateMarksheet(@Param('assignmentId') assignmentId: string) {
    return this.submissionService.generateMarksheet(assignmentId);
  }
}
