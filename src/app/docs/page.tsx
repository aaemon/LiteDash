'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { API_DATA, API_CATEGORIES, APIEndpoint } from './api-data';

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState('introduction');
    const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
    const [settings, setSettings] = useState({ appName: 'LiteDash', logoUrl: '' });

    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                setSettings(data);
            } catch (err) {
                console.error('Settings fetch error:', err);
            }
        }
        fetchSettings();
    }, []);

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        setSelectedEndpoint(null);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            {/* Nav */}
            <nav style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 100,
                backgroundColor: 'var(--bg-elevated)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid var(--border-color)',
                padding: '0.85rem 0'
            }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
                        {settings.logoUrl ? (
                            <img src={settings.logoUrl} alt={settings.appName} style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'contain' }} />
                        ) : (
                            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem', fontWeight: 800 }}>
                                {settings.appName.charAt(0)}
                            </div>
                        )}
                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{settings.appName}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 500, paddingLeft: '0.5rem', borderLeft: '1px solid var(--border-color)' }}>Documentation</span>
                    </Link>
                    <Link href="/login" className="btn btn-primary">Sign In</Link>
                </div>
            </nav>

            <div className="container" style={{ display: 'flex', gap: '4rem', paddingTop: '100px', paddingBottom: '100px' }}>
                {/* Sidebar */}
                <aside style={{ width: '260px', position: 'sticky', top: '100px', height: 'calc(100vh - 140px)', overflowY: 'auto', paddingRight: '1rem' }}>
                    <div className="flex flex-col gap-8">
                        <div>
                            <h5 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', color: 'var(--text-tertiary)' }}>Getting Started</h5>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                                <li><button onClick={() => scrollToSection('introduction')} className={`nav-link ${activeSection === 'introduction' ? 'active' : ''}`} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', width: '100%', cursor: 'pointer' }}>Introduction</button></li>
                                <li><button onClick={() => scrollToSection('architecture')} className={`nav-link ${activeSection === 'architecture' ? 'active' : ''}`} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', width: '100%', cursor: 'pointer' }}>Architecture</button></li>
                            </ul>
                        </div>

                        <div>
                            <h5 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', color: 'var(--text-tertiary)' }}>API Reference</h5>
                            <div className="flex flex-col gap-4">
                                {API_CATEGORIES.map(cat => (
                                    <div key={cat.id}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span>{cat.icon}</span> {cat.name}
                                        </div>
                                        <ul style={{ listStyle: 'none', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                                            {API_DATA.filter(e => e.tag === cat.id).map(endpoint => (
                                                <li key={endpoint.path}>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedEndpoint(endpoint);
                                                            setActiveSection('api-explorer');
                                                            window.scrollTo({ top: 100, behavior: 'smooth' });
                                                        }}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            padding: 0,
                                                            textAlign: 'left',
                                                            width: '100%',
                                                            cursor: 'pointer',
                                                            color: selectedEndpoint?.path === endpoint.path ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                                            fontWeight: selectedEndpoint?.path === endpoint.path ? 600 : 400
                                                        }}
                                                    >
                                                        {endpoint.summary}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h5 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Enterprise</h5>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                                <li><button onClick={() => scrollToSection('guardrails')} className="nav-link" style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', width: '100%', cursor: 'pointer' }}>Guardrails & Budgets</button></li>
                                <li><a href="#rbac" className="nav-link">RBAC & Security</a></li>
                            </ul>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main style={{ flex: 1, maxWidth: '800px' }}>
                    {activeSection === 'api-explorer' && selectedEndpoint ? (
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    backgroundColor: selectedEndpoint.method === 'GET' ? '#0ea5e920' : '#10b98120',
                                    color: selectedEndpoint.method === 'GET' ? '#0ea5e9' : '#10b981',
                                    border: `1px solid ${selectedEndpoint.method === 'GET' ? '#0ea5e940' : '#10b98140'}`
                                }}>
                                    {selectedEndpoint.method}
                                </span>
                                <code style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedEndpoint.path}</code>
                            </div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>{selectedEndpoint.summary}</h1>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>{selectedEndpoint.description}</p>

                            {selectedEndpoint.body && (
                                <div style={{ marginBottom: '2.5rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Request Body</h3>
                                    <div className="glass-card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
                                        <pre style={{ margin: 0, fontSize: '0.85rem' }}>
                                            {JSON.stringify(selectedEndpoint.body, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Example Request</h3>
                                <div className="glass-card" style={{ padding: '1.5rem', backgroundColor: '#000', color: '#fff' }}>
                                    <pre style={{ margin: 0, fontSize: '0.85rem', overflowX: 'auto' }}>
                                        {`curl -X ${selectedEndpoint.method} "http://localhost:4000${selectedEndpoint.path}" \\
  -H "Authorization: Bearer sk-1234" \\
  ${selectedEndpoint.body ? `-H "Content-Type: application/json" \\
  -d '${JSON.stringify(selectedEndpoint.body)}'` : ''}`}
                                    </pre>
                                </div>
                            </div>

                            <button
                                onClick={() => setActiveSection('introduction')}
                                style={{ marginTop: '3rem', color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                            >
                                ← Back to Documentation
                            </button>
                        </section>
                    ) : (
                        <>
                            <section id="introduction" style={{ marginBottom: '5rem' }}>
                                <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>Introduction</h1>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                                    LiteDash is a high-performance, enterprise-grade management layer for the LiteLLM Proxy.
                                    It provides a centralized orchestration platform for managing diverse Large Language Models (LLMs)
                                    with absolute precision, security, and scalability.
                                </p>
                                <div style={{ padding: '1.5rem', backgroundColor: 'var(--accent-light)', borderLeft: '4px solid var(--accent-primary)', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem' }}>
                                    <p style={{ margin: 0, color: 'var(--accent-primary)', fontWeight: 600 }}>
                                        Pro-Tip: LiteDash is designed to handle 10,000+ requests per second with sub-5ms latency overhead.
                                    </p>
                                </div>
                            </section>

                            <section id="architecture" style={{ marginBottom: '5rem' }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Architecture</h2>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    LiteDash operates as a stateful dashboard that interacts with the LiteLLM Proxy via secure API channels.
                                    It utilizes a modern stack to ensure real-time observability and granular control.
                                </p>
                                <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', background: 'var(--bg-secondary)' }}>
                                    <pre style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                                        {`┌─────────────┐     ┌───────────────┐     ┌──────────────┐
│  End Users  │ ──> │ LiteLLM Proxy │ ──> │ Model API's  │
└─────────────┘     └───────┬───────┘     └──────────────┘
                            │
                    ┌───────┴───────┐
                    │   LiteDash    │ (Orchestration & RBAC)
                    └───────────────┘`}
                                    </pre>
                                </div>
                            </section>

                            <section id="guardrails" style={{ marginBottom: '5rem' }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Enterprise Guardrails</h2>
                                <p>
                                    Deploying AI at scale requires rigorous control. LiteDash provides multi-layered guardrails:
                                </p>
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                                            <th style={{ padding: '1rem' }}>Feature</th>
                                            <th style={{ padding: '1rem' }}>Functionality</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '1rem', fontWeight: 600 }}>Budget Hard-Limits</td>
                                            <td style={{ padding: '1rem' }}>Instant cutoff when budget is exceeded.</td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '1rem', fontWeight: 600 }}>PII Filtering</td>
                                            <td style={{ padding: '1rem' }}>Automatic redaction of sensitive data before reaching the model.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>
                        </>
                    )}
                </main>
            </div>

            <footer style={{ borderTop: '1px solid var(--border-color)', padding: '4rem 0', color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-primary)' }}>
                <div className="container text-center">
                    <p style={{ fontSize: '0.9rem' }}>LiteDash Enterprise Documentation &copy; 2026</p>
                </div>
            </footer>
        </div>
    );
}
