import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config/index.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/validate.js';

import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blogs.js';
import projectRoutes from './routes/projects.js';
import serviceRoutes from './routes/services.js';
import noteRoutes from './routes/notes.js';
import galleryRoutes from './routes/gallery.js';
import reviewRoutes from './routes/reviews.js';
import messageRoutes from './routes/messages.js';
import aiRoutes from './routes/ai.js';
import orderRoutes from './routes/orders.js';
import uploadRoutes from './routes/upload.js';
import adminRoutes from './routes/admin.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: config.clientUrl, methods: ['GET', 'POST'] },
});

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'AI rate limit exceeded.' },
});
app.use('/api/ai/', aiLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

io.on('connection', (socket) => {
  socket.on('join-chat', (sessionId: string) => {
    socket.join(`chat-${sessionId}`);
  });
});

async function start() {
  await connectDB();

  const tryListen = (port: number) => {
    httpServer.once('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.warn(`Port ${port} is busy, trying ${port + 1}...`);
        tryListen(port + 1);
        return;
      }

      console.error('Failed to start server:', error);
      process.exit(1);
    });

    httpServer.listen(port, () => {
      const address = httpServer.address();
      if (address && typeof address !== 'string') {
        console.log(`Server running on port ${address.port}`);
      }
    });
  };

  tryListen(config.port);
}

start();

export { io };
