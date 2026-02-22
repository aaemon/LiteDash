import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/litellm';
import ThemeToggle from '@/components/ThemeToggle';
import SidebarNav from '@/components/SidebarNav';
import UserAvatar from '@/components/UserAvatar';
import MobileMenuButton from '@/components/MobileMenuButton';
import fs from 'fs';
import path from 'path';

function getSettings() {
    try {
        const raw = fs.readFileSync(path.join(process.cwd(), 'config', 'settings.json'), 'utf-8');
        return JSON.parse(raw);
    } catch {
        return { appName: 'LiteLLM Portal', apiEndpoint: '', logoUrl: '' };
    }
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    const isAdmin = session.role === 'admin';
    const settings = getSettings();
    const appName = settings.appName || 'LiteLLM Portal';
    const logoUrl = settings.logoUrl || '';

    const navItems = isAdmin ? [
        { name: 'Overview', href: '/dashboard' },
        { name: 'Usage & Analytics', href: '/dashboard/usage' },
        { name: 'Request Logs', href: '/dashboard/logs' },
        { name: 'Users & Budgets', href: '/dashboard/admin/users' },
        { name: 'Models Manager', href: '/dashboard/admin/models' },
        { name: 'MCP Servers', href: '/dashboard/admin/mcp' },
        { name: 'Guardrails', href: '/dashboard/admin/guardrails' },
        { name: 'Agents Config', href: '/dashboard/admin/agents' },
        { name: 'API Docs', href: '/dashboard/docs' },
        { name: 'Settings', href: '/dashboard/admin/settings' },
    ] : [
        { name: 'Overview', href: '/dashboard' },
        { name: 'API Keys', href: '/dashboard/keys' },
        { name: 'Usage & Budget', href: '/dashboard/usage' },
        { name: 'Available Models', href: '/dashboard/models' },
        { name: 'Request Logs', href: '/dashboard/logs' },
        { name: 'Playground', href: '/dashboard/playground' },
        { name: 'API Docs', href: '/dashboard/docs' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
            {/* Top Navbar */}
            <header
                className="dashboard-header"
                style={{
                    width: '100%',
                    borderBottom: '1px solid var(--border-color)',
                    background: 'var(--bg-elevated)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 1.5rem',
                    height: '56px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                }}
            >
                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <MobileMenuButton />
                    {logoUrl ? (
                        <img src={logoUrl} alt={appName} style={{ width: '26px', height: '26px', borderRadius: 'var(--radius-sm)', objectFit: 'contain' }} />
                    ) : (
                        <div style={{
                            width: '26px',
                            height: '26px',
                            background: 'var(--accent-gradient)',
                            borderRadius: 'var(--radius-sm)',
                            boxShadow: '0 2px 8px rgba(79, 110, 247, 0.3)'
                        }}></div>
                    )}
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                        {appName}
                    </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ThemeToggle />
                    <UserAvatar userId={session.userId} role={isAdmin ? 'Admin' : 'User'} />
                </div>
            </header>

            {/* Layout Wrapper */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Left Sidebar */}
                <aside id="sidebar" className="sidebar">
                    <SidebarNav navItems={navItems} />
                </aside>

                {/* Main Content */}
                <main className="main-content animate-fade-in">
                    <div className="container">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
