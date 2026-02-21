import { NextResponse } from 'next/server';
import { getSession, litellmFetch } from '@/lib/litellm';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const userInfo = await litellmFetch(`/user/info?user_id=${session.userId}`);

        return NextResponse.json({
            spend: userInfo?.user_info?.spend || 0,
            max_budget: userInfo?.user_info?.max_budget || null,
            team_id: userInfo?.user_info?.team_id || null,
            models: userInfo?.user_info?.models || [],
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
