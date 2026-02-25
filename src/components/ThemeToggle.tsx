'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch by only rendering after mount
    const isLight = mounted && (theme === 'system' ? resolvedTheme === 'light' : theme === 'light');

    const toggleTheme = () => {
        setTheme(isLight ? 'dark' : 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            style={{
                borderRadius: 'var(--radius-full)',
                padding: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '52px',
                height: '28px',
                background: isLight ? 'var(--bg-tertiary)' : 'var(--accent-primary)',
                border: '1px solid var(--border-color)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.3s ease',
            }}
            aria-label="Toggle Theme"
        >
            {/* Thumb */}
            <div
                style={{
                    position: 'absolute',
                    top: '2px',
                    left: '2px',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: '#fff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    transform: isLight ? 'translateX(0)' : 'translateX(24px)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            />

            {/* Sun */}
            <div style={{ zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', color: isLight ? '#f59e0b' : 'rgba(255,255,255,0.4)', transition: 'color 0.3s ease' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
            </div>

            {/* Moon */}
            <div style={{ zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', color: !isLight ? '#fff' : 'var(--text-tertiary)', transition: 'color 0.3s ease' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            </div>
        </button>
    );
}
