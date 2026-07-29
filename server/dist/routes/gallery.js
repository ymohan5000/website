import { Router } from 'express';
import { Gallery } from '../models/Gallery.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/validate.js';
const router = Router();
router.get('/', asyncHandler(async (req, res) => {
    const { folder, search } = req.query;
    const filter = {};
    if (folder)
        filter.folder = folder;
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { tags: { $regex: search, $options: 'i' } },
        ];
    }
    const items = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });
    const folders = await Gallery.distinct('folder');
    res.json({ items, folders });
}));
router.post('/', authenticate, requireAdmin, asyncHandler(async (req, res) => {
    const item = await Gallery.create(req.body);
    res.status(201).json({ item });
}));
router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery item deleted' });
}));
export default router;
