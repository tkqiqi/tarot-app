import { initDB } from '../config/database';
import { runMigrations } from './migrations/001_initial';
import { seedDatabase } from './seeds/001_default';

export async function initializeDatabase() {
  await initDB();
  runMigrations();
  await seedDatabase();
  console.log('Database initialized successfully');
}
