import { NextResponse } from 'next/server';
import { getSession, litellmFetch } from '@/lib/litellm';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        // If admin, we could fetch all keys. 
        // For now, we fetch keys belonging to the logged-in user. Let's assume /user/info returns keys.
        const userInfo = await litellmFetch(`/user/info?user_id=${session.userId}`);

        // Fallback if keys are not directly in userInfo
        const keys = userInfo?.keys || userInfo?.models || [];
        return NextResponse.json({ keys });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { name } = await req.json();

        // Create a new API key associated with the user
        const data = await litellmFetch('/key/generate', {
            method: 'POST',
            body: JSON.stringify({
                user_id: session.userId,
                key_alias: name,
                // models: can be specified or leave empty for all allowed models
            }),
        });

        return NextResponse.json({ key: data.key, alias: data.key_alias, token: data.token });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { key } = await req.json();

        // LiteLLM API to disable/delete a key
        await litellmFetch('/key/delete', {
            method: 'POST',
            body: JSON.stringify({
                keys: [key]
            })
        });
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
