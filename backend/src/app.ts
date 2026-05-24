import express from 'express';
import cors from 'cors';
import { config } from './config/environment';
import authRoutes from './routes/auth';
import readingRoutes from './routes/readings';
import adminRoutes from './routes/admin';
import { TAROT_CARDS } from '@tarot/shared';
import { SPREADS } from '@tarot/shared';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Tarot data (public)
app.get('/api/cards', (_req, res) => {
  res.json({ success: true, data: TAROT_CARDS, message: '获取成功' });
});

app.get('/api/spreads', (_req, res) => {
  res.json({ success: true, data: SPREADS, message: '获取成功' });
});

// Protected routes
app.use('/api/readings', readingRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', time: new Date().toISOString() }, message: '服务正常' });
});

export default app;
