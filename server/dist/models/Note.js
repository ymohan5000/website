import mongoose, { Schema } from 'mongoose';
const noteSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subject: { type: String, required: true },
    fileUrl: String,
    fileType: String,
    fileSize: Number,
    downloads: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
}, { timestamps: true });
noteSchema.index({ category: 1, subject: 1 });
export const Note = mongoose.model('Note', noteSchema);
