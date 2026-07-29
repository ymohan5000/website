import mongoose, { Schema } from 'mongoose';
const gallerySchema = new Schema({
    title: { type: String, required: true },
    folder: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: String,
    tags: [{ type: String }],
    order: { type: Number, default: 0 },
}, { timestamps: true });
gallerySchema.index({ folder: 1 });
export const Gallery = mongoose.model('Gallery', gallerySchema);
