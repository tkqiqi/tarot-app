import React, { useEffect, useState } from 'react';
import { adminEndpoints } from '../services/adminApi';

export default function Settings() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadConfig(); }, []);

  const loadConfig = async () => {
    try {
      const res = await adminEndpoints.getConfig() as any;
      setConfig(res.data);
    } catch {} finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminEndpoints.updateConfig(config);
      alert('配置已保存');
    } catch (err: any) {
      alert(err.message);
    } finally { setSaving(false); }
  };

  const updateConfig = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">系统设置</h1>
        <p className="page-subtitle">配置 AI 接口和系统参数</p>
      </div>

      <div className="form-card">
        <h3 style={{ color: 'var(--gold)', marginBottom: 20 }}>🤖 AI 深度解析配置</h3>
        <div className="form-group">
          <label className="form-label">Claude API Key</label>
          <input
            className="form-input"
            type="password"
            value={config.claude_api_key || ''}
            onChange={(e) => updateConfig('claude_api_key', e.target.value)}
            placeholder="sk-ant-..."
          />
        </div>
        <div className="form-group">
          <label className="form-label">API 地址</label>
          <input
            className="form-input"
            value={config.claude_api_url || ''}
            onChange={(e) => updateConfig('claude_api_url', e.target.value)}
            placeholder="https://api.anthropic.com"
          />
        </div>
        <div className="form-group">
          <label className="form-label">模型名称</label>
          <input
            className="form-input"
            value={config.claude_model || ''}
            onChange={(e) => updateConfig('claude_model', e.target.value)}
            placeholder="claude-sonnet-4-6"
          />
        </div>
      </div>

      <div className="form-card">
        <h3 style={{ color: 'var(--gold)', marginBottom: 20 }}>⚙️ 系统参数</h3>
        <div className="form-group">
          <label className="form-label">深度解析消耗金币</label>
          <input
            className="form-input"
            type="number"
            value={config.deep_analysis_cost || '5'}
            onChange={(e) => updateConfig('deep_analysis_cost', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">每日免费占卜次数</label>
          <input
            className="form-input"
            type="number"
            value={config.daily_free_count || '1'}
            onChange={(e) => updateConfig('daily_free_count', e.target.value)}
          />
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? '保存中...' : '💾 保存配置'}
      </button>
    </div>
  );
}
