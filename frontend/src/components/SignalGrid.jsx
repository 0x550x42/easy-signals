const getSignalStyles = (decision) => {
  switch (decision) {
    case 'YES':
      return {
        bg: 'bg-gradient-to-br from-emerald-900/30 to-emerald-950/20',
        border: 'border-emerald-700/50 hover:border-emerald-600',
        badge: 'bg-emerald-900/60 text-emerald-200',
        badgeBorder: 'border border-emerald-700',
      }
    case 'NO':
      return {
        bg: 'bg-gradient-to-br from-red-900/30 to-red-950/20',
        border: 'border-red-700/50 hover:border-red-600',
        badge: 'bg-red-900/60 text-red-200',
        badgeBorder: 'border border-red-700',
      }
    case 'WAIT':
      return {
        bg: 'bg-gradient-to-br from-amber-900/30 to-amber-950/20',
        border: 'border-amber-700/50 hover:border-amber-600',
        badge: 'bg-amber-900/60 text-amber-200',
        badgeBorder: 'border border-amber-700',
      }
    default:
      return {
        bg: 'bg-gradient-to-br from-slate-800/30 to-slate-900/20',
        border: 'border-slate-700/50 hover:border-slate-600',
        badge: 'bg-slate-800 text-slate-200',
        badgeBorder: 'border border-slate-700',
      }
  }
}

const signalConfig = {
  gold: { emoji: '🥇', label: 'Gold Jewelry', category: 'Metals' },
  silver: { emoji: '💎', label: 'Silver', category: 'Metals' },
  nifty: { emoji: '📈', label: 'Nifty/Sensex', category: 'Stocks' },
  realEstate: { emoji: '🏠', label: 'Real Estate', category: 'Major Purchase' },
  fd: { emoji: '🏦', label: 'Fixed Deposit', category: 'Savings' },
  goldScheme: { emoji: '🪙', label: 'Gold Savings Scheme', category: 'Investment' },
  personalLoan: { emoji: '💳', label: 'Personal Loan/EMI', category: 'Borrowing' },
  vehiclePurchase: { emoji: '🚗', label: 'Vehicle Purchase', category: 'Major Purchase' },
  healthInsurance: { emoji: '🏥', label: 'Health Insurance', category: 'Insurance' },
  domesticTravel: { emoji: '✈️', label: 'Domestic Travel', category: 'Spending' },
  crypto: { emoji: '💹', label: 'Bitcoin/Crypto', category: 'Alternative' },
  inrStrength: { emoji: '🇮🇳', label: 'INR Strength (Travel)', category: 'Currency' },
}

const SignalCard = ({ id, decision, reason, price, change }) => {
  const config = signalConfig[id] || { emoji: '📊', label: id }
  const styles = getSignalStyles(decision)

  return (
    <div
      className={`${styles.bg} border-2 ${styles.border} rounded-2xl p-7 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-900/50 cursor-pointer backdrop-blur-sm group`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{config.emoji}</span>
          <div>
            <h3 className="text-lg font-display font-700 text-white tracking-tight">{config.label}</h3>
            <p className="text-xs text-slate-500 mt-1 font-500 uppercase tracking-wider">{config.category}</p>
          </div>
        </div>
        <span
          className={`${styles.badge} ${styles.badgeBorder} text-sm font-800 px-4 py-2 rounded-lg flex-shrink-0 uppercase tracking-wider`}
        >
          {decision}
        </span>
      </div>

      <p className="text-slate-200 font-500 mb-5 leading-relaxed text-sm">{reason}</p>

      {(price || (change !== undefined && change !== null)) && (
        <div className="text-xs text-slate-400 space-y-2 border-t border-slate-700/50 pt-5">
          {price && (
            <p className="text-slate-300 font-500">Price: <span className="text-gold-400 font-700">₹{price.toLocaleString()}</span></p>
          )}
          {change !== undefined && change !== null && (
            <p className={`${change >= 0 ? 'text-emerald-400' : 'text-red-400'} font-500`}>
              24h Change: <span className="font-700">{change >= 0 ? '+' : ''}{change.toFixed(2)}%</span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function SignalGrid({ signals }) {
  // Group signals by category
  const categories = {}
  signals.forEach((signal) => {
    const config = signalConfig[signal.id]
    const category = config?.category || 'Other'
    if (!categories[category]) {
      categories[category] = []
    }
    categories[category].push(signal)
  })

  const categoryOrder = [
    'Metals',
    'Stocks',
    'Investment',
    'Savings',
    'Major Purchase',
    'Borrowing',
    'Spending',
    'Insurance',
    'Alternative',
    'Currency',
    'Other',
  ]

  const orderedCategories = categoryOrder.filter((cat) => categories[cat])

  return (
    <div className="space-y-14">
      {orderedCategories.map((category) => (
        <section key={category}>
          <div className="mb-8">
            <h2 className="text-3xl font-display font-800 text-white mb-3 tracking-tight">{category}</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-gold-500 via-gold-400 to-transparent rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
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
