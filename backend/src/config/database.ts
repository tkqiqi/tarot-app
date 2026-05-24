import initSqlJs, { Database } from 'sql.js';
import path from 'path';
import fs from 'fs';
import { config } from './environment';

let db: Database;
const dbPath = config.databasePath;

export async function initDB(): Promise<Database> {
  const SQL = await initSqlJs();

  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  return db;
}

export function getDB(): Database {
  if (!db) throw new Error('Database not initialized. Call initDB() first.');
  return db;
}

export function saveDB() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

// Wrapper to provide better-sqlite3-like API
export function prepare(sql: string) {
  return {
    run(...params: any[]) {
      const database = getDB();
      database.run(sql, params);
      saveDB();
    },
    get(...params: any[]) {
      const database = getDB();
      const stmt = database.prepare(sql);
      stmt.bind(params);
      if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        return row;
      }
      stmt.free();
      return undefined;
    },
    all(...params: any[]) {
      const database = getDB();
      const results: any[] = [];
      const stmt = database.prepare(sql);
      stmt.bind(params);
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    },
  };
}

export function exec(sql: string) {
  const database = getDB();
  database.run(sql);
  saveDB();
}

export default { initDB, getDB, saveDB, prepare, exec };
