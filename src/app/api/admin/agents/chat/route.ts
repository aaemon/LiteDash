import { NextResponse } from 'next/server';
import { getSession, litellmFetch, hasReadAccess } from '@/lib/litellm';

export async function POST(req: Request) {
    const session = await getSession();
    if (!session || !hasReadAccess(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { model, messages, temperature, top_p, max_tokens, frequency_penalty, presence_penalty, stop, response_format, guardrails } = await req.json();

        const body: any = {
            model,
            messages,
        };
        if (temperature !== undefined) body.temperature = parseFloat(temperature);
        if (top_p !== undefined) body.top_p = parseFloat(top_p);
        if (max_tokens !== undefined) body.max_tokens = parseInt(max_tokens);
        if (frequency_penalty !== undefined) body.frequency_penalty = parseFloat(frequency_penalty);
        if (presence_penalty !== undefined) body.presence_penalty = parseFloat(presence_penalty);
        if (stop) body.stop = stop.split(',').map((s: string) => s.trim()).filter(Boolean);
        if (response_format && response_format !== 'text') {
            body.response_format = { type: response_format };
        }

        // If guardrails are specified, add metadata
        if (guardrails && guardrails.length > 0) {
            body.metadata = { guardrails: guardrails };
        }

        const data = await litellmFetch('/v1/chat/completions', {
            method: 'POST',
            body: JSON.stringify(body),
        });

        return NextResponse.json(data);
    } catch (err: any) {
        const msg = err.message || 'Failed to run agent';
        // Check for guardrail blocks
        if (msg.includes('guardrail') || msg.includes('Guardrail')) {
            return NextResponse.json({ error: msg, blocked: true }, { status: 400 });
        }
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
