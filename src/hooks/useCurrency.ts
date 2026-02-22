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

    const format = (value: number, decimals = 4) => {
        return `${symbol}${Number(value * multiplier).toFixed(decimals)}`;
    };

    return { symbol, multiplier, format, loading };
}
