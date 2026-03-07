import { NextResponse } from 'next/server';
import { getSession, hasWriteAccess } from '@/lib/litellm';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({
        role: session.role,
        userId: session.userId,
        isViewer: !hasWriteAccess(session.role)
    });
}
