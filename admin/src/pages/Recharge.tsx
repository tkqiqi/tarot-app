import React, { useState } from 'react';
import adminApi from '../services/adminApi';

export default function Recharge() {
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setResult(null);
    if (!username.trim()) { setError('请输入用户名'); return; }
    if (!amount || parseInt(amount) <= 0) { setError('请输入有效的充值金额'); return; }

    setLoading(true);
    try {
      // 先查找用户
      const usersRes: any = await adminApi.get(`/admin/users?limit=100`);
      const user = usersRes.data.users.find((u: any) => u.username === username.trim());
      if (!user) { setError('用户不存在'); setLoading(false); return; }

      // 充值
      const res: any = await adminApi.post(`/admin/users/${user.id}/coins`, {
        amount: parseInt(amount),
        reason: reason || '管理员充值',
      });
      setResult(res.data);
      setHistory(prev => [{
        username: user.username,
        amount: parseInt(amount),
        time: new Date().toLocaleString('zh-CN'),
        reason: reason || '管理员充值',
        newBalance: res.data.coin_balance,
      }, ...prev].slice(0, 20));
      setAmount('');
      setReason('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [10, 30, 50, 100, 200, 500];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🪙 充值管理</h1>
        <p className="page-subtitle">为指定用户充值金币</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* 左侧：充值表单 */}
        <div className="form-card">
          <h3 style={{ color: 'var(--gold)', marginBottom: 20 }}>充值操作</h3>
          <form onSubmit={handleRecharge}>
            <div className="form-group">
              <label className="form-label">用户名</label>
              <input
                className="form-input"
                placeholder="输入要充值的用户名"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">充值金额（金币）</label>
              <input
                className="form-input"
                type="number"
                min="1"
                placeholder="输入金币数量"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                {quickAmounts.map(a => (
                  <button
                    key={a}
                    type="button"
                    style={{
                      padding: '4px 12px', borderRadius: 6, border: '1px solid var(--border-gold)',
                      background: amount === String(a) ? 'var(--gold)' : 'var(--bg-secondary)',
                      color: amount === String(a) ? 'var(--bg-primary)' : 'var(--text-secondary)',
                      cursor: 'pointer', fontSize: 13,
                    }}
                    onClick={() => setAmount(String(a))}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">备注（选填）</label>
              <input
                className="form-input"
                placeholder="充值原因"
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </div>

            {error && <p style={{ color: 'var(--error)', fontSize: 14, marginBottom: 12 }}>{error}</p>}
            {result && (
              <div style={{
                background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)',
                borderRadius: 8, padding: 12, marginBottom: 12,
              }}>
                <p style={{ color: 'var(--success)', fontSize: 14 }}>
                  ✅ 充值成功！用户 <b>{result.username}</b> 当前余额：🪙 {result.coin_balance}
                </p>
              </div>
            )}

            <button className="btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? '处理中...' : '确认充值'}
            </button>
          </form>
        </div>

        {/* 右侧：操作记录 */}
        <div className="form-card">
          <h3 style={{ color: 'var(--gold)', marginBottom: 20 }}>操作记录</h3>
          {history.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>暂无操作记录</p>
          ) : (
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {history.map((h, i) => (
                <div key={i} style={{
                  borderBottom: '1px solid var(--border-gold)', padding: '10px 0',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{h.username}</span>
                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>+{h.amount} 金币</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{h.reason}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{h.time}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 2 }}>
                    余额：🪙 {h.newBalance}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
