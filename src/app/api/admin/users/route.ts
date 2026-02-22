import { NextResponse } from 'next/server';
import { getSession, litellmFetch } from '@/lib/litellm';

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const data = await litellmFetch('/user/list');
        return NextResponse.json({ users: data.users || [] });
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
        const { user_id, max_budget, password, email, models, tpm_limit, rpm_limit, metadata } = await req.json();

        const body: any = {
            user_id,
            max_budget: max_budget ? parseFloat(max_budget) : null,
            user_email: email || null,
            password: password || null,
            auto_create_key: false,
        };

        if (models) body.models = models.split(',').map((m: string) => m.trim()).filter(Boolean);
        if (tpm_limit) body.tpm_limit = parseInt(tpm_limit);
        if (rpm_limit) body.rpm_limit = parseInt(rpm_limit);

        // Build metadata with ui_password fallback
        let meta: any = {};
        if (metadata) {
            try { meta = JSON.parse(metadata); } catch { meta = { note: metadata }; }
        }
        if (password) meta.ui_password = password;
        if (Object.keys(meta).length > 0) body.metadata = meta;

        const data = await litellmFetch('/user/new', {
            method: 'POST',
            body: JSON.stringify(body)
        });

        return NextResponse.json({ user: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
