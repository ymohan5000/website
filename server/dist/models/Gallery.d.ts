import mongoose, { Document } from 'mongoose';
export interface IGalleryItem extends Document {
    title: string;
    folder: string;
    imageUrl: string;
    description?: string;
    tags: string[];
    order: number;
}
export declare const Gallery: mongoose.Model<IGalleryItem, {}, {}, {}, mongoose.Document<unknown, {}, IGalleryItem, {}, {}> & IGalleryItem & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
