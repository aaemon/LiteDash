'use client';

import { useState, useRef, useEffect } from 'react';

export default function UserAvatar({ userId, role }: { userId: string; role: string }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const initials = userId.slice(0, 2).toUpperCase();

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    width: '32px', height: '32px',
                    borderRadius: '50%',
                    background: 'var(--accent-gradient)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.02em',
                    transition: 'box-shadow 0.2s ease',
                    boxShadow: open ? '0 0 0 3px rgba(79, 110, 247, 0.25)' : 'none',
                }}
                aria-label="User menu"
            >
                {initials}
            </button>

            {open && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '200px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.5rem',
                    zIndex: 100,
                    animation: 'fadeIn 0.15s ease-out',
                }}>
                    {/* User info */}
                    <div style={{ padding: '0.5rem 0.65rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.35rem' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{userId}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>{role}</div>
                    </div>

                    {/* Sign out */}
                    <form action="/api/auth/logout" method="POST" style={{ margin: 0 }}>
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '0.45rem 0.65rem',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                fontSize: '0.78rem',
                                color: 'var(--danger)',
                                fontWeight: 500,
                                textAlign: 'left',
                                transition: 'background 0.15s ease',
                                fontFamily: 'inherit',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                            Sign Out
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
