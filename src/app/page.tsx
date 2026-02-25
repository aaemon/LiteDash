'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const MOCK_DAILY = [
  { date: '02-16', spend: 12.5 }, { date: '02-17', spend: 18.2 },
  { date: '02-18', spend: 15.8 }, { date: '02-19', spend: 24.5 },
  { date: '02-20', spend: 28.1 }, { date: '02-21', spend: 22.4 },
  { date: '02-22', spend: 32.8 }
];

interface ModelPricing {
  name: string;
  provider: string;
  input_cost_1m: number;
  output_cost_1m: number;
  context_window?: number;
  desc: string;
  color?: string;
}

const PROVIDER_COLORS: Record<string, string> = {
  'openai': '#10a37f',
  'anthropic': '#d97757',
  'meta': '#0668E1',
  'google': '#4285f4',
  'mistral': '#f5d142',
  'ollama': '#7c5bf5',
  'default': '#4f6ef7'
};

const ENTERPRISE_FEATURES = [
  { icon: '🌐', title: 'Endpoints & Providers', desc: 'Unified interface for 100+ language models and providers with a single standard OpenAI-compatible format.' },
  { icon: '🔒', title: 'Data Privacy & Security', desc: 'Enterprise-grade encryption, zero data retention policies, and compliance-ready infrastructure.' },
  { icon: '🔑', title: 'Virtual API Keys', desc: 'Securely generate and segment isolated virtual keys for every developer, project, and environment.' },
  { icon: '📊', title: 'Usage Monitoring', desc: 'Complete sub-second observability. Track request latencies, token consumption, and errors in real-time.' },
  { icon: '💰', title: 'Budget Controls', desc: 'Enforce hard limits on maximum spend per key, user, or organization to completely eliminate cost overruns.' },
  { icon: '🛡️', title: 'Enterprise Guardrails', desc: 'Automatic, zero-trust PII redaction and advanced safety filtering via Microsoft Presidio integrations.' },
  { icon: '👥', title: 'Teams & Workspaces', desc: 'Multi-tenant architecture bringing granular Role-Based Access Control (RBAC) to your organization.' },
  { icon: '🔌', title: 'MCP Servers', desc: 'Seamlessly extend your models capabilities by connecting them natively to Model Context Protocol tooling.' },
  { icon: '🤖', title: 'Agents Orchestration', desc: 'Build and supervise complex, multi-step autonomous reasoning agents directly off the gateway.' },
  { icon: '⚙️', title: 'Routing Policies', desc: 'Define complex failover, load-balancing, and semantic cost-routing rules directly at the API layer.' },
  { icon: '🛠️', title: 'Embedded Tools', desc: 'Provide immediate model context through built-in support for vector similarity search and web integration.' },
  { icon: '🧪', title: 'Interactive Playground', desc: 'Instantly test prompts, adjust parameters, and benchmark models in a rich UI without writing code.' },
];

