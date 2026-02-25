import { NextResponse } from 'next/server';
import { getSession, litellmFetch } from '@/lib/litellm';

export async function PUT(req: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { password } = await req.json();

        if (!password) {
            return NextResponse.json({ error: 'Password is required' }, { status: 400 });
        }

        const bodyReq: any = {
            user_id: session.userId,
            password: password,
        };

        const data = await litellmFetch('/user/update', {
            method: 'POST',
            body: JSON.stringify(bodyReq),
        });

        return NextResponse.json({ user: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
