import { Router } from 'express';
import { Note } from '../models/Note.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/validate.js';
const router = Router();
router.get('/', asyncHandler(async (req, res) => {
    const { category, subject } = req.query;
    const filter = { published: true };
    if (category)
        filter.category = category;
    if (subject)
        filter.subject = subject;
    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.json({ notes });
}));
router.get('/:id/download', asyncHandler(async (req, res) => {
    const note = await Note.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } }, { new: true });
    if (!note) {
        res.status(404).json({ error: 'Note not found' });
        return;
    }
    res.json({ fileUrl: note.fileUrl, title: note.title });
}));
router.post('/', authenticate, requireAdmin, asyncHandler(async (req, res) => {
    const note = await Note.create(req.body);
    res.status(201).json({ note });
}));
router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
}));
export default router;
