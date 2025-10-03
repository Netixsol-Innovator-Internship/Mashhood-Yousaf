import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Submission,
  SubmissionDocument,
} from '../database/schema/submission.schema';
import {
  Assignment,
  AssignmentDocument,
} from '../database/schema/assignment.schema';
import { PdfService } from '../shared/pdf.service';
import { GeminiService } from '../shared/gemini.service';
import { EvaluateSubmissionsDto } from './dto/evaluate-submissions.dto';
import * as ExcelJS from 'exceljs';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name)
    private submissionModel: Model<SubmissionDocument>,
    @InjectModel(Assignment.name)
    private assignmentModel: Model<AssignmentDocument>,
    private pdfService: PdfService,
    private geminiService: GeminiService,
  ) {}

  async processUploads(files: Express.Multer.File[], assignmentId: string) {
    const submissions: SubmissionDocument[] = [];

    for (const file of files) {
      const { text, wordCount } = await this.pdfService.extractTextFromPdf(
        file.path,
      );

      const studentInfo = this.extractStudentInfo(file.originalname, text);

      const submission = new this.submissionModel({
        studentName: studentInfo.name,
        rollNumber: studentInfo.rollNumber,
        filename: file.filename,
        extractedText: text,
        wordCount: wordCount,
        assignmentId: assignmentId,
      });

      const savedSubmission = await submission.save();
      submissions.push(savedSubmission);
    }

    return submissions;
  }

  async evaluateSubmissions(evaluateDto: EvaluateSubmissionsDto) {
    const assignment = await this.assignmentModel.findById(
      evaluateDto.assignmentId,
    );
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    const submissions = await this.submissionModel.find({
      assignmentId: evaluateDto.assignmentId,
    });

    const results: SubmissionDocument[] = [];

    for (const submission of submissions) {
      const evaluation = await this.geminiService.evaluateAssignment(
        assignment.instructions,
        submission.extractedText,
        assignment.gradingMode as 'strict' | 'loose',
        assignment.minLength,
      );

      submission.score = evaluation.score;
      submission.remarks = evaluation.remarks;
      submission.evaluationDetails = evaluation.details;

      const updatedSubmission = await submission.save();
      results.push(updatedSubmission);
    }

    return results;
  }

  async findByAssignment(assignmentId: string): Promise<SubmissionDocument[]> {
    return this.submissionModel.find({ assignmentId }).exec();
  }

  async generateMarksheet(
    assignmentId: string,
  ): Promise<{ filename: string; path: string }> {
    const submissions = await this.submissionModel
      .find({ assignmentId })
      .exec();
    const assignment = await this.assignmentModel.findById(assignmentId);

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Marks Sheet');

    worksheet.columns = [
      { header: 'Student Name', key: 'name', width: 30 },
      { header: 'Roll Number', key: 'rollNumber', width: 15 },
      { header: 'Score', key: 'score', width: 10 },
      { header: 'Remarks', key: 'remarks', width: 50 },
      { header: 'Word Count', key: 'wordCount', width: 12 },
    ];

    submissions.forEach((submission) => {
      worksheet.addRow({
        name: submission.studentName,
        rollNumber: submission.rollNumber,
        score: submission.score,
        remarks: submission.remarks,
        wordCount: submission.wordCount,
      });
    });

    worksheet.addRow([]);
    worksheet.addRow(['Assignment:', assignment.title]);
    worksheet.addRow(['Grading Mode:', assignment.gradingMode]);
    worksheet.addRow(['Minimum Length:', assignment.minLength + ' words']);

    const filename = `marksheet-${assignmentId}-${Date.now()}.xlsx`;
    const filePath = `./uploads/${filename}`;
    await workbook.xlsx.writeFile(filePath);

    return { filename, path: filePath };
  }

  private extractStudentInfo(
    filename: string,
    text: string,
  ): { name: string; rollNumber: string } {
    const nameMatch = filename.match(/([^-]+)-([^-]+)/);
    let name = 'Unknown Student';
    let rollNumber = 'Unknown';

    if (nameMatch) {
      rollNumber = nameMatch[1];
      name = nameMatch[2].replace('.pdf', '').replace(/_/g, ' ');
    }

    return { name, rollNumber };
  }
}
