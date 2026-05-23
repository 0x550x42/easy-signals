// ─── LLM Provider Registry ────────────────────────────────────────
// To switch providers: change LLM_PROVIDER env var in wrangler.toml
// or via: npx wrangler secret put LLM_PROVIDER
//
// Supported values: "openai" | "claude" | "gemini"
// Default: "openai"

// ─── OpenAI (GPT-4o with web search) ─────────────────────────────
const openai = {
  name: 'OpenAI GPT-4o',

  buildRequest(prompt, apiKey) {
    return {
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        // Web search via OpenAI tools
        tools: [{
          type: 'function',
          function: {
            name: 'search',
            description: 'Search the web for current information',
            parameters: {
              type: 'object',
              properties: { query: { type: 'string' } },
              required: ['query'],
            },
          },
        }],
      }),
    }
  },

  parseResponse(data) {
    const content = data.choices?.[0]?.message?.content
    if (!content) throw new Error('OpenAI: empty response')
    return JSON.parse(content)
  },
}

// ─── Anthropic Claude (with web search tool) ──────────────────────
const claude = {
  name: 'Anthropic Claude',

  buildRequest(prompt, apiKey) {
    return {
      url: 'https://api.anthropic.com/v1/messages',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        tools: [{
          type: 'web_search_20250305',
          name: 'web_search',
        }],
        messages: [{ role: 'user', content: prompt }],
      }),
    }
  },

  parseResponse(data) {
    // Claude may return multiple content blocks (text + tool_use)
    // Find the last text block which contains the final JSON response
    const textBlocks = data.content?.filter(b => b.type === 'text')
    const last = textBlocks?.[textBlocks.length - 1]?.text
    if (!last) throw new Error('Claude: no text block in response')
    // Strip any accidental markdown fences
    const clean = last.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  },
}

// ─── Google Gemini (with grounding / web search) ──────────────────
const gemini = {
  name: 'Google Gemini',

  buildRequest(prompt, apiKey) {
    return {
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} }],  // Gemini grounding with Google Search
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    }
  },

  parseResponse(data) {
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new Error('Gemini: empty response')
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  },
}

// ─── Provider map ─────────────────────────────────────────────────
const PROVIDERS = { openai, claude, gemini }

export function getProvider(name = 'openai') {
  const provider = PROVIDERS[name.toLowerCase()]
  if (!provider) throw new Error(`Unknown LLM provider: "${name}". Use: openai, claude, gemini`)
  return provider
}
