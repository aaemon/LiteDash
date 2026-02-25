import { NextResponse } from 'next/server';
import { getSession, litellmFetch } from '@/lib/litellm';

export async function DELETE(req: Request) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    try {
        const { user_id } = await req.json();
        await litellmFetch('/user/delete', { method: 'POST', body: JSON.stringify({ user_ids: [user_id] }) });
        return NextResponse.json({ success: true });
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
        const { user_id, max_budget, password, email, models, tpm_limit, rpm_limit, metadata, role } = await req.json();

        const bodyReq: any = { user_id };
        if (role) bodyReq.user_role = role;
        if (max_budget !== undefined) bodyReq.max_budget = max_budget ? parseFloat(max_budget) : null;
        if (password) bodyReq.password = password;
        if (email !== undefined) bodyReq.user_email = email || null;
        if (models !== undefined) bodyReq.models = models ? models.split(',').map((m: string) => m.trim()).filter(Boolean) : [];
        if (tpm_limit !== undefined) bodyReq.tpm_limit = tpm_limit ? parseInt(tpm_limit) : null;
        if (rpm_limit !== undefined) bodyReq.rpm_limit = rpm_limit ? parseInt(rpm_limit) : null;

        let meta: any = {};
        if (metadata) {
            try { meta = JSON.parse(metadata); } catch { meta = { note: metadata }; }
        }
        if (password) meta.ui_password = password;
        if (Object.keys(meta).length > 0) bodyReq.metadata = meta;

        const data = await litellmFetch('/user/update', { method: 'POST', body: JSON.stringify(bodyReq) });
        return NextResponse.json({ user: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
