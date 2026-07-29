import mongoose, { Document } from 'mongoose';
export interface IProject extends Document {
    slug: string;
    name: string;
    category: string;
    image?: string;
    demo?: string;
    code?: string;
    badge?: string;
    year?: number;
    role?: string;
    tags: string[];
    description: string;
    features: string[];
    technologies: string[];
    featured: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Project: mongoose.Model<IProject, {}, {}, {}, mongoose.Document<unknown, {}, IProject, {}, {}> & IProject & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
