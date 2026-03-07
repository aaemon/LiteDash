import { NextResponse } from 'next/server';
import { getSession, litellmFetch, isGlobalAdmin } from '@/lib/litellm';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        // Fetch logs and user list in parallel for enrichment
        const [logsData, usersData] = await Promise.all([
            litellmFetch(`/spend/logs`),
            isGlobalAdmin(session.role) ? litellmFetch('/user/list').catch(() => ({ users: [] })) : Promise.resolve({ users: [] })
        ]);

        const allLogs = Array.isArray(logsData) ? logsData : (logsData?.logs || []);
        const users = usersData?.users || [];
        const emailMap: Record<string, string> = {};
        users.forEach((u: any) => { if (u.user_id && u.user_email) emailMap[u.user_id] = u.user_email; });

        const userLogs = isGlobalAdmin(session.role)
            ? allLogs
            : allLogs.filter((log: any) => log.api_key_user_id === session.userId || log.user === session.userId);

        const enrichedLogs = userLogs.map((log: any) => ({
            ...log,
            user_email: emailMap[log.user] || emailMap[log.api_key_user_id] || null,
            spend: log.spend || log.metadata?.cost_breakdown?.total_cost || 0,
            startTime: log.startTime || log.start_time || new Date().toISOString()
        }));

        const sortedLogs = enrichedLogs.sort((a: any, b: any) => new Date(b.startTime || b.start_time).getTime() - new Date(a.startTime || a.start_time).getTime());

        return NextResponse.json({ logs: sortedLogs });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
