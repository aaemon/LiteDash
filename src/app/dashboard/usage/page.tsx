'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';

export default function UsagePage() {
    const [usage, setUsage] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sym, setSym] = useState('$');
    const [mul, setMul] = useState(1);

    useEffect(() => {
        Promise.all([
            fetch('/api/usage').then(r => r.json()),
            fetch('/api/logs').then(r => r.json()),
            fetch('/api/settings').then(r => r.json()).catch(() => ({})),
        ]).then(([usageData, logsData, settings]) => {
            if (usageData) setUsage(usageData);
            setLogs(logsData.logs || []);
            if (settings.currencySymbol) setSym(settings.currencySymbol);
            if (settings.currencyMultiplier) setMul(settings.currencyMultiplier);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const fmt = (v: number, decimals = 4) => `${sym}${(v * mul).toFixed(decimals)}`;

    // Compute analytics from logs
    const totalSpend = logs.reduce((s, l) => s + (l.spend || 0), 0);
    const totalTokens = logs.reduce((s, l) => s + (l.total_tokens || 0), 0);
    const totalPromptTokens = logs.reduce((s, l) => s + (l.prompt_tokens || 0), 0);
    const totalCompletionTokens = logs.reduce((s, l) => s + (l.completion_tokens || 0), 0);
    const successCount = logs.filter(l => l.status === 'success').length;
    const failCount = logs.length - successCount;

    // Model breakdown
    const modelMap: Record<string, { count: number; spend: number; tokens: number }> = {};
    logs.forEach(l => {
        const m = l.model || 'unknown';
        if (!modelMap[m]) modelMap[m] = { count: 0, spend: 0, tokens: 0 };
        modelMap[m].count++;
        modelMap[m].spend += l.spend || 0;
        modelMap[m].tokens += l.total_tokens || 0;
    });
    const modelBreakdown = Object.entries(modelMap).sort((a, b) => b[1].spend - a[1].spend);

    // Daily spend (last 7 days)
    const dailyMap: Record<string, number> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now); d.setDate(d.getDate() - i);
        dailyMap[d.toISOString().split('T')[0]] = 0;
    }
    logs.forEach(l => {
        const d = l.startTime ? new Date(l.startTime).toISOString().split('T')[0] : null;
        if (d && dailyMap[d] !== undefined) dailyMap[d] += l.spend || 0;
    });
    const dailyData = Object.entries(dailyMap);
    const maxDailySpend = Math.max(...dailyData.map(d => d[1]), 0.001);

    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 style={{ marginBottom: '0.25rem' }}>Usage & Analytics</h1>
                <p>Comprehensive usage data, spend tracking, and model analytics.</p>
            </header>

            {loading ? (
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Loading analytics...</div>
            ) : (
                <>
                    {/* Top Stats */}
                    <div className="responsive-grid-4">
                        {[
                            { label: 'Total Spend', value: fmt(totalSpend), color: '#4f6ef7' },
                            { label: 'Total Requests', value: logs.length, color: '#7c5bf5' },
                            { label: 'Total Tokens', value: totalTokens.toLocaleString(), color: '#22c55e' },
                            { label: 'Success Rate', value: logs.length ? `${((successCount / logs.length) * 100).toFixed(1)}%` : 'N/A', color: successCount === logs.length ? '#22c55e' : '#f59e0b' },
                        ].map((card, i) => (
                            <StatCard key={i} label={card.label} value={card.value} color={card.color} />
                        ))}
                    </div>

                    {/* Budget Bar */}
                    {usage && (
                        <div className="glass-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontWeight: 600 }}>Budget Utilization</h3>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                    {usage.max_budget ? `${((usage.spend / usage.max_budget) * 100).toFixed(1)}%` : 'No limit'}
                                </span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: usage.max_budget ? `${Math.min((usage.spend / usage.max_budget) * 100, 100)}%` : '100%',
                                    background: usage.max_budget && (usage.spend / usage.max_budget) > 0.9 ? 'var(--danger)' : 'var(--accent-gradient)',
                                    borderRadius: 'var(--radius-full)',
                                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                                }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                                <span>Spent: {fmt(Number(usage.spend))}</span>
                                <span>Budget: {usage.max_budget ? fmt(Number(usage.max_budget), 2) : '∞'}</span>
                            </div>
                        </div>
                    )}

                    {/* Daily Spend Chart */}
                    <div className="glass-card">
                        <h3 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Daily Spend (7 days)</h3>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '120px' }}>
                            {dailyData.map(([date, spend], i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', height: '100%', justifyContent: 'flex-end' }}>
                                    <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>{fmt(spend)}</span>
                                    <div style={{
                                        width: '100%', minHeight: '4px',
                                        height: `${Math.max((spend / maxDailySpend) * 100, 3)}%`,
                                        background: 'var(--accent-gradient)',
                                        borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                                        transition: 'height 0.5s ease',
                                    }} />
                                    <span style={{ fontSize: '0.58rem', color: 'var(--text-tertiary)' }}>{date.slice(5)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Token Breakdown + Model Breakdown */}
                    <div className="responsive-grid-2">
                        {/* Token Split */}
                        <div className="glass-card">
                            <h3 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Token Breakdown</h3>
                            <div className="flex flex-col gap-3">
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Prompt Tokens</span>
                                        <span style={{ fontWeight: 600 }}>{totalPromptTokens.toLocaleString()}</span>
                                    </div>
                                    <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)' }}>
                                        <div style={{ height: '100%', width: totalTokens ? `${(totalPromptTokens / totalTokens) * 100}%` : '0%', background: '#4f6ef7', borderRadius: 'var(--radius-full)' }} />
                                    </div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Completion Tokens</span>
                                        <span style={{ fontWeight: 600 }}>{totalCompletionTokens.toLocaleString()}</span>
                                    </div>
                                    <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)' }}>
                                        <div style={{ height: '100%', width: totalTokens ? `${(totalCompletionTokens / totalTokens) * 100}%` : '0%', background: '#7c5bf5', borderRadius: 'var(--radius-full)' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Model Breakdown */}
                        <div className="glass-card">
                            <h3 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Model Usage</h3>
                            <div className="flex flex-col gap-2">
                                {modelBreakdown.slice(0, 5).map(([model, stats], i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', padding: '0.35rem 0', borderBottom: i < Math.min(modelBreakdown.length, 5) - 1 ? '1px solid var(--border-color)' : 'none' }}>
                                        <div>
                                            <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{model.split('/').pop()}</span>
                                            <span style={{ color: 'var(--text-tertiary)', marginLeft: '0.35rem', fontSize: '0.68rem' }}>{stats.count} req</span>
                                        </div>
                                        <span style={{ fontWeight: 600 }}>{fmt(stats.spend)}</span>
                                    </div>
                                ))}
                                {modelBreakdown.length === 0 && <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>No usage data yet.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Request Stats */}
                    <div className="glass-card">
                        <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Request Summary</h3>
                        <div className="request-summary-stats" style={{ display: 'flex', gap: '2rem', fontSize: '0.78rem' }}>
                            <div><span style={{ color: 'var(--text-tertiary)' }}>Success:</span> <span style={{ fontWeight: 600, color: 'var(--success)' }}>{successCount}</span></div>
                            <div><span style={{ color: 'var(--text-tertiary)' }}>Failed:</span> <span style={{ fontWeight: 600, color: failCount > 0 ? 'var(--danger)' : 'var(--text-secondary)' }}>{failCount}</span></div>
                            <div><span style={{ color: 'var(--text-tertiary)' }}>Avg Tokens/Req:</span> <span style={{ fontWeight: 600 }}>{logs.length ? Math.round(totalTokens / logs.length).toLocaleString() : 0}</span></div>
                            <div><span style={{ color: 'var(--text-tertiary)' }}>Avg Cost/Req:</span> <span style={{ fontWeight: 600 }}>{logs.length ? fmt(totalSpend / logs.length, 6) : `${sym}0`}</span></div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
