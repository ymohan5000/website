import mongoose, { Schema } from 'mongoose';
const blogSchema = new Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    author: { type: String, default: 'Mohan Yadav' },
    coverImage: String,
    tone: String,
    icon: String,
    excerpt: { type: String, required: true },
    content: { type: String, default: '' },
    readingTime: { type: Number, default: 5 },
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
}, { timestamps: true });
blogSchema.index({ category: 1, published: 1 });
export const Blog = mongoose.model('Blog', blogSchema);
