export const GUARDRAIL_PROVIDERS = [
    {
        category: 'Content Safety & Moderation',
        providers: [
            { id: 'aporia', name: 'Aporia', icon: '🛡️', description: 'AI guardrails for prompt injection, PII detection, toxicity, and hallucination prevention.', modes: ['pre_call', 'post_call', 'during_call'], requiresKey: true, requiresBase: true, fields: [] },
            { id: 'lakera', name: 'Lakera AI', icon: '🔒', description: 'Prompt injection detection, data leakage prevention, and content moderation.', modes: ['pre_call', 'during_call'], requiresKey: true, requiresBase: false, fields: [] },
            { id: 'openai_moderation', name: 'OpenAI Moderation', icon: '🤖', description: 'OpenAI\'s built-in content moderation for hate, violence, sexual content, and self-harm.', modes: ['pre_call', 'post_call'], requiresKey: true, requiresBase: false, fields: [] },
            {
                id: 'bedrock', name: 'AWS Bedrock Guardrails', icon: '☁️', description: 'Amazon Bedrock content filtering, PII detection, denied topics, and word filters.', modes: ['pre_call', 'post_call', 'during_call'], requiresKey: true, requiresBase: true, fields: [
                    { name: 'guardrailIdentifier', label: 'Guardrail ID', type: 'text', placeholder: 'e.g. abc123' },
                    { name: 'guardrailVersion', label: 'Guardrail Version', type: 'text', placeholder: 'e.g. 1' },
                ]
            },
        ]
    },
    {
        category: 'PII & Data Protection',
        providers: [
            {
                id: 'presidio', name: 'Presidio (PII/PHI Masking)', icon: '🔐', description: 'Microsoft Presidio for PII detection and masking — credit cards, emails, SSNs, phone numbers, and more.', modes: ['pre_call', 'post_call'], requiresKey: false, requiresBase: false, fields: [
                    { name: 'presidio_language', label: 'Language', type: 'text', placeholder: 'en' },
                ]
            },
            { id: 'hide-secrets', name: 'Secret Detection', icon: '🕵️', description: 'Detect and redact API keys, tokens, passwords, and other secrets in prompts. (Enterprise)', modes: ['pre_call'], requiresKey: false, requiresBase: false, fields: [] },
        ]
    },
    {
        category: 'AI Safety Platforms',
        providers: [
            { id: 'aim', name: 'Aim Security', icon: '🎯', description: 'Enterprise AI security platform with content filtering and threat detection.', modes: ['pre_call', 'post_call'], requiresKey: true, requiresBase: true, fields: [] },
            { id: 'pangea', name: 'Pangea AI Guard', icon: '🌍', description: 'Security services for AI applications including content moderation and threat intelligence.', modes: ['pre_call', 'post_call'], requiresKey: true, requiresBase: true, fields: [] },
            {
                id: 'guardrails_ai', name: 'Guardrails AI', icon: '🏗️', description: 'Validate LLM outputs with custom validators — format checking, toxicity, regex, and more.', modes: ['post_call'], requiresKey: false, requiresBase: false, fields: [
                    { name: 'guard_name', label: 'Guard Name', type: 'text', placeholder: 'e.g. my_guard' },
                ]
            },
        ]
    },
    {
        category: 'Enterprise & Advanced',
        providers: [
            { id: 'generic_guardrail_api', name: 'Generic Guardrail API', icon: '🔌', description: 'Connect any guardrail service via a standard API interface. Supports static and dynamic headers.', modes: ['pre_call', 'post_call'], requiresKey: true, requiresBase: true, fields: [] },
            {
                id: 'custom', name: 'Custom Guardrail', icon: '⚙️', description: 'Write your own Python guardrail class with pre_call, post_call, and streaming hooks.', modes: ['pre_call', 'post_call', 'during_call'], requiresKey: false, requiresBase: false, fields: [
                    { name: 'callback_path', label: 'Callback Path', type: 'text', placeholder: 'e.g. custom_guardrail.myGuardrail' },
                ]
            },
        ]
    },
];

export const ALL_MODES = ['pre_call', 'post_call', 'during_call', 'logging_only'] as const;
export const CATEGORIES = ['All', ...GUARDRAIL_PROVIDERS.map(c => c.category)];

export const MODE_COLORS: Record<string, string> = {
    pre_call: '#4f6ef7',
    post_call: '#22c55e',
    during_call: '#f59e0b',
    logging_only: '#8b5cf6',
};

export const CONFIG_EXAMPLES = {
    basic: `guardrails:
  - guardrail_name: "my-guardrail"
    litellm_params:
      guardrail: aporia
      mode: "pre_call"
      api_key: os.environ/APORIA_API_KEY
      api_base: os.environ/APORIA_API_BASE
      default_on: true`,
    presidio: `guardrails:
  - guardrail_name: "presidio-pii"
    litellm_params:
      guardrail: presidio
      mode: "pre_call"
      presidio_language: "en"
      pii_entities_config:
        CREDIT_CARD: "MASK"
        EMAIL_ADDRESS: "MASK"
        US_SSN: "MASK"
      presidio_score_thresholds:
        CREDIT_CARD: 0.8
        EMAIL_ADDRESS: 0.6`,
    multiMode: `guardrails:
  - guardrail_name: "safety-guard"
    litellm_params:
      guardrail: aporia
      mode: [pre_call, post_call]
      api_key: os.environ/APORIA_API_KEY
      api_base: os.environ/APORIA_API_BASE
      default_on: true
    guardrail_info:
      params:
        - name: "toxicity_score"
          type: "float"
          description: "Score 0-1 for content toxicity"
        - name: "pii_detection"
          type: "boolean"`,
    custom: `guardrails:
  - guardrail_name: "my-custom-guard"
    litellm_params:
      guardrail: custom_guardrail.myGuardrail
      mode: "pre_call"
      default_on: false`,
};

export function generateYaml(config: {
    guardrail_name: string;
    guardrail: string;
    mode: string[];
    api_key?: string;
    api_base?: string;
    default_on: boolean;
    extra_fields?: Record<string, string>;
}): string {
    const modeVal = config.mode.length === 1
        ? `"${config.mode[0]}"`
        : `[${config.mode.join(', ')}]`;

    let yaml = `guardrails:\n  - guardrail_name: "${config.guardrail_name}"\n    litellm_params:\n      guardrail: ${config.guardrail}\n      mode: ${modeVal}`;

    if (config.api_key) yaml += `\n      api_key: ${config.api_key}`;
    if (config.api_base) yaml += `\n      api_base: ${config.api_base}`;
    if (config.default_on) yaml += `\n      default_on: true`;
    if (config.extra_fields) {
        for (const [k, v] of Object.entries(config.extra_fields)) {
            if (v) yaml += `\n      ${k}: ${v}`;
        }
    }
    return yaml;
}
