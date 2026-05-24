import React, { useEffect, useState } from 'react';
import { adminEndpoints } from '../services/adminApi';

interface CoinPackage {
  id: number;
  name: string;
  name_zh: string;
  coins: number;
  price: number;
  original_price: number;
  description: string;
  is_active: number;
}

export default function Pricing() {
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CoinPackage | null>(null);

  useEffect(() => { loadPackages(); }, []);

  const loadPackages = async () => {
    try {
      const res = await adminEndpoints.getPackages() as any;
      setPackages(res.data);
    } catch {} finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      await adminEndpoints.updatePackage(editing.id, editing);
      setEditing(null);
      loadPackages();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">价格配置</h1>
        <p className="page-subtitle">管理金币套餐和深度解析定价</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {packages.map((pkg) => (
          <div key={pkg.id} className="form-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ color: 'var(--gold)' }}>{pkg.name_zh}</h3>
              <span className={`badge ${pkg.is_active ? 'badge-success' : 'badge-error'}`}>
                {pkg.is_active ? '上架中' : '已下架'}
              </span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--gold)', marginBottom: 4 }}>🪙 {pkg.coins}</div>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 4 }}>¥{(pkg.price / 100).toFixed(2)}</div>
            {pkg.original_price > pkg.price && (
              <div style={{ fontSize: 14, color: 'var(--text-muted)', textDecoration: 'line-through', marginBottom: 4 }}>¥{(pkg.original_price / 100).toFixed(2)}</div>
            )}
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>{pkg.description}</div>
            <button className="btn btn-primary btn-sm" onClick={() => setEditing({ ...pkg })}>编辑</button>
          </div>
        ))}
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="form-card" style={{ width: 440 }}>
            <h3 style={{ color: 'var(--gold)', marginBottom: 16 }}>编辑套餐 - {editing.name_zh}</h3>
            <div className="form-group">
              <label className="form-label">套餐名称</label>
              <input className="form-input" value={editing.name_zh} onChange={(e) => setEditing({ ...editing, name_zh: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">金币数量</label>
              <input className="form-input" type="number" value={editing.coins} onChange={(e) => setEditing({ ...editing, coins: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="form-group">
              <label className="form-label">价格（分）</label>
              <input className="form-input" type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="form-group">
              <label className="form-label">原价（分）</label>
              <input className="form-input" type="number" value={editing.original_price} onChange={(e) => setEditing({ ...editing, original_price: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="form-group">
              <label className="form-label">描述</label>
              <input className="form-input" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input type="checkbox" checked={!!editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked ? 1 : 0 })} />
                上架状态
              </label>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn btn-sm" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }} onClick={() => setEditing(null)}>取消</button>
              <button className="btn btn-primary btn-sm" onClick={handleSave}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
