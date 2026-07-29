import { Router } from 'express';
import { body } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { AIChat } from '../models/AIChat.js';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';
import { validate, asyncHandler } from '../middleware/validate.js';
import { chatWithAI, generateContent, analyzeDocument } from '../utils/ai.js';

const router = Router();

router.post(
  '/chat',
  optionalAuth,
  [body('message').trim().notEmpty(), body('sessionId').optional()],
  validate,
  asyncHandler(async (req: AuthRequest, res) => {
    const { message, sessionId: sid, provider = 'auto' } = req.body;
    const sessionId = sid || uuidv4();

    let chat = await AIChat.findOne({ sessionId });
    if (!chat) {
      chat = await AIChat.create({
        sessionId,
        userId: req.user?._id,
        messages: [],
        tool: 'chatbot',
      });
    }

    chat.messages.push({ role: 'user', content: message, timestamp: new Date() });
    const history = chat.messages.map((m) => ({ role: m.role, content: m.content }));
    const reply = await chatWithAI(history, provider);
    chat.messages.push({ role: 'assistant', content: reply, timestamp: new Date() });
    await chat.save();

    res.json({ reply, sessionId });
  })
);

router.post(
  '/generate',
  [body('prompt').trim().notEmpty(), body('type').isIn(['blog', 'resume', 'tutor', 'social', 'summary'])],
  validate,
  asyncHandler(async (req, res) => {
    const { prompt, type } = req.body;
    const content = await generateContent(prompt, type);
    res.json({ content });
  })
);

router.post(
  '/analyze',
  [body('text').trim().notEmpty()],
  validate,
  asyncHandler(async (req, res) => {
    const analysis = await analyzeDocument(req.body.text);
    res.json({ analysis });
  })
);

export default router;
