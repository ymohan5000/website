import mongoose, { Schema } from 'mongoose';
const reviewSchema = new Schema({
    name: { type: String, required: true },
    email: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    service: String,
    approved: { type: Boolean, default: false },
}, { timestamps: true });
export const Review = mongoose.model('Review', reviewSchema);
