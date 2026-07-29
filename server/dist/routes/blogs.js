import { Router } from 'express';
import { body } from 'express-validator';
import { Blog } from '../models/Blog.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validate, asyncHandler } from '../middleware/validate.js';
const router = Router();
router.get('/', asyncHandler(async (req, res) => {
    const { category, search, page = '1', limit = '12' } = req.query;
    const filter = { published: true };
    if (category)
        filter.category = category;
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { excerpt: { $regex: search, $options: 'i' } },
            { tags: { $regex: search, $options: 'i' } },
        ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [blogs, total] = await Promise.all([
        Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
        Blog.countDocuments(filter),
    ]);
    res.json({ blogs, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
}));
router.get('/:slug', asyncHandler(async (req, res) => {
    const blog = await Blog.findOneAndUpdate({ slug: req.params.slug, published: true }, { $inc: { views: 1 } }, { new: true });
    if (!blog) {
        res.status(404).json({ error: 'Blog not found' });
        return;
    }
    const related = await Blog.find({
        category: blog.category,
        _id: { $ne: blog._id },
        published: true,
    }).limit(3);
    res.json({ blog, related });
}));
router.post('/', authenticate, requireAdmin, [
    body('slug').trim().notEmpty(),
    body('title').trim().notEmpty(),
    body('category').trim().notEmpty(),
    body('excerpt').trim().notEmpty(),
], validate, asyncHandler(async (req, res) => {
    const blog = await Blog.create(req.body);
    res.status(201).json({ blog });
}));
router.put('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) {
        res.status(404).json({ error: 'Blog not found' });
        return;
    }
    res.json({ blog });
}));
router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted' });
}));
export default router;
