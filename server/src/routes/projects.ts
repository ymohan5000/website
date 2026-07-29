import { Router } from 'express';
import { body } from 'express-validator';
import { Project } from '../models/Project.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validate, asyncHandler } from '../middleware/validate.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { category, featured } = req.query;
    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ projects });
  })
);

router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json({ project });
  })
);

router.post(
  '/',
  authenticate,
  requireAdmin,
  [body('slug').trim().notEmpty(), body('name').trim().notEmpty(), body('description').trim().notEmpty()],
  validate,
  asyncHandler(async (req, res) => {
    const project = await Project.create(req.body);
    res.status(201).json({ project });
  })
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json({ project });
  })
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  asyncHandler(async (req, res) => {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  })
);

export default router;
