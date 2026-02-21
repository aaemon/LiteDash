'use client';

import { useState, useEffect } from 'react';

const MCP_CATALOG = [
    {
        category: 'Developer Tools', servers: [
            { name: 'GitHub', description: 'Repository management, issues, PRs, and code search', icon: '🐙', url: 'https://mcp.github.com' },
            { name: 'GitLab', description: 'GitLab CI/CD, merge requests, and repository management', icon: '🦊', url: 'https://mcp.gitlab.com' },
            { name: 'Atlassian (Jira & Confluence)', description: 'Project tracking, issue management, and documentation', icon: '🔺', url: '' },
            { name: 'Linear', description: 'Issue tracking and project management for engineering teams', icon: '📐', url: '' },
            { name: 'Sentry', description: 'Error monitoring and performance tracking', icon: '🛡', url: '' },
        ]
    },
    {
        category: 'Communication', servers: [
            { name: 'Slack', description: 'Messaging, channels, and team collaboration', icon: '💬', url: '' },
            { name: 'Discord', description: 'Community and team communication', icon: '🎮', url: '' },
            { name: 'Twilio', description: 'SMS, voice, and messaging APIs', icon: '📱', url: '' },
        ]
    },
    {
        category: 'Cloud', servers: [
            { name: 'AWS', description: 'Amazon Web Services cloud infrastructure management', icon: '☁️', url: '' },
            { name: 'Google Cloud', description: 'GCP services and resource management', icon: '🌐', url: '' },
            { name: 'Azure', description: 'Microsoft Azure cloud services', icon: '🔷', url: '' },
            { name: 'Cloudflare', description: 'CDN, DNS, and edge computing', icon: '🟧', url: '' },
        ]
    },
    {
        category: 'Databases', servers: [
            { name: 'PostgreSQL', description: 'Query and manage PostgreSQL databases', icon: '🐘', url: '' },
            { name: 'MongoDB', description: 'NoSQL document database operations', icon: '🍃', url: '' },
            { name: 'Redis', description: 'In-memory data store and caching', icon: '🔴', url: '' },
            { name: 'Supabase', description: 'Open-source Firebase alternative', icon: '⚡', url: '' },
        ]
    },
    {
        category: 'Productivity', servers: [
            { name: 'Notion', description: 'Notes, docs, and knowledge management', icon: '📝', url: '' },
            { name: 'Google Drive', description: 'File storage and document collaboration', icon: '📁', url: '' },
            { name: 'Airtable', description: 'Spreadsheet-database hybrid for workflows', icon: '📊', url: '' },
        ]
    },
    {
        category: 'Search', servers: [
            { name: 'Brave Search', description: 'Web search with privacy focus', icon: '🦁', url: '' },
            { name: 'Exa', description: 'AI-powered semantic search engine', icon: '🔍', url: '' },
            { name: 'Tavily', description: 'AI-optimized search and research', icon: '🔎', url: '' },
        ]
    },
    {
        category: 'Finance', servers: [
            { name: 'Stripe', description: 'Payment processing and billing management', icon: '💳', url: '' },
            { name: 'Plaid', description: 'Banking and financial data connectivity', icon: '🏦', url: '' },
        ]
    },
    {
        category: 'Web & Browser', servers: [
            { name: 'Puppeteer', description: 'Browser automation and web scraping', icon: '🎭', url: '' },
            { name: 'Browserbase', description: 'Cloud-hosted headless browser infrastructure', icon: '🌍', url: '' },
        ]
    },
    {
        category: 'System', servers: [
            { name: 'Filesystem', description: 'Local file system read/write operations', icon: '📂', url: '' },
            { name: 'Docker', description: 'Container management and orchestration', icon: '🐳', url: '' },
            { name: 'Kubernetes', description: 'Container orchestration and cluster management', icon: '☸️', url: '' },
        ]
    },
];

const CATEGORIES = ['All', ...MCP_CATALOG.map(c => c.category)];

