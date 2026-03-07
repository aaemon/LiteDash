'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { GUARDRAIL_PROVIDERS, ALL_MODES, CATEGORIES, MODE_COLORS, CONFIG_EXAMPLES, generateYaml } from './catalog';

export default function AdminGuardrailsPage() {
    const [guardrails, setGuardrails] = useState<any[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'active' | 'add' | 'catalog' | 'test' | 'reference'>('active');
    const [isViewer, setIsViewer] = useState(false);

    // Add form state
    const [formName, setFormName] = useState('');
    const [formProvider, setFormProvider] = useState('aporia');
    const [formModes, setFormModes] = useState<string[]>(['pre_call']);
    const [formApiKey, setFormApiKey] = useState('');
    const [formApiBase, setFormApiBase] = useState('');
    const [formDefaultOn, setFormDefaultOn] = useState(false);
    const [formExtraFields, setFormExtraFields] = useState<Record<string, string>>({});
    const [generatedYaml, setGeneratedYaml] = useState('');
    const [copied, setCopied] = useState(false);

    // Catalog state
    const [catalogFilter, setCatalogFilter] = useState('All');
    const [catalogSearch, setCatalogSearch] = useState('');

    // Test state
    const [testModel, setTestModel] = useState('');
    const [testGuardrails, setTestGuardrails] = useState<string[]>([]);
    const [testPrompt, setTestPrompt] = useState('');
    const [testResult, setTestResult] = useState<any>(null);
    const [testing, setTesting] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch('/api/auth/me').then(r => r.json()).catch(() => ({})),
            fetch('/api/admin/guardrails').then(r => r.json()).catch(() => ({ guardrails: [] })),
            fetch('/api/models').then(r => r.json()).catch(() => ({ data: [] })),
        ]).then(([meData, gData, mData]) => {
            if (meData?.isViewer) setIsViewer(true);
            setGuardrails(gData.guardrails || []);
            const m = mData.data || mData.models || [];
            setModels(m);
            if (m.length > 0) setTestModel(m[0]?.id || m[0]?.model_name || '');
        }).finally(() => setLoading(false));
    }, []);

    const toggleMode = (m: string) => {
        setFormModes(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
    };

    const handleGenerate = () => {
        if (!formName || formModes.length === 0) return;
        const yaml = generateYaml({
            guardrail_name: formName,
            guardrail: formProvider,
            mode: formModes,
            api_key: formApiKey || undefined,
            api_base: formApiBase || undefined,
            default_on: formDefaultOn,
            extra_fields: Object.keys(formExtraFields).length > 0 ? formExtraFields : undefined,
        });
        setGeneratedYaml(yaml);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedYaml);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTest = async () => {
        if (!testModel || !testPrompt) return;
        setTesting(true); setTestResult(null);
        try {
            const res = await fetch('/api/admin/guardrails/test', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: testModel,
                    messages: [{ role: 'user', content: testPrompt }],
                    guardrails: testGuardrails.length > 0 ? testGuardrails : undefined,
                }),
            });
            const data = await res.json();
            setTestResult(data);
        } catch (e: any) {
            setTestResult({ success: false, error: e.message });
        } finally { setTesting(false); }
    };

    const addFromCatalog = (provider: any) => {
        setFormName(`${provider.id}-guard`);
        setFormProvider(provider.id);
        setFormModes(provider.modes?.slice(0, 1) || ['pre_call']);
        setFormApiKey(provider.requiresKey ? 'os.environ/YOUR_API_KEY' : '');
        setFormApiBase(provider.requiresBase ? 'os.environ/YOUR_API_BASE' : '');
        setFormExtraFields({});
        setGeneratedYaml('');
        setTab('add');
    };

    const currentProviderObj = GUARDRAIL_PROVIDERS.flatMap(c => c.providers).find(p => p.id === formProvider);

    const filteredCatalog = GUARDRAIL_PROVIDERS
        .filter(c => catalogFilter === 'All' || c.category === catalogFilter)
        .map(c => ({ ...c, providers: c.providers.filter(p => !catalogSearch || p.name.toLowerCase().includes(catalogSearch.toLowerCase())) }))
        .filter(c => c.providers.length > 0);

    const labelStyle: CSSProperties = { fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' };
    const fieldStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.3rem' };
    const tabBtn = (t: string, active: boolean): CSSProperties => ({
        padding: '0.4rem 0.85rem', fontSize: '0.78rem', fontWeight: active ? 600 : 400,
        color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
        borderTop: 'none', borderLeft: 'none', borderRight: 'none',
        borderBottomWidth: '2px', borderBottomStyle: 'solid',
        borderBottomColor: active ? 'var(--accent-primary)' : 'transparent',
        background: 'none', cursor: 'pointer', transition: 'color 0.2s ease',
    });

    return (
        <div className="flex flex-col gap-6">
            <header>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ marginBottom: '0.25rem' }}>Guardrails</h1>
                        <p>Configure and manage content safety guardrails for your LLM requests.</p>
                    </div>
                    {!isViewer && <button className="btn btn-primary" onClick={() => setTab('add')}>+ Add Guardrail</button>}
                </div>
            </header>

            {/* Info Banner */}
            <div className="glass-card" style={{ borderLeft: '3px solid var(--accent-primary)', padding: '0.85rem 1rem' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Guardrails enforce content safety policies on LLM requests. They run as <strong>pre_call</strong> (before LLM), <strong>post_call</strong> (after LLM), <strong>during_call</strong> (parallel), or <strong>logging_only</strong>. Configure them in your <code style={{ padding: '0.1rem 0.35rem', background: 'var(--bg-secondary)', borderRadius: '3px', fontSize: '0.72rem' }}>config.yaml</code> file.
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
                <button style={tabBtn('active', tab === 'active')} onClick={() => setTab('active')}>Active Guardrails</button>
                <button style={tabBtn('add', tab === 'add')} onClick={() => setTab('add')}>Add Guardrail</button>
                <button style={tabBtn('catalog', tab === 'catalog')} onClick={() => setTab('catalog')}>Provider Catalog</button>
                <button style={tabBtn('test', tab === 'test')} onClick={() => setTab('test')}>Test Guardrail</button>
                <button style={tabBtn('reference', tab === 'reference')} onClick={() => setTab('reference')}>Config Reference</button>
            </div>

            {loading ? (
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Loading guardrails...</div>
            ) : (
                <>
                    {/* ====== ACTIVE GUARDRAILS TAB ====== */}
                    {tab === 'active' && (
                        guardrails.length === 0 ? (
                            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                </div>
                                <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>No Guardrails Configured</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', maxWidth: '450px', margin: '0 auto 1rem' }}>
                                    Add guardrails to your <code style={{ padding: '0.1rem 0.3rem', background: 'var(--bg-secondary)', borderRadius: '3px', fontSize: '0.72rem' }}>config.yaml</code> to enable content safety features.
                                </p>
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                    {!isViewer && <button className="btn btn-primary" onClick={() => setTab('add')}>Add Guardrail</button>}
                                    <button className="btn btn-outline" onClick={() => setTab('catalog')}>Browse Providers</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                    <strong>{guardrails.length}</strong> guardrail{guardrails.length !== 1 ? 's' : ''} configured
                                </div>
                                <div className="responsive-grid-2">
                                    {guardrails.map((g: any, idx: number) => {
                                        const mode = g.litellm_params?.mode || g.mode || 'pre_call';
                                        const modes = Array.isArray(mode) ? mode : [mode];
                                        return (
                                            <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                                <div className="card-stripe" style={{ background: MODE_COLORS[modes[0]] || '#4f6ef7' }}></div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{g.guardrail_name || g.name}</span>
                                                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                                        {modes.map((m: string) => (
                                                            <span key={m} style={{ fontSize: '0.6rem', padding: '0.1rem 0.3rem', borderRadius: 'var(--radius-full)', fontWeight: 600, textTransform: 'uppercase', background: `${MODE_COLORS[m] || '#888'}15`, color: MODE_COLORS[m] || '#888' }}>{m.replace('_', ' ')}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                                                    Provider: <span style={{ fontWeight: 500 }}>{g.litellm_params?.guardrail || 'custom'}</span>
                                                </div>
                                                {g.litellm_params?.api_base && (
                                                    <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                                                        Base: {g.litellm_params.api_base}
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    {g.litellm_params?.default_on && (
                                                        <span style={{ fontSize: '0.62rem', color: 'var(--success)', fontWeight: 600, background: 'rgba(34,197,94,0.1)', padding: '0.1rem 0.35rem', borderRadius: 'var(--radius-full)' }}>✓ Default On</span>
                                                    )}
                                                    {g.guardrail_info?.params?.map((p: any, pi: number) => (
                                                        <span key={pi} style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', background: 'var(--bg-secondary)', padding: '0.1rem 0.35rem', borderRadius: 'var(--radius-full)' }}>{p.name}: {p.type}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    )}

                    {/* ====== ADD GUARDRAIL TAB ====== */}
                    {tab === 'add' && (
                        <div className="grid-split">
                            <div className="glass-card">
                                <h3 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '1rem' }}>Configure Guardrail</h3>
                                <div className="flex flex-col gap-4">
                                    <div className="grid-form-2">
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Guardrail Name *</label>
                                            <input className="input" placeholder="e.g. pii-masking" value={formName} onChange={e => setFormName(e.target.value)} />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Provider *</label>
                                            <select className="input" value={formProvider} onChange={e => { setFormProvider(e.target.value); setFormExtraFields({}); }}>
                                                {GUARDRAIL_PROVIDERS.flatMap(c => c.providers).map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Mode(s) *</label>
                                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                                            {ALL_MODES.map(m => (
                                                <button key={m} onClick={() => toggleMode(m)} style={{
                                                    padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: 'var(--radius-full)',
                                                    border: `1px solid ${formModes.includes(m) ? MODE_COLORS[m] : 'var(--border-color)'}`,
                                                    background: formModes.includes(m) ? `${MODE_COLORS[m]}15` : 'var(--bg-primary)',
                                                    color: formModes.includes(m) ? MODE_COLORS[m] : 'var(--text-secondary)',
                                                    fontWeight: formModes.includes(m) ? 600 : 400, cursor: 'pointer',
                                                }}>{m.replace('_', ' ')}</button>
                                            ))}
                                        </div>
                                    </div>

                                    {currentProviderObj?.requiresKey && (
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>API Key</label>
                                            <input className="input" placeholder="os.environ/YOUR_API_KEY" value={formApiKey} onChange={e => setFormApiKey(e.target.value)} />
                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Use os.environ/VAR_NAME for environment variable references</span>
                                        </div>
                                    )}

                                    {currentProviderObj?.requiresBase && (
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>API Base URL</label>
                                            <input className="input" placeholder="os.environ/YOUR_API_BASE" value={formApiBase} onChange={e => setFormApiBase(e.target.value)} />
                                        </div>
                                    )}

                                    {/* Provider-specific fields */}
                                    {currentProviderObj?.fields && currentProviderObj.fields.length > 0 && (
                                        <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                            <span style={{ ...labelStyle, color: '#f59e0b', display: 'block', marginBottom: '0.5rem' }}>{currentProviderObj.name} Configuration</span>
                                            <div className="flex flex-col gap-3">
                                                {currentProviderObj.fields.map((f: any) => (
                                                    <div key={f.name} style={fieldStyle}>
                                                        <label style={labelStyle}>{f.label}</label>
                                                        <input className="input" placeholder={f.placeholder} value={formExtraFields[f.name] || ''} onChange={e => setFormExtraFields(prev => ({ ...prev, [f.name]: e.target.value }))} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={formDefaultOn} onChange={e => setFormDefaultOn(e.target.checked)} />
                                        Default on (run on every request)
                                    </label>

                                    <button className="btn btn-primary" onClick={handleGenerate} disabled={!formName || formModes.length === 0}>
                                        Generate YAML Config
                                    </button>
                                </div>
                            </div>

                            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <h3 style={{ fontWeight: 600, fontSize: '1rem' }}>Generated Config</h3>
                                    {generatedYaml && (
                                        <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }} onClick={handleCopy}>
                                            {copied ? '✓ Copied!' : 'Copy'}
                                        </button>
                                    )}
                                </div>
                                {generatedYaml ? (
                                    <pre style={{ flex: 1, background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontFamily: 'monospace', overflow: 'auto', whiteSpace: 'pre-wrap', margin: 0 }}>{generatedYaml}</pre>
                                ) : (
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '2rem' }}>
                                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.82rem', textAlign: 'center' }}>
                                            Fill out the form and click <strong>Generate YAML Config</strong> to create the config snippet for your <code style={{ padding: '0.1rem 0.3rem', background: 'var(--bg-primary)', borderRadius: '3px', fontSize: '0.72rem' }}>config.yaml</code>
                                        </p>
                                    </div>
                                )}
                                {generatedYaml && (
                                    <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 'var(--radius-md)', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                        <strong style={{ color: '#f59e0b' }}>Next steps:</strong> Add the generated config to your <code style={{ padding: '0.1rem 0.3rem', background: 'var(--bg-secondary)', borderRadius: '3px', fontSize: '0.68rem' }}>litellm-config.yaml</code> under the <code style={{ padding: '0.1rem 0.3rem', background: 'var(--bg-secondary)', borderRadius: '3px', fontSize: '0.68rem' }}>guardrails</code> section, then restart LiteLLM.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ====== PROVIDER CATALOG TAB ====== */}
                    {tab === 'catalog' && (
                        <div className="flex flex-col gap-4">
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                {CATEGORIES.map(c => (
                                    <button key={c} onClick={() => setCatalogFilter(c)} style={{
                                        padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: 'var(--radius-full)',
                                        border: '1px solid var(--border-color)', cursor: 'pointer',
                                        background: catalogFilter === c ? 'var(--accent-primary)' : 'var(--bg-primary)',
                                        color: catalogFilter === c ? '#fff' : 'var(--text-secondary)',
                                        fontWeight: catalogFilter === c ? 600 : 400,
                                    }}>{c}</button>
                                ))}
                            </div>
                            <input className="input" placeholder="Search providers..." value={catalogSearch} onChange={e => setCatalogSearch(e.target.value)} style={{ maxWidth: '400px' }} />

                            {filteredCatalog.map((cat, ci) => (
                                <div key={ci}>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>{cat.category}</div>
                                    <div className="responsive-grid-2">
                                        {cat.providers.map((p, pi) => (
                                            <div key={pi} className="glass-card" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => addFromCatalog(p)}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                                    <span style={{ fontSize: '1.3rem' }}>{p.icon}</span>
                                                    <div>
                                                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{p.name}</div>
                                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{p.description}</div>
                                                        <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.3rem' }}>
                                                            {p.modes.map((m: string) => (
                                                                <span key={m} style={{ fontSize: '0.55rem', padding: '0.05rem 0.25rem', borderRadius: 'var(--radius-full)', background: `${MODE_COLORS[m]}15`, color: MODE_COLORS[m], fontWeight: 600 }}>{m.replace('_', ' ')}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }}>›</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ====== TEST GUARDRAIL TAB ====== */}
                    {tab === 'test' && (
                        <div className="grid-split">
                            <div className="glass-card">
                                <h3 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '1rem' }}>Test Request</h3>
                                <div className="flex flex-col gap-4">
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Model</label>
                                        <select className="input" value={testModel} onChange={e => setTestModel(e.target.value)}>
                                            {models.map((m: any, i: number) => (
                                                <option key={i} value={m.id || m.model_name}>{m.id || m.model_name}</option>
                                            ))}
                                            {models.length === 0 && <option value="">No models available</option>}
                                        </select>
                                    </div>

                                    {guardrails.length > 0 && (
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Guardrails to Apply</label>
                                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                                                {guardrails.map((g: any, i: number) => {
                                                    const name = g.guardrail_name || g.name;
                                                    const active = testGuardrails.includes(name);
                                                    return (
                                                        <button key={i} onClick={() => setTestGuardrails(prev => active ? prev.filter(x => x !== name) : [...prev, name])} style={{
                                                            padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: 'var(--radius-full)',
                                                            border: `1px solid ${active ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                                            background: active ? 'var(--accent-light)' : 'var(--bg-primary)',
                                                            color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                                            fontWeight: active ? 600 : 400, cursor: 'pointer',
                                                        }}>{name}</button>
                                                    );
                                                })}
                                            </div>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Leave empty to test with all default_on guardrails</span>
                                        </div>
                                    )}

                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Test Prompt</label>
                                        <textarea className="input" rows={4} style={{ resize: 'vertical', fontSize: '0.82rem' }} placeholder="e.g. Hi, my email is test@example.com and my SSN is 123-45-6789" value={testPrompt} onChange={e => setTestPrompt(e.target.value)} />
                                    </div>

                                    <button className="btn btn-primary" onClick={handleTest} disabled={testing || !testModel || !testPrompt}>
                                        {testing ? 'Testing...' : '🧪 Send Test Request'}
                                    </button>
                                </div>
                            </div>

                            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '1rem' }}>Result</h3>
                                {testResult ? (
                                    <div className="flex flex-col gap-3" style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: testResult.success ? 'var(--success)' : testResult.blocked ? '#f59e0b' : 'var(--danger)' }} />
                                            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: testResult.success ? 'var(--success)' : testResult.blocked ? '#f59e0b' : 'var(--danger)' }}>
                                                {testResult.success ? 'Passed' : testResult.blocked ? 'Blocked by Guardrail' : 'Error'}
                                            </span>
                                        </div>
                                        {testResult.blocked && (
                                            <div style={{ padding: '0.6rem 0.85rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                                🛡️ The guardrail correctly blocked this request.
                                            </div>
                                        )}
                                        <pre style={{ flex: 1, background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.5, overflow: 'auto', whiteSpace: 'pre-wrap', margin: 0 }}>
                                            {JSON.stringify(testResult.response || testResult.error, null, 2)}
                                        </pre>
                                    </div>
                                ) : (
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '2rem' }}>
                                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.82rem', textAlign: 'center' }}>
                                            Send a test request to see if your guardrails are working correctly.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ====== CONFIG REFERENCE TAB ====== */}
                    {tab === 'reference' && (
                        <div className="flex flex-col gap-4">
                            <div className="glass-card">
                                <h3 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>YAML Configuration Specification</h3>
                                <pre style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontFamily: 'monospace', overflow: 'auto', whiteSpace: 'pre-wrap', margin: 0 }}>{`guardrails:
  - guardrail_name: string      # Required: unique name
    litellm_params:
      guardrail: string          # Required: provider id
      mode: string | string[]    # Required: pre_call, post_call,
                                 #   during_call, logging_only
      api_key: string            # API key or env ref
      api_base: string           # API base URL or env ref
      default_on: boolean        # Run on every request
    guardrail_info:              # Optional metadata
      params:
        - name: string
          type: string
          description: string`}</pre>
                            </div>

                            <div className="responsive-grid-2">
                                {Object.entries(CONFIG_EXAMPLES).map(([key, val]) => (
                                    <div key={key} className="glass-card">
                                        <h4 style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')} Example</h4>
                                        <pre style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.5, overflow: 'auto', whiteSpace: 'pre-wrap', margin: 0 }}>{val}</pre>
                                    </div>
                                ))}
                            </div>

                            <div className="glass-card" style={{ borderLeft: '3px solid var(--accent-primary)' }}>
                                <h4 style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>Mode Reference</h4>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            {['Mode', 'Description', 'Timing'].map(h => (
                                                <th key={h} style={{ padding: '0.5rem 0.6rem', fontWeight: 600, fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            ['pre_call', 'Runs before the LLM call on the input', 'Synchronous, blocks LLM call'],
                                            ['post_call', 'Runs after the LLM call on input & output', 'After response received'],
                                            ['during_call', 'Runs in parallel with the LLM call', 'Response waits for guardrail'],
                                            ['logging_only', 'Logs guardrail results without blocking', 'Non-blocking, audit only'],
                                        ].map(([mode, desc, timing]) => (
                                            <tr key={mode} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '0.5rem 0.6rem' }}>
                                                    <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.35rem', borderRadius: 'var(--radius-full)', background: `${MODE_COLORS[mode]}15`, color: MODE_COLORS[mode], fontWeight: 600 }}>{mode}</span>
                                                </td>
                                                <td style={{ padding: '0.5rem 0.6rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{desc}</td>
                                                <td style={{ padding: '0.5rem 0.6rem', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{timing}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="glass-card" style={{ borderLeft: '3px solid #22c55e' }}>
                                <h4 style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>Client-Side Usage</h4>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Specify guardrails per request in the API call:</p>
                                <pre style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.5, overflow: 'auto', margin: 0 }}>{`curl http://your-proxy/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your-key" \\
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "hello"}],
    "guardrails": ["pii-masking", "prompt-injection"]
  }'`}</pre>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
