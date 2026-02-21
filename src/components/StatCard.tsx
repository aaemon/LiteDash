'use client';

export default function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
    return (
        <div
            style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderLeft: `3px solid ${color}`,
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'default',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${color}15, 0 2px 6px rgba(0,0,0,0.08)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
        >
            {/* Subtle color wash in top-right corner */}
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '90px', height: '90px', borderRadius: '50%', background: color, opacity: 0.06 }} />
            <div style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                {label}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: color, letterSpacing: '-0.02em' }}>
                {value}
            </div>
        </div>
    );
}
