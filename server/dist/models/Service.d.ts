import mongoose, { Document } from 'mongoose';
export interface IService extends Document {
    slug: string;
    title: string;
    category: string;
    description: string;
    features: string[];
    technologies: string[];
    icon: string;
    price?: string;
    active: boolean;
    order: number;
}
export declare const Service: mongoose.Model<IService, {}, {}, {}, mongoose.Document<unknown, {}, IService, {}, {}> & IService & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
