'use client';

import { useState, useEffect, useMemo } from 'react';

export default function LogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sym, setSym] = useState('$');
    const [mul, setMul] = useState(1);

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

    // Filters
    const [searchModel, setSearchModel] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'error'>('all');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const [res, settingsRes] = await Promise.all([
                    fetch('/api/logs'),
                    fetch('/api/settings').catch(() => null),
                ]);
                const data = await res.json();
                if (res.ok) setLogs(data.logs || []);
                if (settingsRes?.ok) {
                    const s = await settingsRes.json();
                    if (s.currencySymbol) setSym(s.currencySymbol);
                    if (s.currencyMultiplier) setMul(s.currencyMultiplier);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const fmt = (v: number) => `${sym}${(v * mul).toFixed(6)}`;

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            if (searchModel && !(log.model || '').toLowerCase().includes(searchModel.toLowerCase())) return false;
            if (statusFilter === 'success' && log.status !== 'success') return false;
            if (statusFilter === 'error' && log.status === 'success') return false;
            return true;
        });
    }, [logs, searchModel, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const paginatedLogs = filteredLogs.slice((safePage - 1) * pageSize, safePage * pageSize);

    // Reset to page 1 when filters change
    useEffect(() => { setPage(1); }, [searchModel, statusFilter, pageSize]);

    const thStyle: React.CSSProperties = { padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' };
    const tdStyle: React.CSSProperties = { padding: '0.6rem 1rem', fontSize: '0.8rem' };

    const pageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;
        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (safePage > 3) pages.push('...');
            const start = Math.max(2, safePage - 1);
            const end = Math.min(totalPages - 1, safePage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (safePage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    const pageBtnStyle = (active: boolean): React.CSSProperties => ({
        width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.75rem', fontWeight: active ? 700 : 400, borderRadius: 'var(--radius-sm)',
        background: active ? 'var(--accent-primary)' : 'transparent',
        color: active ? '#fff' : 'var(--text-secondary)',
        border: active ? 'none' : '1px solid var(--border-color)',
        cursor: 'pointer', transition: 'all 0.15s ease',
    });

    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 style={{ marginBottom: '0.25rem' }}>Request Logs</h1>
                <p>Monitor your API requests and token usage.</p>
            </header>

            {loading ? (
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Loading activity...</div>
            ) : logs.length === 0 ? (
                <div className="glass-card" style={{ minHeight: '35vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                        </svg>
                    </div>
                    <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>No recent activity</h3>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '340px', fontSize: '0.8rem' }}>
                        Request logs will appear here once you use your API keys.
                    </p>
                </div>
            ) : (
                <>
                    {/* Filters & Info Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input className="input" placeholder="Filter by model..." value={searchModel} onChange={e => setSearchModel(e.target.value)} style={{ width: '200px', fontSize: '0.78rem' }} />
                            <select className="input" value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} style={{ width: '120px', fontSize: '0.78rem' }}>
                                <option value="all">All Status</option>
                                <option value="success">Success</option>
                                <option value="error">Error</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                            <span>{filteredLogs.length} request{filteredLogs.length !== 1 ? 's' : ''}</span>
                            <span>·</span>
                            <select className="input" value={pageSize} onChange={e => setPageSize(Number(e.target.value))} style={{ width: '70px', fontSize: '0.72rem', padding: '0.2rem 0.4rem' }}>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span>per page</span>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="glass-card" style={{ overflowX: 'auto', padding: 0 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={thStyle}>Timestamp</th>
                                    <th style={thStyle}>Model</th>
                                    <th style={thStyle}>Tokens (In / Out)</th>
                                    <th style={thStyle}>Cost</th>
                                    <th style={thStyle}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem' }}>No matching logs found.</td>
                                    </tr>
                                ) : (
                                    paginatedLogs.map((log: any, idx: number) => (
                                        <tr key={log.call_id || idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>
                                                {new Date(log.startTime || log.start_time).toLocaleString()}
                                            </td>
                                            <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--accent-primary)' }}>
                                                {log.model}
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{ fontWeight: 500 }}>{log.prompt_tokens || 0}</span>
                                                <span style={{ color: 'var(--text-tertiary)', margin: '0 0.25rem' }}>/</span>
                                                <span style={{ fontWeight: 500 }}>{log.completion_tokens || 0}</span>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginLeft: '0.35rem' }}>
                                                    ({log.total_tokens || 0})
                                                </span>
                                            </td>
                                            <td style={{ ...tdStyle, fontWeight: 500 }}>
                                                {fmt(Number(log.spend || 0))}
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-full)',
                                                    fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em',
                                                    background: log.status === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: log.status === 'success' ? 'var(--success)' : 'var(--danger)',
                                                }}>
                                                    {log.status || 'success'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                Showing {((safePage - 1) * pageSize) + 1}–{Math.min(safePage * pageSize, filteredLogs.length)} of {filteredLogs.length}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <button onClick={() => setPage(1)} disabled={safePage === 1} style={{ ...pageBtnStyle(false), opacity: safePage === 1 ? 0.4 : 1 }}>«</button>
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} style={{ ...pageBtnStyle(false), opacity: safePage === 1 ? 0.4 : 1 }}>‹</button>
                                {pageNumbers().map((p, i) =>
                                    typeof p === 'number' ? (
                                        <button key={i} onClick={() => setPage(p)} style={pageBtnStyle(p === safePage)}>{p}</button>
                                    ) : (
                                        <span key={i} style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', padding: '0 0.15rem' }}>…</span>
                                    )
                                )}
                                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} style={{ ...pageBtnStyle(false), opacity: safePage === totalPages ? 0.4 : 1 }}>›</button>
                                <button onClick={() => setPage(totalPages)} disabled={safePage === totalPages} style={{ ...pageBtnStyle(false), opacity: safePage === totalPages ? 0.4 : 1 }}>»</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
