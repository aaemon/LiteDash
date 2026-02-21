import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen animate-fade-in" style={{ padding: '0 2rem' }}>

      {/* Background decoration */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '500px',
          background: 'linear-gradient(145deg, var(--accent-primary) 0%, transparent 100%)',
          opacity: 0.05,
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />

      <div className="glass-card flex flex-col items-center justify-center mt-8 text-center" style={{ maxWidth: '600px', width: '100%', padding: '4rem 2rem' }}>
        <h1 style={{ marginBottom: '1rem', background: 'linear-gradient(90deg, var(--text-primary), var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          LiteLLM Portal
        </h1>

        <p style={{ marginBottom: '2.5rem', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          Manage your AI models, control api usage, and track your expenditures efficiently in one unified dashboard.
        </p>

        <div className="flex gap-4" style={{ width: '100%', justifyContent: 'center' }}>
          <Link href="/login" className="btn btn-primary" style={{ padding: '0.75rem 2.5rem', fontSize: '1.05rem' }}>
            Get Started
          </Link>
          <a href="https://docs.litellm.ai/docs/" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '0.75rem 2.5rem', fontSize: '1.05rem' }}>
            LiteLLM Docs
          </a>
        </div>
      </div>

      {/* Footer / Info */}
      <div style={{ position: 'absolute', bottom: '2rem', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
        Built with Next.js and ❤️ for AI
      </div>
    </div>
  );
}
