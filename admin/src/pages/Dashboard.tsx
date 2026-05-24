import React, { useEffect, useState } from 'react';
import { adminEndpoints } from '../services/adminApi';

interface Stats {
  totalUsers: number;
  totalReadings: number;
  todayReadings: number;
  deepReadings: number;
  totalCoinsInCirculation: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await adminEndpoints.getStats() as any;
      setStats(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>加载中...</div>;
  if (!stats) return <div>加载失败</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">数据概览</h1>
        <p className="page-subtitle">系统运行状态一览</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">注册用户</div>
          <div className="stat-value">{stats.totalUsers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">总占卜次数</div>
          <div className="stat-value">{stats.totalReadings}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">今日占卜</div>
          <div className="stat-value">{stats.todayReadings}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">深度解析</div>
          <div className="stat-value">{stats.deepReadings}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">流通金币</div>
          <div className="stat-value">🪙 {stats.totalCoinsInCirculation}</div>
        </div>
      </div>
    </div>
  );
}
