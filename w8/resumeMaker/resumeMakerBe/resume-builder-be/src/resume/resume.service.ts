import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Resume } from './schemas/resume.schema';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: Model<Resume>,
  ) {}

  // async createResume(userId: string, resumeData: any): Promise<Resume> {
  //   // const resume = await this.resumeModel.create({
  //   //   userId,
  //   //   ...resumeData,
  //   // });

  //   return resume;
  // }
  async createResume(userId: string, resumeData: any): Promise<Resume> {
    const skills =
      typeof resumeData.skills === 'string'
        ? resumeData.skills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : resumeData.skills;

    const resume = await this.resumeModel.create({
      userId,
      ...resumeData,
      skills,
    });

    return resume;
  }

  async getUserResumes(userId: string): Promise<Resume[]> {
    return this.resumeModel.find({ userId });
  }

  async getResumeById(id: string): Promise<Resume> {
    const resume = await this.resumeModel.findById(id);
    console.log(resume?.skills);
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return resume;
  }

  async generatePDF(resumeId: string): Promise<Buffer> {
    const resume = await this.getResumeById(resumeId);

    
    // Load template
    const templatePath = join(
      process.cwd(),
      'src',
      'templates',
      `template-${resume.templateId}.hbs`,
    );

    const templateSource = readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);

    // Generate HTML from template
    const html = template({
      ...resume.toObject(),
      skills: resume.skills.join(', '),
    });

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    // const pdfBuffer = await page.pdf({ format: 'A4' });
    return Buffer.from(pdfBuffer); // convert to Node Buffer
  }

  async generateDOCX(resumeId: string): Promise<Buffer> {
    const resume = await this.getResumeById(resumeId);

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: resume.fullName,
                  bold: true,
                  size: 32,
                }),
              ],
            }),
            new Paragraph({
              children: [new TextRun(`Email: ${resume.email}`)],
            }),
            new Paragraph({
              children: [
                new TextRun(`Phone: ${resume.phone || 'Not provided'}`),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Education',
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [new TextRun(resume.education)],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Skills',
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [new TextRun(resume.skills.join(', '))],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Experience',
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [new TextRun(resume.experience)],
            }),
          ],
        },
      ],
    });

    return Packer.toBuffer(doc);
  }

  async deleteResume(userId: string, id: string): Promise<{ message: string }> {
    const resume = await this.resumeModel.findOne({ _id: id, userId });

    if (!resume) {
      throw new NotFoundException('Resume not found or you are not authorized');
    }

    await this.resumeModel.deleteOne({ _id: id, userId });
    return { message: 'Resume deleted successfully' };
  }
}
