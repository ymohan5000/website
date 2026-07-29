import { Router } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/Order.js';
import { optionalAuth, authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { validate, asyncHandler } from '../middleware/validate.js';

const router = Router();

router.post(
  '/',
  optionalAuth,
  [
    body('serviceSlug').trim().notEmpty(),
    body('serviceName').trim().notEmpty(),
    body('clientName').trim().notEmpty(),
    body('clientEmail').isEmail(),
    body('requirements').trim().notEmpty(),
  ],
  validate,
  asyncHandler(async (req: AuthRequest, res) => {
    const order = await Order.create({
      ...req.body,
      userId: req.user?._id,
    });
    res.status(201).json({ order, message: 'Order submitted successfully' });
  })
);

router.get(
  '/',
  authenticate,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'name email');
    res.json({ orders });
  })
);

router.put(
  '/:id/status',
  authenticate,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ order });
  })
);

export default router;
