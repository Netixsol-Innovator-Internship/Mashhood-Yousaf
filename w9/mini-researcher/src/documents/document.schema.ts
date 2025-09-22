import { Schema } from 'mongoose';

export const DocumentSchema = new Schema({
  title: { type: String, required: true },
  topic: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
