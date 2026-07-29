import mongoose, { Document } from 'mongoose';
export interface IAIChat extends Document {
    userId?: mongoose.Types.ObjectId;
    sessionId: string;
    messages: {
        role: 'user' | 'assistant';
        content: string;
        timestamp: Date;
    }[];
    tool?: string;
}
export declare const AIChat: mongoose.Model<IAIChat, {}, {}, {}, mongoose.Document<unknown, {}, IAIChat, {}, {}> & IAIChat & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
