'use client';

import { useState, useEffect } from 'react';
import type { FormEvent, CSSProperties } from 'react';
import { useCurrency } from '@/hooks/useCurrency';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);
    const { symbol, format } = useCurrency();

    // Form fields
    const [formUserId, setFormUserId] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [formBudget, setFormBudget] = useState('');
    const [formModels, setFormModels] = useState('');
    const [formTpm, setFormTpm] = useState('');
    const [formRpm, setFormRpm] = useState('');
    const [formMetadata, setFormMetadata] = useState('');
    const [formRole, setFormRole] = useState('internal_user');
    const [saving, setSaving] = useState(false);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (res.ok) setUsers(data.users || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const resetForm = () => {
        setFormUserId(''); setFormEmail(''); setFormPassword(''); setFormBudget('');
        setFormModels(''); setFormTpm(''); setFormRpm(''); setFormMetadata('');
        setFormRole('internal_user');
        setEditUser(null);
    };

    const openCreate = () => { resetForm(); setShowModal(true); };

    const openEdit = (u: any) => {
        setEditUser(u);
        setFormUserId(u.user_id);
        setFormEmail(u.user_email || '');
        setFormPassword('');
        setFormBudget(u.max_budget ? String(u.max_budget) : '');
        setFormModels(u.models ? u.models.join(', ') : '');
        setFormTpm(u.tpm_limit ? String(u.tpm_limit) : '');
        setFormRpm(u.rpm_limit ? String(u.rpm_limit) : '');
        setFormMetadata(u.metadata ? JSON.stringify(u.metadata) : '');
        setFormRole(u.user_role || 'internal_user');
        setShowModal(true);
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault(); setSaving(true);
        try {
            if (editUser) {
                // Update
                const res = await fetch('/api/admin/users/action', {
                    method: 'PUT', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: formUserId, max_budget: formBudget || undefined,
                        password: formPassword || undefined, email: formEmail || undefined,
                        models: formModels || undefined, tpm_limit: formTpm || undefined,
                        rpm_limit: formRpm || undefined, metadata: formMetadata || undefined,
                        role: formRole
                    })
                });
                if (!res.ok) { const err = await res.json(); alert(err.error || 'Failed'); return; }
            } else {
                // Create
                const res = await fetch('/api/admin/users', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: formUserId, max_budget: formBudget, password: formPassword,
                        email: formEmail, models: formModels, tpm_limit: formTpm,
                        rpm_limit: formRpm, metadata: formMetadata, role: formRole
                    })
                });
                if (!res.ok) { const err = await res.json(); alert(err.error || 'Failed'); return; }
            }
            setShowModal(false); resetForm(); fetchUsers();
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm(`Delete user "${userId}"?`)) return;
        try {
            const res = await fetch('/api/admin/users/action', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId }) });
            if (res.ok) fetchUsers();
            else { const err = await res.json(); alert(err.error || 'Failed'); }
        } catch (e) { console.error(e); }
    };

    const labelStyle: CSSProperties = { fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' };
    const fieldStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.3rem' };

    return (
        <div className="flex flex-col gap-6">
            <header>
                <div className="page-header-actions">
                    <div>
                        <h1 style={{ marginBottom: '0.25rem' }}>Users & Budgets</h1>
                        <p>Manage portal users, allocate budgets, and configure access controls.</p>
                    </div>
                    <button className="btn btn-primary" onClick={openCreate}>+ Create User</button>
                </div>
            </header>

            {/* Floating Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-card modal-content" onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '1.05rem' }}>
                            {editUser ? `Edit User — ${editUser.user_id}` : 'Create New User'}
                        </h3>
                        <form onSubmit={handleSave} className="flex flex-col gap-4">
                            {/* Core fields */}
                            <div className="responsive-grid-2">
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>User ID *</label>
                                    <input className="input" placeholder="e.g. dev-team-a" value={formUserId} onChange={e => setFormUserId(e.target.value)} required disabled={!!editUser} style={editUser ? { opacity: 0.6 } : {}} />
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Email</label>
                                    <input className="input" type="email" placeholder="user@company.com" value={formEmail} onChange={e => setFormEmail(e.target.value)} />
                                </div>
                            </div>

                            <div className="responsive-grid-2">
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Role</label>
                                    <select className="input" value={formRole} onChange={e => setFormRole(e.target.value)}>
                                        <option value="proxy_admin">Admin (All Permissions)</option>
                                        <option value="proxy_admin_viewer">Admin (View Only)</option>
                                        <option value="internal_user">Internal User (Create/Delete/View)</option>
                                        <option value="internal_user_viewer">Internal User (View Only)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="responsive-grid-2">
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>{editUser ? 'New Password' : 'Password *'}</label>
                                    <input className="input" type="text" placeholder={editUser ? 'Leave blank to keep' : 'Enter password'} value={formPassword} onChange={e => setFormPassword(e.target.value)} required={!editUser} />
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Max Budget ($)</label>
                                    <input className="input" type="number" step="0.01" placeholder="Unlimited" value={formBudget} onChange={e => setFormBudget(e.target.value)} />
                                </div>
                            </div>

                            {/* Advanced section */}
                            <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <span style={{ ...labelStyle, color: 'var(--accent-primary)' }}>Access Controls</span>
                                <div className="responsive-grid-3">
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Allowed Models</label>
                                        <input className="input" placeholder="model1, model2" value={formModels} onChange={e => setFormModels(e.target.value)} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>TPM Limit</label>
                                        <input className="input" type="number" placeholder="—" value={formTpm} onChange={e => setFormTpm(e.target.value)} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>RPM Limit</label>
                                        <input className="input" type="number" placeholder="—" value={formRpm} onChange={e => setFormRpm(e.target.value)} />
                                    </div>
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Metadata (JSON)</label>
                                    <input className="input" placeholder='{"team": "engineering"}' value={formMetadata} onChange={e => setFormMetadata(e.target.value)} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editUser ? 'Update User' : 'Create User'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Users Table */}
            <div className="glass-card flex flex-col gap-4">
                <h3 style={{ fontWeight: 600 }}>Active Users</h3>
                {loading ? (
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>Loading...</p>
                ) : users.length === 0 ? (
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>No users provisioned yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    {['User ID', 'Email', 'Role', 'Spend', 'Budget', 'Models', 'Status', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: h === 'Actions' ? 'right' : 'left', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u, i) => {
                                    const roleMap: any = {
                                        'proxy_admin': 'Admin',
                                        'proxy_admin_viewer': 'Admin (Viewer)',
                                        'internal_user': 'Internal',
                                        'internal_user_viewer': 'Internal (Viewer)'
                                    };
                                    const displayRole = roleMap[u.user_role] || 'Internal';
                                    return (
                                        <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '0.5rem', fontWeight: 500, fontSize: '0.82rem' }}>{u.user_id}</td>
                                            <td style={{ padding: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{u.user_email || '—'}</td>
                                            <td style={{ padding: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{displayRole}</td>
                                            <td style={{ padding: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{format(u.spend || 0)}</td>
                                            <td style={{ padding: '0.5rem', fontSize: '0.78rem' }}>{u.max_budget ? format(u.max_budget, 2) : '∞'}</td>
                                            <td style={{ padding: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {u.models?.length ? u.models.join(', ') : 'All'}
                                            </td>
                                            <td style={{ padding: '0.5rem' }}>
                                                <span style={{
                                                    fontSize: '0.62rem', padding: '0.12rem 0.35rem', borderRadius: 'var(--radius-full)', fontWeight: 600, textTransform: 'uppercase',
                                                    background: u.spend > (u.max_budget || Infinity) ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                                    color: u.spend > (u.max_budget || Infinity) ? 'var(--danger)' : 'var(--success)',
                                                }}>{u.spend > (u.max_budget || Infinity) ? 'Over Budget' : 'Active'}</span>
                                            </td>
                                            <td style={{ padding: '0.5rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => openEdit(u)} className="btn btn-outline" style={{ padding: '0.18rem 0.4rem', fontSize: '0.68rem' }}>Edit</button>
                                                    <button onClick={() => handleDelete(u.user_id)} className="btn btn-outline" style={{ padding: '0.18rem 0.4rem', fontSize: '0.68rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes pulse {
            0% { opacity: 0.6; transform: scale(0.9); }
            50% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 0.6; transform: scale(0.9); }
        }
      `}} />
        </div>
    );
}
