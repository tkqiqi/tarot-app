import { v4 as uuidv4 } from 'uuid';
import { prepare } from '../config/database';
import type { Reading, ReadingTier, QuestionCategory, SpreadType, DrawnCard } from '@tarot/shared';
import { SPREADS } from '@tarot/shared';
import { drawCards } from '../utils/cardShuffler';
import { generateReading } from './rulesEngine';
import { generateDeepReading } from './claudeService';

interface ReadingRow {
  id: string;
  user_id: string;
  question: string;
  category: string;
  spread_type: string;
  tier: string;
  drawn_cards: string;
  result: string | null;
  status: string;
  created_at: string;
  completed_at: string | null;
}

function rowToReading(row: ReadingRow): Reading {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    question: row.question as string,
    category: row.category as QuestionCategory,
    spreadType: row.spread_type as SpreadType,
    tier: row.tier as ReadingTier,
    drawnCards: JSON.parse(row.drawn_cards as string),
    result: row.result ? JSON.parse(row.result as string) : null,
    status: row.status as Reading['status'],
    createdAt: row.created_at as string,
    completedAt: row.completed_at as string | null,
  };
}

export async function createReading(
  userId: string,
  question: string,
  category: QuestionCategory,
  spreadType: SpreadType,
  tier: ReadingTier
): Promise<Reading> {
  const spread = SPREADS.find((s) => s.type === spreadType);
  if (!spread) throw new Error('无效的牌阵类型');

  const drawnCards = drawCards(spread);
  const id = uuidv4();
  const now = new Date().toISOString();

  prepare(
    `INSERT INTO readings (id, user_id, question, category, spread_type, tier, drawn_cards, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, userId, question, category, spreadType, tier, JSON.stringify(drawnCards), 'in_progress', now);

  let result;
  if (tier === 'deep') {
    result = await generateDeepReading(drawnCards, question, category);
  } else {
    result = generateReading(drawnCards, question, category);
  }

  const completedAt = new Date().toISOString();
  prepare('UPDATE readings SET result = ?, status = ?, completed_at = ? WHERE id = ?')
    .run(JSON.stringify(result), 'completed', completedAt, id);

  const row = prepare('SELECT * FROM readings WHERE id = ?').get(id) as ReadingRow;
  return rowToReading(row);
}

export async function upgradeReading(readingId: string, userId: string): Promise<Reading> {
  const row = prepare('SELECT * FROM readings WHERE id = ? AND user_id = ?').get(readingId, userId) as ReadingRow | undefined;
  if (!row) throw new Error('占卜记录不存在');
  if (row.tier === 'deep') throw new Error('已经是深度解析');

  const reading = rowToReading(row);
  const drawnCards: DrawnCard[] = reading.drawnCards;

  const result = await generateDeepReading(drawnCards, reading.question, reading.category);
  const completedAt = new Date().toISOString();

  prepare('UPDATE readings SET result = ?, tier = ?, status = ?, completed_at = ? WHERE id = ?')
    .run(JSON.stringify(result), 'deep', 'completed', completedAt, readingId);

  const updated = prepare('SELECT * FROM readings WHERE id = ?').get(readingId) as ReadingRow;
  return rowToReading(updated);
}

export function getReadingById(id: string, userId: string): Reading | null {
  const row = prepare('SELECT * FROM readings WHERE id = ? AND user_id = ?').get(id, userId) as ReadingRow | undefined;
  return row ? rowToReading(row) : null;
}

export function getUserReadings(userId: string, limit: number = 20, offset: number = 0): Reading[] {
  const rows = prepare(
    'SELECT * FROM readings WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
  ).all(userId, limit, offset) as ReadingRow[];
  return rows.map(rowToReading);
}

export function getReadingStats(): { total: number; today: number; deep: number } {
  const total = (prepare('SELECT COUNT(*) as c FROM readings').get() as any)?.c || 0;
  const today = (prepare("SELECT COUNT(*) as c FROM readings WHERE created_at >= date('now')").get() as any)?.c || 0;
  const deep = (prepare("SELECT COUNT(*) as c FROM readings WHERE tier = 'deep'").get() as any)?.c || 0;
  return { total: Number(total), today: Number(today), deep: Number(deep) };
}
