'use client';

import { useState, useEffect } from 'react';

export default function AdminGuardrailsPage() {
    const [guardrails, setGuardrails] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/guardrails').then(r => r.json()).then(d => setGuardrails(d.guardrails || [])).catch(() => { }).finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 style={{ marginBottom: '0.25rem' }}>Guardrails</h1>
                <p>View and monitor content safety guardrails configured on this LiteLLM instance.</p>
            </header>

            {/* Info Banner */}
            <div className="glass-card" style={{ borderLeft: '3px solid var(--accent-primary)', padding: '0.85rem 1rem' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Guardrails are configured in your <code style={{ padding: '0.1rem 0.35rem', background: 'var(--bg-secondary)', borderRadius: '3px', fontSize: '0.72rem' }}>config.yaml</code> file and can run as <strong>pre_call</strong> (before LLM), <strong>post_call</strong> (after LLM), or <strong>during_call</strong> (parallel). Supported providers include Aporia, Lakera, Pangea, and custom implementations.
                </p>
            </div>

            {loading ? (
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Loading guardrails...</div>
            ) : guardrails.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>No Guardrails Configured</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', maxWidth: '450px', margin: '0 auto 1rem' }}>
                        Add guardrails to your <code style={{ padding: '0.1rem 0.3rem', background: 'var(--bg-secondary)', borderRadius: '3px', fontSize: '0.72rem' }}>config.yaml</code> to enable content safety features.
                    </p>
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'left', maxWidth: '450px', margin: '0 auto' }}>
                        <pre style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontFamily: 'monospace', margin: 0, whiteSpace: 'pre-wrap' }}>{`guardrails:
  - guardrail_name: "pii-masking"
    litellm_params:
      guardrail: presidio
      mode: "pre_call"
  - guardrail_name: "prompt-injection"
    litellm_params:
      guardrail: lakera_prompt_injection
      mode: "during_call"`}</pre>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
                    {guardrails.map((g: any, idx: number) => {
                        const mode = g.litellm_params?.mode || g.mode || 'pre_call';
                        const modeColor = mode === 'pre_call' ? '#4f6ef7' : mode === 'post_call' ? '#22c55e' : '#f59e0b';
                        return (
                            <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div className="card-stripe" style={{ background: modeColor }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{g.guardrail_name || g.name}</span>
                                    <span style={{ fontSize: '0.62rem', padding: '0.12rem 0.35rem', borderRadius: 'var(--radius-full)', fontWeight: 600, textTransform: 'uppercase', background: `${modeColor}15`, color: modeColor }}>{mode.replace('_', ' ')}</span>
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                                    Provider: <span style={{ fontWeight: 500 }}>{g.litellm_params?.guardrail || 'custom'}</span>
                                </div>
                                {g.litellm_params?.default_on && (
                                    <span style={{ fontSize: '0.62rem', color: 'var(--success)', fontWeight: 500 }}>✓ Default enabled</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
