import { Router, Request, Response } from 'express';
import * as authService from '../services/authService';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, nickname } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: '缺少必要字段', data: null });
    }
    // 用户名验证: 3-20位，只允许字母数字下划线
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return res.status(400).json({ success: false, message: '用户名需3-20位，只允许字母、数字和下划线', data: null });
    }
    // 邮箱验证
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: '请输入有效的邮箱地址', data: null });
    }
    // 密码验证: 至少8位，必须包含字母和数字
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: '密码至少需要8个字符', data: null });
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ success: false, message: '密码必须包含字母和数字', data: null });
    }
    // 昵称验证
    if (nickname && (nickname.length < 1 || nickname.length > 20)) {
      return res.status(400).json({ success: false, message: '昵称长度为1-20个字符', data: null });
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
