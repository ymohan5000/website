import { Router } from 'express';
import { body } from 'express-validator';
import { Message } from '../models/Message.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validate, asyncHandler } from '../middleware/validate.js';
import { sendContactNotification } from '../utils/email.js';
const router = Router();
router.post('/', [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('message').trim().notEmpty().isLength({ min: 10 }),
], validate, asyncHandler(async (req, res) => {
    const message = await Message.create(req.body);
    await sendContactNotification(req.body).catch(console.error);
    res.status(201).json({ message: 'Message sent successfully', id: message._id });
}));
router.get('/', authenticate, requireAdmin, asyncHandler(async (_req, res) => {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ messages });
}));
router.put('/:id/read', authenticate, requireAdmin, asyncHandler(async (req, res) => {
    const message = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json({ message });
}));
router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
}));
export default router;
