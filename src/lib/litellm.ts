import { cookies } from 'next/headers';

const LITELLM_URL = process.env.LITELLM_URL || 'http://localhost:4000';
const LITELLM_MASTER_KEY = process.env.LITELLM_MASTER_KEY || '';

function getResolvedBaseUrl() {
    return LITELLM_URL;
}

export async function litellmFetch(endpoint: string, options: RequestInit = {}) {
    const url = `${LITELLM_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers = new Headers(options.headers);
    if (!headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${LITELLM_MASTER_KEY}`);
    }
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    try {
        const res = await fetch(url, {
            ...options,
            headers,
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const msg = errorData.error?.message || errorData.message || `LiteLLM API Error: ${res.statusText}`;
            console.error(`[LiteLLM] Error ${res.status} at ${endpoint}:`, msg);
            throw new Error(msg);
        }

        return res.json();
    } catch (err: any) {
        console.error(`[LiteLLM] Fetch Failed at ${url}:`, err.message);
        // Add additional logging for debugging connectivity/API issues
        console.error(`[LiteLLM] Request details: URL=${url}, Method=${options.method || 'GET'}, Headers=${JSON.stringify(Object.fromEntries(headers.entries()))}`);
        if (options.body) {
            console.error(`[LiteLLM] Request body: ${options.body}`);
        }
        throw err;
    }
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
