import { cookies } from 'next/headers';

const LITELLM_URL = process.env.LITELLM_URL || 'http://localhost:4000';
const LITELLM_MASTER_KEY = process.env.LITELLM_MASTER_KEY || '';

export async function litellmFetch(endpoint: string, options: RequestInit = {}) {
    const url = `${LITELLM_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers = new Headers(options.headers);
    if (!headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${LITELLM_MASTER_KEY}`);
    }
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const res = await fetch(url, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || errorData.message || `LiteLLM API Error: ${res.statusText}`);
    }

    return res.json();
}

/** 
 * Simple session handling.
 * In a real app, use JWT or a secure session store. 
 */
export async function getSession() {
    const c = await cookies();
    const session = c.get('portal_session')?.value;
    if (!session) return null;
    try {
        return JSON.parse(session);
    } catch {
        return null;
    }
}
