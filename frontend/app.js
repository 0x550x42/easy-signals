// ─── Config ───────────────────────────────────────────────────────
// Replace with your deployed Cloudflare Worker URL
const WORKER_URL = 'https://signals-worker.ud0103.workers.dev/signals'

// ─── Signal metadata ──────────────────────────────────────────────
const SIGNAL_CONFIG = {
  gold:                { label: 'Gold jewellery',                   category: 'Precious Metals',          icon: 'coins' },
  silver:              { label: 'Silver',                           category: 'Precious Metals',          icon: 'droplet' },
  goldScheme:          { label: 'Gold SIP / Savings Scheme',        category: 'Precious Metals',          icon: 'coin' },
  sovereignGoldBond:   { label: 'Sovereign Gold Bond (SGB)',        category: 'Precious Metals',          icon: 'coin' },
  digitalGold:         { label: 'Digital Gold',                     category: 'Precious Metals',          icon: 'coins' },
  nifty:               { label: 'Nifty / Sensex',                   category: 'Markets',                  icon: 'chart' },
  crypto:              { label: 'Bitcoin / Crypto',                 category: 'Markets',                  icon: 'bitcoin' },
  sipTiming:           { label: 'Start / increase SIP?',            category: 'Markets',                  icon: 'chart' },
  ipoInvesting:        { label: 'IPO investing',                    category: 'Markets',                  icon: 'chart' },
  usStocks:            { label: 'US stocks (INDmoney / Vested)',     category: 'Markets',                  icon: 'globe' },
  fd:                  { label: 'Fixed Deposit (FD)',               category: 'Savings & Borrowing',      icon: 'bank' },
  personalLoan:        { label: 'Personal loan or EMI',             category: 'Savings & Borrowing',      icon: 'card' },
  homeLoan:            { label: 'Home loan',                        category: 'Savings & Borrowing',      icon: 'building' },
  ppf:                 { label: 'PPF top-up',                       category: 'Savings & Borrowing',      icon: 'bank' },
  recurringDeposit:    { label: 'Recurring Deposit (RD)',           category: 'Savings & Borrowing',      icon: 'bank' },
  realEstate:          { label: 'Real estate',                      category: 'Big Purchases',            icon: 'building' },
  petrolCar:           { label: 'Petrol car',                       category: 'Big Purchases',            icon: 'car' },
  dieselCar:           { label: 'Diesel car',                       category: 'Big Purchases',            icon: 'car' },
  electricCar:         { label: 'Electric car (EV)',                category: 'Big Purchases',            icon: 'car' },
  hybridCar:           { label: 'Hybrid car',                       category: 'Big Purchases',            icon: 'car' },
  smartphone:          { label: 'Smartphone upgrade',               category: 'Big Purchases',            icon: 'card' },
  laptop:              { label: 'Laptop purchase',                  category: 'Big Purchases',            icon: 'card' },
  airConditioner:      { label: 'Air conditioner (AC)',             category: 'Big Purchases',            icon: 'card' },
  domesticTravel:      { label: 'Domestic travel',                  category: 'Travel & Currency',        icon: 'plane' },
  internationalTravel: { label: 'International travel',             category: 'Travel & Currency',        icon: 'plane' },
  flightBooking:       { label: 'Book flights now or wait?',        category: 'Travel & Currency',        icon: 'plane' },
  inrStrength:         { label: 'Dollar vs Rupee',                  category: 'Travel & Currency',        icon: 'globe' },
  healthInsurance:     { label: 'Health insurance',                 category: 'Insurance',                icon: 'heart' },
  termInsurance:       { label: 'Term life insurance',              category: 'Insurance',                icon: 'heart' },
  carInsurance:        { label: 'Car insurance',                    category: 'Insurance',                icon: 'car' },
  twoWheelerInsurance: { label: 'Two-wheeler insurance',            category: 'Insurance',                icon: 'car' },
  homeInsurance:       { label: 'Home insurance',                   category: 'Insurance',                icon: 'building' },
  elss:                { label: 'ELSS (tax-saving mutual fund)',    category: 'Tax & Long-term Savings',  icon: 'chart' },
  nps:                 { label: 'NPS (National Pension System)',    category: 'Tax & Long-term Savings',  icon: 'bank' },
  postOfficeSavings:   { label: 'Post Office savings schemes',      category: 'Tax & Long-term Savings',  icon: 'bank' },
}

