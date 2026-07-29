import mongoose, { Schema, Document } from 'mongoose';

export interface IAIChat extends Document {
  userId?: mongoose.Types.ObjectId;
  sessionId: string;
  messages: { role: 'user' | 'assistant'; content: string; timestamp: Date }[];
  tool?: string;
}

const aiChatSchema = new Schema<IAIChat>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    sessionId: { type: String, required: true },
    messages: [
      {
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    tool: String,
  },
  { timestamps: true }
);

aiChatSchema.index({ sessionId: 1 });

export const AIChat = mongoose.model<IAIChat>('AIChat', aiChatSchema);
