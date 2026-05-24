import { exec } from '../../config/database';

export function runMigrations() {
  exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      nickname TEXT DEFAULT '',
      avatar_url TEXT DEFAULT '',
      coin_balance INTEGER DEFAULT 0,
      role TEXT DEFAULT 'user',
      daily_free_count INTEGER DEFAULT 1,
      daily_free_used INTEGER DEFAULT 0,
      daily_free_reset_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  exec(`
    CREATE TABLE IF NOT EXISTS readings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      question TEXT NOT NULL,
      category TEXT NOT NULL,
      spread_type TEXT NOT NULL,
      tier TEXT NOT NULL DEFAULT 'free',
      drawn_cards TEXT NOT NULL,
      result TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now')),
      completed_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      package_id INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      channel TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      transaction_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      paid_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  exec(`
    CREATE TABLE IF NOT EXISTS admin_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  exec(`
    CREATE TABLE IF NOT EXISTS coin_packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      name_zh TEXT NOT NULL,
      coins INTEGER NOT NULL,
      price INTEGER NOT NULL,
      original_price INTEGER NOT NULL,
      description TEXT DEFAULT '',
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Create indexes (ignore errors if they exist)
  try { exec(`CREATE INDEX IF NOT EXISTS idx_readings_user ON readings(user_id)`); } catch {}
  try { exec(`CREATE INDEX IF NOT EXISTS idx_readings_created ON readings(created_at)`); } catch {}
  try { exec(`CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id)`); } catch {}

  console.log('Database migrations completed');
}
