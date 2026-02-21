'use client';

import { useState, useEffect } from 'react';

const CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar', defaultRate: 1 },
    { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', defaultRate: 121.50 },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', defaultRate: 83.50 },
    { code: 'EUR', symbol: '€', name: 'Euro', defaultRate: 0.92 },
    { code: 'GBP', symbol: '£', name: 'British Pound', defaultRate: 0.79 },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', defaultRate: 149.50 },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', defaultRate: 7.25 },
    { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', defaultRate: 1.36 },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', defaultRate: 1.53 },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', defaultRate: 1.34 },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', defaultRate: 3.67 },
    { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', defaultRate: 3.75 },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', defaultRate: 4.47 },
    { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', defaultRate: 278.50 },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won', defaultRate: 1320 },
    { code: 'THB', symbol: '฿', name: 'Thai Baht', defaultRate: 35.50 },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira', defaultRate: 32.50 },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', defaultRate: 4.97 },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', defaultRate: 1550 },
    { code: 'PHP', symbol: '₱', name: 'Philippine Peso', defaultRate: 56.50 },
];

export default function AdminSettingsPage() {
    const [appName, setAppName] = useState('');
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [currencySymbol, setCurrencySymbol] = useState('$');
    const [currencyMultiplier, setCurrencyMultiplier] = useState('1');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        fetch('/api/settings').then(r => r.json()).then(d => {
            setAppName(d.appName || '');
            setApiEndpoint(d.apiEndpoint || '');
            setLogoUrl(d.logoUrl || '');
            setCurrency(d.currency || 'USD');
            setCurrencySymbol(d.currencySymbol || '$');
            setCurrencyMultiplier(String(d.currencyMultiplier ?? 1));
        }).finally(() => setLoading(false));
    }, []);

    const handleCurrencyChange = (code: string) => {
        const c = CURRENCIES.find(c => c.code === code);
        if (c) {
            setCurrency(c.code);
            setCurrencySymbol(c.symbol);
            setCurrencyMultiplier(String(c.defaultRate));
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            // Use a free exchange rate API
            const res = await fetch(`https://open.er-api.com/v6/latest/USD`);
            if (res.ok) {
                const data = await res.json();
                const rate = data.rates?.[currency];
                if (rate) {
                    setCurrencyMultiplier(String(rate));
                } else {
                    alert(`Rate for ${currency} not found. Using default.`);
                }
            } else {
                alert('Failed to fetch exchange rates. Using default values.');
            }
        } catch {
            alert('Could not reach exchange rate API. Check your connection.');
        }
        finally { setSyncing(false); }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); setSaving(true); setSaved(false);
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    appName, apiEndpoint, logoUrl,
                    currency, currencySymbol,
                    currencyMultiplier: parseFloat(currencyMultiplier) || 1,
                })
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                const err = await res.json(); alert(err.error || 'Failed');
            }
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    const labelStyle: React.CSSProperties = { fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' };
    const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.3rem' };
    const previewAmount = 1.2345;
    const convertedPreview = (previewAmount * (parseFloat(currencyMultiplier) || 1)).toFixed(2);

    if (loading) return <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Loading settings...</p>;

    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 style={{ marginBottom: '0.25rem' }}>Portal Settings</h1>
                <p>Customize the appearance and behavior of the portal.</p>
            </header>

            <form onSubmit={handleSave} className="flex flex-col gap-6">
                {/* Branding */}
                <div className="glass-card flex flex-col gap-4">
                    <h3 style={{ fontWeight: 600 }}>Branding</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div style={fieldStyle}>
                            <label style={labelStyle}>Application Name</label>
                            <input className="input" placeholder="LiteLLM Portal" value={appName} onChange={e => setAppName(e.target.value)} />
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Displayed in the navbar and login page.</span>
                        </div>
                        <div style={fieldStyle}>
                            <label style={labelStyle}>Logo URL</label>
                            <input className="input" placeholder="https://example.com/logo.png" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Image URL for the navbar logo. Leave blank for default.</span>
                        </div>
                    </div>

                    {/* Logo preview */}
                    {logoUrl && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                            <img src={logoUrl} alt="Logo preview" style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', objectFit: 'contain' }} onError={e => (e.currentTarget.style.display = 'none')} />
                            <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{appName || 'LiteLLM Portal'}</span>
                        </div>
                    )}
                </div>

                {/* API Settings */}
                <div className="glass-card flex flex-col gap-4">
                    <h3 style={{ fontWeight: 600 }}>API Configuration</h3>

                    <div style={fieldStyle}>
                        <label style={labelStyle}>API Endpoint URL</label>
                        <input className="input" placeholder="https://api.yourcompany.com" value={apiEndpoint} onChange={e => setApiEndpoint(e.target.value)} />
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                            The public-facing URL shown in the API documentation. Users will use this to connect to the proxy.
                            If left blank, the current browser URL will be used.
                        </span>
                    </div>
                </div>

                {/* Currency Settings */}
                <div className="glass-card flex flex-col gap-4">
                    <h3 style={{ fontWeight: 600 }}>Currency & Display</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '-0.25rem' }}>
                        LiteLLM tracks costs in USD. Choose your display currency and multiplier to show converted amounts across the dashboard.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                        <div style={fieldStyle}>
                            <label style={labelStyle}>Display Currency</label>
                            <select className="input" value={currency} onChange={e => handleCurrencyChange(e.target.value)}>
                                {CURRENCIES.map(c => (
                                    <option key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div style={fieldStyle}>
                            <label style={labelStyle}>Currency Symbol</label>
                            <input className="input" value={currencySymbol} onChange={e => setCurrencySymbol(e.target.value)} style={{ fontSize: '1rem', fontWeight: 700, textAlign: 'center' }} />
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Auto-set from currency. Editable.</span>
                        </div>
                        <div style={fieldStyle}>
                            <label style={labelStyle}>Conversion Multiplier (1 USD =)</label>
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                                <input className="input" type="number" step="0.01" min="0" value={currencyMultiplier} onChange={e => setCurrencyMultiplier(e.target.value)} style={{ flex: 1 }} />
                                <button type="button" className="btn btn-outline" onClick={handleSync} disabled={syncing || currency === 'USD'} style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem', whiteSpace: 'nowrap' }}>
                                    {syncing ? '⏳' : '🔄'} Sync
                                </button>
                            </div>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Fetches live rate from exchange API. Editable for custom rates.</span>
                        </div>
                    </div>

                    {/* Preview */}
                    <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 500 }}>Preview</span>
                            <div style={{ fontSize: '0.82rem', marginTop: '0.15rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>$1.2345 USD</span>
                                <span style={{ color: 'var(--text-tertiary)', margin: '0 0.5rem' }}>→</span>
                                <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{currencySymbol}{convertedPreview} {currency}</span>
                            </div>
                        </div>
                        {currency !== 'USD' && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                                1 USD = {currencySymbol}{parseFloat(currencyMultiplier).toFixed(2)} {currency}
                            </span>
                        )}
                    </div>
                </div>

                {/* Save */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                    {saved && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 500, animation: 'fadeIn 0.2s ease' }}>
                            ✓ Settings saved — refresh to see changes across the portal.
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
}
