'use client';

import { useState, useEffect } from 'react';

export default function PlaygroundPage() {
    const [keys, setKeys] = useState<any[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [selectedKey, setSelectedKey] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/api/keys')
            .then(async r => { try { return JSON.parse(await r.text()); } catch { return {}; } })
            .then(d => { if (d.keys) setKeys(d.keys); })
            .catch(e => console.error('Failed to fetch keys', e));

        fetch('/api/models')
            .then(async r => { try { return JSON.parse(await r.text()); } catch { return {}; } })
            .then(d => { if (d.models) { setModels(d.models); if (d.models.length > 0) setSelectedModel(d.models[0].id); } })
            .catch(e => console.error('Failed to fetch models', e));
    }, []);

    const handleTest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedKey || !selectedModel || !prompt) return;
        setLoading(true); setError(''); setResponse(null);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey: selectedKey, model: selectedModel, messages: [{ role: 'user', content: prompt }] })
            });
            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error(`Invalid response format from server (Status ${res.status}): ${text.substring(0, 100)}...`);
            }
            if (!res.ok) setError(data.error || 'API Request Failed');
            else setResponse(data.result);
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    return (
        <div className="flex flex-col gap-6" style={{ height: 'calc(100vh - 5rem)' }}>
            <header>
                <h1 style={{ marginBottom: '0.25rem' }}>API Playground</h1>
                <p>Test your API keys directly against active models.</p>
            </header>

            <div className="playground-grid">
                {/* Controls */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <label style={{ fontWeight: 500, color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>API Key</label>
                        <input type="password" className="input" value={selectedKey} onChange={(e) => setSelectedKey(e.target.value)} placeholder="sk-..." />
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Paste your key to authenticate requests.</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <label style={{ fontWeight: 500, color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Model</label>
                        <select className="input" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={models.length === 0}>
                            <option value="" disabled>-- Choose a model --</option>
                            {models.map((m, i) => <option key={i} value={m.id}>{m.id}</option>)}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1 }}>
                        <label style={{ fontWeight: 500, color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Message</label>
                        <textarea className="input" style={{ flex: 1, resize: 'none', fontSize: '0.82rem' }} placeholder="Write a short poem about code..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                    </div>

                    <button className="btn btn-primary" style={{ padding: '0.6rem' }} onClick={handleTest} disabled={loading || !selectedKey || !selectedModel || !prompt}>
                        {loading ? 'Sending...' : 'Send Request'}
                    </button>
                </div>

                {/* Response */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--bg-secondary)' }}>
                    <h3 style={{ fontWeight: 600 }}>Response</h3>
                    <div style={{ flex: 1, background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflowY: 'auto', fontSize: '0.82rem' }}>
                        {error ? (
                            <div style={{ color: 'var(--danger)', fontWeight: 500 }}>{error}</div>
                        ) : response ? (
                            <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {response.choices?.[0]?.message?.content || JSON.stringify(response, null, 2)}
                            </div>
                        ) : (
                            <div style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center', marginTop: '25%', fontSize: '0.82rem' }}>
                                Enter a message and hit Send to see the response.
                            </div>
                        )}
                    </div>
                    {response && !error && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'flex', gap: '1rem' }}>
                            <span>Prompt: {response.usage?.prompt_tokens}</span>
                            <span>Completion: {response.usage?.completion_tokens}</span>
                            <span>Total: {response.usage?.total_tokens}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
