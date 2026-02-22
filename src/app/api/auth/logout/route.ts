import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    const c = await cookies();
    c.delete('portal_session');

    // Use a relative redirect to /login
    // Next.js NextResponse.redirect requires an absolute URL, 
    // but the URL constructor with req.url origin is safe if the host is correct.
    // If req.url has 0.0.0.0, we can try to use the host header.

    const host = req.headers.get('host') || new URL(req.url).host;
    const protocol = req.headers.get('x-forwarded-proto') || (req.url.startsWith('https') ? 'https' : 'http');
    const loginUrl = new URL('/login', `${protocol}://${host}`);

    return NextResponse.redirect(loginUrl);
}
