import { NextResponse } from 'next/server';
import { getSession, litellmFetch } from '@/lib/litellm';

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    try {
        const data = await litellmFetch('/model/info');
        return NextResponse.json({ models: data.data || [] });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    try {
        const { model_name, litellm_params, model_info } = await req.json();
        const data = await litellmFetch('/model/new', {
            method: 'POST',
            body: JSON.stringify({ model_name, litellm_params, model_info: model_info || {} })
        });
        return NextResponse.json({ model: data });
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
        const { id } = await req.json();
        const data = await litellmFetch('/model/delete', {
            method: 'POST',
            body: JSON.stringify({ id })
        });
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
