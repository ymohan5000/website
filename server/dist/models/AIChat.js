import mongoose, { Schema } from 'mongoose';
const aiChatSchema = new Schema({
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
}, { timestamps: true });
aiChatSchema.index({ sessionId: 1 });
export const AIChat = mongoose.model('AIChat', aiChatSchema);
