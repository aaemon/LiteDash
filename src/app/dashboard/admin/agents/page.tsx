'use client';

import { useState, useEffect } from 'react';

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

export default function AdminAgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [availableTools, setAvailableTools] = useState<any[]>([]);
    const [availableGuardrails, setAvailableGuardrails] = useState<any[]>([]);
    const [availableMCPServers, setAvailableMCPServers] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state — all fields
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

    useEffect(() => {
        // Fetch models
        fetch('/api/models').then(r => r.json()).then(d => {
            if (d.models) { setModels(d.models); if (d.models.length > 0) setFModel(d.models[0].id); }
        });
        // Fetch MCP tools & servers
        fetch('/api/admin/mcp').then(r => r.json()).then(d => {
            setAvailableTools(d.tools || []);
            setAvailableMCPServers(d.servers || []);
        }).catch(() => { });
        // Fetch guardrails
        fetch('/api/admin/guardrails').then(r => r.json()).then(d => {
            setAvailableGuardrails(d.guardrails || []);
        }).catch(() => { });
    }, []);

    const resetForm = () => {
        setFName(''); setFDescription(''); setFSystemPrompt('');
        setFTemp('0.7'); setFTopP('1.0'); setFMaxTokens('4096');
        setFFreqPenalty('0'); setFPresPenalty('0'); setFStop('');
        setFResponseFormat('text'); setFTools([]); setFGuardrails([]); setFMCPServers([]); setFMetadata('');
        setEditingId(null);
        if (models.length > 0) setFModel(models[0].id);
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
        if (editingId) {
            setAgents(agents.map(a => a.id === editingId ? agent : a));
        } else {
            setAgents([...agents, agent]);
        }
        setShowModal(false); resetForm();
    };

    const handleRemove = (id: string) => { if (confirm('Remove this agent?')) setAgents(agents.filter(a => a.id !== id)); };
    const handleToggle = (id: string) => setAgents(agents.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a));

    const toggleArrayItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
        setter(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]);
    };

    const labelStyle: React.CSSProperties = { fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' };
    const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.3rem' };
    const chipStyle = (selected: boolean): React.CSSProperties => ({
        padding: '0.2rem 0.5rem', fontSize: '0.68rem', borderRadius: 'var(--radius-full)', cursor: 'pointer', transition: 'all 0.15s ease',
        border: '1px solid ' + (selected ? 'var(--accent-primary)' : 'var(--border-color)'),
        background: selected ? 'var(--accent-primary)' : 'var(--bg-primary)',
        color: selected ? '#fff' : 'var(--text-secondary)', fontWeight: selected ? 600 : 400,
    });

    return (
        <div className="flex flex-col gap-6">
            <header>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ marginBottom: '0.25rem' }}>Agents & Workflows</h1>
                        <p>Configure autonomous agents with models, tools, guardrails, and MCP servers.</p>
                    </div>
                    <button className="btn btn-primary" onClick={openCreate}>+ Create Agent</button>
                </div>
            </header>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-card" style={{ width: '650px' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '1.05rem' }}>{editingId ? 'Edit Agent' : 'Create New Agent'}</h3>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Basic Info */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Agent Name *</label>
                                    <input className="input" placeholder="e.g. Code Review Assistant" value={fName} onChange={e => setFName(e.target.value)} required />
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Model *</label>
                                    <select className="input" value={fModel} onChange={e => setFModel(e.target.value)}>
                                        {models.map((m, i) => <option key={i} value={m.id}>{m.id}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Description</label>
                                <input className="input" placeholder="Brief description of what this agent does" value={fDescription} onChange={e => setFDescription(e.target.value)} />
                            </div>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>System Prompt *</label>
                                <textarea className="input" style={{ minHeight: '90px', resize: 'vertical', fontSize: '0.82rem' }} placeholder="You are a helpful assistant that..." value={fSystemPrompt} onChange={e => setFSystemPrompt(e.target.value)} required />
                            </div>

                            {/* Model Parameters */}
                            <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                <span style={{ ...labelStyle, color: 'var(--accent-primary)', display: 'block', marginBottom: '0.5rem' }}>Model Parameters</span>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
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
                                        <input className="input" type="number" min="1" value={fMaxTokens} onChange={e => setFMaxTokens(e.target.value)} />
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
                                            <option value="json_object">JSON Object</option>
                                            <option value="json_schema">JSON Schema</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ ...fieldStyle, marginTop: '0.75rem' }}>
                                    <label style={labelStyle}>Stop Sequences (comma-separated)</label>
                                    <input className="input" placeholder='e.g. \n, END, ###' value={fStop} onChange={e => setFStop(e.target.value)} />
                                </div>
                            </div>

                            {/* Tools & MCP */}
                            <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                <span style={{ ...labelStyle, color: '#22c55e', display: 'block', marginBottom: '0.5rem' }}>Tools & MCP Servers</span>

                                {availableTools.length > 0 && (
                                    <div style={{ ...fieldStyle, marginBottom: '0.75rem' }}>
                                        <label style={labelStyle}>Bind MCP Tools</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                            {availableTools.map((t: any, i: number) => {
                                                const toolName = t.name || t.function?.name || `tool_${i}`;
                                                return (
                                                    <span key={i} style={chipStyle(fTools.includes(toolName))} onClick={() => toggleArrayItem(fTools, toolName, setFTools)}>{toolName}</span>
                                                );
                                            })}
                                        </div>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Click to toggle. Selected tools will be available for function calling.</span>
                                    </div>
                                )}

                                {availableMCPServers.length > 0 && (
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Connected MCP Servers</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                            {availableMCPServers.map((s: any, i: number) => {
                                                const sName = s.server_name || s.server_id;
                                                return (
                                                    <span key={i} style={chipStyle(fMCPServers.includes(sName))} onClick={() => toggleArrayItem(fMCPServers, sName, setFMCPServers)}>{sName}</span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {availableTools.length === 0 && availableMCPServers.length === 0 && (
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>No MCP tools or servers configured. Add them from the MCP Servers page.</p>
                                )}
                            </div>

                            {/* Guardrails */}
                            <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                <span style={{ ...labelStyle, color: '#f59e0b', display: 'block', marginBottom: '0.5rem' }}>Guardrails</span>
                                {availableGuardrails.length > 0 ? (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                        {availableGuardrails.map((g: any, i: number) => {
                                            const gName = g.guardrail_name || g.name || `guardrail_${i}`;
                                            return (
                                                <span key={i} style={chipStyle(fGuardrails.includes(gName))} onClick={() => toggleArrayItem(fGuardrails, gName, setFGuardrails)}>{gName}</span>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>No guardrails configured. Configure them from the Guardrails page.</p>
                                )}
                            </div>

                            {/* Metadata */}
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Metadata (JSON)</label>
                                <textarea className="input" rows={2} placeholder='{"department": "engineering", "version": "1.0"}' value={fMetadata} onChange={e => setFMetadata(e.target.value)} style={{ fontFamily: 'monospace', fontSize: '0.72rem' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Create Agent'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Agent List */}
            {agents.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5"><circle cx="12" cy="10" r="3"></circle><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2z"></path><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path></svg>
                    </div>
                    <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>No Agents Configured</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', maxWidth: '400px', margin: '0 auto' }}>
                        Create an agent with a custom system prompt, model parameters, tool bindings, and guardrails.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
                    {agents.map(agent => (
                        <div key={agent.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <div className="card-stripe" style={{ background: agent.status === 'active' ? '#4f6ef7' : '#6b7280' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{agent.name}</span>
                                <span style={{
                                    fontSize: '0.62rem', padding: '0.12rem 0.35rem', borderRadius: 'var(--radius-full)', fontWeight: 600, textTransform: 'uppercase',
                                    background: agent.status === 'active' ? 'rgba(79, 110, 247, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                                    color: agent.status === 'active' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                                }}>{agent.status}</span>
                            </div>
                            {agent.description && <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{agent.description}</p>}

                            {/* Config row */}
                            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', padding: '0.4rem 0.6rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: '0.72rem' }}>
                                <div><span style={{ color: 'var(--text-tertiary)' }}>Model:</span> <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{agent.model}</span></div>
                                <div><span style={{ color: 'var(--text-tertiary)' }}>Temp:</span> <span style={{ fontWeight: 500 }}>{agent.temperature}</span></div>
                                <div><span style={{ color: 'var(--text-tertiary)' }}>Top P:</span> <span style={{ fontWeight: 500 }}>{agent.topP}</span></div>
                                <div><span style={{ color: 'var(--text-tertiary)' }}>Max:</span> <span style={{ fontWeight: 500 }}>{agent.maxTokens}</span></div>
                                {agent.responseFormat !== 'text' && <div><span style={{ color: 'var(--text-tertiary)' }}>Format:</span> <span style={{ fontWeight: 500 }}>{agent.responseFormat}</span></div>}
                            </div>

                            {/* Bindings */}
                            {(agent.tools.length > 0 || agent.mcpServers.length > 0 || agent.guardrails.length > 0) && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                    {agent.tools.map((t, i) => <span key={`t${i}`} style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem', borderRadius: 'var(--radius-full)', background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontWeight: 500 }}>🔧 {t}</span>)}
                                    {agent.mcpServers.map((s, i) => <span key={`m${i}`} style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem', borderRadius: 'var(--radius-full)', background: 'rgba(79,110,247,0.1)', color: 'var(--accent-primary)', fontWeight: 500 }}>🔌 {s}</span>)}
                                    {agent.guardrails.map((g, i) => <span key={`g${i}`} style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem', borderRadius: 'var(--radius-full)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontWeight: 500 }}>🛡 {g}</span>)}
                                </div>
                            )}

                            {/* System prompt preview */}
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '0.35rem 0.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', maxHeight: '48px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {agent.systemPrompt}
                            </div>

                            <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.15rem' }}>
                                <button className="btn btn-outline" style={{ fontSize: '0.68rem', padding: '0.18rem 0.4rem' }} onClick={() => openEdit(agent)}>Edit</button>
                                <button className="btn btn-outline" style={{ fontSize: '0.68rem', padding: '0.18rem 0.4rem' }} onClick={() => handleToggle(agent.id)}>
                                    {agent.status === 'active' ? 'Deactivate' : 'Activate'}
                                </button>
                                <button className="btn btn-outline" style={{ fontSize: '0.68rem', padding: '0.18rem 0.4rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleRemove(agent.id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
