'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
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

export default function Home() {
  const [models, setModels] = useState<ModelPricing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch('/api/models/public');
        const data = await res.json();
        setModels(data.models || []);
      } catch (err) {
        console.error('Failed to fetch models:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchModels();
  }, []);

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Premium Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 100,
        backgroundColor: 'var(--bg-elevated)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '1.25rem 0'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div className="flex items-center gap-3">
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>L</div>
            <span style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.03em' }}>LiteDash</span>
          </div>
          <div className="flex items-center gap-4" style={{ gap: 'clamp(1rem, 4vw, 2.5rem)' }}>
            <Link href="/docs" className="nav-link mobile-hide" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Documentation</Link>
            <Link href="/login" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>Open Dashboard</Link>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, paddingTop: '120px' }}>
        {/* Extreme Hero Section */}
        <section className="container text-center animate-fade-in section-padding" style={{ padding: '4rem 1rem 6rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent-primary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '2rem',
            border: '1px solid rgba(79, 110, 247, 0.2)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)', animation: 'pulse 2s infinite' }} />
            Enterprise LLM Gateway Control
          </div>

          <h1 className="hero-title" style={{
            fontSize: 'clamp(2.8rem, 10vw, 5.5rem)',
            lineHeight: 0.95,
            marginBottom: '2rem',
            fontWeight: 800,
            letterSpacing: '-0.05em',
            background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--accent-primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Orchestrate Your<br />AI Infrastructure.
          </h1>

          <p style={{
            maxWidth: '720px',
            margin: '0 auto 3.5rem',
            fontSize: 'clamp(1rem, 4vw, 1.35rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            fontWeight: 400
          }}>
            The definitive dashboard for LiteLLM. Secure, monitor, and scale 100+ AI models
            with enterprise-grade precision and advanced observability.
          </p>

          <div className="flex gap-4 justify-center mobile-stack">
            <Link href="/login" className="btn btn-primary" style={{ padding: '1rem 2.8rem', fontSize: '1.1rem', borderRadius: '14px', fontWeight: 700 }}>
              Get Started for Free
            </Link>
            <Link href="/docs" className="btn btn-outline" style={{ padding: '1rem 2.8rem', fontSize: '1.1rem', borderRadius: '14px', fontWeight: 600 }}>
              Read Technical Specs
            </Link>
          </div>
        </section>

        {/* Visual Showcase - ANALYTICS PREVIEW */}
        <section className="container section-padding" style={{ paddingBottom: '6rem' }}>
          <div className="glass-card" style={{ padding: 'clamp(1.5rem, 5vw, 3rem)', border: '1px solid var(--border-color)', background: 'var(--bg-elevated)', boxShadow: '0 30px 60px rgba(0,0,0,0.12)' }}>
            <div className="responsive-grid-2" style={{ gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)', gap: 'clamp(1.5rem, 5vw, 3rem)' }}>
              <div style={{ height: '320px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.2rem' }}>Throughput & Spend</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, background: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>REAL-TIME</span>
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
                      contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                    />
                    <Area type="monotone" dataKey="spend" stroke="var(--accent-primary)" strokeWidth={3} fill="url(#landingGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Full Stack Observability.</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Track every token, request, and cent across your entire organization with sub-second precision.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <div>
                    <div style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 800, color: 'var(--accent-primary)' }}>100+</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Model Providers</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 800, color: 'var(--accent-primary)' }}>99.9%</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Up-time Slack</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Models Showcase - PREMIUM GRID */}
        {!loading && models.length > 0 && (
          <section className="section-padding" style={{ padding: '6rem 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>One Protocol. All Models.</h2>
                <p style={{ color: 'var(--text-tertiary)', fontSize: 'clamp(1rem, 3vw, 1.1rem)' }}>Seamlessly switch between your active providers without changing a line of code.</p>
              </div>

              <div className="responsive-grid-auto" style={{ gap: '1.5rem' }}>
                {models.map((m, i) => {
                  const color = PROVIDER_COLORS[m.provider.toLowerCase()] || PROVIDER_COLORS.default;
                  return (
                    <div key={i} className="glass-card" style={{ padding: '2rem', minHeight: '220px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
                      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.provider}</span>
                      </div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>{m.name}</h3>
                      <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{m.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Model Based API Pricing */}
        {!loading && models.length > 0 && (
          <section className="section-padding" style={{ width: '100%', padding: '8rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 2.8rem)', fontWeight: 800, marginBottom: '1rem' }}>Live Model Pricing</h2>
                <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: 'clamp(1rem, 4vw, 1.2rem)', color: 'var(--text-secondary)' }}>Transparent pricing across your active infrastructure. Pay local rates for top-tier intelligence.</p>
              </div>

              <div className="glass-card" style={{ overflow: 'hidden', border: '1px solid var(--border-color)', padding: 0 }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <table style={{ minWidth: '700px', width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                    <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                      <tr>
                        <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>Model Name</th>
                        <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>Provider</th>
                        <th style={{ padding: '1.25rem 2rem', textAlign: 'right', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>Input / 1M Tokens</th>
                        <th style={{ padding: '1.25rem 2rem', textAlign: 'right', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>Output / 1M Tokens</th>
                      </tr>
                    </thead>
                    <tbody>
                      {models.map((row, i) => (
                        <tr key={i} style={{ borderBottom: i < models.length - 1 ? '1px solid var(--border-color)' : 'none', transition: 'var(--transition)' }}>
                          <td style={{ padding: '1.25rem 2rem', fontWeight: 600 }}>{row.name}</td>
                          <td style={{ padding: '1.25rem 2rem', color: 'var(--text-secondary)' }}>{row.provider}</td>
                          <td style={{ padding: '1.25rem 2rem', textAlign: 'right', fontWeight: 600, color: 'var(--accent-primary)' }}>${row.input_cost_1m.toFixed(2)}</td>
                          <td style={{ padding: '1.25rem 2rem', textAlign: 'right', fontWeight: 600, color: 'var(--accent-primary)' }}>${row.output_cost_1m.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <Link href="/login" className="btn btn-primary" style={{ padding: '1rem 3rem', borderRadius: '12px' }}>Start Integration</Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '5rem 0', color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="flex flex-col gap-4 w-full mobile-text-center" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
            <div className="flex items-center gap-6 justify-between mobile-stack" style={{ display: 'flex', alignItems: 'center', gap: '2rem', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--accent-gradient)' }} />
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>LiteDash</span>
              </div>
              <div className="flex gap-6 mobile-hide" style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
                <Link href="/docs" className="nav-link" style={{ fontWeight: 600 }}>Documentation</Link>
                <Link href="/login" className="nav-link" style={{ fontWeight: 600 }}>Dashboard</Link>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', marginTop: '1rem' }}>&copy; 2026 LiteDash Infrastructure. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
