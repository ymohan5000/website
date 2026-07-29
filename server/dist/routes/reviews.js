import { Router } from 'express';
import { body } from 'express-validator';
import { Review } from '../models/Review.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validate, asyncHandler } from '../middleware/validate.js';
const router = Router();
router.get('/', asyncHandler(async (_req, res) => {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
    res.json({ reviews, avgRating: Math.round(avgRating * 10) / 10, total: reviews.length });
}));
router.post('/', [
    body('name').trim().notEmpty(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').trim().notEmpty().isLength({ min: 10 }),
], validate, asyncHandler(async (req, res) => {
    const review = await Review.create({ ...req.body, approved: false });
    res.status(201).json({ message: 'Review submitted for approval', review });
}));
router.put('/:id/approve', authenticate, requireAdmin, asyncHandler(async (req, res) => {
    const review = await Review.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    res.json({ review });
}));
router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
}));
export default router;
