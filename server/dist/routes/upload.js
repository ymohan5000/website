import { Router } from 'express';
import multer from 'multer';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/validate.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp|pdf|doc|docx|mp4|mp3/;
        const ext = allowed.test(file.originalname.toLowerCase());
        const mime = allowed.test(file.mimetype);
        cb(null, ext || mime);
    },
});
router.post('/', authenticate, requireAdmin, upload.single('file'), asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }
    const folder = req.body.folder || 'mohan-yadav';
    const result = await uploadToCloudinary(req.file, folder);
    res.json({
        url: result.url,
        publicId: result.publicId,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
    });
}));
export default router;
