'use client';

import { useState, useEffect } from 'react';

export default function KeysPage() {
    const [keys, setKeys] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newKeyName, setNewKeyName] = useState('');
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);

    const fetchKeys = async () => {
        try {
            const res = await fetch('/api/keys');
            const data = await res.json();
            if (res.ok) setKeys(data.keys || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchKeys(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneratedKey(null);
        try {
            const res = await fetch('/api/keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newKeyName })
            });
            const data = await res.json();
            if (res.ok && data.key) {
                setGeneratedKey(data.key);
                setNewKeyName('');
                fetchKeys();
            } else {
                alert(data.error || 'Failed to create key');
            }
        } catch (e) { console.error(e); }
    };

    const handleRevoke = async (keyToken: string) => {
        if (!confirm('Are you sure you want to revoke this key?')) return;
        try {
            const res = await fetch('/api/keys', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: keyToken })
            });
            if (res.ok) { fetchKeys(); }
            else { const data = await res.json(); alert(data.error || 'Failed to revoke key'); }
        } catch (e) { console.error(e); }
    };

    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 style={{ marginBottom: '0.25rem' }}>API Keys</h1>
                <p>Manage your API keys for accessing the LiteLLM proxy.</p>
            </header>

            <div className="glass-card flex flex-col gap-4">
                <h3 style={{ fontWeight: 600 }}>Create New API Key</h3>
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>Key Name (Optional)</label>
                        <input className="input" placeholder="e.g. My Production App" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>Generate Key</button>
                </form>

                {generatedKey && (
                    <div style={{ padding: '0.85rem', backgroundColor: 'rgba(34, 197, 94, 0.08)', border: '1px solid var(--success)', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.35rem' }}>New Key Generated!</p>
                        <p style={{ fontSize: '0.78rem', marginBottom: '0.5rem' }}>Copy this key now — you won't be able to see it again.</p>
                        <code style={{ display: 'block', padding: '0.65rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', wordBreak: 'break-all', fontSize: '0.78rem' }}>
                            {generatedKey}
                        </code>
                    </div>
                )}
            </div>

            <div className="glass-card flex flex-col gap-4">
                <h3 style={{ fontWeight: 600 }}>Active Keys</h3>
                {loading ? (
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>Loading keys...</p>
                ) : keys.length === 0 ? (
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>No active API keys yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '0.6rem 0.75rem', fontWeight: 600, fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Name</th>
                                    <th style={{ padding: '0.6rem 0.75rem', fontWeight: 600, fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Prefix</th>
                                    <th style={{ padding: '0.6rem 0.75rem', fontWeight: 600, fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Created</th>
                                    <th style={{ padding: '0.6rem 0.75rem', fontWeight: 600, fontSize: '0.72rem', color: 'var(--text-tertiary)', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {keys.map((k, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '0.6rem 0.75rem', fontWeight: 500, fontSize: '0.82rem' }}>{k.key_alias || 'Unnamed'}</td>
                                        <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{k.token || 'sk-...'}</td>
                                        <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-tertiary)', fontSize: '0.78rem' }}>{k.created_at || 'Just now'}</td>
                                        <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>
                                            <button className="btn btn-outline" style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleRevoke(k.token)}>
                                                Revoke
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
