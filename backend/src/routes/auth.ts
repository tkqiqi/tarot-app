import { Router, Request, Response } from 'express';
import * as authService from '../services/authService';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, nickname } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: '缺少必要字段', data: null });
    }
    const result = await authService.register(username, email, password, nickname);
    res.json({ success: true, data: result, message: '注册成功' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message, data: null });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: '请输入用户名和密码', data: null });
    }
    const result = await authService.login(username, password);
    res.json({ success: true, data: result, message: '登录成功' });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message, data: null });
  }
});

router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: '未授权', data: null });
    }
    const decoded = authService.verifyToken(authHeader.slice(7));
    const user = authService.getUserById(decoded.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在', data: null });
    }
    res.json({ success: true, data: user, message: '获取成功' });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message, data: null });
  }
});

export default router;
