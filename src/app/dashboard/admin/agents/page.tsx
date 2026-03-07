'use client';

import { useState, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

interface Agent {
    id: string;
    name: string;
    description: string;
    model: string;
    systemPrompt: string;
    temperature: number;
    topP: number;
    maxTokens: number;
    frequencyPenalty: number;
    presencePenalty: number;
    stopSequences: string;
    responseFormat: string;
    tools: string[];
    guardrails: string[];
    mcpServers: string[];
    metadata: string;
    status: 'active' | 'inactive';
}

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

const STORAGE_KEY = 'litedash_agents';

function loadAgents(): Agent[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

function saveAgents(agents: Agent[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
}

export default function AdminAgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [availableTools, setAvailableTools] = useState<any[]>([]);
    const [availableGuardrails, setAvailableGuardrails] = useState<any[]>([]);
    const [availableMCPServers, setAvailableMCPServers] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isViewer, setIsViewer] = useState(false);
    const [tab, setTab] = useState<'agents' | 'chat'>('agents');

    // Chat state
    const [chatAgent, setChatAgent] = useState<Agent | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Form state
    const [fName, setFName] = useState('');
    const [fDescription, setFDescription] = useState('');
    const [fModel, setFModel] = useState('');
    const [fSystemPrompt, setFSystemPrompt] = useState('');
    const [fTemp, setFTemp] = useState('0.7');
    const [fTopP, setFTopP] = useState('1.0');
    const [fMaxTokens, setFMaxTokens] = useState('4096');
    const [fFreqPenalty, setFFreqPenalty] = useState('0');
    const [fPresPenalty, setFPresPenalty] = useState('0');
    const [fStop, setFStop] = useState('');
    const [fResponseFormat, setFResponseFormat] = useState('text');
    const [fTools, setFTools] = useState<string[]>([]);
    const [fGuardrails, setFGuardrails] = useState<string[]>([]);
    const [fMCPServers, setFMCPServers] = useState<string[]>([]);
    const [fMetadata, setFMetadata] = useState('');

    useEffect(() => { setAgents(loadAgents()); }, []);
    useEffect(() => {
        if (agents.length > 0 || localStorage.getItem(STORAGE_KEY)) saveAgents(agents);
    }, [agents]);

    useEffect(() => {
        fetch('/api/auth/me').then(r => r.json()).then(d => setIsViewer(d.isViewer)).catch(() => { });
        fetch('/api/models').then(r => r.json()).then(d => {
            const m = d.data || d.models || [];
            setModels(m);
            if (m.length > 0) setFModel(m[0]?.id || m[0]?.model_name || '');
        }).catch(() => { });
        fetch('/api/admin/mcp').then(r => r.json()).then(d => {
            setAvailableTools(d.tools || []);
            setAvailableMCPServers(d.servers || []);
        }).catch(() => { });
        fetch('/api/admin/guardrails').then(r => r.json()).then(d => {
            setAvailableGuardrails(d.guardrails || []);
        }).catch(() => { });
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const resetForm = () => {
        setFName(''); setFDescription(''); setFSystemPrompt('');
        setFTemp('0.7'); setFTopP('1.0'); setFMaxTokens('4096');
        setFFreqPenalty('0'); setFPresPenalty('0'); setFStop('');
        setFResponseFormat('text'); setFTools([]); setFGuardrails([]); setFMCPServers([]); setFMetadata('');
        setEditingId(null);
        if (models.length > 0) setFModel(models[0]?.id || models[0]?.model_name || '');
    };

    const openCreate = () => { resetForm(); setShowModal(true); };
    const openEdit = (a: Agent) => {
        setEditingId(a.id); setFName(a.name); setFDescription(a.description || '');
        setFModel(a.model); setFSystemPrompt(a.systemPrompt);
        setFTemp(String(a.temperature)); setFTopP(String(a.topP)); setFMaxTokens(String(a.maxTokens));
        setFFreqPenalty(String(a.frequencyPenalty)); setFPresPenalty(String(a.presencePenalty));
        setFStop(a.stopSequences || ''); setFResponseFormat(a.responseFormat || 'text');
        setFTools(a.tools || []); setFGuardrails(a.guardrails || []); setFMCPServers(a.mcpServers || []);
        setFMetadata(a.metadata || '');
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const agent: Agent = {
            id: editingId || Date.now().toString(),
            name: fName, description: fDescription, model: fModel,
            systemPrompt: fSystemPrompt, temperature: parseFloat(fTemp),
            topP: parseFloat(fTopP), maxTokens: parseInt(fMaxTokens),
            frequencyPenalty: parseFloat(fFreqPenalty), presencePenalty: parseFloat(fPresPenalty),
            stopSequences: fStop, responseFormat: fResponseFormat,
            tools: fTools, guardrails: fGuardrails, mcpServers: fMCPServers, metadata: fMetadata,
            status: 'active',
        };
        if (editingId) setAgents(agents.map(a => a.id === editingId ? agent : a));
        else setAgents([...agents, agent]);
        setShowModal(false); resetForm();
    };

    const handleRemove = (id: string) => { if (confirm('Remove this agent?')) setAgents(agents.filter(a => a.id !== id)); };
    const handleToggle = (id: string) => setAgents(agents.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a));
    const handleDuplicate = (a: Agent) => setAgents([...agents, { ...a, id: Date.now().toString(), name: `${a.name} (Copy)` }]);

    const exportAgent = (a: Agent) => {
        const config = {
            agent_id: a.id, name: a.name, description: a.description, model: a.model,
            system_prompt: a.systemPrompt,
            parameters: {
                temperature: a.temperature, top_p: a.topP, max_tokens: a.maxTokens,
                frequency_penalty: a.frequencyPenalty, presence_penalty: a.presencePenalty,
                ...(a.stopSequences ? { stop: a.stopSequences.split(',').map(s => s.trim()) } : {}),
                ...(a.responseFormat !== 'text' ? { response_format: { type: a.responseFormat } } : {}),
            },
            ...(a.tools.length > 0 ? { tools: a.tools } : {}),
            ...(a.guardrails.length > 0 ? { guardrails: a.guardrails } : {}),
            ...(a.mcpServers.length > 0 ? { mcp_servers: a.mcpServers } : {}),
            status: a.status,
        };
        navigator.clipboard.writeText(JSON.stringify(config, null, 2));
        alert('Agent configuration copied to clipboard as JSON!');
    };

    const startChat = (a: Agent) => { setChatAgent(a); setChatMessages([]); setChatInput(''); setTab('chat'); };

    const sendMessage = async () => {
        if (!chatInput.trim() || !chatAgent || chatLoading) return;
        const userMsg: ChatMessage = { role: 'user', content: chatInput.trim() };
        const newMessages = [...chatMessages, userMsg];
        setChatMessages(newMessages);
        setChatInput('');
        setChatLoading(true);
        try {
            const apiMessages: ChatMessage[] = [];
            if (chatAgent.systemPrompt) apiMessages.push({ role: 'system', content: chatAgent.systemPrompt });
            apiMessages.push(...newMessages);
            const res = await fetch('/api/admin/agents/chat', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: chatAgent.model, messages: apiMessages,
                    temperature: chatAgent.temperature, top_p: chatAgent.topP,
                    max_tokens: chatAgent.maxTokens, frequency_penalty: chatAgent.frequencyPenalty,
                    presence_penalty: chatAgent.presencePenalty,
                    stop: chatAgent.stopSequences || undefined,
                    response_format: chatAgent.responseFormat,
                    guardrails: chatAgent.guardrails.length > 0 ? chatAgent.guardrails : undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setChatMessages(prev => [...prev, { role: 'assistant', content: data.blocked ? `🛡️ Guardrail blocked: ${data.error}` : `Error: ${data.error || 'Failed'}` }]);
            } else {
                setChatMessages(prev => [...prev, { role: 'assistant', content: data.choices?.[0]?.message?.content || 'No response' }]);
            }
        } catch (err: any) {
            setChatMessages(prev => [...prev, { role: 'assistant', content: `Connection error: ${err.message}` }]);
        } finally { setChatLoading(false); }
    };

    const toggleArrayItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
        setter(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]);
    };

    const labelStyle: CSSProperties = { fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' };
    const fieldStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.3rem' };
    const tabBtn = (t: string, active: boolean): CSSProperties => ({
        padding: '0.4rem 0.85rem', fontSize: '0.78rem', fontWeight: active ? 600 : 400,
        color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
        borderTop: 'none', borderLeft: 'none', borderRight: 'none',
        borderBottomWidth: '2px', borderBottomStyle: 'solid',
        borderBottomColor: active ? 'var(--accent-primary)' : 'transparent',
        background: 'none', cursor: 'pointer', transition: 'color 0.2s ease',
    });
    const chipStyle = (selected: boolean): CSSProperties => ({
        padding: '0.2rem 0.5rem', fontSize: '0.68rem', borderRadius: 'var(--radius-full)', cursor: 'pointer', transition: 'all 0.15s ease',
        border: '1px solid ' + (selected ? 'var(--accent-primary)' : 'var(--border-color)'),
        background: selected ? 'var(--accent-primary)' : 'var(--bg-primary)',
        color: selected ? '#fff' : 'var(--text-secondary)', fontWeight: selected ? 600 : 400,
    });

    const activeAgents = agents.filter(a => a.status === 'active');

    return (
        <div className="flex flex-col gap-6">
            <header>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ marginBottom: '0.25rem' }}>Agents & Workflows</h1>
                        <p>Configure autonomous agents with models, tools, guardrails, and MCP servers.</p>
                    </div>
                    {!isViewer && <button className="btn btn-primary" onClick={openCreate}>+ New Agent</button>}
                </div>
            </header>

            {/* Tabs — matching MCP page pattern */}
            <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
                <button style={tabBtn('agents', tab === 'agents')} onClick={() => setTab('agents')}>All Agents ({agents.length})</button>
                <button style={tabBtn('chat', tab === 'chat')} onClick={() => setTab('chat')}>Agent Chat{chatAgent ? ` — ${chatAgent.name}` : ''}</button>
            </div>

            {/* ====== AGENTS TAB ====== */}
            {tab === 'agents' && (
                <div className="glass-card" style={{ padding: '0' }}>
                    {agents.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>No Agents Configured</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>Create an agent to get started with autonomous workflows.</p>
                            {!isViewer && <button className="btn btn-primary" onClick={openCreate}>+ New Agent</button>}
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        {['Name', 'Model', 'Temperature', 'Max Tokens', 'Tools', 'Guardrails', 'Status', 'Actions'].map(h => (
                                            <th key={h} style={{ padding: '0.65rem 0.6rem', fontWeight: 600, fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {agents.map(agent => (
                                        <tr key={agent.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '0.55rem 0.6rem' }}>
                                                <div style={{ fontWeight: 500, fontSize: '0.82rem' }}>{agent.name}</div>
                                                {agent.description && <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '0.1rem' }}>{agent.description.substring(0, 60)}{agent.description.length > 60 ? '…' : ''}</div>}
                                            </td>
                                            <td style={{ padding: '0.55rem 0.6rem', fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'monospace', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.model}</td>
                                            <td style={{ padding: '0.55rem 0.6rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{agent.temperature}</td>
                                            <td style={{ padding: '0.55rem 0.6rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{agent.maxTokens}</td>
                                            <td style={{ padding: '0.55rem 0.6rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{agent.tools.length > 0 ? agent.tools.join(', ') : '—'}</td>
                                            <td style={{ padding: '0.55rem 0.6rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{agent.guardrails.length > 0 ? agent.guardrails.join(', ') : '—'}</td>
                                            <td style={{ padding: '0.55rem 0.6rem' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem' }}>
                                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: agent.status === 'active' ? 'var(--success)' : 'var(--text-tertiary)' }} />
                                                    <span style={{ color: agent.status === 'active' ? 'var(--success)' : 'var(--text-tertiary)', fontWeight: 500, textTransform: 'capitalize' }}>{agent.status}</span>
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.55rem 0.6rem', whiteSpace: 'nowrap' }}>
                                                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                                                    <button onClick={() => startChat(agent)} className="btn btn-outline" style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem' }} disabled={agent.status !== 'active'}>Chat</button>
                                                    {!isViewer && <button onClick={() => openEdit(agent)} className="btn btn-outline" style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem' }}>Edit</button>}
                                                    {!isViewer && <button onClick={() => handleDuplicate(agent)} className="btn btn-outline" style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem' }}>Duplicate</button>}
                                                    <button onClick={() => exportAgent(agent)} className="btn btn-outline" style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem' }}>Export</button>
                                                    {!isViewer && <button onClick={() => handleToggle(agent.id)} className="btn btn-outline" style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem' }}>{agent.status === 'active' ? 'Pause' : 'Resume'}</button>}
                                                    {!isViewer && <button onClick={() => handleRemove(agent.id)} className="btn btn-outline" style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>Delete</button>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ====== CHAT TAB ====== */}
            {tab === 'chat' && (
                <div className="grid-split" style={{ height: 'calc(100vh - 240px)', minHeight: '400px' }}>
                    {/* Agent Sidebar */}
                    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflow: 'auto' }}>
                        <h3 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Select Agent</h3>
                        {activeAgents.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No active agents.</p>
                                <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>Create and activate an agent to start chatting.</p>
                            </div>
                        ) : (
                            activeAgents.map(a => (
                                <div key={a.id} onClick={() => { setChatAgent(a); setChatMessages([]); setChatInput(''); }}
                                    style={{
                                        padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                                        background: chatAgent?.id === a.id ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                                        color: chatAgent?.id === a.id ? '#fff' : 'var(--text-primary)',
                                        border: '1px solid ' + (chatAgent?.id === a.id ? 'var(--accent-primary)' : 'var(--border-color)'),
                                        transition: 'all 0.15s ease',
                                    }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{a.name}</div>
                                    <div style={{ fontSize: '0.68rem', opacity: chatAgent?.id === a.id ? 0.85 : 0.6, marginTop: '0.15rem' }}>{a.model}</div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Chat Area */}
                    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        {!chatAgent ? (
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                                <div>
                                    <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Agent Chat</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Select an active agent from the sidebar to begin a conversation.</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Chat Header */}
                                <div style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{chatAgent.name}</span>
                                        <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginLeft: '0.5rem', fontFamily: 'monospace' }}>{chatAgent.model}</span>
                                    </div>
                                    <button className="btn btn-outline" style={{ fontSize: '0.65rem', padding: '0.15rem 0.35rem' }} onClick={() => setChatMessages([])}>Clear Chat</button>
                                </div>

                                {/* Messages */}
                                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingRight: '0.25rem' }}>
                                    {chatMessages.length === 0 && (
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.5 }}>
                                            <div>
                                                <p style={{ fontSize: '0.8rem' }}>Send a message to start the conversation</p>
                                                {chatAgent.systemPrompt && <p style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '0.3rem', fontStyle: 'italic' }}>System: &quot;{chatAgent.systemPrompt.substring(0, 80)}…&quot;</p>}
                                            </div>
                                        </div>
                                    )}
                                    {chatMessages.map((msg, i) => (
                                        <div key={i} style={{
                                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                            maxWidth: '85%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-md)',
                                            background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                                            color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                                            fontSize: '0.82rem', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                                        }}>
                                            {msg.content}
                                        </div>
                                    ))}
                                    {chatLoading && (
                                        <div style={{ alignSelf: 'flex-start', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', fontSize: '0.82rem' }}>
                                            <span style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>●●●</span>
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Input */}
                                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
                                    <input className="input" style={{ flex: 1, fontSize: '0.85rem' }} placeholder="Type a message..." value={chatInput}
                                        onChange={e => setChatInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                        disabled={chatLoading} />
                                    <button className="btn btn-primary" onClick={sendMessage} disabled={chatLoading || !chatInput.trim()} style={{ minWidth: '60px' }}>
                                        {chatLoading ? '…' : 'Send'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ====== CREATE/EDIT MODAL — matching MCP page style ====== */}
            {showModal && (
                <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
                    <div className="modal-card" style={{ width: '580px' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '1.05rem' }}>{editingId ? 'Edit Agent' : 'Create New Agent'}</h3>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="grid-form-2">
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Agent Name *</label>
                                    <input className="input" placeholder="e.g. Code Review Assistant" value={fName} onChange={e => setFName(e.target.value)} required />
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Model *</label>
                                    <select className="input" value={fModel} onChange={e => setFModel(e.target.value)}>
                                        {models.map((m: any, i: number) => <option key={i} value={m.id || m.model_name}>{m.id || m.model_name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Description</label>
                                <input className="input" placeholder="What this agent does" value={fDescription} onChange={e => setFDescription(e.target.value)} />
                            </div>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>System Prompt</label>
                                <textarea className="input" rows={3} placeholder="You are a helpful assistant that..." value={fSystemPrompt} onChange={e => setFSystemPrompt(e.target.value)} style={{ fontFamily: 'inherit', resize: 'vertical' }} />
                            </div>

                            {/* Model Parameters */}
                            <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                <span style={{ ...labelStyle, color: 'var(--accent-primary)', display: 'block', marginBottom: '0.5rem' }}>Model Parameters</span>
                                <div className="grid-form-3">
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Temperature</label>
                                        <input className="input" type="number" step="0.05" min="0" max="2" value={fTemp} onChange={e => setFTemp(e.target.value)} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Top P</label>
                                        <input className="input" type="number" step="0.05" min="0" max="1" value={fTopP} onChange={e => setFTopP(e.target.value)} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Max Tokens</label>
                                        <input className="input" type="number" min="1" max="128000" value={fMaxTokens} onChange={e => setFMaxTokens(e.target.value)} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Frequency Penalty</label>
                                        <input className="input" type="number" step="0.1" min="-2" max="2" value={fFreqPenalty} onChange={e => setFFreqPenalty(e.target.value)} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Presence Penalty</label>
                                        <input className="input" type="number" step="0.1" min="-2" max="2" value={fPresPenalty} onChange={e => setFPresPenalty(e.target.value)} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Response Format</label>
                                        <select className="input" value={fResponseFormat} onChange={e => setFResponseFormat(e.target.value)}>
                                            <option value="text">Text</option>
                                            <option value="json_object">JSON</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div style={fieldStyle}>
                                <label style={labelStyle}>Stop Sequences</label>
                                <input className="input" placeholder="Comma-separated stop sequences" value={fStop} onChange={e => setFStop(e.target.value)} />
                            </div>

                            {/* Tools */}
                            {availableTools.length > 0 && (
                                <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                    <span style={{ ...labelStyle, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Tools ({fTools.length} selected)</span>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                        {availableTools.map((t: any, i: number) => {
                                            const name = t.name || t.function?.name || `tool-${i}`;
                                            return <span key={i} style={chipStyle(fTools.includes(name))} onClick={() => toggleArrayItem(fTools, name, setFTools)}>{name}</span>;
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* MCP Servers */}
                            {availableMCPServers.length > 0 && (
                                <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                    <span style={{ ...labelStyle, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>MCP Servers ({fMCPServers.length} selected)</span>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                        {availableMCPServers.map((s: any, i: number) => (
                                            <span key={i} style={chipStyle(fMCPServers.includes(s.server_name || s.name))} onClick={() => toggleArrayItem(fMCPServers, s.server_name || s.name, setFMCPServers)}>{s.server_name || s.name}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Guardrails */}
                            {availableGuardrails.length > 0 && (
                                <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                    <span style={{ ...labelStyle, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Guardrails ({fGuardrails.length} selected)</span>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                        {availableGuardrails.map((g: any, i: number) => (
                                            <span key={i} style={chipStyle(fGuardrails.includes(g.guardrail_name))} onClick={() => toggleArrayItem(fGuardrails, g.guardrail_name, setFGuardrails)}>{g.guardrail_name}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Metadata */}
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Metadata (JSON)</label>
                                <textarea className="input" rows={2} placeholder='{"key": "value"}' value={fMetadata} onChange={e => setFMetadata(e.target.value)} style={{ fontFamily: 'monospace', fontSize: '0.72rem' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Create Agent'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
