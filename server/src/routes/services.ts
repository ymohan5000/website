import { Router } from 'express';
import { Service } from '../models/Service.js';
import { asyncHandler } from '../middleware/validate.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const services = await Service.find({ active: true }).sort({ order: 1 });
    res.json({ services });
  })
);

router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const service = await Service.findOne({ slug: req.params.slug, active: true });
    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    res.json({ service });
  })
);

export default router;
