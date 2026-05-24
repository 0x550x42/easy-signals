# Should I buy / do this now?

Plain-language Indian market signals for everyday decision makers. Gives simple **YES / WAIT / NO** answers — no jargon, no charts, no finance degree needed.

Live at: `signals-app.pages.dev`

---

## What it does

12 signal cards across 6 categories:

| Category | Signals |
|---|---|
| 🪙 Precious Metals | Gold, Silver, Gold SIP |
| 📈 Markets | Nifty / Sensex, Bitcoin |
| 🏦 Savings & Borrowing | Fixed Deposit, Personal Loan |
| 🏠 Big Purchases | Real Estate, Vehicle |
| ✈️ Travel & Currency | Domestic Travel, Dollar vs Rupee |
| 🛡️ Insurance | Health Insurance |

Each card: decision + plain-language reason + 💡 action hint + WhatsApp share.

---

## Architecture

```
Cloudflare Cron (every 6h)
        ↓
Worker → LLM (OpenAI / Claude / Gemini)
        ↓
Signals JSON → Cloudflare KV
        ↓
Frontend reads KV — zero latency, no API calls on page load
```

No Express. No React. No Docker. No server.

---

## Stack

| Layer | Technology | Cost |
|---|---|---|
| Frontend | Vanilla HTML + CSS + JS | Free |
| Backend | Cloudflare Workers + Cron | Free |
| Cache | Cloudflare KV | Free |
| Hosting | Cloudflare Pages | Free |
| Signals | OpenAI / Claude / Gemini | ~₹2–5/day |

---

## Project Structure

```
/
├── frontend/
│   ├── index.html      # App shell
│   ├── style.css       # Dark theme, mobile responsive
│   └── app.js          # Fetches KV data, renders cards
│
├── worker/
│   ├── index.js        # Cron + fetch handler
│   ├── prompt.js       # LLM prompt — single source of truth
│   ├── providers.js    # OpenAI / Claude / Gemini adapters
│   └── wrangler.toml   # Cron schedule, KV binding, observability
│
├── CLAUDE.md           # Context for Claude Code sessions
├── DEPLOY.md           # Full deployment walkthrough
└── README.md
```

---

## Secrets

Set via `npx wrangler secret put` — never hardcoded:

| Secret | Value |
|---|---|
| `LLM_PROVIDER` | `openai` / `claude` / `gemini` |
| `LLM_API_KEY` | Provider API key |
| `REFRESH_TOKEN` | Protects the `/refresh` endpoint |

---

## Key Commands

```bash
# Deploy worker
cd worker && npx wrangler deploy

# Force signal refresh
curl -X POST https://signals-worker.ud0103.workers.dev/refresh \
  -H "x-refresh-token: YOUR_TOKEN"

# Switch LLM provider
npx wrangler secret put LLM_PROVIDER
npx wrangler secret put LLM_API_KEY
npx wrangler deploy

# Stream live logs
npx wrangler tail
```

---

## Switching LLM Provider

Two commands, zero code changes:

```bash
npx wrangler secret put LLM_PROVIDER   # openai | claude | gemini
npx wrangler secret put LLM_API_KEY
npx wrangler deploy
```

---

## License

MIT