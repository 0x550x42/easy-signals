# easy-signals — Claude Code Context

## What this app is
Plain-language Indian market signals dashboard. Gives YES / WAIT / NO answers
to everyday financial decisions. Target audience: first-time investors and
household decision makers with no market knowledge.

## Live URLs
- Frontend: https://signals-app.pages.dev
- Worker: https://signals-worker.ud0103.workers.dev

## Stack
- Frontend: Vanilla HTML + CSS + JS → Cloudflare Pages
- Backend: Cloudflare Worker (cron every 6h) → calls LLM → writes JSON to KV
- Cache: Cloudflare KV (key: signals_v1)
- Frontend reads from KV only — never triggers LLM calls directly

## Key files
- `worker/prompt.js` — master LLM prompt, single source of truth for all signals
- `worker/providers.js` — OpenAI / Claude / Gemini adapter layer
- `worker/index.js` — cron handler + fetch handler + /refresh endpoint
- `worker/wrangler.toml` — cron schedule, KV binding, observability config
- `frontend/app.js` — fetches /signals, renders all cards
- `frontend/index.html` — app shell
- `frontend/style.css` — dark theme, card layout

## Signal IDs (must match exactly in prompt and frontend)
gold, silver, goldScheme, nifty, crypto, fd,
personalLoan, realEstate, petrolCar, dieselCar, electricCar, hybridCar,
domesticTravel, inrStrength,
healthInsurance, termInsurance, carInsurance, twoWheelerInsurance, homeInsurance

## Worker endpoints
- GET  /signals — returns cached KV JSON
- POST /refresh — triggers immediate LLM refresh (header: x-refresh-token)

## Deploy commands
```bash
cd worker && npx wrangler deploy
curl -X POST https://signals-worker.ud0103.workers.dev/refresh \
  -H "x-refresh-token: YOUR_TOKEN"
```

## Conventions
- Read the file from repo before making any changes
- Return only the changed file, no explanations unless asked
- One task at a time
- After worker changes: remind to run wrangler deploy + curl /refresh

---

## Todo list

### Token Optimisation
- [x] `worker/prompt.js` — remove verbose example JSON, replace with compact
      schema definition, tighten rules section by ~40%
- [x] `worker/prompt.js` — add word limits: reason max 20 words, hint max 12 words
- [x] `worker/providers.js` — lower max_tokens from 2500 to 1200
- [x] `worker/prompt.js` + `frontend/app.js` — drop priceLabel field from prompt
      schema, infer label from signal id in frontend instead
- [x] `worker/providers.js` — switch model from gpt-4o to gpt-4o-mini

### UI
- [x] `frontend/index.html` + `frontend/app.js` — remove refresh button from header
- [x] `frontend/app.js` — replace "Updated at [browser time]" with
      "Signals last refreshed: [KV write time]" using data.generatedAt

### Logging
- [x] `worker/index.js` — add console.log('[LLM raw response]', JSON.stringify(data))
      after res.json() and before provider.parseResponse(data)