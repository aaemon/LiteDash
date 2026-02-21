'use client';

import { useState, useEffect } from 'react';

export default function AdminModelsPage() {
    const [models, setModels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [modelName, setModelName] = useState('');
    const [litellmModel, setLitellmModel] = useState('');
    const [apiBase, setApiBase] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [tpm, setTpm] = useState('');
    const [rpm, setRpm] = useState('');
    const [adding, setAdding] = useState(false);
    const [sym, setSym] = useState('$');
    const [mul, setMul] = useState(1);
    const [cur, setCur] = useState('USD');

    const fetchModels = async () => {
        try {
            const [res, settingsRes] = await Promise.all([
                fetch('/api/admin/models'),
                fetch('/api/settings').catch(() => null),
            ]);
            const data = await res.json();
            if (res.ok) setModels(data.models || []);
            if (settingsRes?.ok) {
                const s = await settingsRes.json();
                if (s.currencySymbol) setSym(s.currencySymbol);
                if (s.currencyMultiplier) setMul(s.currencyMultiplier);
                if (s.currency) setCur(s.currency);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fmtPrice = (costPerToken: number) => {
        const perMillion = costPerToken * 1e6 * mul;
        return `${sym}${perMillion.toFixed(2)}`;
    };

    useEffect(() => { fetchModels(); }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault(); setAdding(true);
        try {
            const res = await fetch('/api/admin/models', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model_name: modelName,
                    litellm_params: { model: litellmModel, api_base: apiBase || undefined, api_key: apiKey || undefined },
                    model_info: { tpm: tpm ? parseInt(tpm) : undefined, rpm: rpm ? parseInt(rpm) : undefined }
                })
            });
            if (res.ok) { setModelName(''); setLitellmModel(''); setApiBase(''); setApiKey(''); setTpm(''); setRpm(''); setShowForm(false); fetchModels(); }
            else { const err = await res.json(); alert(err.error || 'Failed'); }
        } catch (e) { console.error(e); }
        finally { setAdding(false); }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete model "${name}"?`)) return;
        try {
            const res = await fetch('/api/admin/models', {
                method: 'DELETE', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) fetchModels();
            else { const err = await res.json(); alert(err.error || 'Failed'); }
        } catch (e) { console.error(e); }
    };

    const labelStyle: React.CSSProperties = { fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' };

    const capBadge = (label: string, supported: boolean | null) => {
        if (!supported) return null;
        return <span key={label} style={{ fontSize: '0.58rem', padding: '0.1rem 0.3rem', borderRadius: 'var(--radius-full)', background: 'rgba(79, 110, 247, 0.08)', color: 'var(--accent-primary)', fontWeight: 600 }}>{label}</span>;
    };

    return (
        <div className="flex flex-col gap-6">
            <header>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ marginBottom: '0.25rem' }}>Model Management</h1>
                        <p>{models.length} model{models.length !== 1 ? 's' : ''} provisioned on this instance.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : '+ Add Model'}
                    </button>
                </div>
            </header>

            {/* Add Model Modal */}
            {showForm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }} onClick={() => setShowForm(false)}>
                    <div className="glass-card" style={{ width: '520px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Add New Model</h3>
                        <form onSubmit={handleAdd} className="flex flex-col gap-4">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                    <label style={labelStyle}>Model Name *</label>
                                    <input className="input" placeholder="e.g. gpt-4o" value={modelName} onChange={e => setModelName(e.target.value)} required />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                    <label style={labelStyle}>LiteLLM Model *</label>
                                    <input className="input" placeholder="e.g. openai/gpt-4o" value={litellmModel} onChange={e => setLitellmModel(e.target.value)} required />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                <label style={labelStyle}>API Base URL</label>
                                <input className="input" placeholder="https://api.openai.com/v1 (optional)" value={apiBase} onChange={e => setApiBase(e.target.value)} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                <label style={labelStyle}>API Key</label>
                                <input className="input" type="password" placeholder="sk-... (optional)" value={apiKey} onChange={e => setApiKey(e.target.value)} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                    <label style={labelStyle}>TPM Limit</label>
                                    <input className="input" type="number" placeholder="100000" value={tpm} onChange={e => setTpm(e.target.value)} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                    <label style={labelStyle}>RPM Limit</label>
                                    <input className="input" type="number" placeholder="60" value={rpm} onChange={e => setRpm(e.target.value)} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={adding}>{adding ? 'Adding...' : 'Add Model'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Loading models...</div>
            ) : models.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>No Models Configured</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Add your first model to get started.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
                    {models.map((m, idx) => {
                        const info = m.model_info || {};
                        const params = m.litellm_params || {};
                        const capabilities = [
                            capBadge('Vision', info.supports_vision),
                            capBadge('Tools', info.supports_function_calling),
                            capBadge('Streaming', info.supports_native_streaming),
                            capBadge('PDF', info.supports_pdf_input),
                            capBadge('Audio', info.supports_audio_input),
                            capBadge('Reasoning', info.supports_reasoning),
                            capBadge('Web Search', info.supports_web_search),
                        ].filter(Boolean);

                        return (
                            <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <div className="card-stripe" style={{ background: 'var(--accent-gradient)' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{m.model_name}</div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>{params.model}</div>
                                    </div>
                                    <span style={{ fontSize: '0.62rem', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', padding: '0.12rem 0.4rem', borderRadius: 'var(--radius-full)', fontWeight: 600, textTransform: 'uppercase' }}>Active</span>
                                </div>

                                {/* Pricing */}
                                <div style={{ display: 'flex', gap: '1rem', padding: '0.4rem 0.6rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                    <div>
                                        <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 500 }}>Input</span>
                                        <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{fmtPrice(info.input_cost_per_token || 0)}<span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', fontWeight: 400 }}>/1M</span></div>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 500 }}>Output</span>
                                        <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{fmtPrice(info.output_cost_per_token || 0)}<span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', fontWeight: 400 }}>/1M</span></div>
                                    </div>
                                    {params.api_base && (
                                        <div style={{ marginLeft: 'auto' }}>
                                            <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 500 }}>Endpoint</span>
                                            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontFamily: 'monospace', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{params.api_base}</div>
                                        </div>
                                    )}
                                </div>

                                {/* Capabilities */}
                                {capabilities.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>{capabilities}</div>
                                )}

                                {/* Limits + Delete */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        {info.max_tokens && <span>Max: {info.max_tokens.toLocaleString()} tok</span>}
                                        {info.tpm && <span>TPM: {info.tpm.toLocaleString()}</span>}
                                        {info.rpm && <span>RPM: {info.rpm}</span>}
                                    </div>
                                    <button className="btn btn-outline" style={{ fontSize: '0.65rem', padding: '0.15rem 0.35rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleDelete(info.id, m.model_name)}>Delete</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
