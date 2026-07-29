import mongoose, { Schema, Document } from 'mongoose';

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

const serviceSchema = new Schema<IService>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    technologies: [{ type: String }],
    icon: { type: String, default: 'fa-code' },
    price: String,
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Service = mongoose.model<IService>('Service', serviceSchema);
