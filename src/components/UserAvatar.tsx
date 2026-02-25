'use client';

import { useState, useRef, useEffect } from 'react';

export default function UserAvatar({ userId, role }: { userId: string; role: string }) {
    const [open, setOpen] = useState(false);
    const [resetModalOpen, setResetModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/user/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: newPassword })
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.error || 'Failed to update password');
                return;
            }

            alert('Password successfully updated!');
            setResetModalOpen(false);
            setNewPassword('');
        } catch (err) {
            console.error(err);
            alert('An error occurred while updating the password.');
        } finally {
            setIsSaving(false);
        }
    };

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

                    {/* Change Password */}
                    <button
                        onClick={() => { setOpen(false); setResetModalOpen(true); }}
                        style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontSize: '0.78rem',
                            color: 'var(--text-secondary)',
                            fontWeight: 500,
                            textAlign: 'left',
                            transition: 'background 0.15s ease, color 0.15s ease',
                            fontFamily: 'inherit',
                            marginBottom: '0.2rem',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                        Reset Password
                    </button>

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

            {resetModalOpen && (
                <div className="modal-overlay" onClick={() => setResetModalOpen(false)}>
                    <div className="modal-card modal-content" onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '1.05rem' }}>
                            Reset Credentials
                        </h3>
                        <form onSubmit={handlePasswordReset} className="flex flex-col gap-4">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                <label style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    New Password *
                                </label>
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                <button type="button" className="btn btn-outline" onClick={() => { setResetModalOpen(false); setNewPassword(''); }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                                    {isSaving ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
