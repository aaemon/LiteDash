import { cookies } from 'next/headers';

function getResolvedBaseUrl() {
    return process.env.LITELLM_URL || 'http://localhost:4000';
}

function getMasterKey() {
    return process.env.LITELLM_MASTER_KEY || '';
}

export async function litellmFetch(endpoint: string, options: RequestInit = {}) {
    const baseUrl = getResolvedBaseUrl();
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers = new Headers(options.headers);
    if (!headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${getMasterKey()}`);
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
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`[LiteLLM] Fetch Failed at ${url}:`, error.message);
        // Add additional logging for debugging connectivity/API issues
        console.error(`[LiteLLM] Request details: URL=${url}, Method=${options.method || 'GET'}, Headers=${JSON.stringify(Object.fromEntries(headers.entries()))}`);
        if (options.body) {
            console.error(`[LiteLLM] Request body: ${options.body}`);
        }
        throw error;
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

export function isGlobalAdmin(role: string): boolean {
    return ['admin', 'proxy_admin', 'proxy_admin_viewer'].includes(role);
}

export function hasReadAccess(role: string): boolean {
    return isGlobalAdmin(role) || ['internal_user', 'internal_viewer'].includes(role);
}

export function hasWriteAccess(role: string): boolean {
    return ['admin', 'proxy_admin', 'internal_user'].includes(role);
}
