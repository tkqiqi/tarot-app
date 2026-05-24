import React, { useState, useEffect } from 'react';
import { adminAuth } from './services/adminApi';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import Recharge from './pages/Recharge';

type Page = 'dashboard' | 'users' | 'pricing' | 'settings' | 'recharge';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [page, setPage] = useState<Page>('dashboard');

  useEffect(() => {
    if (token) localStorage.setItem('admin_token', token);
    else localStorage.removeItem('admin_token');
  }, [token]);

  if (!token) {
    return <LoginPage onLogin={(t: string) => setToken(t)} />;
  }

  const handleLogout = () => {
    setToken(null);
    setPage('dashboard');
  };

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-title">🔮 塔罗管理</div>
        <div className="sidebar-subtitle">管理后台</div>
        <button className={`nav-item ${page === 'dashboard' ? 'active' : ''}`} onClick={() => setPage('dashboard')}>
          📊 数据概览
        </button>
        <button className={`nav-item ${page === 'users' ? 'active' : ''}`} onClick={() => setPage('users')}>
          👥 用户管理
        </button>
        <button className={`nav-item ${page === 'recharge' ? 'active' : ''}`} onClick={() => setPage('recharge')}>
          💰 充值管理
        </button>
        <button className={`nav-item ${page === 'pricing' ? 'active' : ''}`} onClick={() => setPage('pricing')}>
          🪙 价格配置
        </button>
        <button className={`nav-item ${page === 'settings' ? 'active' : ''}`} onClick={() => setPage('settings')}>
          ⚙️ 系统设置
        </button>
        <button className="nav-item" onClick={handleLogout} style={{ marginTop: 'auto', position: 'absolute', bottom: 24, left: 0, right: 0 }}>
          🚪 退出登录
        </button>
      </nav>

      <main className="main-content">
        {page === 'dashboard' && <Dashboard />}
        {page === 'users' && <Users />}
        {page === 'recharge' && <Recharge />}
        {page === 'pricing' && <Pricing />}
        {page === 'settings' && <Settings />}
      </main>
    </div>
  );
}
