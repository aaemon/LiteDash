import { NextResponse } from 'next/server';
import { getSession, litellmFetch, hasReadAccess } from '@/lib/litellm';

export async function POST(req: Request) {
    const session = await getSession();
    if (!session || !hasReadAccess(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    try {
        const body = await req.json();
        const { model, messages, guardrails } = body;
        if (!model || !messages?.length) {
            return NextResponse.json({ error: 'model and messages are required' }, { status: 400 });
        }

        const payload: any = { model, messages };
        if (guardrails?.length) {
            payload.guardrails = guardrails;
        }

        const data = await litellmFetch('/v1/chat/completions', {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        return NextResponse.json({
            success: true,
            response: data,
            guardrails_applied: guardrails || [],
        });
    } catch (err: any) {
        const isGuardrailBlock = err.message?.includes('guardrail') || err.message?.includes('Violated');
        return NextResponse.json({
            success: false,
            blocked: isGuardrailBlock,
            error: err.message,
        }, { status: isGuardrailBlock ? 200 : 500 });
    }
}
