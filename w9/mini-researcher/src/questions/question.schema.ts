import { Schema } from 'mongoose';

export const QuestionSchema = new Schema({
  questionText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  finalAnswer: { type: String, default: null },
});
