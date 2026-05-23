# Should I buy / do this now?

A plain-language Indian market signals dashboard for everyday users — not investors or analysts. Gives simple **YES / WAIT / NO** answers to common financial and purchase decisions.

Live at: `signals.bugsandbots.com`

---

## What it does

12 signal cards across 6 categories, each answering a real question a household decision maker might have:

| Category | Signals |
|---|---|
| 🪙 Precious Metals | Gold, Silver, Gold SIP / Savings Scheme |
| 📈 Markets | Nifty / Sensex, Bitcoin / Crypto |
| 🏦 Savings & Borrowing | Fixed Deposit, Personal Loan / EMI |
| 🏠 Big Purchases | Real Estate, Vehicle Purchase |
| ✈️ Travel & Currency | Domestic Travel, Dollar vs Rupee |
| 🛡️ Insurance | Health Insurance |

Each card shows:
- **YES / WAIT / NO** decision
- Plain-language reason (no jargon)
- 💡 Action hint — what to actually do next
- WhatsApp share button
- Price where relevant

---

## Architecture

```
Cloudflare Cron (every 6h)
        ↓
Worker calls LLM (OpenAI / Claude / Gemini)
with web search — researches live market data
        ↓
Generates all 12 signals as JSON
        ↓
Writes to Cloudflare KV
        ↓
User visits page → frontend reads KV instantly
No API call on page load. Zero latency.
```

### Why this architecture

- **Frontend never triggers an LLM call** — it only reads pre-built JSON from KV. Every user gets sub-millisecond response.
- **LLM does the research** — no need to manage GoldAPI, CoinGecko, Frankfurter, or any other data API. One LLM call replaces all of them.
- **Provider-agnostic** — swap between OpenAI, Claude, and Gemini by changing one environment variable. No code changes needed.
- **Cron controls freshness** — update every 6 hours, 2 hours, or once a day. One line in `wrangler.toml`.

---

## Tech Stack

| Layer | Technology | Cost |
|---|---|---|
| Frontend | Vanilla HTML + CSS + JS | Free |
| Backend | Cloudflare Workers | Free |
| Cache | Cloudflare KV | Free |
| Hosting | Cloudflare Pages | Free |
| SSL + DNS | Cloudflare | Free |
| Signal generation | OpenAI / Claude / Gemini (LLM with web search) | ~₹2–5/day |

No Node.js. No Express. No React. No Docker. No server to manage.

---

## Project Structure

```
/
├── frontend/
│   ├── index.html       # App shell — no framework
│   ├── style.css        # Dark theme, card layout, mobile responsive
│   └── app.js           # Fetch signals from Worker, render cards
│
├── worker/
│   ├── index.js         # Cloudflare Worker — cron + fetch handler
│   ├── prompt.js        # Master LLM prompt — single source of truth
│   ├── providers.js     # OpenAI / Claude / Gemini adapter layer
│   └── wrangler.toml    # Cloudflare config — cron schedule, KV binding
│
├── DEPLOY.md            # Step-by-step deployment guide
└── README.md
```

---

## Switching LLM Provider

The prompt is provider-agnostic. Switching takes two commands:

```bash
npx wrangler secret put LLM_PROVIDER   # openai | claude | gemini
npx wrangler secret put LLM_API_KEY    # new provider's API key
npx wrangler deploy
```

Prompt, frontend, and cron schedule stay exactly the same.

---

## Environment Variables

Set via Cloudflare Wrangler secrets — never hardcoded:

| Secret | Description |
|---|---|
| `LLM_PROVIDER` | `openai`, `claude`, or `gemini` |
| `LLM_API_KEY` | API key for the chosen provider |
| `REFRESH_TOKEN` | Random string to protect the `/refresh` endpoint |

KV namespace configured in `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "SIGNALS_KV"
id      = "your-kv-namespace-id"
```

---

## API Endpoints (Worker)

| Endpoint | Method | Description |
|---|---|---|
| `/signals` | GET | Returns cached signals JSON from KV |
| `/refresh` | POST | Triggers immediate LLM refresh (requires `x-refresh-token` header) |

---

## Cron Schedule

Configured in `wrangler.toml`:

```toml
[triggers]
crons = ["0 */6 * * *"]   # every 6 hours
```

Common alternatives:
```toml
crons = ["0 */2 * * *"]   # every 2 hours
crons = ["0 9 * * *"]     # once daily at 9am UTC
```

---

## Deployment

Full step-by-step in `DEPLOY.md`. Summary:

1. Create Cloudflare account (free)
2. Point `bugsandbots.com` nameservers from GoDaddy → Cloudflare
3. Create KV namespace → paste ID into `wrangler.toml`
4. Set 3 secrets via `wrangler secret put`
5. `npx wrangler deploy`
6. Seed KV: `curl -X POST /refresh -H "x-refresh-token: YOUR_TOKEN"`
7. Push `frontend/` to GitHub → connect to Cloudflare Pages
8. Add `signals.bugsandbots.com` as custom domain in Pages

Cron takes over from step 6. Every push to `master` auto-deploys the frontend.

---

## Manually Forcing a Refresh

After changing the prompt or switching providers:

```bash
curl -X POST https://signals-worker.YOUR-SUBDOMAIN.workers.dev/refresh \
  -H "x-refresh-token: YOUR_REFRESH_TOKEN"
```

---

## Design Principles

- **No jargon** — written for first-time investors and household decision makers
- **Lead with implication** — "Gold is expensive right now" not "Gold up 2.3%"
- **One clear action** — every card tells you what to actually do next
- **Mobile first** — primary audience is on phones
- **WhatsApp native** — share any signal instantly via WhatsApp

---

## License

MIT
