import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  claudeApiKey: process.env.CLAUDE_API_KEY || '',
  claudeApiUrl: process.env.CLAUDE_API_URL || 'https://api.anthropic.com',
  claudeModel: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
  databasePath: process.env.DATABASE_PATH || './data/tarot.db',
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};
