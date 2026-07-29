import { Router } from 'express';
import { Blog, Project, Note, Gallery, Review, Message, Order, User } from '../models/index.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/validate.js';
const router = Router();
router.use(authenticate, requireAdmin);
router.get('/stats', asyncHandler(async (_req, res) => {
    const [blogs, projects, notes, gallery, reviews, messages, orders, users] = await Promise.all([
        Blog.countDocuments(),
        Project.countDocuments(),
        Note.countDocuments(),
        Gallery.countDocuments(),
        Review.countDocuments(),
        Message.countDocuments({ read: false }),
        Order.countDocuments({ status: 'pending' }),
        User.countDocuments(),
    ]);
    const publishedBlogs = await Blog.countDocuments({ published: true });
    const pendingReviews = await Review.countDocuments({ approved: false });
    res.json({
        stats: {
            blogs,
            publishedBlogs,
            projects,
            notes,
            gallery,
            reviews,
            pendingReviews,
            unreadMessages: messages,
            pendingOrders: orders,
            users,
        },
    });
}));
router.get('/reviews/pending', asyncHandler(async (_req, res) => {
    const reviews = await Review.find({ approved: false }).sort({ createdAt: -1 });
    res.json({ reviews });
}));
export default router;
