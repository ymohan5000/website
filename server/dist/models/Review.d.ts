import mongoose, { Document } from 'mongoose';
export interface IReview extends Document {
    name: string;
    email?: string;
    rating: number;
    comment: string;
    service?: string;
    approved: boolean;
}
export declare const Review: mongoose.Model<IReview, {}, {}, {}, mongoose.Document<unknown, {}, IReview, {}, {}> & IReview & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
