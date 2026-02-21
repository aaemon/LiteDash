import { NextResponse } from 'next/server';
import { getSession, litellmFetch } from '@/lib/litellm';

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    try {
        // Fetch both MCP servers and MCP tools
        const [servers, tools] = await Promise.all([
            litellmFetch('/v1/mcp/server').catch(() => []),
            litellmFetch('/mcp/tools/list').catch(() => ({ tools: [] })),
        ]);
        return NextResponse.json({
            servers: Array.isArray(servers) ? servers : [],
            tools: tools?.tools || tools || [],
        });
    } catch (err: any) {
        return NextResponse.json({ servers: [], tools: [] });
    }
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    try {
        const body = await req.json();
        const data = await litellmFetch('/v1/mcp/server', {
            method: 'POST',
            body: JSON.stringify(body),
        });
        return NextResponse.json({ server: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    try {
        const body = await req.json();
        const data = await litellmFetch('/v1/mcp/server', {
            method: 'PUT',
            body: JSON.stringify(body),
        });
        return NextResponse.json({ server: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    try {
        const { server_id } = await req.json();
        await litellmFetch(`/v1/mcp/server/${server_id}`, { method: 'DELETE' });
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
