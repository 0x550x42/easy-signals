const SIGNAL_STYLES = {
  YES: {
    card: 'border-t-emerald-500',
    badge: 'bg-emerald-950 text-emerald-400 border-emerald-800',
    accent: '#10b981',
  },
  NO: {
    card: 'border-t-red-500',
    badge: 'bg-red-950 text-red-400 border-red-800',
    accent: '#f87171',
  },
  WAIT: {
    card: 'border-t-amber-500',
    badge: 'bg-amber-950 text-amber-400 border-amber-800',
    accent: '#f59e0b',
  },
  DEFAULT: {
    card: 'border-t-slate-600',
    badge: 'bg-slate-800 text-slate-400 border-slate-700',
    accent: '#64748b',
  },
}

const SIGNAL_CONFIG = {
  gold:            { icon: 'coins',           label: 'Gold jewelry',         category: 'Precious Metals' },
  silver:          { icon: 'droplet',         label: 'Silver',               category: 'Precious Metals' },
  goldScheme:      { icon: 'coin',            label: 'Gold savings scheme',  category: 'Precious Metals' },
  nifty:           { icon: 'chart-line',      label: 'Nifty / Sensex',       category: 'Markets' },
  crypto:          { icon: 'currency-bitcoin',label: 'Bitcoin / Crypto',     category: 'Markets' },
  fd:              { icon: 'building-bank',   label: 'Fixed deposit',        category: 'Savings & Borrowing' },
  personalLoan:    { icon: 'credit-card',     label: 'Personal loan / EMI',  category: 'Savings & Borrowing' },
  realEstate:      { icon: 'building',        label: 'Real estate',          category: 'Big Purchases' },
  vehiclePurchase: { icon: 'car',             label: 'Vehicle purchase',     category: 'Big Purchases' },
  domesticTravel:  { icon: 'plane',           label: 'Domestic travel',      category: 'Travel & Currency' },
  inrStrength:     { icon: 'world',           label: 'INR strength',         category: 'Travel & Currency' },
  healthInsurance: { icon: 'heart',           label: 'Health insurance',     category: 'Insurance' },
}

const ICON_MAP = {
  coins: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>
    </svg>
  ),
  droplet: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
    </svg>
  ),
  'chart-line': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  building: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01M12 14h.01"/>
    </svg>
  ),
  'building-bank': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l18 0"/><path d="M3 10l18 0"/><path d="M5 6l7-3 7 3"/><path d="M4 10l0 11"/><path d="M20 10l0 11"/><path d="M8 14l0 3"/><path d="M12 14l0 3"/><path d="M16 14l0 3"/>
    </svg>
  ),
  coin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8"/><path d="M12 8v4l2 2"/>
    </svg>
  ),
  'credit-card': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/>
    </svg>
  ),
  car: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>
    </svg>
  ),
  heart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  plane: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
    </svg>
  ),
  'currency-bitcoin': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/>
    </svg>
  ),
  world: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
}

const ACCENT_COLORS = {
  'Precious Metals':     '#f59e0b',
  'Markets':             '#34d399',
  'Savings & Borrowing': '#60a5fa',
  'Big Purchases':       '#fb923c',
  'Travel & Currency':   '#38bdf8',
  'Insurance':           '#4ade80',
  'Other':               '#94a3b8',
}

const SignalCard = ({ id, decision, reason, price, change }) => {
  const config = SIGNAL_CONFIG[id] || { icon: 'coin', label: id, category: 'Other' }
  const styles = SIGNAL_STYLES[decision] || SIGNAL_STYLES.DEFAULT
  const IconSVG = ICON_MAP[config.icon] || ICON_MAP['coin']

  const iconBg = {
    YES:  { bg: 'rgba(16,185,129,0.12)', color: '#34d399' },
    NO:   { bg: 'rgba(239,68,68,0.12)',  color: '#f87171' },
    WAIT: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  }[decision] || { bg: 'rgba(100,116,139,0.12)', color: '#94a3b8' }

  return (
    <div className={`bg-slate-900 border border-slate-800 border-t-2 ${styles.card} rounded-xl p-5 flex flex-col gap-4 hover:border-slate-700 transition-colors`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: iconBg.bg, color: iconBg.color }}
          >
            {IconSVG}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white leading-tight">{config.label}</h3>
            <p className="text-xs text-slate-500 mt-0.5 uppercase tracking-wider">{config.category}</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${styles.badge} flex-shrink-0 uppercase tracking-widest`}>
          {decision}
        </span>
      </div>

      <p className="text-slate-400 text-xs leading-relaxed border-t border-slate-800 pt-3">
        {reason}
      </p>

      {(price || (change !== undefined && change !== null)) && (
        <div className="flex gap-4">
          {price && (
            <div>
              <p className="text-xs text-slate-600 mb-0.5">Price</p>
              <p className="text-sm font-semibold text-slate-200">₹{price.toLocaleString()}</p>
            </div>
          )}
          {change !== undefined && change !== null && (
            <div>
              <p className="text-xs text-slate-600 mb-0.5">24h change</p>
              <p className={`text-sm font-semibold ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {change >= 0 ? '+' : ''}{change.toFixed(2)}%
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function SignalGrid({ signals }) {
  const categories = {}
  signals.forEach((signal) => {
    const config = SIGNAL_CONFIG[signal.id]
    const category = config?.category || 'Other'
    if (!categories[category]) categories[category] = []
    categories[category].push(signal)
  })

  const categoryOrder = [
    'Precious Metals',
    'Markets',
    'Savings & Borrowing',
    'Big Purchases',
    'Travel & Currency',
    'Insurance',
    'Other',
  ]

  const orderedCategories = categoryOrder.filter((cat) => categories[cat])

  return (
    <div className="space-y-10">
      {orderedCategories.map((category) => (
        <section key={category}>
          <div className="flex items-center gap-3 mb-5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: ACCENT_COLORS[category] || '#94a3b8' }}
            />
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{category}</h2>
            <div className="flex-1 h-px bg-slate-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories[category].map((signal) => (
              <SignalCard
                key={signal.id}
                id={signal.id}
                decision={signal.decision}
                reason={signal.reason}
                price={signal.price}
                change={signal.change24h}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
