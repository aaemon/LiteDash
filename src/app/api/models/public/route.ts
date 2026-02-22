import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export async function GET() {
    try {
        const configPath = path.join(process.cwd(), 'litellm-config.yaml');
        const fileContents = fs.readFileSync(configPath, 'utf8');
        const config = yaml.load(fileContents) as any;

        const models = (config.model_list || []).map((m: any) => ({
            name: m.model_name,
            provider: m.litellm_params?.model?.split('/')[0] || 'Custom',
            input_cost_1m: (m.model_info?.input_cost_per_token || 0) * 1000000,
            output_cost_1m: (m.model_info?.output_cost_per_token || 0) * 1000000,
            desc: m.model_info?.description || `High-performance model: ${m.model_name}`
        }));

        return NextResponse.json({ models });
    } catch (error: any) {
        console.error('[Public Model API] Error:', error);
        return NextResponse.json({ error: 'Failed to load model pricing' }, { status: 500 });
    }
}