const CATEGORIES = {
  'Precious Metals':         { emoji: '🪙', question: 'Thinking of buying gold or silver?' },
  'Markets':                 { emoji: '📈', question: 'Want to invest right now?' },
  'Savings & Borrowing':     { emoji: '🏦', question: 'Planning to save or take a loan?' },
  'Big Purchases':           { emoji: '🏠', question: 'Planning a big purchase?' },
  'Travel & Currency':       { emoji: '✈️', question: 'Travelling soon?' },
  'Insurance':               { emoji: '🛡️', question: 'Thinking about insurance?' },
  'Tax & Long-term Savings': { emoji: '📋', question: 'Planning your taxes or long-term savings?' },
}

const CATEGORY_ORDER = [
  'Precious Metals', 'Markets', 'Savings & Borrowing',
  'Big Purchases', 'Travel & Currency', 'Insurance', 'Tax & Long-term Savings',
]

// ─── Action hints ─────────────────────────────────────────────────
const ACTION_HINTS = {
  gold:                { YES: 'Good time to buy — prices are reasonable.', NO: 'Prices are high. Wait for a dip.', WAIT: 'Watch for a few weeks — prices may settle.' },
  silver:              { YES: 'Decent entry — silver tends to follow gold up.', NO: 'Hold off — prices are elevated.', WAIT: 'Watch for a dip before committing.' },
  goldScheme:          { YES: 'Good time to start or top up a gold SIP.', NO: 'Not the best time to start.', WAIT: 'Wait for prices to cool before starting.' },
  sovereignGoldBond:   { YES: 'Good tranche to invest — better than physical gold.', NO: 'Check if a new tranche is open before acting.', WAIT: 'Wait for the next SGB tranche announcement.' },
  digitalGold:         { YES: 'Convenient entry — start small if new to gold.', NO: 'Prices are elevated — wait for a dip.', WAIT: 'Watch gold prices for a week before buying.' },
  nifty:               { YES: 'Markets are reasonable — SIPs and blue chips are fine.', NO: 'Avoid lump-sum investments right now.', WAIT: 'SIPs are okay — avoid large one-time investments.' },
  crypto:              { YES: 'If you were planning to buy, conditions are okay. High risk.', NO: 'Avoid chasing the price — wait for a pullback.', WAIT: 'Too volatile. Watch and wait.' },
  sipTiming:           { YES: 'Great time to start or increase your SIP.', NO: 'Continue existing SIPs — avoid increasing now.', WAIT: 'Keep existing SIPs running — pause new ones for now.' },
  ipoInvesting:        { YES: 'IPO market looks healthy — research before applying.', NO: 'IPO market is overheated — be selective.', WAIT: 'Wait for better-quality IPOs before applying.' },
  usStocks:            { YES: 'Good entry point — rupee and US markets are favourable.', NO: 'US market is expensive and rupee is weak — wait.', WAIT: 'Hold off — watch US Fed signals before investing.' },
  fd:                  { YES: 'Lock in an FD this week — rates are attractive.', NO: 'Rates are not great. Explore better options.', WAIT: 'Rates may change soon. Check again in 2–3 weeks.' },
  personalLoan:        { YES: 'Loan conditions are decent — compare a few banks.', NO: 'Avoid if possible — rates are high.', WAIT: 'Hold off a little — rates may improve soon.' },
  homeLoan:            { YES: 'Good time to take or transfer a home loan — rates are low.', NO: 'Rates are high — wait or negotiate harder.', WAIT: 'RBI policy review coming — wait before locking in.' },
  ppf:                 { YES: 'Top up your PPF now — rates are good, tax-free returns.', NO: 'Meet the minimum — no need to max out right now.', WAIT: 'Check PPF rate announcement before topping up.' },
  recurringDeposit:    { YES: 'Start an RD now — steady returns at decent rates.', NO: 'RD rates are low — consider other options.', WAIT: 'Wait for rate revision before locking in.' },
  realEstate:          { YES: 'Conditions are relatively favourable — good time.', NO: 'Costs are elevated — not a great time.', WAIT: 'Market is in flux — take your time before committing.' },
  petrolCar:           { YES: 'Good time — fuel prices are stable, decent deals available.', NO: 'Fuel costs are high; consider waiting or going electric.', WAIT: 'Watch fuel price trends before committing.' },
  dieselCar:           { YES: 'Diesel economics are decent right now — go ahead.', NO: 'Diesel costs and restrictions make this a tough time.', WAIT: 'Check diesel regulations in your city before deciding.' },
  electricCar:         { YES: 'Good time — subsidies and model options are strong.', NO: 'Wait — charging infra or pricing may improve soon.', WAIT: 'Compare models carefully; new launches expected soon.' },
  hybridCar:           { YES: 'Solid choice right now — best of both worlds.', NO: 'Full EVs or petrol may offer better value currently.', WAIT: 'A few more models launching soon — worth waiting.' },
  smartphone:          { YES: 'Good time — festive deals or new models available.', NO: 'Prices are high — wait for a sale or next launch.', WAIT: 'A new model or sale may be around the corner.' },
  laptop:              { YES: 'Decent deals available — good time to buy.', NO: 'Wait for back-to-school or festive season deals.', WAIT: 'New models launching soon — hold a few more weeks.' },
  airConditioner:      { YES: 'Buy now before peak summer — stock and prices better.', NO: 'Peak season pricing — wait for post-summer discounts.', WAIT: 'Pre-summer deals starting soon — check in a week.' },
  domesticTravel:      { YES: 'Good time to book.', NO: 'Costs are high — consider waiting or booking far in advance.', WAIT: 'Book closer to your date for better deals.' },
  internationalTravel: { YES: 'Good time — fares and rupee are both reasonable.', NO: 'International travel is expensive right now — delay if possible.', WAIT: 'Watch rupee and fare trends before booking.' },
  flightBooking:       { YES: 'Book now — fares are low, good availability.', NO: 'Fares are high — wait or consider alternate dates.', WAIT: 'Check again in a few days — fares fluctuate quickly.' },
  inrStrength:         { YES: 'Good time — rupee is holding up well.', NO: 'Going abroad will cost more than usual right now.', WAIT: 'Check again closer to your travel date.' },
  healthInsurance:     { YES: 'Buy or renew now — good time to lock in rates.', NO: 'Review existing coverage before buying new.', WAIT: 'Compare a few plans before deciding — do not rush.' },
  termInsurance:       { YES: 'Buy now — premiums are stable and coverage is strong.', NO: 'Review your existing cover before adding more.', WAIT: 'Compare a few insurers — rates may vary soon.' },
  carInsurance:        { YES: 'Good time to renew or switch — competitive rates available.', NO: 'Stick with your current insurer for now.', WAIT: 'Check renewal date — switch only if saving meaningfully.' },
  twoWheelerInsurance: { YES: 'Renew now — good deals available, do not let it lapse.', NO: 'Your current policy is likely fine — no rush to switch.', WAIT: 'Compare online before renewing — prices vary widely.' },
  homeInsurance:       { YES: 'Great time to buy — low premiums, high peace of mind.', NO: 'Not urgent — assess your risk before committing.', WAIT: 'Compare bundled home + content plans before deciding.' },
  elss:                { YES: 'Invest now — markets are at a good level for tax saving.', NO: 'Markets are stretched — invest only if deadline is near.', WAIT: 'March deadline approaching — start SIP now to spread risk.' },
  nps:                 { YES: 'Good time to contribute — tax benefit + decent returns.', NO: 'Meet minimum contribution only — explore better options.', WAIT: 'Review fund choice before contributing more.' },
  postOfficeSavings:   { YES: 'Solid choice — government-backed, good rates right now.', NO: 'Rates are low — FD or RD may offer better returns.', WAIT: 'Rate revision expected — check before locking in.' },
}

