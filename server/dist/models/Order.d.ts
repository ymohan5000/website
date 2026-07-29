import mongoose, { Document } from 'mongoose';
export interface IOrder extends Document {
    userId?: mongoose.Types.ObjectId;
    serviceSlug: string;
    serviceName: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    requirements: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    amount?: number;
}
export declare const Order: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
