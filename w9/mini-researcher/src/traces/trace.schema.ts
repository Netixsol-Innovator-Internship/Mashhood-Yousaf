import { Schema } from 'mongoose';

const StepSchema = new Schema({
  stepName: { type: String, required: true },
  input: { type: Schema.Types.Mixed, required: false },
  output: { type: Schema.Types.Mixed, required: false },
});

export const TraceSchema = new Schema({
  questionId: { type: String, required: true },
  steps: { type: [StepSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});
