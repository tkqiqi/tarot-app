import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as readingService from '../services/readingService';
import { prepare } from '../config/database';
import { SPREADS } from '@tarot/shared';
import type { QuestionCategory, SpreadType, ReadingTier } from '@tarot/shared';

const router = Router();

router.get('/spreads', (_req: Request, res: Response) => {
  res.json({ success: true, data: SPREADS, message: '获取成功' });
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { question, category, spreadType, tier } = req.body as {
      question: string;
      category: QuestionCategory;
      spreadType: SpreadType;
      tier: ReadingTier;
    };

    if (!question || !category || !spreadType) {
      return res.status(400).json({ success: false, message: '缺少必要参数', data: null });
    }

    const validCategories: QuestionCategory[] = ['love', 'career', 'finance', 'health', 'general'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ success: false, message: '无效的问题类别', data: null });
    }

    const readingTier: ReadingTier = tier || 'free';

    if (readingTier === 'deep') {
      const { getUserById } = await import('../services/authService');
      const user = getUserById(req.userId!);
      if (!user) {
        return res.status(404).json({ success: false, message: '用户不存在', data: null });
      }
      const costRow = prepare("SELECT value FROM admin_config WHERE key = 'deep_analysis_cost'").get() as any;
      const cost = costRow ? parseInt(costRow.value, 10) : 5;

      if (user.coinBalance < cost) {
        return res.status(400).json({
          success: false,
          message: `金币不足，深度解析需要${cost}金币，当前余额${user.coinBalance}金币`,
          data: null,
        });
      }
      prepare('UPDATE users SET coin_balance = coin_balance - ? WHERE id = ?').run(cost, req.userId);
    }

    const reading = await readingService.createReading(req.userId!, question, category, spreadType, readingTier);
    res.json({ success: true, data: reading, message: '占卜完成' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
});

router.post('/:id/upgrade', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { getUserById } = await import('../services/authService');
    const user = getUserById(req.userId!);
    if (!user) return res.status(404).json({ success: false, message: '用户不存在', data: null });

    const costRow = prepare("SELECT value FROM admin_config WHERE key = 'deep_analysis_cost'").get() as any;
    const cost = costRow ? parseInt(costRow.value, 10) : 5;

    if (user.coinBalance < cost) {
      return res.status(400).json({ success: false, message: `金币不足，需要${cost}金币`, data: null });
    }

    prepare('UPDATE users SET coin_balance = coin_balance - ? WHERE id = ?').run(cost, req.userId);
    const reading = await readingService.upgradeReading(req.params.id, req.userId!);
    res.json({ success: true, data: reading, message: '深度解析完成' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
});

router.get('/', authMiddleware, (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    const readings = readingService.getUserReadings(req.userId!, limit, offset);
    res.json({ success: true, data: readings, message: '获取成功' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
});

router.get('/:id', authMiddleware, (req: Request, res: Response) => {
  try {
    const reading = readingService.getReadingById(req.params.id, req.userId!);
    if (!reading) {
      return res.status(404).json({ success: false, message: '记录不存在', data: null });
    }
    res.json({ success: true, data: reading, message: '获取成功' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
});

export default router;
