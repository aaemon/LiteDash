'use client';

import { useState, useEffect, useMemo } from 'react';
import StatCard from '@/components/StatCard';
import { useCurrency } from '@/hooks/useCurrency';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

export default function UsagePage() {
    const [usage, setUsage] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { symbol, format: fmt } = useCurrency();

    useEffect(() => {
        Promise.all([
            fetch('/api/usage').then(r => r.json()),
            fetch('/api/logs').then(r => r.json()),
        ]).then(([usageData, logsData]) => {
            if (usageData) setUsage(usageData);
            setLogs(logsData.logs || []);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    // Analytics computation
    const stats = useMemo(() => {
        const totalSpend = logs.reduce((s, l) => s + (l.spend || 0), 0);
        const totalTokens = logs.reduce((s, l) => s + (l.total_tokens || 0), 0);
        const totalPromptTokens = logs.reduce((s, l) => s + (l.prompt_tokens || 0), 0);
        const totalCompletionTokens = logs.reduce((s, l) => s + (l.completion_tokens || 0), 0);
        const successCount = logs.filter(l => l.status === 'success').length;

        // Model breakdown
        const modelMap: Record<string, { name: string; value: number }> = {};
        logs.forEach(l => {
            const m = l.model || 'unknown';
            if (!modelMap[m]) modelMap[m] = { name: m.split('/').pop() || m, value: 0 };
            modelMap[m].value += l.spend || 0;
        });
        const modelData = Object.values(modelMap).sort((a, b) => b.value - a.value).slice(0, 6);

        // User breakdown
        const userMap: Record<string, { name: string; spend: number }> = {};
        logs.forEach(l => {
            // Priority: enriched email > user > api_key_user_id > user_id
            const uDisplayName = l.user_email || l.user || l.api_key_user_id || l.user_id || 'anonymous';
            if (!userMap[uDisplayName]) userMap[uDisplayName] = { name: uDisplayName, spend: 0 };
            userMap[uDisplayName].spend += l.spend || 0;
        });
        const userData = Object.values(userMap).sort((a, b) => b.spend - a.spend).slice(0, 8);

        // Token breakdown
        const tokenData = [
            { name: 'Prompt', value: totalPromptTokens },
            { name: 'Completion', value: totalCompletionTokens }
        ];

        // Daily spend (7 days)
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
        const dailyData = Object.entries(dailyMap).map(([date, spend]) => ({ date: date.slice(5), spend }));

        return {
            totalSpend, totalTokens, successCount,
            modelData, userData, tokenData, dailyData
        };
    }, [logs]);

    const COLORS = ['#4f6ef7', '#7c5bf5', '#22c55e', '#f59e0b', '#ee4444', '#06b6d4'];

    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 style={{ marginBottom: '0.25rem' }}>Usage & Analytics</h1>
                <p>Enterprise-grade observability and spend management.</p>
            </header>

            {loading ? (
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Loading analytics...</div>
            ) : (
                <>
                    <div className="responsive-grid-4">
                        <StatCard label="Total Spend" value={fmt(stats.totalSpend)} color="#4f6ef7" />
                        <StatCard label="Total Requests" value={logs.length} color="#7c5bf5" />
                        <StatCard label="Total Tokens" value={stats.totalTokens.toLocaleString()} color="#22c55e" />
                        <StatCard label="Success Rate" value={logs.length ? `${((stats.successCount / logs.length) * 100).toFixed(1)}%` : 'N/A'} color="#22c55e" />
                    </div>

                    <div className="responsive-grid-2">
                        {/* Daily Spend Chart */}
                        <div className="glass-card" style={{ height: '400px' }}>
                            <h3 style={{ fontWeight: 600, marginBottom: '1.5rem' }}>Daily Spend (Last 7 Days)</h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <AreaChart data={stats.dailyData}>
                                    <defs>
                                        <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f6ef7" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4f6ef7" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                    <XAxis dataKey="date" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${symbol}${v}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                        labelStyle={{ fontWeight: 600, color: 'var(--text-primary)' }}
                                    />
                                    <Area type="monotone" dataKey="spend" stroke="#4f6ef7" fillOpacity={1} fill="url(#colorSpend)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* User-based Spending */}
                        <div className="glass-card" style={{ height: '400px' }}>
                            <h3 style={{ fontWeight: 600, marginBottom: '1.5rem' }}>Spend by User</h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <BarChart data={stats.userData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" stroke="var(--text-tertiary)" fontSize={11} width={80} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="spend" fill="#7c5bf5" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="responsive-grid-2">
                        {/* Token Breakdown */}
                        <div className="glass-card" style={{ height: '350px' }}>
                            <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Prompt vs Completion Tokens</h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <PieChart>
                                    <Pie
                                        data={stats.tokenData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.tokenData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Model Spending */}
                        <div className="glass-card" style={{ height: '350px' }}>
                            <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Spend by Model</h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <PieChart>
                                    <Pie
                                        data={stats.modelData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {stats.modelData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number | undefined) => value !== undefined ? fmt(value) : ''} />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
