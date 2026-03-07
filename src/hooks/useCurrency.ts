'use client';

import { useState, useEffect } from 'react';

export function useCurrency() {
    const [symbol, setSymbol] = useState('$');
    const [multiplier, setMultiplier] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/settings')
            .then(r => r.json())
            .then(d => {
                if (d.currencySymbol) setSymbol(d.currencySymbol);
                if (d.currencyMultiplier) setMultiplier(Number(d.currencyMultiplier));
            })
            .catch(e => console.error('Failed to fetch currency settings:', e))
            .finally(() => setLoading(false));
    }, []);

    const format = (value: number, decimals?: number) => {
        const val = value * multiplier;
        if (decimals !== undefined) return `${symbol}${val.toFixed(decimals)}`;

        if (val === 0) return `${symbol}0.00`;
        if (Math.abs(val) >= 10) return `${symbol}${val.toFixed(2)}`;
        if (Math.abs(val) >= 1) return `${symbol}${val.toFixed(3)}`;
        if (Math.abs(val) >= 0.01) return `${symbol}${val.toFixed(4)}`;
        if (Math.abs(val) >= 0.001) return `${symbol}${val.toFixed(5)}`;
        return `${symbol}${val.toFixed(6)}`;
    };

    return { symbol, multiplier, format, loading };
}
