import mongoose, { Schema } from 'mongoose';
const serviceSchema = new Schema({
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
}, { timestamps: true });
export const Service = mongoose.model('Service', serviceSchema);