export default function AdminMCPPage() {
    const [servers, setServers] = useState<any[]>([]);
    const [tools, setTools] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'servers' | 'connect' | 'catalog' | 'tools' | 'semantic' | 'network'>('servers');
    const [showAddModal, setShowAddModal] = useState(false);
    const [catalogFilter, setCatalogFilter] = useState('All');
    const [catalogSearch, setCatalogSearch] = useState('');

    // Connect tab
    const [apiEndpoint, setApiEndpoint] = useState('');

    // Semantic Filter
    const [semanticEnabled, setSemanticEnabled] = useState(false);
    const [semanticThreshold, setSemanticThreshold] = useState('0.7');
    const [semanticMaxTools, setSemanticMaxTools] = useState('10');
    const [semanticDescription, setSemanticDescription] = useState('');

    // Network Settings
    const [privateRanges, setPrivateRanges] = useState('');

    // Add form - all LiteLLM fields
    const [formName, setFormName] = useState('');
    const [formAlias, setFormAlias] = useState('');
    const [formUrl, setFormUrl] = useState('');
    const [formTransport, setFormTransport] = useState('sse');
    const [formAuthType, setFormAuthType] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formAccessGroups, setFormAccessGroups] = useState('');
    const [formAllowAllKeys, setFormAllowAllKeys] = useState(false);
    const [formAvailablePublic, setFormAvailablePublic] = useState(false);
    const [formCredentials, setFormCredentials] = useState('');
    const [formTeams, setFormTeams] = useState('');
    const [formAllowedTools, setFormAllowedTools] = useState('');
    const [formExtraHeaders, setFormExtraHeaders] = useState('');
    const [formStaticHeaders, setFormStaticHeaders] = useState('');
    // StdIO fields
    const [formCommand, setFormCommand] = useState('');
    const [formArgs, setFormArgs] = useState('');
    const [formEnv, setFormEnv] = useState('');
    // OAuth fields
    const [formAuthorizationUrl, setFormAuthorizationUrl] = useState('');
    const [formTokenUrl, setFormTokenUrl] = useState('');
    const [formRegistrationUrl, setFormRegistrationUrl] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        try {
            const [mcpRes, settingsRes] = await Promise.all([
                fetch('/api/admin/mcp'),
                fetch('/api/settings').catch(() => null),
            ]);
            const data = await mcpRes.json();
            setServers(data.servers || []);
            setTools(data.tools || []);
            if (settingsRes?.ok) {
                const s = await settingsRes.json();
                if (s.apiEndpoint) setApiEndpoint(s.apiEndpoint);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const resetForm = () => {
        setFormName(''); setFormAlias(''); setFormUrl(''); setFormTransport('sse');
        setFormAuthType(''); setFormDescription(''); setFormAccessGroups(''); setFormAllowAllKeys(false);
        setFormAvailablePublic(false); setFormCredentials(''); setFormTeams('');
        setFormAllowedTools(''); setFormExtraHeaders(''); setFormStaticHeaders('');
        setFormCommand(''); setFormArgs(''); setFormEnv('');
        setFormAuthorizationUrl(''); setFormTokenUrl(''); setFormRegistrationUrl('');
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault(); setSaving(true);
        try {
            const body: any = {
                server_name: formName,
                url: formUrl || undefined,
                transport: formTransport,
                description: formDescription || undefined,
                alias: formAlias || undefined,
                auth_type: formAuthType || undefined,
                allow_all_keys: formAllowAllKeys,
                available_on_public_internet: formAvailablePublic,
            };
            if (formAccessGroups) body.mcp_access_groups = formAccessGroups.split(',').map(s => s.trim()).filter(Boolean);
            if (formTeams) body.teams = formTeams.split(',').map(s => s.trim()).filter(Boolean);
            if (formAllowedTools) body.allowed_tools = formAllowedTools.split(',').map(s => s.trim()).filter(Boolean);
            if (formCredentials) { try { body.credentials = JSON.parse(formCredentials); } catch { body.credentials = { api_key: formCredentials }; } }
            if (formExtraHeaders) { try { body.extra_headers = JSON.parse(formExtraHeaders); } catch { } }
            if (formStaticHeaders) { try { body.static_headers = JSON.parse(formStaticHeaders); } catch { } }
            // StdIO fields
            if (formTransport === 'stdio') {
                if (formCommand) body.command = formCommand;
                if (formArgs) body.args = formArgs.split(',').map(s => s.trim()).filter(Boolean);
                if (formEnv) { try { body.env = JSON.parse(formEnv); } catch { } }
            }
            // OAuth fields
            if (formAuthType === 'oauth') {
                if (formAuthorizationUrl) body.authorization_url = formAuthorizationUrl;
                if (formTokenUrl) body.token_url = formTokenUrl;
                if (formRegistrationUrl) body.registration_url = formRegistrationUrl;
            }
            const res = await fetch('/api/admin/mcp', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (res.ok) { resetForm(); setShowAddModal(false); fetchData(); }
            else { const err = await res.json(); alert(err.error || 'Failed'); }
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    const handleDelete = async (serverId: string, name: string) => {
        if (!confirm(`Delete MCP server "${name || serverId}"?`)) return;
        try {
            const res = await fetch('/api/admin/mcp', {
                method: 'DELETE', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ server_id: serverId })
            });
            if (res.ok) fetchData();
            else { const err = await res.json(); alert(err.error || 'Failed'); }
        } catch (e) { console.error(e); }
    };

    const addFromCatalog = (server: any) => {
        setFormName(server.name);
        setFormUrl(server.url || '');
        setFormDescription(server.description || '');
        setFormTransport('sse');
        setShowAddModal(true);
    };

    const filteredCatalog = MCP_CATALOG
        .filter(c => catalogFilter === 'All' || c.category === catalogFilter)
        .map(c => ({
            ...c,
            servers: c.servers.filter(s => !catalogSearch || s.name.toLowerCase().includes(catalogSearch.toLowerCase()))
        }))
        .filter(c => c.servers.length > 0);

    const healthColor = (s: string) => s === 'healthy' ? 'var(--success)' : s === 'unhealthy' ? 'var(--danger)' : 'var(--text-tertiary)';
    const labelStyle: React.CSSProperties = { fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' };
    const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.3rem' };
    const tabBtn = (t: string, active: boolean): React.CSSProperties => ({
        padding: '0.4rem 0.85rem', fontSize: '0.78rem', fontWeight: active ? 600 : 400,
        color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
        borderTop: 'none', borderLeft: 'none', borderRight: 'none',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderBottomColor: active ? 'var(--accent-primary)' : 'transparent',
        background: 'none', cursor: 'pointer',
        transition: 'color 0.2s ease',
    });

    return (
        <div className="flex flex-col gap-6">
            <header>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ marginBottom: '0.25rem' }}>MCP Servers</h1>
                        <p>Configure and manage your Model Context Protocol servers.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }}>+ Add MCP Server</button>
                </div>
            </header>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
                <button style={tabBtn('servers', tab === 'servers')} onClick={() => setTab('servers')}>All Servers</button>
                <button style={tabBtn('connect', tab === 'connect')} onClick={() => setTab('connect')}>Connect</button>
                <button style={tabBtn('semantic', tab === 'semantic')} onClick={() => setTab('semantic')}>Semantic Filter</button>
                <button style={tabBtn('network', tab === 'network')} onClick={() => setTab('network')}>Network Settings</button>
                <button style={tabBtn('catalog', tab === 'catalog')} onClick={() => setTab('catalog')}>Server Catalog</button>
                <button style={tabBtn('tools', tab === 'tools')} onClick={() => setTab('tools')}>Available Tools</button>
            </div>

            {/* Add Server Modal */}
            {showAddModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }} onClick={() => setShowAddModal(false)}>
                    <div className="glass-card" style={{ width: '580px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '1.05rem' }}>Add MCP Server</h3>
                        <form onSubmit={handleAdd} className="flex flex-col gap-4">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Server Name *</label>
                                    <input className="input" placeholder="e.g. GitHub" value={formName} onChange={e => setFormName(e.target.value)} required />
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Alias</label>
                                    <input className="input" placeholder="Short alias" value={formAlias} onChange={e => setFormAlias(e.target.value)} />
                                </div>
                            </div>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Server URL</label>
                                <input className="input" placeholder="https://mcp-server.example.com/sse" value={formUrl} onChange={e => setFormUrl(e.target.value)} />
                            </div>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Description</label>
                                <input className="input" placeholder="What this server does" value={formDescription} onChange={e => setFormDescription(e.target.value)} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Transport</label>
                                    <select className="input" value={formTransport} onChange={e => setFormTransport(e.target.value)}>
                                        <option value="sse">SSE (Server-Sent Events)</option>
                                        <option value="stdio">StdIO</option>
                                        <option value="streamable_http">Streamable HTTP</option>
                                    </select>
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Auth Type</label>
                                    <select className="input" value={formAuthType} onChange={e => setFormAuthType(e.target.value)}>
                                        <option value="">None</option>
                                        <option value="api_key">API Key</option>
                                        <option value="oauth">OAuth 2.0</option>
                                        <option value="bearer">Bearer Token</option>
                                    </select>
                                </div>
                            </div>

                            {/* Credentials */}
                            {(formAuthType === 'api_key' || formAuthType === 'bearer') && (
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Credentials / API Key</label>
                                    <input className="input" type="password" placeholder="sk-..." value={formCredentials} onChange={e => setFormCredentials(e.target.value)} />
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Plain API key string or JSON object like {`{"api_key": "sk-..."}`}</span>
                                </div>
                            )}

                            {/* OAuth URLs — shown when auth_type === oauth */}
                            {formAuthType === 'oauth' && (
                                <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                    <span style={{ ...labelStyle, color: '#f59e0b', display: 'block', marginBottom: '0.5rem' }}>OAuth 2.0 Configuration</span>
                                    <div className="flex flex-col gap-3">
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Authorization URL</label>
                                            <input className="input" placeholder="https://provider.com/oauth/authorize" value={formAuthorizationUrl} onChange={e => setFormAuthorizationUrl(e.target.value)} />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Token URL</label>
                                            <input className="input" placeholder="https://provider.com/oauth/token" value={formTokenUrl} onChange={e => setFormTokenUrl(e.target.value)} />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Registration URL</label>
                                            <input className="input" placeholder="https://provider.com/oauth/register" value={formRegistrationUrl} onChange={e => setFormRegistrationUrl(e.target.value)} />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Credentials (Client ID / Secret JSON)</label>
                                            <textarea className="input" rows={2} placeholder='{"client_id": "...", "client_secret": "..."}' value={formCredentials} onChange={e => setFormCredentials(e.target.value)} style={{ fontFamily: 'monospace', fontSize: '0.72rem' }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* StdIO — shown when transport === stdio */}
                            {formTransport === 'stdio' && (
                                <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                    <span style={{ ...labelStyle, color: '#22c55e', display: 'block', marginBottom: '0.5rem' }}>StdIO Configuration</span>
                                    <div className="flex flex-col gap-3">
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Command</label>
                                            <input className="input" placeholder="npx, uvx, python, node..." value={formCommand} onChange={e => setFormCommand(e.target.value)} />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Arguments (comma-separated)</label>
                                            <input className="input" placeholder="-m, mcp_server, --port, 8080" value={formArgs} onChange={e => setFormArgs(e.target.value)} />
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Environment Variables (JSON)</label>
                                            <textarea className="input" rows={2} placeholder='{"API_KEY": "...", "DEBUG": "true"}' value={formEnv} onChange={e => setFormEnv(e.target.value)} style={{ fontFamily: 'monospace', fontSize: '0.72rem' }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Access & Teams */}
                            <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                <span style={{ ...labelStyle, color: 'var(--accent-primary)', display: 'block', marginBottom: '0.5rem' }}>Access Controls</span>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Access Groups</label>
                                        <input className="input" placeholder="group1, group2" value={formAccessGroups} onChange={e => setFormAccessGroups(e.target.value)} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Teams</label>
                                        <input className="input" placeholder="team_id_1, team_id_2" value={formTeams} onChange={e => setFormTeams(e.target.value)} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Allowed Tools</label>
                                        <input className="input" placeholder="tool1, tool2 (empty = all)" value={formAllowedTools} onChange={e => setFormAllowedTools(e.target.value)} />
                                    </div>
                                    <div style={{ ...fieldStyle, justifyContent: 'flex-end', gap: '0.5rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                            <input type="checkbox" checked={formAllowAllKeys} onChange={e => setFormAllowAllKeys(e.target.checked)} />
                                            Allow all API keys
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                            <input type="checkbox" checked={formAvailablePublic} onChange={e => setFormAvailablePublic(e.target.checked)} />
                                            Available on public internet
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Headers */}
                            <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                <span style={{ ...labelStyle, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Headers (Advanced)</span>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Extra Headers (JSON)</label>
                                        <textarea className="input" rows={2} placeholder='{"X-Custom": "value"}' value={formExtraHeaders} onChange={e => setFormExtraHeaders(e.target.value)} style={{ fontFamily: 'monospace', fontSize: '0.72rem' }} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Static Headers (JSON)</label>
                                        <textarea className="input" rows={2} placeholder='{"Authorization": "Bearer ..."}' value={formStaticHeaders} onChange={e => setFormStaticHeaders(e.target.value)} style={{ fontFamily: 'monospace', fontSize: '0.72rem' }} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Adding...' : 'Add Server'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Loading...</div>
            ) : (
                <>
                    {/* All Servers Tab */}
                    {tab === 'servers' && (
                        <div className="glass-card" style={{ padding: '0' }}>
                            {servers.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem' }}>
                                    <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>No MCP Servers Configured</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>Add a server or browse the catalog to get started.</p>
                                    <button className="btn btn-primary" onClick={() => setTab('catalog')}>Browse Catalog</button>
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                {['Name', 'Alias', 'URL', 'Transport', 'Auth', 'Health', 'Access Groups', 'Created', 'Actions'].map(h => (
                                                    <th key={h} style={{ padding: '0.65rem 0.6rem', fontWeight: 600, fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {servers.map((s, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                    <td style={{ padding: '0.55rem 0.6rem', fontWeight: 500, fontSize: '0.82rem' }}>{s.server_name || '—'}</td>
                                                    <td style={{ padding: '0.55rem 0.6rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.alias || '—'}</td>
                                                    <td style={{ padding: '0.55rem 0.6rem', fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--text-secondary)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.url || '—'}</td>
                                                    <td style={{ padding: '0.55rem 0.6rem' }}>
                                                        <span style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem', borderRadius: 'var(--radius-full)', background: 'var(--accent-light)', color: 'var(--accent-primary)', fontWeight: 600, textTransform: 'uppercase' }}>{s.transport || 'sse'}</span>
                                                    </td>
                                                    <td style={{ padding: '0.55rem 0.6rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.auth_type || 'None'}</td>
                                                    <td style={{ padding: '0.55rem 0.6rem' }}>
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem' }}>
                                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: healthColor(s.status) }} />
                                                            <span style={{ color: healthColor(s.status), fontWeight: 500, textTransform: 'capitalize' }}>{s.status || 'Unknown'}</span>
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.55rem 0.6rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                                                        {s.mcp_access_groups?.length ? s.mcp_access_groups.join(', ') : 'All'}
                                                    </td>
                                                    <td style={{ padding: '0.55rem 0.6rem', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                                                        {s.created_at ? new Date(s.created_at).toLocaleDateString() : '—'}
                                                    </td>
                                                    <td style={{ padding: '0.55rem 0.6rem' }}>
                                                        <button onClick={() => handleDelete(s.server_id, s.server_name)} className="btn btn-outline" style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Catalog Tab */}
                    {tab === 'catalog' && (
                        <div className="flex flex-col gap-4">
                            {/* Category filter */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                {CATEGORIES.map(c => (
                                    <button key={c} onClick={() => setCatalogFilter(c)} style={{
                                        padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: 'var(--radius-full)',
                                        border: '1px solid var(--border-color)', cursor: 'pointer',
                                        background: catalogFilter === c ? 'var(--accent-primary)' : 'var(--bg-primary)',
                                        color: catalogFilter === c ? '#fff' : 'var(--text-secondary)',
                                        fontWeight: catalogFilter === c ? 600 : 400,
                                        transition: 'all 0.15s ease',
                                    }}>{c}</button>
                                ))}
                            </div>
                            {/* Search */}
                            <input className="input" placeholder="Search servers..." value={catalogSearch} onChange={e => setCatalogSearch(e.target.value)} style={{ maxWidth: '400px' }} />

                            {filteredCatalog.map((cat, ci) => (
                                <div key={ci}>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>{cat.category}</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.5rem' }}>
                                        {cat.servers.map((s, si) => (
                                            <div key={si} className="glass-card" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => addFromCatalog(s)}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                                    <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
                                                    <div>
                                                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.name}</div>
                                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{s.description}</div>
                                                    </div>
                                                </div>
                                                <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }}>›</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tools Tab */}
                    {tab === 'tools' && (
                        <div>
                            {tools.length === 0 ? (
                                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                                    <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>No MCP Tools Available</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Configure MCP servers to expose tools for LLM function calling.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
                                    {tools.map((tool: any, idx: number) => (
                                        <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <div className="card-stripe" style={{ background: 'var(--accent-gradient)' }}></div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{tool.name || tool.function?.name}</span>
                                                <span style={{ fontSize: '0.62rem', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', padding: '0.12rem 0.4rem', borderRadius: 'var(--radius-full)', fontWeight: 600, textTransform: 'uppercase' }}>Available</span>
                                            </div>
                                            {(tool.description || tool.function?.description) && (
                                                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{tool.description || tool.function?.description}</p>
                                            )}
                                            {(tool.inputSchema || tool.function?.parameters) && (
                                                <details style={{ fontSize: '0.72rem' }}>
                                                    <summary style={{ cursor: 'pointer', color: 'var(--accent-primary)', fontWeight: 500, padding: '0.25rem 0' }}>Input Schema</summary>
                                                    <pre style={{ background: 'var(--bg-secondary)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', overflow: 'auto', maxHeight: '150px', fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                                        {JSON.stringify(tool.inputSchema || tool.function?.parameters, null, 2)}
                                                    </pre>
                                                </details>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Connect Tab */}
                    {tab === 'connect' && (
                        <div className="flex flex-col gap-4">
                            <div className="glass-card">
                                <h3 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>MCP Gateway Endpoint</h3>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Use this endpoint to connect to all your MCP servers through LiteLLM's unified gateway.</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    <div>
                                        <span style={{ ...labelStyle, display: 'block', marginBottom: '0.25rem' }}>SSE Endpoint</span>
                                        <code style={{ display: 'block', padding: '0.6rem 0.85rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                            {apiEndpoint || (typeof window !== 'undefined' ? window.location.origin : '')}/mcp/sse
                                        </code>
                                    </div>
                                    <div>
                                        <span style={{ ...labelStyle, display: 'block', marginBottom: '0.25rem' }}>Streamable HTTP Endpoint</span>
                                        <code style={{ display: 'block', padding: '0.6rem 0.85rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                            {apiEndpoint || (typeof window !== 'undefined' ? window.location.origin : '')}/mcp
                                        </code>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card">
                                <h3 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Connection Examples</h3>
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <span style={{ ...labelStyle, display: 'block', marginBottom: '0.25rem' }}>Claude Desktop (config.json)</span>
                                        <pre style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5, overflow: 'auto' }}>{`{
  "mcpServers": {
    "litellm-gateway": {
      "url": "${apiEndpoint || 'https://your-litellm-proxy'}/mcp/sse",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}`}</pre>
                                    </div>
                                    <div>
                                        <span style={{ ...labelStyle, display: 'block', marginBottom: '0.25rem' }}>Python (mcp client)</span>
                                        <pre style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5, overflow: 'auto' }}>{`from mcp import ClientSession
from mcp.client.sse import sse_client

async with sse_client(
    url="${apiEndpoint || 'https://your-litellm-proxy'}/mcp/sse",
    headers={"Authorization": "Bearer YOUR_API_KEY"}
) as (read, write):
    async with ClientSession(read, write) as session:
        await session.initialize()
        tools = await session.list_tools()
        print(tools)`}</pre>
                                    </div>
                                    <div>
                                        <span style={{ ...labelStyle, display: 'block', marginBottom: '0.25rem' }}>Cursor / Windsurf (mcp.json)</span>
                                        <pre style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5, overflow: 'auto' }}>{`{
  "mcpServers": {
    "litellm-gateway": {
      "serverUrl": "${apiEndpoint || 'https://your-litellm-proxy'}/mcp/sse",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}`}</pre>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card" style={{ borderLeft: '3px solid var(--accent-primary)' }}>
                                <h4 style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>How it works</h4>
                                <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '1.1rem', margin: 0 }}>
                                    <li>LiteLLM acts as an <strong>MCP Gateway</strong> — one endpoint for all configured MCP servers</li>
                                    <li>API key-based access control determines which servers a user can access</li>
                                    <li>Supports both <strong>SSE</strong> and <strong>Streamable HTTP</strong> transports</li>
                                    <li>Tool calls are routed to the appropriate backend MCP server automatically</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Semantic Filter Tab */}
                    {tab === 'semantic' && (
                        <div className="flex flex-col gap-4">
                            <div className="glass-card">
                                <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Semantic Tool Filtering</h3>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Use semantic similarity to automatically filter and select the most relevant MCP tools for each request. This reduces token usage by only including tools that match the user's intent.</p>

                                <div className="flex flex-col gap-4">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={semanticEnabled} onChange={e => setSemanticEnabled(e.target.checked)} />
                                        <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Enable Semantic Filtering</span>
                                    </label>

                                    {semanticEnabled && (
                                        <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }} className="flex flex-col gap-4">
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                                <div style={fieldStyle}>
                                                    <label style={labelStyle}>Similarity Threshold</label>
                                                    <input className="input" type="number" step="0.05" min="0" max="1" value={semanticThreshold} onChange={e => setSemanticThreshold(e.target.value)} />
                                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Minimum similarity score (0.0 - 1.0). Higher = more restrictive.</span>
                                                </div>
                                                <div style={fieldStyle}>
                                                    <label style={labelStyle}>Max Tools per Request</label>
                                                    <input className="input" type="number" min="1" max="50" value={semanticMaxTools} onChange={e => setSemanticMaxTools(e.target.value)} />
                                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Maximum number of tools to include per request.</span>
                                                </div>
                                            </div>
                                            <div style={fieldStyle}>
                                                <label style={labelStyle}>Filter Description</label>
                                                <textarea className="input" rows={3} style={{ fontSize: '0.78rem', resize: 'vertical' }} placeholder="Describe the types of tools to prioritize, e.g. 'Focus on code review and repository management tools'" value={semanticDescription} onChange={e => setSemanticDescription(e.target.value)} />
                                                <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Natural language description to guide tool selection.</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="glass-card" style={{ borderLeft: '3px solid #f59e0b' }}>
                                <h4 style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>How Semantic Filtering Works</h4>
                                <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '1.1rem', margin: 0 }}>
                                    <li>User messages are compared against tool descriptions using embedding similarity</li>
                                    <li>Only tools above the <strong>similarity threshold</strong> are included in the LLM request</li>
                                    <li>Reduces prompt token usage by excluding irrelevant tools</li>
                                    <li>Especially useful when you have many MCP servers with dozens of tools</li>
                                </ul>
                            </div>

                            {tools.length > 0 && (
                                <div className="glass-card">
                                    <h4 style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Registered Tools ({tools.length})</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                        {tools.map((t: any, i: number) => (
                                            <span key={i} style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)', background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontWeight: 500 }}>
                                                {t.name || t.function?.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Network Settings Tab */}
                    {tab === 'network' && (
                        <div className="flex flex-col gap-4">
                            <div className="glass-card">
                                <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Private IP Ranges</h3>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                    Define which IP ranges are part of your private network. Callers from these IPs can see all MCP servers.
                                    Callers from any other IP can only see servers marked "Available on Public Internet".
                                </p>

                                <div style={{ background: 'rgba(79, 110, 247, 0.06)', border: '1px solid rgba(79, 110, 247, 0.15)', borderRadius: 'var(--radius-md)', padding: '0.65rem 0.85rem', marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 500 }}>
                                        Your current IP: <strong>{typeof window !== 'undefined' ? '(detected on request)' : '—'}</strong>
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                        Suggested range: <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.68rem', cursor: 'pointer', background: 'var(--bg-primary)' }} onClick={() => setPrivateRanges(prev => prev ? prev + ', 172.21.0.0/24' : '172.21.0.0/24')}>+ 172.21.0.0/24</span>
                                    </div>
                                </div>

                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Your Private Network Ranges</label>
                                    <textarea className="input" rows={3} style={{ fontSize: '0.78rem', fontFamily: 'monospace' }} placeholder="Leave empty to use defaults: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8" value={privateRanges} onChange={e => setPrivateRanges(e.target.value)} />
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Enter CIDR ranges (e.g., 10.0.0.0/8). When empty, standard private IP ranges are used. Separate multiple ranges with commas or newlines.</span>
                                </div>

                                <button className="btn btn-primary" style={{ marginTop: '0.75rem' }} onClick={() => alert('Network settings saved (note: requires LiteLLM config update to persist)')}>Save Network Settings</button>
                            </div>

                            <div className="glass-card">
                                <h4 style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Server Network Access Summary</h4>
                                {servers.length === 0 ? (
                                    <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>No servers configured.</p>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <th style={{ ...labelStyle, padding: '0.5rem 0.6rem' }}>Server</th>
                                                <th style={{ ...labelStyle, padding: '0.5rem 0.6rem' }}>Network Access</th>
                                                <th style={{ ...labelStyle, padding: '0.5rem 0.6rem' }}>Public Internet</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {servers.map((s, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                    <td style={{ padding: '0.5rem 0.6rem', fontSize: '0.82rem', fontWeight: 500 }}>{s.server_name || s.server_id}</td>
                                                    <td style={{ padding: '0.5rem 0.6rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                        {s.allow_all_keys ? 'All Keys' : (s.mcp_access_groups?.length ? s.mcp_access_groups.join(', ') : 'Restricted')}
                                                    </td>
                                                    <td style={{ padding: '0.5rem 0.6rem' }}>
                                                        <span style={{
                                                            fontSize: '0.65rem', padding: '0.1rem 0.35rem', borderRadius: 'var(--radius-full)', fontWeight: 600,
                                                            background: s.available_on_public_internet ? 'rgba(34,197,94,0.1)' : 'rgba(107,114,128,0.1)',
                                                            color: s.available_on_public_internet ? '#22c55e' : 'var(--text-tertiary)',
                                                        }}>{s.available_on_public_internet ? 'Yes' : 'No'}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            <div className="glass-card" style={{ borderLeft: '3px solid #22c55e' }}>
                                <h4 style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>Network Security Model</h4>
                                <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '1.1rem', margin: 0 }}>
                                    <li><strong>Private network callers</strong> — can access all MCP servers regardless of public internet flag</li>
                                    <li><strong>Public network callers</strong> — can only access servers with "Available on Public Internet" enabled</li>
                                    <li><strong>Default private ranges</strong> — 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8</li>
                                    <li>Customize the ranges above to match your infrastructure</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
