import app from './app';
import { config } from './config/environment';
import { initializeDatabase } from './database';

async function start() {
  try {
    await initializeDatabase();
    app.listen(config.port, () => {
      console.log(`🔮 塔罗占卜服务器已启动: http://localhost:${config.port}`);
      console.log(`   管理后台: http://localhost:5173`);
    });
  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
}

start();
