import mongoose, { Schema, Document } from 'mongoose';

export interface IMediaItem {
  type: 'image' | 'photo' | 'audio' | 'video' | 'link';
  url: string;
  title?: string;
  caption?: string;
}

export interface IBlog extends Document {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  author: string;
  coverImage?: string;
  tone?: string;
  icon?: string;
  media?: IMediaItem[];
  excerpt: string;
  content: string;
  readingTime: number;
  published: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    author: { type: String, default: 'Mohan Yadav' },
    coverImage: String,
    tone: String,
    icon: String,
    media: [
      {
        type: { type: String, enum: ['image', 'photo', 'audio', 'video', 'link'], default: 'image' },
        url: { type: String, required: true },
        title: String,
        caption: String,
      },
    ],
    excerpt: { type: String, required: true },
    content: { type: String, default: '' },
    readingTime: { type: Number, default: 5 },
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.index({ category: 1, published: 1 });

export const Blog = mongoose.model<IBlog>('Blog', blogSchema);
