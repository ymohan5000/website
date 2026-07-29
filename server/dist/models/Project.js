import mongoose, { Schema } from 'mongoose';
const projectSchema = new Schema({
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    image: String,
    demo: String,
    code: String,
    badge: String,
    year: Number,
    role: String,
    tags: [{ type: String }],
    description: { type: String, required: true },
    features: [{ type: String }],
    technologies: [{ type: String }],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
}, { timestamps: true });
projectSchema.index({ category: 1, featured: 1 });
export const Project = mongoose.model('Project', projectSchema);
