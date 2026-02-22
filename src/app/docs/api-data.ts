export interface APIEndpoint {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    summary: string;
    description: string;
    tag: string;
    body?: any;
    responses: any;
}

export const API_CATEGORIES = [
    { id: 'chat', name: 'Chat & Completions', icon: '💬' },
    { id: 'models', name: 'Model Management', icon: '🤖' },
    { id: 'embeddings', name: 'Embeddings', icon: '🧠' },
    { id: 'batch', name: 'Batch Processing', icon: '📦' },
    { id: 'audio', name: 'Audio & Vision', icon: '🎧' },
    { id: 'utils', name: 'Utilities', icon: '🛠️' },
];

export const API_DATA: APIEndpoint[] = [
    {
        tag: 'chat',
        method: 'POST',
        path: '/v1/chat/completions',
        summary: 'Chat Completion',
        description: "Creates a model response for the given chat conversation. Follows OpenAI's Chat API specification.",
        body: {
            model: "string (required)",
            messages: "array (required)",
            temperature: "number (optional)",
            stream: "boolean (optional)",
            max_tokens: "integer (optional)"
        },
        responses: {
            200: "ChatCompletionResponse",
            401: "AuthenticationError"
        }
    },
    {
        tag: 'models',
        method: 'GET',
        path: '/models',
        summary: 'List Models',
        description: "Retrieve a list of models available to your API key. Compatible with OpenAI's model list endpoint.",
        responses: {
            200: "ListModelsResponse"
        }
    },
    {
        tag: 'models',
        method: 'GET',
        path: '/model/info',
        summary: 'Model Info',
        description: "Provides detailed information about models, including pricing, providers, and capabilities.",
        responses: {
            200: "ModelInfoResponse"
        }
    },
    {
        tag: 'embeddings',
        method: 'POST',
        path: '/v1/embeddings',
        summary: 'Create Embeddings',
        description: "Creates an embedding vector representing the input text.",
        body: {
            model: "string (required)",
            input: "string or array (required)"
        },
        responses: {
            200: "EmbeddingResponse"
        }
    },
    {
        tag: 'batch',
        method: 'POST',
        path: '/v1/batches',
        summary: 'Create Batch',
        description: "Creates a new batch for asynchronous processing of multiple requests.",
        body: {
            input_file_id: "string (required)",
            endpoint: "string (required)",
            completion_window: "string (required)"
        },
        responses: {
            201: "BatchResponse"
        }
    },
    {
        tag: 'audio',
        method: 'POST',
        path: '/v1/audio/transcriptions',
        summary: 'Audio Transcription',
        description: "Transcribes audio into a representative text format.",
        body: {
            file: "file (required)",
            model: "string (required)"
        },
        responses: {
            200: "TranscriptionResponse"
        }
    },
    {
        tag: 'utils',
        method: 'POST',
        path: '/utils/token_counter',
        summary: 'Token Counter',
        description: "Utility endpoint to count tokens for a specific model without calling the LLM provider.",
        body: {
            model: "string",
            messages: "array"
        },
        responses: {
            200: "TokenCountResponse"
        }
    }
];
