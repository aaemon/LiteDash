'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export default function MobileMenuButton() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Close sidebar on route change
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // Toggle body scroll and sidebar classes
    useEffect(() => {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar && overlay) {
            if (open) {
                sidebar.classList.add('sidebar-open');
                overlay.classList.add('sidebar-open');
            } else {
                sidebar.classList.remove('sidebar-open');
                overlay.classList.remove('sidebar-open');
            }
        }
    }, [open]);

    const handleOverlayClick = useCallback(() => {
        setOpen(false);
    }, []);

    return (
        <>
            {/* Hamburger Button */}
            <button
                className="mobile-menu-btn"
                onClick={() => setOpen(!open)}
                aria-label="Toggle navigation menu"
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {open ? (
                        <>
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </>
                    ) : (
                        <>
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </>
                    )}
                </svg>
            </button>

            {/* Overlay backdrop (renders in DOM, controlled by CSS) */}
            <div
                id="sidebar-overlay"
                className="sidebar-overlay"
                onClick={handleOverlayClick}
            />
        </>
    );
}
