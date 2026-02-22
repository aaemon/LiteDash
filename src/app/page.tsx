'use client';

import Link from 'next/link';
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

const MOCK_TOKENS = [
  { name: 'Prompt', value: 4500000, color: '#4f6ef7' },
  { name: 'Completion', value: 2100000, color: '#7c5bf5' }
];

export default function Home() {
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
        padding: '1rem 0'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="flex items-center gap-3">
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>L</div>
            <span style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.03em' }}>LiteDash</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/docs" className="nav-link" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Documentation</Link>
            <Link href="/login" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Open Dashboard</Link>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, paddingTop: '120px' }}>
        {/* Extreme Hero Section */}
        <section className="container text-center animate-fade-in" style={{ padding: '4rem 1rem 6rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent-primary)',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '2.5rem',
            border: '1px solid rgba(79, 110, 247, 0.2)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)', animation: 'pulse 2s infinite' }} />
            Enterprise LLM Gateway Control
          </div>

          <h1 style={{
            fontSize: 'clamp(3rem, 10vw, 5.5rem)',
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
            fontSize: '1.35rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            fontWeight: 400
          }}>
            The definitive dashboard for LiteLLM. Secure, monitor, and scale 100+ AI models
            with enterprise-grade precision and advanced observability.
          </p>

          <div className="flex gap-6 justify-center">
            <Link href="/login" className="btn btn-primary" style={{ padding: '1rem 2.8rem', fontSize: '1.1rem', borderRadius: '14px', fontWeight: 700 }}>
              Get Started for Free
            </Link>
            <Link href="/docs" className="btn btn-outline" style={{ padding: '1rem 2.8rem', fontSize: '1.1rem', borderRadius: '14px', fontWeight: 600 }}>
              Read Technical Specs
            </Link>
          </div>
        </section>

        {/* Visual Showcase - ANALYTICS PREVIEW */}
        <section className="container" style={{ paddingBottom: '6rem' }}>
          <div className="glass-card" style={{ padding: '3rem', border: '1px solid var(--border-color)', background: 'var(--bg-elevated)', boxShadow: '0 30px 60px rgba(0,0,0,0.12)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '3rem' }}>
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
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>100+</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Model Providers</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>99.9%</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Up-time Slack</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Models Showcase - PREMIUM GRID */}
        <section style={{ padding: '6rem 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>One Protocol. All Models.</h2>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '1.1rem' }}>Seamlessly switch between state-of-the-art providers without changing a line of code.</p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}>
              {[
                { name: 'GPT-4o', provider: 'OpenAI', desc: 'The gold standard for reasoning and complex multimodal tasks.', color: '#10a37f' },
                { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', desc: 'Superior coding capabilities and nuanced human-like reasoning.', color: '#d97757' },
                { name: 'Llama 3.1 405B', provider: 'Meta', desc: 'Next-generation open intelligence at massive scale.', color: '#0668E1' },
                { name: 'Gemini 1.5 Pro', provider: 'Google', desc: 'Unprecedented 2M context window for long-form reasoning.', color: '#4285f4' },
                { name: 'Mistral Large 2', provider: 'Mistral AI', desc: 'European efficiency with top-tier performance benchmarks.', color: '#f5d142' },
                { name: 'DeepSeek-V2', provider: 'DeepSeek', desc: 'Optimized Mixture-of-Experts for hyper-efficient inference.', color: '#6a11cb' }
              ].map((m, i) => (
                <div key={i} className="glass-card" style={{ padding: '2rem', height: '100%', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
                  <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: m.color }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: m.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.provider}</span>
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>{m.name}</h3>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing & Benefits - SaaS STYLE */}
        <section style={{ width: '100%', padding: '8rem 0', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '1rem' }}>Built for Scale.</h2>
              <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Transparent management for teams of all sizes. From startup to global enterprise.</p>
            </div>

            <div className="responsive-grid-3" style={{ gap: '2rem', alignItems: 'start' }}>
              {/* Free Tier */}
              <div className="glass-card" style={{ padding: '3rem 2rem', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', color: 'var(--text-tertiary)' }}>Open Source</h4>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>$0 <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>/ month</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
                  <li style={{ display: 'flex', gap: '0.75rem' }}>✅ Unified API Endpoint</li>
                  <li style={{ display: 'flex', gap: '0.75rem' }}>✅ Basic Observability</li>
                  <li style={{ display: 'flex', gap: '0.75rem' }}>✅ Community Support</li>
                  <li style={{ display: 'flex', gap: '0.75rem' }}>✅ Self-Hosted</li>
                </ul>
                <Link href="/login" className="btn btn-outline w-full" style={{ padding: '0.8rem' }}>Deploy Now</Link>
              </div>

              {/* Pro Tier (Featured) */}
              <div className="glass-card" style={{ padding: '3.5rem 2rem', border: '2px solid var(--accent-primary)', transform: 'scale(1.05)', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', padding: '0.25rem 0.75rem', background: 'var(--accent-primary)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, borderRadius: '20px' }}>POPULAR</div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', color: 'var(--accent-primary)' }}>Pro Dashboard</h4>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>$49 <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>/ month</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1rem' }}>
                  <li style={{ display: 'flex', gap: '0.75rem' }}>✅ Advanced RBAC Controls</li>
                  <li style={{ display: 'flex', gap: '0.75rem' }}>✅ Granular Budget Guards</li>
                  <li style={{ display: 'flex', gap: '0.75rem' }}>✅ Real-time Cost Analytics</li>
                  <li style={{ display: 'flex', gap: '0.75rem' }}>✅ Custom MCP Servers</li>
                  <li style={{ display: 'flex', gap: '0.75rem' }}>✅ Priority Feature Access</li>
                </ul>
                <Link href="/login" className="btn btn-primary w-full" style={{ padding: '1rem' }}>Start Free Trial</Link>
              </div>

              {/* Enterprise Tier */}
              <div className="glass-card" style={{ padding: '3rem 2rem', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', color: 'var(--text-tertiary)' }}>Enterprise</h4>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Custom</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
                  <li style={{ display: 'flex', gap: '0.75rem' }}>✅ SOC2 / Compliance focus</li>
                  <li style={{ display: 'flex', gap: '0.75rem' }}>✅ 24/7 Dedicated Support</li>
                  <li style={{ display: 'flex', gap: '0.75rem' }}>✅ Private Cloud Deployment</li>
                  <li style={{ display: 'flex', gap: '0.75rem' }}>✅ Custom Integrations</li>
                </ul>
                <button className="btn btn-outline w-full" style={{ padding: '0.8rem' }}>Contact Sales</button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container" style={{ padding: '8rem 1rem' }}>
          <div className="glass-card flex-col items-center text-center animate-fade-in" style={{ padding: '6rem 2rem', background: 'var(--accent-gradient)', color: '#fff' }}>
            <h2 style={{ color: '#fff', fontSize: '3.5rem', marginBottom: '1.5rem', letterSpacing: '-0.03em', fontWeight: 800 }}>Master Your AI Stack.</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.3rem', marginBottom: '3.5rem', maxWidth: '600px' }}>
              Join forward-thinking engineering teams managing millions of LLM requests with LiteDash.
            </p>
            <div className="flex gap-4">
              <Link href="/login" className="btn" style={{ background: '#fff', color: 'var(--accent-primary)', padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '14px', fontWeight: 700 }}>
                Launch Dashboard
              </Link>
              <Link href="/docs" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '14px', fontWeight: 600, backdropFilter: 'blur(10px)' }}>
                View Docs
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '5rem 0', color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--accent-gradient)' }} />
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>LiteDash</span>
            </div>
            <p style={{ fontSize: '0.8rem' }}>&copy; 2026 LiteDash Infrastructure. All rights reserved.</p>
          </div>
          <div className="flex gap-12" style={{ fontSize: '0.9rem' }}>
            <div className="flex flex-col gap-3">
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Product</span>
              <Link href="/docs" className="nav-link">Documentation</Link>
              <Link href="/login" className="nav-link">Dashboard</Link>
              <a href="#pricing" className="nav-link">Pricing</a>
            </div>
            <div className="flex flex-col gap-3">
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Legal</span>
              <a href="#" className="nav-link">Privacy</a>
              <a href="#" className="nav-link">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
