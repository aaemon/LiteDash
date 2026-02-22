'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarNav({ navItems }: { navItems: { name: string, href: string }[] }) {
    const pathname = usePathname();

    return (
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`nav-link ${isActive ? 'active' : ''}`}
                        onClick={() => {
                            // Close mobile sidebar on navigation
                            const sidebar = document.getElementById('sidebar');
                            const overlay = document.getElementById('sidebar-overlay');
                            sidebar?.classList.remove('sidebar-open');
                            overlay?.classList.remove('sidebar-open');
                        }}
                        style={{
                            padding: '0.55rem 0.75rem',
                            borderRadius: 'var(--radius-md)',
                            color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            fontWeight: isActive ? 600 : 450,
                            fontSize: '0.83rem',
                            transition: 'var(--transition)',
                            textDecoration: 'none',
                            display: 'block',
                            backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                        }}
                    >
                        {item.name}
                    </Link>
                );
            })}
        </nav>
    );
}
