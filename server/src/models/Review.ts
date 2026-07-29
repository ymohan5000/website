import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  name: string;
  email?: string;
  rating: number;
  comment: string;
  service?: string;
  approved: boolean;
}

const reviewSchema = new Schema<IReview>(
  {
    name: { type: String, required: true },
    email: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    service: String,
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReview>('Review', reviewSchema);
