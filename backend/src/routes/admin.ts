import { Router, Request, Response } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { prepare } from '../config/database';
import * as readingService from '../services/readingService';

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get('/stats', (_req: Request, res: Response) => {
  try {
    const totalUsers = Number((prepare('SELECT COUNT(*) as c FROM users WHERE role = ?').get('user') as any)?.c || 0);
    const readingStats = readingService.getReadingStats();
    const totalCoins = Number((prepare('SELECT SUM(coin_balance) as c FROM users').get() as any)?.c || 0);

    res.json({
      success: true,
      data: { totalUsers, totalReadings: readingStats.total, todayReadings: readingStats.today, deepReadings: readingStats.deep, totalCoinsInCirculation: totalCoins },
      message: '获取成功',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
});

router.get('/config', (_req: Request, res: Response) => {
  try {
    const rows = prepare('SELECT key, value FROM admin_config').all() as any[];
    const config: Record<string, string> = {};
    rows.forEach((r: any) => (config[r.key] = r.value));
    res.json({ success: true, data: config, message: '获取成功' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
});

router.put('/config', (req: Request, res: Response) => {
  try {
    const updates = req.body as Record<string, string>;
    for (const [key, value] of Object.entries(updates)) {
      const existing = prepare('SELECT key FROM admin_config WHERE key = ?').get(key);
      if (existing) {
        prepare("UPDATE admin_config SET value = ?, updated_at = datetime('now') WHERE key = ?").run(String(value), key);
      } else {
        prepare("INSERT INTO admin_config (key, value, updated_at) VALUES (?, ?, datetime('now'))").run(key, String(value));
      }
    }
    res.json({ success: true, data: null, message: '配置已更新' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
});

router.get('/packages', (_req: Request, res: Response) => {
  try {
    const rows = prepare('SELECT * FROM coin_packages ORDER BY sort_order').all();
    res.json({ success: true, data: rows, message: '获取成功' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
});

router.put('/packages/:id', (req: Request, res: Response) => {
  try {
    const { name_zh, coins, price, original_price, description, is_active } = req.body;
    prepare('UPDATE coin_packages SET name_zh = ?, coins = ?, price = ?, original_price = ?, description = ?, is_active = ? WHERE id = ?')
      .run(name_zh, coins, price, original_price, description, is_active ? 1 : 0, parseInt(req.params.id));
    res.json({ success: true, data: null, message: '套餐已更新' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
});

router.get('/users', (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const rows = prepare('SELECT id, username, email, nickname, coin_balance, role, daily_free_used, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?').all(limit, offset);
    const total = Number((prepare('SELECT COUNT(*) as c FROM users').get() as any)?.c || 0);
    res.json({ success: true, data: { users: rows, total }, message: '获取成功' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
});

router.post('/users/:id/coins', (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    if (typeof amount !== 'number') {
      return res.status(400).json({ success: false, message: '金额必须是数字', data: null });
    }
    prepare('UPDATE users SET coin_balance = coin_balance + ? WHERE id = ?').run(amount, req.params.id);
    const user = prepare('SELECT id, username, coin_balance FROM users WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: user, message: `已${amount > 0 ? '充值' : '扣除'}${Math.abs(amount)}金币` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
});

export default router;
