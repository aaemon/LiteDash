'use client';

import Link from 'next/link';

export default function DocsPage() {
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
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--accent-gradient)' }} />
                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>LiteDash</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 500, paddingLeft: '0.5rem', borderLeft: '1px solid var(--border-color)' }}>Documentation</span>
                    </Link>
                    <Link href="/login" className="btn btn-primary">Sign In</Link>
                </div>
            </nav>

            <div className="container" style={{ display: 'flex', gap: '4rem', paddingTop: '100px', paddingBottom: '100px' }}>
                {/* Sidebar */}
                <aside style={{ width: '240px', position: 'sticky', top: '100px', height: 'fit-content' }}>
                    <div className="flex flex-col gap-8">
                        <div>
                            <h5 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Getting Started</h5>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                                <li><a href="#introduction" className="nav-link active">Introduction</a></li>
                                <li><a href="#architecture" className="nav-link">Architecture</a></li>
                                <li><a href="#quickstart" className="nav-link">Quickstart</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Core Concepts</h5>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                                <li><a href="#mcp" className="nav-link">MCP Integration</a></li>
                                <li><a href="#guardrails" className="nav-link">Guardrails & Budgets</a></li>
                                <li><a href="#routing" className="nav-link">Intelligent Routing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Enterprise</h5>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                                <li><a href="#rbac" className="nav-link">RBAC & Security</a></li>
                                <li><a href="#compliance" className="nav-link">Compliance Mapping</a></li>
                            </ul>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main style={{ flex: 1, maxWidth: '800px' }}>
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
                        <p>
                            The LiteDash system consists of:
                            <ul style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <li><strong>Global Control Plane:</strong> Manages key distribution and model configurations.</li>
                                <li><strong>Observability Engine:</strong> Tracks token usage, costs, and latency in real-time.</li>
                                <li><strong>Security Mesh:</strong> Implements enterprise SSO and RBAC policies.</li>
                            </ul>
                        </p>
                    </section>

                    <section id="mcp" style={{ marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Model Context Protocol (MCP)</h2>
                        <p style={{ marginBottom: '1.5rem' }}>
                            LiteDash natively supports the Model Context Protocol, allowing models to securely access
                            local systems, cloud services, and real-time data with zero-trust security.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="glass-card">
                                <h4 style={{ marginBottom: '0.5rem' }}>SSE Transport</h4>
                                <p style={{ fontSize: '0.8rem' }}>Server-Sent Events for high-frequency updates and long-running context streams.</p>
                            </div>
                            <div className="glass-card">
                                <h4 style={{ marginBottom: '0.5rem' }}>StdIO Transport</h4>
                                <p style={{ fontSize: '0.8rem' }}>Secure process communication for local tool execution and sandboxed agents.</p>
                            </div>
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
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>Rate Limiting</td>
                                    <td style={{ padding: '1rem' }}>User-level tiering to prevent API starvation.</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
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
