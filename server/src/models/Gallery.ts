import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryItem extends Document {
  title: string;
  folder: string;
  imageUrl: string;
  description?: string;
  tags: string[];
  order: number;
}

const gallerySchema = new Schema<IGalleryItem>(
  {
    title: { type: String, required: true },
    folder: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: String,
    tags: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

gallerySchema.index({ folder: 1 });

export const Gallery = mongoose.model<IGalleryItem>('Gallery', gallerySchema);
