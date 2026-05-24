import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prepare } from '../config/database';
import { config } from '../config/environment';
import type { User, UserRole } from '@tarot/shared';

interface UserRow {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  nickname: string;
  avatar_url: string;
  coin_balance: number;
  role: UserRole;
  daily_free_count: number;
  daily_free_used: number;
  daily_free_reset_at: string | null;
  created_at: string;
  updated_at: string;
}

function rowToUser(row: UserRow): User {
  return {
    id: row.id as string,
    username: row.username as string,
    email: row.email as string,
    nickname: (row.nickname as string) || '',
    avatarUrl: (row.avatar_url as string) || '',
    coinBalance: row.coin_balance as number,
    role: row.role as UserRole,
    dailyFreeCount: row.daily_free_count as number,
    dailyFreeUsed: row.daily_free_used as number,
    dailyFreeResetAt: row.daily_free_reset_at as string | null,
    createdAt: row.created_at as string,
  };
}

export async function register(username: string, email: string, password: string, nickname?: string) {
  const existing = prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
  if (existing) {
    throw new Error('用户名或邮箱已存在');
  }

  const id = uuidv4();
  const passwordHash = await bcrypt.hash(password, 10);

  prepare(
    'INSERT INTO users (id, username, email, password_hash, nickname) VALUES (?, ?, ?, ?, ?)'
  ).run(id, username, email, passwordHash, nickname || username);

  const user = prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow;
  const tokens = generateTokens(id, user.role as UserRole);

  return { user: rowToUser(user), ...tokens };
}

export async function login(username: string, password: string) {
  const row = prepare('SELECT * FROM users WHERE username = ?').get(username) as UserRow | undefined;
  if (!row) {
    throw new Error('用户不存在');
  }

  const valid = await bcrypt.compare(password, row.password_hash as string);
  if (!valid) {
    throw new Error('密码错误');
  }

  const tokens = generateTokens(row.id as string, row.role as UserRole);
  return { user: rowToUser(row), ...tokens };
}

export function getUserById(id: string): User | null {
  const row = prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined;
  return row ? rowToUser(row) : null;
}

export function verifyToken(token: string): { userId: string; role: UserRole } {
  return jwt.verify(token, config.jwtSecret) as { userId: string; role: UserRole };
}

function generateTokens(userId: string, role: UserRole) {
  const token = jwt.sign({ userId, role }, config.jwtSecret, { expiresIn: '7d' });
  const refreshToken = jwt.sign({ userId, role, type: 'refresh' }, config.jwtSecret, { expiresIn: '30d' });
  return { token, refreshToken };
}
