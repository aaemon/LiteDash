'use client';

import { useState, useEffect } from 'react';

export default function APIDocsPage() {
    const [keys, setKeys] = useState<any[]>([]);
    const [baseUrl, setBaseUrl] = useState('');

    useEffect(() => {
        fetch('/api/settings').then(r => r.json()).then(d => {
            setBaseUrl(d.apiEndpoint || window.location.origin);
        }).catch(() => setBaseUrl(window.location.origin));
        fetch('/api/keys').then(r => r.json()).then(d => setKeys(d.keys || []));
    }, []);

    const endpoints = [
        {
            method: 'POST', path: '/v1/chat/completions', title: 'Chat Completions',
            description: 'Create a chat completion request. This is the primary endpoint for conversational AI.',
            body: `{
  "model": "gpt-oss-120b",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ],
  "temperature": 0.7,
  "max_tokens": 1000
}`,
            curl: (key: string) => `curl -X POST ${baseUrl || 'http://your-proxy'}/v1/chat/completions \\
  -H "Authorization: Bearer ${key || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-oss-120b",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`
        },
        {
            method: 'POST', path: '/v1/completions', title: 'Text Completions',
            description: 'Generate text completions for a given prompt.',
            body: `{
  "model": "gpt-oss-120b",
  "prompt": "Write a haiku about AI:",
  "max_tokens": 50
}`,
            curl: (key: string) => `curl -X POST ${baseUrl || 'http://your-proxy'}/v1/completions \\
  -H "Authorization: Bearer ${key || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "gpt-oss-120b", "prompt": "Hello"}'`
        },
        {
            method: 'POST', path: '/v1/embeddings', title: 'Embeddings',
            description: 'Generate vector embeddings for text input.',
            body: `{
  "model": "text-embedding-model",
  "input": "Your text to embed"
}`,
            curl: (key: string) => `curl -X POST ${baseUrl || 'http://your-proxy'}/v1/embeddings \\
  -H "Authorization: Bearer ${key || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "text-embedding-model", "input": "Hello"}'`
        },
        {
            method: 'GET', path: '/v1/models', title: 'List Models',
            description: 'List all available models on this LiteLLM instance.',
            body: null,
            curl: (key: string) => `curl ${baseUrl || 'http://your-proxy'}/v1/models \\
  -H "Authorization: Bearer ${key || 'YOUR_API_KEY'}"`
        },
        {
            method: 'POST', path: '/v1/images/generations', title: 'Image Generation',
            description: 'Generate images from text prompts.',
            body: `{
  "model": "dall-e-3",
  "prompt": "A sunset over mountains",
  "size": "1024x1024"
}`,
            curl: (key: string) => `curl -X POST ${baseUrl || 'http://your-proxy'}/v1/images/generations \\
  -H "Authorization: Bearer ${key || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "dall-e-3", "prompt": "A sunset"}'`
        },
        {
            method: 'POST', path: '/v1/audio/transcriptions', title: 'Audio Transcription',
            description: 'Transcribe audio files to text.',
            body: 'multipart/form-data with file and model fields',
            curl: (key: string) => `curl -X POST ${baseUrl || 'http://your-proxy'}/v1/audio/transcriptions \\
  -H "Authorization: Bearer ${key || 'YOUR_API_KEY'}" \\
  -F file=@audio.mp3 \\
  -F model=whisper-1`
        },
    ];

    const methodColors: Record<string, string> = { GET: '#22c55e', POST: '#4f6ef7', PUT: '#f59e0b', DELETE: '#ef4444' };

    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 style={{ marginBottom: '0.25rem' }}>API Documentation</h1>
                <p>Use your API key to access these OpenAI-compatible endpoints.</p>
            </header>

            {/* Quick Start */}
            <div className="glass-card" style={{ borderLeft: '3px solid var(--accent-primary)' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Quick Start</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500, marginBottom: '0.25rem' }}>Base URL</div>
                        <code style={{ display: 'block', padding: '0.5rem 0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', fontWeight: 500 }}>
                            {baseUrl || 'http://your-proxy-url'}/v1
                        </code>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500, marginBottom: '0.25rem' }}>Authentication</div>
                        <code style={{ display: 'block', padding: '0.5rem 0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}>
                            Authorization: Bearer YOUR_API_KEY
                        </code>
                    </div>
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500, marginBottom: '0.25rem' }}>Python (OpenAI SDK)</div>
                    <pre style={{ background: 'var(--bg-secondary)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5, overflow: 'auto' }}>{`from openai import OpenAI

client = OpenAI(
    base_url="${baseUrl || 'http://your-proxy'}/v1",
    api_key="YOUR_API_KEY"
)

response = client.chat.completions.create(
    model="gpt-oss-120b",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`}</pre>
                </div>
            </div>

            {/* Endpoints */}
            <div className="flex flex-col gap-4">
                {endpoints.map((ep, idx) => (
                    <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-sm)', color: '#fff', background: methodColors[ep.method] || 'var(--text-tertiary)' }}>{ep.method}</span>
                            <code style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{ep.path}</code>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{ep.description}</p>

                        {ep.body && typeof ep.body === 'string' && ep.body !== 'multipart/form-data with file and model fields' && (
                            <details>
                                <summary style={{ cursor: 'pointer', fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 500, padding: '0.15rem 0' }}>Request Body</summary>
                                <pre style={{ background: 'var(--bg-secondary)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', color: 'var(--text-secondary)', overflow: 'auto', lineHeight: 1.5 }}>{ep.body}</pre>
                            </details>
                        )}

                        <details>
                            <summary style={{ cursor: 'pointer', fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 500, padding: '0.15rem 0' }}>cURL Example</summary>
                            <pre style={{ background: 'var(--bg-secondary)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.68rem', color: 'var(--text-secondary)', overflow: 'auto', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{ep.curl('YOUR_API_KEY')}</pre>
                        </details>
                    </div>
                ))}
            </div>
        </div>
    );
}
