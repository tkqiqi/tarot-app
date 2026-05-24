import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';
import type { UserRole } from '@tarot/shared';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: UserRole;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: '未授权访问', data: null });
  }

  try {
    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token 已过期或无效', data: null });
  }
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ success: false, message: '需要管理员权限', data: null });
  }
  next();
}
