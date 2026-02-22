'use client';

import { useState, useEffect } from 'react';
import { useCurrency } from '@/hooks/useCurrency';

export default function ModelsPage() {
    const [models, setModels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { format } = useCurrency();

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const res = await fetch('/api/models');
                const data = await res.json();
                if (res.ok) setModels(data.models || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchModels();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 style={{ marginBottom: '0.25rem' }}>Available Models</h1>
                <p>AI models actively configured on this LiteLLM instance.</p>
            </header>

            {loading ? (
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Loading models...</div>
            ) : models.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'var(--text-tertiary)' }}>No models found.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
                    {models.map((model, idx) => (
                        <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div className="card-stripe" style={{ background: 'var(--accent-gradient)' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, wordBreak: 'break-all', color: 'var(--text-primary)' }}>{model.id}</span>
                                <span style={{
                                    fontSize: '0.65rem',
                                    background: 'rgba(34, 197, 94, 0.1)',
                                    color: 'var(--success)',
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: 'var(--radius-full)',
                                    fontWeight: 600,
                                    letterSpacing: '0.02em',
                                    textTransform: 'uppercase',
                                }}>
                                    Active
                                </span>
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: '1.5rem',
                                padding: '0.6rem 0.75rem',
                                background: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.8rem',
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>Input</span>
                                    <span style={{ fontWeight: 600 }}>
                                        {format((model.input_cost_per_token || 0) * 1000000, 2)}
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 400 }}> /1M</span>
                                    </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>Output</span>
                                    <span style={{ fontWeight: 600 }}>
                                        {format((model.output_cost_per_token || 0) * 1000000, 2)}
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 400 }}> /1M</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
