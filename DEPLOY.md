# Deployment Guide — signals.bugsandbots.com

## Architecture
- Cloudflare Cron (every 6h) → calls LLM → writes signals to KV
- Frontend → reads from KV instantly — never triggers an LLM call
- Provider swap: change one env var, zero code changes

## Step 1 — Cloudflare account
Sign up free at cloudflare.com.

---

## Step 2 — Point GoDaddy to Cloudflare (one-time)
1. Cloudflare Dashboard → Add Site → bugsandbots.com → Free plan
2. Copy the 2 nameservers Cloudflare gives you
3. GoDaddy → My Domains → bugsandbots.com → DNS → Nameservers → Custom
4. Paste Cloudflare nameservers → Save
5. Wait 10–30 min for propagation

---

## Step 3 — Deploy the Worker

```bash
npm install -g wrangler
wrangler login

cd worker

# Create KV namespace
npx wrangler kv:namespace create SIGNALS_KV
# Copy the id from output → paste into wrangler.toml

# Set secrets (run each separately, paste value when prompted)
npx wrangler secret put LLM_PROVIDER    # → openai
npx wrangler secret put LLM_API_KEY     # → your OpenAI/Claude/Gemini key
npx wrangler secret put REFRESH_TOKEN   # → any random string e.g. "mytoken123"

# Deploy
npx wrangler deploy
```

Worker is live at: https://signals-worker.YOUR-SUBDOMAIN.workers.dev

---

## Step 4 — Seed KV on first deploy

The cron hasn't run yet so KV is empty. Trigger it manually once:

```bash
curl -X POST https://signals-worker.YOUR-SUBDOMAIN.workers.dev/refresh \
  -H "x-refresh-token: mytoken123"
```

You'll get back: `{ "ok": true, "generatedAt": "..." }`
KV is now seeded. Cron takes over from here.

---

## Step 5 — Update frontend Worker URL

Open frontend/app.js line 3:
```js
const WORKER_URL = 'https://signals-worker.YOUR-SUBDOMAIN.workers.dev/signals'
```
Replace with your actual Worker URL.

---

## Step 6 — Deploy frontend to Cloudflare Pages

1. Push frontend/ folder to GitHub
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
3. Select repo
4. Build settings: Framework = None, Build command = (empty), Output = /
5. Deploy

Every push to master → auto-redeploys frontend. No GitHub Actions needed.

---

## Step 7 — Custom domain

Cloudflare Pages → your project → Custom Domains → Add:
  signals.bugsandbots.com

SSL is automatic. Done.

---

## Switching LLM provider

```bash
npx wrangler secret put LLM_PROVIDER   # → claude  (or gemini)
npx wrangler secret put LLM_API_KEY    # → new provider's key
npx wrangler deploy
```

That's it. Prompt and frontend don't change.

---

## Changing cron frequency

Edit wrangler.toml:
```toml
crons = ["0 */2 * * *"]   # every 2 hours
crons = ["0 */6 * * *"]   # every 6 hours (default)
crons = ["0 9 * * *"]     # once daily at 9am UTC
```
Then: npx wrangler deploy

---

## Manually forcing a refresh anytime

```bash
curl -X POST https://signals-worker.YOUR-SUBDOMAIN.workers.dev/refresh \
  -H "x-refresh-token: YOUR_REFRESH_TOKEN"
```

Useful after updating the prompt or switching providers.
