'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [appName, setAppName] = useState('LiteLLM Portal');
    const [logoUrl, setLogoUrl] = useState('');

    useEffect(() => {
        fetch('/api/settings').then(r => r.json()).then(d => {
            if (d.appName) setAppName(d.appName);
            if (d.logoUrl) setLogoUrl(d.logoUrl);
        }).catch(() => { });
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            router.push('/dashboard');
            router.refresh();
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen animate-fade-in" style={{ padding: '0 2rem', background: 'var(--bg-secondary)' }}>
            {/* Background gradient */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(ellipse at top left, rgba(79, 110, 247, 0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(124, 91, 245, 0.06) 0%, transparent 50%)',
                pointerEvents: 'none',
            }} />

            <div className="glass-card flex flex-col items-center" style={{ maxWidth: '380px', width: '100%', padding: '2.5rem 2rem', position: 'relative' }}>
                {/* Logo */}
                {logoUrl ? (
                    <img src={logoUrl} alt={appName} style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', objectFit: 'contain' }} />
                ) : (
                    <div style={{ width: '40px', height: '40px', background: 'var(--accent-gradient)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', boxShadow: '0 4px 16px rgba(79, 110, 247, 0.3)' }}></div>
                )}

                <h2 style={{ marginBottom: '0.25rem', textAlign: 'center', fontSize: '1.3rem' }}>Welcome Back</h2>
                <p style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.8rem' }}>Sign in to your {appName}</p>

                {error && (
                    <div style={{ width: '100%', padding: '0.65rem', marginBottom: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger)', fontSize: '0.78rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <label htmlFor="username" style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Username</label>
                        <input id="username" type="text" className="input" placeholder="User ID" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <label htmlFor="password" style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Password</label>
                        <input id="password" type="password" className="input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem', marginTop: '0.35rem' }} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>


            </div>
        </div>
    );
}
