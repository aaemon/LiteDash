'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 100,
        backgroundColor: 'var(--bg-elevated)',
        backdropFilter: 'blur(var(--glass-blur))',
        borderBottom: '1px solid var(--border-color)',
        padding: '0.75rem 2rem'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0 }}>
          <div className="flex items-center gap-2">
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', background: 'var(--accent-gradient)' }} />
            <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>LiteDash</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://docs.litellm.ai/docs/" target="_blank" rel="noreferrer" className="nav-link" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Docs</a>
            <Link href="/login" className="btn btn-primary">Sign In</Link>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, paddingTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Hero Section */}
        <section className="container text-center animate-fade-in" style={{ padding: '4rem 1rem 6rem' }}>
          <div style={{
            display: 'inline-block',
            padding: '0.35rem 1rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent-primary)',
            fontSize: '0.75rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            LiteLLM Proxy Management
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            background: 'var(--accent-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em'
          }}>
            The Modern Dashboard<br />for your AI Gateway
          </h1>

          <p style={{
            maxWidth: '640px',
            margin: '0 auto 2.5rem',
            fontSize: '1.15rem',
            color: 'var(--text-secondary)'
          }}>
            Manage 100+ LLMs with one interface. LiteDash provides sleek observability,
            granular budget controls, and seamless team management for your LiteLLM instance.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/login" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
              Launch Dashboard
            </Link>
            <a href="https://docs.litellm.ai/docs/" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
              LiteLLM Documentation
            </a>
          </div>
        </section>

        {/* Features Grid */}
        <section style={{ backgroundColor: 'var(--bg-primary)', width: '100%', padding: '6rem 0', borderTop: '1px solid var(--border-color)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Enterprise Control, Simplified.</h2>
              <p style={{ maxWidth: '600px', margin: '0 auto' }}>Everything you need to scale your AI infrastructure without the complexity.</p>
            </div>

            <div className="responsive-grid-3">
              {[
                {
                  title: 'Unified LLM Access',
                  desc: 'Standardize your AI requests across OpenAI, Anthropic, Azure, and 100+ models with one secure endpoint.',
                  stripe: 'var(--card-stripe-1)'
                },
                {
                  title: 'Budget Observability',
                  desc: 'Track spend in real-time. Set granular budget limits per user or API key to prevent unexpected costs.',
                  stripe: 'var(--card-stripe-2)'
                },
                {
                  title: 'Team Management',
                  desc: 'Provision access, manage keys, and audit logs across your entire organization with ease.',
                  stripe: 'var(--card-stripe-3)'
                }
              ].map((f, i) => (
                <div key={i} className="glass-card">
                  <div className="card-stripe" style={{ backgroundColor: f.stripe }} />
                  <h3 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>{f.title}</h3>
                  <p style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container" style={{ padding: '8rem 1rem' }}>
          <div className="glass-card flex-col items-center text-center" style={{ padding: '4rem 2rem', background: 'var(--accent-gradient)', color: '#fff' }}>
            <h2 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Ready to Scale?</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '500px' }}>
              Deploy LiteDash in minutes and start managing your LLM proxy like a pro.
            </p>
            <Link href="/login" className="btn" style={{ backgroundColor: '#fff', color: 'var(--accent-primary)', padding: '0.8rem 2.5rem', fontSize: '1rem', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
              Get Started Free
            </Link>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '3rem 0', color: 'var(--text-tertiary)' }}>
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2 opacity-50">
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: 'var(--text-primary)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>LiteDash</span>
          </div>
          <div style={{ fontSize: '0.8rem' }}>
            Built for the LiteLLM Community
          </div>
        </div>
      </footer>
    </div>
  );
}
