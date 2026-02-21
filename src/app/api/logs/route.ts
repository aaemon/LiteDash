import { NextResponse } from 'next/server';
import { getSession, litellmFetch } from '@/lib/litellm';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const data = await litellmFetch(`/spend/logs`);
        const allLogs = Array.isArray(data) ? data : (data?.logs || []);

        const userLogs = session.role === 'admin'
            ? allLogs
            : allLogs.filter((log: any) => log.api_key_user_id === session.userId || log.user === session.userId);

        const sortedLogs = userLogs.sort((a: any, b: any) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

        return NextResponse.json({ logs: sortedLogs });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
