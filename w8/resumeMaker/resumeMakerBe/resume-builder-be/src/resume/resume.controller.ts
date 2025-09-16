import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  Res,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { ResumeService } from './resume.service';

@Controller('resume')
@UseGuards(AuthGuard())
export class ResumeController {
  constructor(private resumeService: ResumeService) {}

  @Post('create')
  async createResume(@Req() req, @Body() resumeData: any) {
    return this.resumeService.createResume(req.user._id, resumeData);
  }

  @Get('my-resumes')
  async getUserResumes(@Req() req) {
    return this.resumeService.getUserResumes(req.user._id);
  }

  @Get(':id')
  async getResume(@Param('id') id: string) {
    return this.resumeService.getResumeById(id);
  }

  @Get(':id/pdf')
  async getResumePDF(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.resumeService.generatePDF(id);
    const resume = await this.resumeService.getResumeById(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${resume.fullName}_CV.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }

  @Get(':id/docx')
  async getResumeDOCX(@Param('id') id: string, @Res() res: Response) {
    const docxBuffer = await this.resumeService.generateDOCX(id);
    const resume = await this.resumeService.getResumeById(id);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename=${resume.fullName}_CV.docx`,
      'Content-Length': docxBuffer.length,
    });

    res.end(docxBuffer);
  }

  @Delete(':id')
  async deleteResume(@Req() req, @Param('id') id: string) {
    return this.resumeService.deleteResume(req.user._id, id);
  }
}
