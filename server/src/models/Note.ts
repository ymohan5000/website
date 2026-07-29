import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  title: string;
  description: string;
  category: string;
  subject: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  downloads: number;
  published: boolean;
}

const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subject: { type: String, required: true },
    fileUrl: String,
    fileType: String,
    fileSize: Number,
    downloads: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

noteSchema.index({ category: 1, subject: 1 });

export const Note = mongoose.model<INote>('Note', noteSchema);
