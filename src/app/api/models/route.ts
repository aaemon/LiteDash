import { NextResponse } from 'next/server';
import { getSession, litellmFetch } from '@/lib/litellm';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        // Fetch /v1/models for the base list and /v1/model/info for pricing details
        const [modelsRes, infoRes] = await Promise.all([
            litellmFetch(`/v1/models`),
            litellmFetch(`/v1/model/info`)
        ]);

        const models = modelsRes.data || [];
        const modelInfoList = infoRes.data || [];

        // Merge pricing data
        const enrichedModels = models.map((model: any) => {
            const info = modelInfoList.find((i: any) => i.model_name === model.id);
            return {
                ...model,
                input_cost_per_token: info?.model_info?.input_cost_per_token || 0,
                output_cost_per_token: info?.model_info?.output_cost_per_token || 0,
            };
        });

        return NextResponse.json({ models: enrichedModels });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