// ─── SVG icons ────────────────────────────────────────────────────
const ICONS = {
  coins:    `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>`,
  droplet:  `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
  coin:     `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2 2"/></svg>`,
  chart:    `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  bitcoin:  `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/></svg>`,
  bank:     `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l18 0M3 10l18 0M5 6l7-3 7 3M4 10l0 11M20 10l0 11M8 14l0 3M12 14l0 3M16 14l0 3"/></svg>`,
  card:     `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>`,
  building: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01M12 14h.01"/></svg>`,
  car:      `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`,
  plane:    `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
  globe:    `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  heart:    `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  whatsapp: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
}

// ─── Helpers ──────────────────────────────────────────────────────
function changeToWords(change) {
  if (change === null || change === undefined) return null
  const abs = Math.abs(change)
  if (abs < 0.3) return { text: 'Stable today', cls: 'flat' }
  if (abs < 1)   return change > 0 ? { text: 'Up a little today', cls: 'up' } : { text: 'Down a little today', cls: 'down' }
  if (abs < 3)   return change > 0 ? { text: 'Up today', cls: 'up' }          : { text: 'Down today', cls: 'down' }
  return change > 0 ? { text: 'Up sharply today', cls: 'up' } : { text: 'Down sharply today', cls: 'down' }
}

function decisionEmoji(d) {
  return d === 'YES' ? '✅' : d === 'NO' ? '❌' : '⏳'
}

function formatPrice(id, price) {
  if (price === null || price === undefined) return null
  if (id === 'inrStrength') return `₹${price} / USD`
  if (id === 'crypto') return `₹${(price / 100000).toFixed(1)}L`
  return `₹${price.toLocaleString('en-IN')}`
}

function share(label, decision, reason) {
  const text = `${decisionEmoji(decision)} *${label}* — ${decision}\n\n${reason}\n\n_via bugsandbots.com_`
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}

// ─── Render functions ─────────────────────────────────────────────
function renderBestBets(signals) {
  const yes  = signals.filter(s => s.decision === 'YES')
  const wait = signals.filter(s => s.decision === 'WAIT')
  const no   = signals.filter(s => s.decision === 'NO')
  if (yes.length === 0) return ''

  const tags = yes.map(s => {
    const label = SIGNAL_CONFIG[s.id]?.label || s.id
    return `<span class="best-bets-tag">${label}</span>`
  }).join('')

  return `
    <div class="best-bets">
      <p class="best-bets-title">✅ Today's Best Bets</p>
      <div class="best-bets-tags">${tags}</div>
      <div class="best-bets-meta">
        <span>⏳ ${wait.length} to watch</span>
        <span>❌ ${no.length} to avoid</span>
      </div>
    </div>`
}

function renderCard(signal) {
  const cfg    = SIGNAL_CONFIG[signal.id] || { label: signal.id, icon: 'coin' }
  const d      = signal.decision
  const cls    = d.toLowerCase()
  const emoji  = decisionEmoji(d)
  const icon   = ICONS[cfg.icon] || ICONS.coin
  const change = changeToWords(signal.change24h)
  const hint   = ACTION_HINTS[signal.id]?.[d] || ''
  const price  = formatPrice(signal.id, signal.price)

  const changeHtml = change
    ? `<div class="card-change ${change.cls}">${change.text}</div>`
    : ''

  const priceHtml = price ? `
    <div>
      <div class="card-price-label">Price</div>
      <div class="card-price">${price}</div>
    </div>` : '<div></div>'

  return `
    <div class="card ${cls}">
      <div class="card-header">
        <div class="card-title-row">
          <div class="card-icon">${icon}</div>
          <div>
            <div class="card-label">${cfg.label}</div>
            ${changeHtml}
          </div>
        </div>
        <div class="badge ${cls}">${emoji} ${d}</div>
      </div>

      <p class="card-reason">${signal.reason}</p>

      ${hint ? `<div class="card-hint">💡 ${hint}</div>` : ''}

      <div class="card-footer">
        ${priceHtml}
        <button class="share-btn" onclick="share('${cfg.label.replace(/'/g, "\\'")}', '${d}', '${signal.reason.replace(/'/g, "\\'")}')">
          ${ICONS.whatsapp} Share
        </button>
      </div>
    </div>`
}

function renderGrid(signals) {
  const byCategory = {}
  signals.forEach(s => {
    const cat = SIGNAL_CONFIG[s.id]?.category || 'Other'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(s)
  })

  return CATEGORY_ORDER
    .filter(cat => byCategory[cat])
    .map(cat => {
      const meta  = CATEGORIES[cat] || { emoji: '📊', question: cat }
      const cards = byCategory[cat].map(renderCard).join('')
      return `
        <div class="category">
          <div class="category-header">
            <span class="category-emoji">${meta.emoji}</span>
            <span class="category-question">${meta.question}</span>
            <div class="category-line"></div>
          </div>
          <div class="signal-grid">${cards}</div>
        </div>`
    }).join('')
}

// ─── Data loading ─────────────────────────────────────────────────
async function loadSignals() {
  const loading = document.getElementById('loading')
  const error   = document.getElementById('error')
  const content = document.getElementById('content')
  const updated = document.getElementById('last-updated')

  loading.classList.remove('hidden')
  error.classList.add('hidden')
  content.classList.add('hidden')

  try {
    const res  = await fetch(WORKER_URL)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    document.getElementById('best-bets').innerHTML  = renderBestBets(data.signals)
    document.getElementById('signal-grid').innerHTML = renderGrid(data.signals)

    const refreshed = new Date(data.generatedAt)
    const time = refreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    const date = refreshed.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
    updated.textContent = `Signals last refreshed: ${date} · ${time}`

    loading.classList.add('hidden')
    content.classList.remove('hidden')
  } catch (err) {
    console.error(err)
    document.getElementById('error-msg').textContent = 'Unable to load signals. Please try again.'
    loading.classList.add('hidden')
    error.classList.remove('hidden')
  }
}

// Load on page open
loadSignals()
