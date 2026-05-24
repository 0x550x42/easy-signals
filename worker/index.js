// ─── Signals Worker ───────────────────────────────────────────────
// Two entry points:
//   scheduled() — cron job, calls LLM, writes to KV
//   fetch()     — serves cached KV data to frontend instantly
//
// Env vars (set via wrangler secret):
//   LLM_PROVIDER  — "openai" | "claude" | "gemini" (default: openai)
//   LLM_API_KEY   — API key for the chosen provider
//   SIGNALS_KV    — KV namespace binding (set in wrangler.toml)

import { buildPrompt } from './prompt.js'
import { getProvider } from './providers.js'

const KV_KEY     = 'signals_v1'
const KV_TTL_SEC = 7 * 24 * 60 * 60  // keep for 7 days as safety net

// ─── CORS headers ─────────────────────────────────────────────────
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type':                 'application/json',
}

// ─── Call the LLM ─────────────────────────────────────────────────
async function fetchSignalsFromLLM(env) {
  const providerName = env.LLM_PROVIDER || 'openai'
  const apiKey       = env.LLM_API_KEY

  if (!apiKey) throw new Error(`LLM_API_KEY is not set. Run: npx wrangler secret put LLM_API_KEY`)

  const provider = getProvider(providerName)
  const prompt   = buildPrompt(new Date().toISOString().split('T')[0])

  console.log(`[signals] Calling ${provider.name}...`)

  const { url, headers, body } = provider.buildRequest(prompt, apiKey)
  const res  = await fetch(url, { method: 'POST', headers, body })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`${provider.name} API error ${res.status}: ${err}`)
  }

  const data   = await res.json()
  console.log('[LLM raw response]', JSON.stringify(data))
  const parsed = provider.parseResponse(data)

  // Validate shape
  if (!Array.isArray(parsed.signals) || parsed.signals.length === 0) {
    throw new Error('LLM returned invalid signal shape')
  }

  // Override LLM-generated timestamp with actual server time
  parsed.generatedAt = new Date().toISOString()

  console.log(`[signals] Got ${parsed.signals.length} signals from ${provider.name}`)
  return parsed
}

// ─── Cron handler — runs on schedule, updates KV ──────────────────
async function refreshSignals(env) {
  try {
    const data = await fetchSignalsFromLLM(env)
    await env.SIGNALS_KV.put(KV_KEY, JSON.stringify(data), { expirationTtl: KV_TTL_SEC })
    console.log(`[signals] KV updated at ${data.generatedAt}`)
    return data
  } catch (err) {
    console.error(`[signals] Refresh failed: ${err.message}`)
    throw err
  }
}

// ─── Fetch handler — serves KV to frontend ────────────────────────
export default {
  // Cron trigger
  async scheduled(event, env, ctx) {
    ctx.waitUntil(refreshSignals(env))
  },

  // HTTP requests from frontend
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS })
    }

    const path = new URL(request.url).pathname

    // Manual refresh endpoint — call this after first deploy to seed KV
    // POST /refresh  (protected by a simple secret token)
    if (path === '/refresh' && request.method === 'POST') {
      const token = request.headers.get('x-refresh-token')
      if (token !== env.REFRESH_TOKEN) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS })
      }
      try {
        const data = await refreshSignals(env)
        return new Response(JSON.stringify({ ok: true, generatedAt: data.generatedAt }), { status: 200, headers: CORS })
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS })
      }
    }

    // Main signals endpoint
    if (path !== '/signals') {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: CORS })
    }

    // Read from KV
    const cached = await env.SIGNALS_KV.get(KV_KEY)

    if (!cached) {
      // KV is empty — this only happens on very first deploy before cron runs
      return new Response(
        JSON.stringify({ error: 'Signals not yet generated. Trigger /refresh to seed data.' }),
        { status: 503, headers: CORS }
      )
    }

    return new Response(cached, {
      status: 200,
      headers: {
        ...CORS,
        'Cache-Control': 'public, max-age=300',  // browser cache 5min
      },
    })
  },
}
