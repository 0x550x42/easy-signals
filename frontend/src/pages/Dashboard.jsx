import { useState, useEffect } from 'react'
import SignalGrid from '../components/SignalGrid'

export default function Dashboard() {
  const [signals, setSignals] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    fetchAllSignals()
    const interval = setInterval(fetchAllSignals, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchAllSignals = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/signals/all')
      if (!response.ok) throw new Error('Failed to fetch signals')
      const data = await response.json()
      setSignals(data.signals)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error fetching signals:', err)
      setError('Unable to load signals. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-slate-700 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Analyzing market signals...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button
            onClick={fetchAllSignals}
            className="px-5 py-2 bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg hover:bg-slate-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 sticky top-0 z-10 bg-slate-950/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-display font-semibold text-white tracking-tight">
              Should I buy/do this now?
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time market signals · Last updated{' '}
              {lastUpdated?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <button
            onClick={fetchAllSignals}
            className="flex items-center gap-2 px-4 py-2 bg-transparent border border-slate-700 text-slate-400 text-xs rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-all"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {signals && <SignalGrid signals={signals} />}
      </main>
    </div>
  )
}
