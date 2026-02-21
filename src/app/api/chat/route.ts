import { NextResponse } from 'next/server';
import { getSession } from '@/lib/litellm';

const LITELLM_URL = process.env.LITELLM_URL || 'http://localhost:4000';

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { apiKey, model, messages } = await req.json();

        if (!apiKey) return NextResponse.json({ error: 'API Key is required to test' }, { status: 400 });
        if (!model) return NextResponse.json({ error: 'Model is required' }, { status: 400 });
        if (!messages || !messages.length) return NextResponse.json({ error: 'Messages are required' }, { status: 400 });

        const url = `${LITELLM_URL}/v1/chat/completions`;

        // We send the user's generated API key so they can actually test that it works!
        const headers = new Headers({
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        });

        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model,
                messages
            })
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: data.error?.message || data.message || `Error: ${res.statusText}` }, { status: res.status });
        }

        return NextResponse.json({ result: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
