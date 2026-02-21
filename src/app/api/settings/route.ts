import { NextResponse } from 'next/server';
import { getSession } from '@/lib/litellm';
import fs from 'fs';
import path from 'path';

const SETTINGS_PATH = path.join(process.cwd(), 'config', 'settings.json');

function readSettings() {
    try {
        const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return { appName: 'LiteLLM Portal', apiEndpoint: '', logoUrl: '', currency: 'USD', currencySymbol: '$', currencyMultiplier: 1 };
    }
}

function writeSettings(data: any) {
    const dir = path.dirname(SETTINGS_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(data, null, 2));
}

// Public GET — no auth required (used by login page for branding)
export async function GET() {
    return NextResponse.json(readSettings());
}

// Admin-only PUT — update settings
export async function PUT(req: Request) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    try {
        const updates = await req.json();
        const current = readSettings();
        const merged = { ...current, ...updates };
        writeSettings(merged);
        return NextResponse.json(merged);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
