'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { API_DATA, APIEndpoint } from './api-data';

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
            // Adjust scroll position for the fixed navbar
            const y = element.getBoundingClientRect().top + window.scrollY - 120;
            window.scrollTo({ top: y, behavior: 'smooth' });
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
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
                        {settings.logoUrl ? (
                            <img src={settings.logoUrl} alt={settings.appName} style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'contain' }} />
                        ) : (
                            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem', fontWeight: 800 }}>
                                {settings.appName.charAt(0)}
                            </div>
                        )}
                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }} className="mobile-hide">{settings.appName}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 500, paddingLeft: '0.5rem', borderLeft: '1px solid var(--border-color)' }}>Documentation</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link href="/login" className="btn btn-primary">Dashboard</Link>
                    </div>
                </div>
            </nav>

            {/* Grid Layout Container - styled via globals.css for responsiveness */}
            <div className="container docs-layout" style={{ paddingTop: '80px', paddingBottom: '60px', width: '100%' }}>
                {/* Flat Clickable Buttons Sidebar */}
                <aside className="docs-sidebar">
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.85rem' }}>
                        <li>
                            <button onClick={() => scrollToSection('introduction')} style={{ background: activeSection === 'introduction' ? 'var(--accent-light)' : 'none', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', textAlign: 'left', width: '100%', cursor: 'pointer', color: activeSection === 'introduction' ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: activeSection === 'introduction' ? 600 : 500, transition: 'all 0.2s ease' }}>
                                Introduction
                            </button>
                        </li>
                        <li>
                            <button onClick={() => scrollToSection('architecture')} style={{ background: activeSection === 'architecture' ? 'var(--accent-light)' : 'none', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', textAlign: 'left', width: '100%', cursor: 'pointer', color: activeSection === 'architecture' ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: activeSection === 'architecture' ? 600 : 500, transition: 'all 0.2s ease' }}>
                                Core Architecture
                            </button>
                        </li>
                        <li>
                            <button onClick={() => scrollToSection('integration')} style={{ background: activeSection === 'integration' ? 'var(--accent-light)' : 'none', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', textAlign: 'left', width: '100%', cursor: 'pointer', color: activeSection === 'integration' ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: activeSection === 'integration' ? 600 : 500, transition: 'all 0.2s ease' }}>
                                Integration Guide
                            </button>
                        </li>
                        <li>
                            <button onClick={() => scrollToSection('authentication')} style={{ background: activeSection === 'authentication' ? 'var(--accent-light)' : 'none', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', textAlign: 'left', width: '100%', cursor: 'pointer', color: activeSection === 'authentication' ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: activeSection === 'authentication' ? 600 : 500, transition: 'all 0.2s ease' }}>
                                Authentication & Keys
                            </button>
                        </li>
                        <li>
                            <button onClick={() => scrollToSection('security')} style={{ background: activeSection === 'security' ? 'var(--accent-light)' : 'none', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', textAlign: 'left', width: '100%', cursor: 'pointer', color: activeSection === 'security' ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: activeSection === 'security' ? 600 : 500, transition: 'all 0.2s ease', marginBottom: '1rem' }}>
                                Enterprise Security
                            </button>
                        </li>

                        {/* Flat list of all API endpoints */}
                        {API_DATA.map(endpoint => (
                            <li key={endpoint.path}>
                                <button
                                    onClick={() => {
                                        setSelectedEndpoint(endpoint);
                                        setActiveSection('api-explorer');
                                        window.scrollTo({ top: 0, behavior: 'instant' });
                                    }}
                                    style={{
                                        background: selectedEndpoint?.path === endpoint.path ? 'var(--accent-light)' : 'transparent',
                                        border: 'none',
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '6px',
                                        textAlign: 'left',
                                        width: '100%',
                                        cursor: 'pointer',
                                        color: selectedEndpoint?.path === endpoint.path ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                        fontWeight: selectedEndpoint?.path === endpoint.path ? 600 : 400,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {endpoint.summary}
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: endpoint.method === 'GET' ? '#0ea5e9' : '#10b981' }}>{endpoint.method}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Main Content Area */}
                <main style={{ width: '100%', overflowX: 'hidden' }}>
                    {activeSection === 'api-explorer' && selectedEndpoint ? (
                        <div className="animate-fade-in">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                <span style={{
                                    padding: '0.3rem 0.8rem',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    backgroundColor: selectedEndpoint.method === 'GET' ? '#0ea5e915' : '#10b98115',
                                    color: selectedEndpoint.method === 'GET' ? '#0ea5e9' : '#10b981',
                                    border: `1px solid ${selectedEndpoint.method === 'GET' ? '#0ea5e930' : '#10b98130'}`
                                }}>
                                    {selectedEndpoint.method}
                                </span>
                                <code style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-all' }}>{selectedEndpoint.path}</code>
                            </div>
                            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>{selectedEndpoint.summary}</h1>
                            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>{selectedEndpoint.description}</p>

                            {selectedEndpoint.body && (
                                <div style={{ marginBottom: '3rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Request Body Structure</h3>
                                    <div className="glass-card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', overflowX: 'auto' }}>
                                        <table style={{ width: '100%', minWidth: '500px', borderCollapse: 'collapse', textAlign: 'left' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                    <th style={{ paddingBottom: '1rem', color: 'var(--text-tertiary)', fontWeight: 700, fontSize: '0.8rem' }}>PROPERTY</th>
                                                    <th style={{ paddingBottom: '1rem', color: 'var(--text-tertiary)', fontWeight: 700, fontSize: '0.8rem' }}>TYPE / REQUIREMENT</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(selectedEndpoint.body).map(([key, value], i, arr) => (
                                                    <tr key={key} style={{ borderBottom: i === arr.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                                                        <td style={{ padding: '1rem 0', fontWeight: 600, color: 'var(--text-primary)' }}><code>{key}</code></td>
                                                        <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{String(value)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Example cURL Request</h3>
                                <div className="glass-card" style={{ padding: '1.5rem', backgroundColor: '#0f1117', color: '#e2e8f0', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <pre style={{ margin: 0, fontSize: '0.85rem', overflowX: 'auto', lineHeight: 1.6, fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}>
                                        {`curl -X ${selectedEndpoint.method} "https://api.litedash.com${selectedEndpoint.path}" \\
  -H "Authorization: Bearer sk-your-litedash-key" \\
  ${selectedEndpoint.body ? `-H "Content-Type: application/json" \\
  -d '${JSON.stringify(selectedEndpoint.body, null, 2)}'` : ''}`}
                                    </pre>
                                </div>
                            </div>

                            <div style={{ marginTop: '3rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Response Format</h3>
                                <div className="glass-card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', overflowX: 'auto' }}>
                                    <table style={{ width: '100%', minWidth: '400px', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <th style={{ paddingBottom: '1rem', color: 'var(--text-tertiary)', fontWeight: 700, fontSize: '0.8rem' }}>STATUS</th>
                                                <th style={{ paddingBottom: '1rem', color: 'var(--text-tertiary)', fontWeight: 700, fontSize: '0.8rem' }}>DESCRIPTION</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(selectedEndpoint.responses).map(([status, desc], i, arr) => (
                                                <tr key={status} style={{ borderBottom: i === arr.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                                                    <td style={{ padding: '1rem 0', fontWeight: 600, color: status.startsWith('2') ? 'var(--success)' : 'var(--danger)' }}>{status}</td>
                                                    <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{String(desc)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <section id="introduction" style={{ marginBottom: '4rem' }}>
                                <div style={{
                                    display: 'inline-block',
                                    padding: '0.4rem 1rem',
                                    borderRadius: 'var(--radius-full)',
                                    background: 'var(--accent-light)',
                                    color: 'var(--accent-primary)',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    marginBottom: '1.5rem'
                                }}>High-Performance API Service</div>
                                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1.5rem', lineHeight: 1.05 }}>Introduction to LiteDash</h1>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '100%' }}>
                                    LiteDash is a managed, ultra-low latency AI API service providing instant, scalable access to the world's most powerful open-source foundation models. We host proprietary clusters of hardware running the latest models like Llama 3, Qwen 2.5, and DeepSeek, optimizing them for maximum throughput and unmatched time-to-first-token (TTFT).
                                </p>
                                <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '100%' }}>
                                    Unlike traditional deployments or local hosting, LiteDash abstracts away the infrastructure. You do not need to manage GPUs, load balancers, or vLLM instances. You simply send a request to our API endpoint, formatted exactly like an OpenAI request, and receive an instant response.
                                </p>
                                <div className="responsive-grid-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
                                    {[
                                        { title: "Drop-in OpenAI Replacement", desc: "No new SDKs to learn. If your code works with GPT-4, it works with LiteDash simply by changing the Base URL." },
                                        { title: "Unmatched Reliability", desc: "We guarantee 99.9% uptime with intelligent, cross-region load balancing and automatic request fallbacks." },
                                        { title: "Predictable, Scalable Pricing", desc: "Pay strictly for the tokens you generate. Implement hard budget limits across your organization to never overspend." },
                                        { title: "Complete Privacy", desc: "Your data is never used to train models. We offer zero-retention policies for enterprise workloads." }
                                    ].map((feat, i) => (
                                        <div key={i} className="glass-card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)' }}>
                                            <h4 style={{ fontWeight: 800, marginBottom: '0.75rem', fontSize: '1.05rem', color: 'var(--text-primary)' }}>{feat.title}</h4>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{feat.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '3rem 0' }} />

                            <section id="architecture" style={{ marginBottom: '4rem' }}>
                                <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Core Service Architecture</h2>
                                <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                    LiteDash is engineered from the ground up for speed. When a request hits our geographically distributed API gateway, it is instantly localized to the nearest data center. Our proprietary semantic router analyzes the request payload and pairs it with the most available, non-saturated GPU cluster hosting the requested model.
                                </p>
                                <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', background: '#0a0d14', color: '#f8fafc', overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <pre style={{ fontSize: '0.85rem', fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.6, display: 'inline-block', textAlign: 'left', margin: 0 }}>
                                        {`  [ YOUR APPLICATION ]
           │    (Standard OpenAI JSON Payload)
           ▼
  ┌────────────────────────────────────────────────────────┐
  │                   LiteDash Edge API                    │
  │  (Auth → Budget Check → Rate Limiting → PII Filter)    │
  └──────────────┬──────────────────────────┬──────────────┘
                 │                          │
                 ▼                          ▼
      ┌────────────────────┐      ┌────────────────────┐
      │  US-East Cluster   │      │  EU-West Cluster   │
      │  (vLLM Optimized)  │      │  (vLLM Optimized)  │
      └──────────┬─────────┘      └─────────┬──────────┘
                 │                          │
           [ H100 GPUs ]              [ A100 GPUs ]`}
                                    </pre>
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', marginTop: '2rem' }}>Global Edge Network</h3>
                                <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                    By caching aggressive system prompts and utilizing RadixAttention inside our vLLM inferences engines, repetitive queries to LiteDash experience almost zero prompt-processing latency. Time to First Token (TTFT) for cached prompts is generally below 150ms globally.
                                </p>
                            </section>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '3rem 0' }} />

                            <section id="integration" style={{ marginBottom: '4rem' }}>
                                <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Integration Guide / Quickstart</h2>
                                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                                    Transitioning to LiteDash is entirely frictionless if you have ever used an OpenAI client library in any language (Python, Node.js, Go, etc.). You simply provide your LiteDash Virtual Key and modify the client's base URL.
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                            <div style={{ background: 'var(--accent-primary)', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>1</div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Generate a Virtual Key</h3>
                                        </div>
                                        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '2.5rem', lineHeight: 1.5 }}>Log in to the LiteDash dashboard, navigate to `API Keys`, and click `Generate New Virtual Key`. You can assign optional monthly budget limits to this key immediately.</p>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                            <div style={{ background: 'var(--accent-primary)', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>2</div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Initialize Your Client</h3>
                                        </div>
                                        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '2.5rem', lineHeight: 1.5 }}>Instantiate an OpenAI client. Instead of omitting the `base_url`, you must explicitly point it to the LiteDash endpoint.</p>
                                        <div className="glass-card" style={{ background: '#0a0d14', marginLeft: '2.5rem', border: '1px solid rgba(255,255,255,0.05)', padding: '1.25rem' }}>
                                            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', marginBottom: '1rem', color: '#9ba1b0', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>PYTHON</div>
                                            <pre style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: 0 }}>
                                                {`import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("LITEDASH_API_KEY"),
    base_url="https://api.litedash.com/v1", # The core LiteDash endpoint
)`}
                                            </pre>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                            <div style={{ background: 'var(--accent-primary)', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>3</div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Invoke the Model</h3>
                                        </div>
                                        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '2.5rem', lineHeight: 1.5 }}>Specify a supported open-source model string using the `ollama/` or `huggingface/` prefix conventions where supported, or simply the exact model ID like `llama-3.1-70b-instruct`.</p>
                                        <div className="glass-card" style={{ background: '#0a0d14', marginLeft: '2.5rem', border: '1px solid rgba(255,255,255,0.05)', padding: '1.25rem' }}>
                                            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', marginBottom: '1rem', color: '#9ba1b0', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>PYTHON</div>
                                            <pre style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: 0 }}>
                                                {`response = client.chat.completions.create(
    model="llama-3.1-70b-instruct",
    messages=[
        {"role": "system", "content": "You are a concise engineering assistant."},
        {"role": "user", "content": "Write a bash script to find large files."}
    ],
    temperature=0.2,
    max_tokens=500
)

print(response.choices[0].message.content)`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '3rem 0' }} />

                            <section id="authentication" style={{ marginBottom: '4rem' }}>
                                <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Authentication & Virtual Keys</h2>
                                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                    LiteDash secures all endpoints using Bearer Token authentication. Your API requests must include an `Authorization` header containing your Virtual Key.
                                </p>
                                <div className="glass-card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', marginBottom: '2rem' }}>
                                    <code style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>Authorization: Bearer sk-ld-1234567890abcdef...</code>
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Understanding Virtual Keys</h3>
                                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                                    Unlike standard API keys, LiteDash "Virtual Keys" are decoupled from your primary account billing and offer microscopic control over resource consumption.
                                </p>
                                <ul style={{ paddingLeft: '1.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                    <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-primary)' }}>Ephemerality:</strong> Keys can be set to auto-expire on a given UTC timestamp.</li>
                                    <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-primary)' }}>Model Restrictions:</strong> A key can be locked to only allow calls to a specific model (e.g., `llama-3.1-8b` only).</li>
                                    <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-primary)' }}>Rate Limits:</strong> Impart strict Tokens-Per-Minute (TPM) and Requests-Per-Minute (RPM) limits to prevent volumetric abuse.</li>
                                </ul>
                            </section>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '3rem 0' }} />

                            <section id="security" style={{ marginBottom: '4rem' }}>
                                <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Enterprise Security & Compliance</h2>
                                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                    When routing millions of tokens representing customer data, security can never be an afterthought. LiteDash brings SOC2 Type II compliance standards to open-source model inference.
                                </p>
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                                            <th style={{ padding: '1.5rem 1rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Security Feature</th>
                                            <th style={{ padding: '1.5rem 1rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Detailed Functionality</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { f: "Automatic PII Redaction", d: "Opt-in middleware that uses Microsoft Presidio to detect and irreversibly mask credit cards, SSNs, and email addresses before the text string ever reaches the GPU." },
                                            { f: "Zero Data Retention", d: "LiteDash does not store your prompt inputs or completions. Once an inference request is fulfilled, the payload is purged entirely from memory." },
                                            { f: "RBAC & Team Isolation", d: "Organize API keys by 'Projects' and assign developers specific granular roles (Viewer, Editor, Admin) to prevent unauthorized key deletion or budget modifications." },
                                            { f: "End-to-End Encryption", d: "TLS 1.3 in transit and AES-256 for all at-rest metadata (user profiles, API key hashes)." }
                                        ].map((row, i, arr) => (
                                            <tr key={i} style={{ borderBottom: i === arr.length - 1 ? 'none' : '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                                                <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-primary)', verticalAlign: 'top', width: '30%', fontSize: '0.95rem' }}>{row.f}</td>
                                                <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{row.d}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </section>
                        </div>
                    )}
                </main>
            </div>

            <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem 0', color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-primary)', marginTop: 'auto' }}>
                <div className="container text-center" style={{ width: '100%' }}>
                    <p style={{ fontSize: '0.85rem' }}>&copy; {new Date().getFullYear()} {settings.appName} Documentation. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
