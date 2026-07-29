import mongoose, { Schema, Document } from 'mongoose';

export interface IMediaItem {
  type: 'image' | 'photo' | 'audio' | 'video' | 'link';
  url: string;
  title?: string;
  caption?: string;
}

export interface IProject extends Document {
  slug: string;
  name: string;
  category: string;
  coverImage?: string;
  demo?: string;
  code?: string;
  badge?: string;
  year?: number;
  role?: string;
  tags: string[];
  description: string;
  features: string[];
  technologies: string[];
  media?: IMediaItem[];
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    coverImage: String,
    demo: String,
    code: String,
    badge: String,
    year: Number,
    role: String,
    tags: [{ type: String }],
    description: { type: String, required: true },
    features: [{ type: String }],
    technologies: [{ type: String }],
    media: [
      {
        type: { type: String, enum: ['image', 'photo', 'audio', 'video', 'link'], default: 'image' },
        url: { type: String, required: true },
        title: String,
        caption: String,
      },
    ],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.index({ category: 1, featured: 1 });

export const Project = mongoose.model<IProject>('Project', projectSchema);
