import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Assignment,
  AssignmentDocument,
} from '../database/schema/assignment.schema';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectModel(Assignment.name)
    private assignmentModel: Model<AssignmentDocument>,
  ) {}

  async create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    const createdAssignment = new this.assignmentModel(createAssignmentDto);
    return createdAssignment.save();
  }

  async findAll(): Promise<Assignment[]> {
    return this.assignmentModel.find().exec();
  }

  async findOne(id: string): Promise<Assignment | null> {
    return this.assignmentModel.findById(id).exec();
  }
}
