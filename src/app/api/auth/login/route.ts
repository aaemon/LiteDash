import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { litellmFetch } from '@/lib/litellm';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        const adminUser = process.env.LITELLM_UI_USERNAME || 'admin';
        const adminPass = process.env.LITELLM_UI_PASSWORD || '';

        let sessionData = null;

        if (username === adminUser && password === adminPass) {
            sessionData = {
                role: 'admin',
                userId: 'admin',
            };
        } else {
            // For standard users, we'll verify if the user exists in LiteLLM
            // In a real scenario, this would check against a DB for a hashed password
            // Since LiteLLM user management only uses userId without a password natively, 
            // we'll authenticate if the password matches a static demo password 'user123' 
            // AND the userId exists. For true prod, a separate DB should store passwords.

            try {
                const userInfo = await litellmFetch(`/user/info?user_id=${username}`);
                if (!userInfo || !userInfo.user_id) {
                    return NextResponse.json({ error: 'User does not exist' }, { status: 401 });
                }

                // Check priority:
                // 1. Native LiteLLM password field (hashed or plain)
                // 2. Custom ui_password stored in user_info.metadata
                // 3. Fallback to user_email (where we accidentally stored passwords before)
                // 4. Default 'user123' logic
                const nativePassword = userInfo.user_info?.password;
                const metadataPassword = userInfo.user_info?.metadata?.ui_password;
                const legacyPassword = userInfo.user_info?.user_email;

                const isValid = password === 'user123' ||
                    (nativePassword && password === nativePassword) ||
                    (metadataPassword && password === metadataPassword) ||
                    (legacyPassword && password === legacyPassword);

                if (!isValid) {
                    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
                }

                sessionData = {
                    role: 'user',
                    userId: userInfo.user_id,
                };
            } catch (err: any) {
                return NextResponse.json({ error: err.message || 'User does not exist' }, { status: 401 });
            }
        }

        const c = await cookies();
        const isSecure = req.headers.get('x-forwarded-proto') === 'https' || req.url.startsWith('https://');

        c.set('portal_session', JSON.stringify(sessionData), {
            httpOnly: true,
            secure: isSecure, // Only true if accessed via HTTPS or behind an HTTPS proxy
            maxAge: 60 * 60 * 24, // 1 day
            path: '/'
        });

        return NextResponse.json({ success: true, role: sessionData.role });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Authentication failed' }, { status: 500 });
    }
}
