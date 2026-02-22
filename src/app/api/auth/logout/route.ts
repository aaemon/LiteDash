import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    const c = await cookies();
    c.delete('portal_session');

    const url = new URL(req.url);
    const loginUrl = new URL('/login', url.origin);

    return NextResponse.redirect(loginUrl);
}
