import { prepare } from '../../config/database';
import { config } from '../../config/environment';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function seedDatabase() {
  // Seed default admin user
  const existingAdmin = prepare('SELECT id FROM users WHERE role = ?').get('admin');
  if (!existingAdmin) {
    const hash = await bcrypt.hash(config.adminPassword, 10);
    prepare(
      'INSERT INTO users (id, username, email, password_hash, nickname, role) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(uuidv4(), config.adminUsername, 'admin@tarot.local', hash, '管理员', 'admin');
    console.log('Admin user seeded');
  }

  // Seed default coin packages
  const existingPackages = prepare('SELECT COUNT(*) as count FROM coin_packages').get() as any;
  if (!existingPackages || existingPackages.count === 0) {
    const packages = [
      { name: 'Starter', name_zh: '体验包', coins: 10, price: 600, original_price: 600, description: '首次体验深度解析', sort_order: 1 },
      { name: 'Standard', name_zh: '标准包', coins: 30, price: 1500, original_price: 1800, description: '最受用户欢迎', sort_order: 2 },
      { name: 'Premium', name_zh: '高级包', coins: 68, price: 2800, original_price: 4080, description: '深度占卜爱好者首选', sort_order: 3 },
      { name: 'Ultimate', name_zh: '至尊包', coins: 168, price: 5800, original_price: 10080, description: '无限探索塔罗奥秘', sort_order: 4 },
    ];
    const stmt = prepare(
      'INSERT INTO coin_packages (name, name_zh, coins, price, original_price, description, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    for (const pkg of packages) {
      stmt.run(pkg.name, pkg.name_zh, pkg.coins, pkg.price, pkg.original_price, pkg.description, pkg.sort_order);
    }
    console.log('Coin packages seeded');
  }

  // Seed default admin config
  const defaultConfigs: Record<string, string> = {
    deep_analysis_cost: '5',
    daily_free_count: '1',
    claude_api_key: '',
    claude_api_url: 'https://api.anthropic.com',
    claude_model: 'claude-sonnet-4-6',
  };
  for (const [key, value] of Object.entries(defaultConfigs)) {
    const existing = prepare('SELECT key FROM admin_config WHERE key = ?').get(key);
    if (!existing) {
      prepare('INSERT INTO admin_config (key, value) VALUES (?, ?)').run(key, value);
    }
  }
  console.log('Admin config seeded');
}
