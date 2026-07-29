import mongoose, { Document } from 'mongoose';
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
export declare const Note: mongoose.Model<INote, {}, {}, {}, mongoose.Document<unknown, {}, INote, {}, {}> & INote & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
