import { getSession, litellmFetch } from '@/lib/litellm';
import StatCard from '@/components/StatCard';
import fs from 'fs';
import path from 'path';

function getSettings() {
    try {
        const raw = fs.readFileSync(path.join(process.cwd(), 'config', 'settings.json'), 'utf-8');
        return JSON.parse(raw);
    } catch { return {}; }
}

export default async function DashboardOverview() {
    const session = await getSession();
    const isAdmin = session?.role === 'admin';
    const settings = getSettings();
    const sym = settings.currencySymbol || '$';
    const mul = settings.currencyMultiplier || 1;
    const cur = settings.currency || 'USD';
    const fmt = (v: number, decimals = 2) => `${sym}${(v * mul).toFixed(decimals)}`;

    let spend = 0;
    let maxBudget = null;
    let keyCount = 0;
    let usersCount = 0;
    let recentLogs: any[] = [];

    if (isAdmin) {
        try { const data = await litellmFetch('/user/list'); usersCount = data.users?.length || 0; } catch (e) { }
    } else if (session?.userId) {
        try {
            const userInfo = await litellmFetch(`/user/info?user_id=${session.userId}`);
            spend = userInfo?.user_info?.spend || 0;
            maxBudget = userInfo?.user_info?.max_budget || null;
            keyCount = userInfo?.keys?.length || 0;
        } catch (e) { }
    }

    // Fetch recent activity
    try {
        const data = await litellmFetch('/spend/logs');
        const allLogs = Array.isArray(data) ? data : [];
        const filtered = isAdmin ? allLogs : allLogs.filter((l: any) => l.user === session?.userId);
        recentLogs = filtered
            .sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
            .slice(0, 5);
    } catch (e) { }

    const statCards = isAdmin ? [
        { label: 'Provisioned Users', value: usersCount, color: '#4f6ef7' },
        { label: 'System Status', value: 'Healthy', color: '#22c55e' },
    ] : [
        { label: 'Total Budget', value: maxBudget ? fmt(maxBudget) : '∞', color: '#4f6ef7' },
        { label: 'Total Spend', value: fmt(spend, 4), color: spend > (maxBudget || Infinity) ? '#ef4444' : '#7c5bf5' },
        { label: 'Remaining Budget', value: maxBudget ? fmt(Math.max(0, maxBudget - spend)) : '∞', color: '#22c55e' },
        { label: 'Active API Keys', value: keyCount, color: '#f59e0b' },
    ];

    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 style={{ marginBottom: '0.25rem' }}>
                    Welcome back, <span style={{ color: 'var(--accent-primary)' }}>{session?.userId}</span>
                </h1>
                <p>Here's an overview of your AI resources.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${statCards.length}, minmax(0, 1fr))`, gap: '1rem' }}>
                {statCards.map((card, i) => (
                    <StatCard key={i} label={card.label} value={card.value} color={card.color} />
                ))}
            </div>

            {/* Recent Activity */}
            <div className="glass-card" style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontWeight: 600 }}>Recent Activity</h3>
                    <a href="/dashboard/logs" className="btn btn-outline" style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}>
                        View All →
                    </a>
                </div>

                {recentLogs.length === 0 ? (
                    <div style={{ color: 'var(--text-tertiary)', padding: '1.5rem 0', textAlign: 'center', fontSize: '0.82rem' }}>
                        No recent activity. Logs will appear here once API requests are made.
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600, fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Time</th>
                                    <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600, fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Model</th>
                                    <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600, fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tokens</th>
                                    <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600, fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cost</th>
                                    <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600, fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentLogs.map((log: any, idx: number) => (
                                    <tr key={log.request_id || idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                            {new Date(log.startTime).toLocaleString()}
                                        </td>
                                        <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                                            {log.model}
                                        </td>
                                        <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.78rem' }}>
                                            {log.total_tokens || 0}
                                        </td>
                                        <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.78rem', fontWeight: 500 }}>
                                            {fmt(Number(log.spend || 0), 6)}
                                        </td>
                                        <td style={{ padding: '0.5rem 0.75rem' }}>
                                            <span style={{
                                                fontSize: '0.62rem', padding: '0.12rem 0.35rem', borderRadius: 'var(--radius-full)', fontWeight: 600, textTransform: 'uppercase',
                                                background: log.status === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: log.status === 'success' ? 'var(--success)' : 'var(--danger)',
                                            }}>{log.status || 'success'}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
