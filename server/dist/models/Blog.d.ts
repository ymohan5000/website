import mongoose, { Document } from 'mongoose';
export interface IBlog extends Document {
    slug: string;
    title: string;
    category: string;
    tags: string[];
    author: string;
    coverImage?: string;
    tone?: string;
    icon?: string;
    excerpt: string;
    content: string;
    readingTime: number;
    published: boolean;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Blog: mongoose.Model<IBlog, {}, {}, {}, mongoose.Document<unknown, {}, IBlog, {}, {}> & IBlog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
