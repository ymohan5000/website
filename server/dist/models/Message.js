import mongoose, { Schema } from 'mongoose';
const messageSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    service: String,
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
}, { timestamps: true });
export const Message = mongoose.model('Message', messageSchema);