export default function Home() {
  const [models, setModels] = useState<ModelPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({ appName: 'LiteDash', logoUrl: '' });

  useEffect(() => {
    async function fetchData() {
      try {
        const [modelsRes, settingsRes] = await Promise.all([
          fetch('/api/models/public'),
          fetch('/api/settings')
        ]);
        const modelsData = await modelsRes.json();
        const settingsData = await settingsRes.json();
        setModels(modelsData.models || []);
        setSettings(settingsData);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Upgraded Nav - Matching Docs Page Style */}
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
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 500, paddingLeft: '0.5rem', borderLeft: '1px solid var(--border-color)' }}>AI Gateway Service</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/docs" className="nav-link mobile-hide" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Docs</Link>
            <Link href="/login" className="btn btn-primary">Login</Link>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, paddingTop: '100px' }}>
        {/* Extreme Hero Section */}
        <section className="container text-center animate-fade-in section-padding" style={{ padding: '3rem 1rem 2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 1rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent-primary)',
            fontSize: '0.7rem',
            fontWeight: 800,
            marginBottom: '1.5rem',
            border: '1px solid rgba(79, 110, 247, 0.2)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)', animation: 'pulse 2s infinite' }} />
            The Unified Enterprise Interface
          </div>

          <h1 className="hero-title" style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            lineHeight: 1.05,
            marginBottom: '1.5rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--accent-primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Accelerate Your<br />AI Organization.
          </h1>

          <p style={{
            maxWidth: '700px',
            margin: '0 auto 2.5rem',
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            fontWeight: 400
          }}>
            Secure, route, and manage all your LLM operations perfectly. We offer blazing-fast hosted endpoints,
            complete team telemetry, cost transparency, and zero-trust data protection for the modern enterprise.
          </p>

          <div className="flex gap-4 justify-center mobile-stack">
            <Link href="/login" className="btn btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '1rem', borderRadius: '10px', fontWeight: 600 }}>
              Start Building Now
            </Link>
            <Link href="/docs" className="btn btn-outline" style={{ padding: '0.8rem 2.5rem', fontSize: '1rem', borderRadius: '10px', fontWeight: 600 }}>
              Read the Docs
            </Link>
          </div>
        </section>

        {/* Massive Features Grid */}
        <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)', padding: '4rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1.1 }}>One Platform. Complete Control.</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.1rem)', maxWidth: '750px', margin: '0 auto' }}>
                Everything you need to ship production-ready AI functionality to thousands of users, securely governed by a single UI.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
            }}>
              {ENTERPRISE_FEATURES.map((feature, i) => (
                <div key={i} className="glass-card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem', background: 'var(--bg-secondary)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{feature.title}</h3>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)', margin: 0 }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visual Showcase - ANALYTICS PREVIEW */}
        <section className="container section-padding" style={{ padding: '4rem 1rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-elevated)', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
            <div className="responsive-grid-2" style={{ gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)', gap: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
              <div style={{ height: '280px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Production Throughput</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, background: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>LIVE STREAM</span>
                </div>
                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={MOCK_DAILY}>
                    <defs>
                      <linearGradient id="landingGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis dataKey="date" hide />
                    <YAxis hide domain={[0, 40]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem', fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="spend" stroke="var(--accent-primary)" strokeWidth={4} fill="url(#landingGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Deep Observability.</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    Identify bottlenecks instantly. Track granular token consumption, audit specific requests, and view analytics directly tied to each enterprise project group.
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0', lineHeight: 1 }}>100+</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>Supported Models</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0', lineHeight: 1 }}>99.9%</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>SLA Up-time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Models Showcase - PREMIUM GRID */}
        {!loading && models.length > 0 && (
          <section className="section-padding" style={{ padding: '4rem 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{
                  display: 'inline-block',
                  padding: '0.3rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--accent-light)',
                  color: 'var(--accent-primary)',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '1rem'
                }}>Open Infrastructure</div>
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1.1 }}>Hosted Models at Scale.</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '750px', margin: '0 auto' }}>
                  A unified API providing routing for internal open-source models as well as major cloud providers.
                </p>
              </div>

              {/* Featured Models 2-in-a-row */}
              <div className="responsive-grid-2" style={{ gap: '1.5rem', marginBottom: '3rem' }}>
                {models.slice(0, 2).map((m, i) => {
                  const color = PROVIDER_COLORS[m.provider.toLowerCase()] || PROVIDER_COLORS.default;
                  const usage = i === 0 ? "Production-grade reasoning and complex problem solving." : "Extreme efficiency for high-volume chat and classification.";
                  const benefits = i === 0 ? ["Low latency reasoning", "High instruction adherence", "Reliable JSON outputs"] : ["Unmatched speed", "Cost-effective scaling", "Consistent performance"];

                  return (
                    <div key={i} className="glass-card" style={{ padding: '2rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', position: 'relative' }}>
                      <div className="card-stripe" style={{ background: color }} />
                      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LiteDash Hosted</span>
                        </div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-tertiary)', background: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>PREMIUM</span>
                      </div>
                      <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{m.name}</h3>
                      <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{m.desc}</p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                        <div>
                          <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Primary Usage</h4>
                          <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{usage}</p>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Key Benefits</h4>
                          <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                            {benefits.map((b, idx) => (
                              <li key={idx} style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                                <span style={{ color: 'var(--success)', fontSize: '1.1rem', fontWeight: 800 }}>✓</span> {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* All Models Grid */}
              <div style={{ marginTop: '3rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>Current Connected Inventory</h3>
                <div className="responsive-grid-auto" style={{ gap: '1rem' }}>
                  {models.map((m, i) => {
                    return (
                      <div key={i} className="glass-card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{m.name}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{m.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Model Based API Pricing */}
        {!loading && models.length > 0 && (
          <section className="section-padding" style={{ width: '100%', padding: '4rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Transparent Predictability</h2>
                <p style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Track expenses strictly at the token level, with hard boundary stops. Pay exclusively for the workloads you generate.</p>
              </div>

              <div className="glass-card" style={{ overflow: 'hidden', border: '1px solid var(--border-color)', padding: 0, maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <table style={{ minWidth: '700px', width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                      <tr>
                        <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>Model Origin</th>
                        <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>Context Window</th>
                        <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>Input Rate (1M Tokens)</th>
                        <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>Output Rate (1M Tokens)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {models.map((row, i) => (
                        <tr key={row.name} style={{ borderBottom: i < models.length - 1 ? '1px solid var(--border-color)' : 'none', transition: 'var(--transition)' }}>
                          <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{row.name}</td>
                          <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{row.context_window ? `${(row.context_window / 1000).toFixed(0)}K` : '8K'}</td>
                          <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: 'var(--accent-primary)', fontFamily: 'monospace', fontSize: '1rem' }}>${row.input_cost_1m.toFixed(2)}</td>
                          <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: 'var(--accent-primary)', fontFamily: 'monospace', fontSize: '1rem' }}>${row.output_cost_1m.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ marginTop: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ maxWidth: '650px' }}>
                  <h4 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Scale With Certainty</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    Unlock infinite scaling utilizing intelligent gateway fallbacks, SOC2-ready data privacy, and global compute availability natively designed for the enterprise.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }} className="mobile-stack">
                  <Link href="/login" className="btn btn-primary" style={{ padding: '0.8rem 2.5rem', borderRadius: '10px', fontSize: '1rem', fontWeight: 600 }}>Deploy Project</Link>
                  <Link href="/docs" className="btn btn-outline" style={{ padding: '0.8rem 2.5rem', borderRadius: '10px', fontSize: '1rem', fontWeight: 600 }}>Architecture Review</Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem 0', color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="flex flex-col gap-4 w-full mobile-text-center" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <div className="flex items-center gap-6 justify-between mobile-stack" style={{ display: 'flex', alignItems: 'center', gap: '2rem', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.appName} style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'contain' }} />
                ) : (
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem', fontWeight: 800 }}>
                    {settings.appName.charAt(0)}
                  </div>
                )}
                <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{settings.appName}</span>
              </div>
              <div className="flex gap-6 mobile-hide" style={{ display: 'flex', gap: '2rem', fontSize: '1rem', fontWeight: 500 }}>
                <Link href="/docs" className="nav-link">Docs</Link>
                <Link href="/login" className="nav-link">Login</Link>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>&copy; {new Date().getFullYear()} {settings.appName} Infrastructure. Accelerating Global Enterprise AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
