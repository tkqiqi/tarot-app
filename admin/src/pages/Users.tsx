import React, { useEffect, useState } from 'react';
import { adminEndpoints } from '../services/adminApi';

interface UserRow {
  id: string;
  username: string;
  email: string;
  nickname: string;
  coin_balance: number;
  role: string;
  daily_free_used: number;
  created_at: string;
}

export default function Users() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adjustModal, setAdjustModal] = useState<{ userId: string; username: string } | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const res = await adminEndpoints.getUsers(100, 0) as any;
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch {} finally { setLoading(false); }
  };

  const handleAdjust = async () => {
    if (!adjustModal || !adjustAmount) return;
    try {
      await adminEndpoints.adjustCoins(adjustModal.userId, parseInt(adjustAmount), adjustReason);
      setAdjustModal(null);
      setAdjustAmount('');
      setAdjustReason('');
      loadUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">用户管理</h1>
        <p className="page-subtitle">共 {total} 名用户</p>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>用户名</th>
              <th>昵称</th>
              <th>邮箱</th>
              <th>金币</th>
              <th>角色</th>
              <th>注册时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.nickname}</td>
                <td>{user.email}</td>
                <td>🪙 {user.coin_balance}</td>
                <td>
                  <span className={`badge ${user.role === 'admin' ? 'badge-warning' : 'badge-success'}`}>
                    {user.role === 'admin' ? '管理员' : '用户'}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString('zh-CN')}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setAdjustModal({ userId: user.id, username: user.username })}
                  >
                    调整金币
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {adjustModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="form-card" style={{ width: 400 }}>
            <h3 style={{ color: 'var(--gold)', marginBottom: 16 }}>调整金币 - {adjustModal.username}</h3>
            <div className="form-group">
              <label className="form-label">调整金额（正数充值，负数扣除）</label>
              <input className="form-input" type="number" value={adjustAmount} onChange={(e) => setAdjustAmount(e.target.value)} placeholder="例如：10 或 -5" />
            </div>
            <div className="form-group">
              <label className="form-label">原因</label>
              <input className="form-input" type="text" value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)} placeholder="操作原因" />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn btn-sm" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }} onClick={() => setAdjustModal(null)}>取消</button>
              <button className="btn btn-primary btn-sm" onClick={handleAdjust}>确认</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
