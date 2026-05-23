import { useState, useEffect } from 'react'
import SignalGrid from '../components/SignalGrid'

export default function Dashboard() {
  const [signals, setSignals] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    fetchAllSignals()
    // Refresh every 5 minutes
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-3 border-slate-700 border-t-gold-500 mx-auto mb-6"></div>
          <p className="text-xl text-slate-300 font-500 tracking-wide">Analyzing market signals...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-400 mb-6 font-500">{error}</p>
          <button
            onClick={fetchAllSignals}
            className="px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-white rounded-xl hover:from-gold-500 hover:to-gold-400 font-semibold transition-all duration-200 shadow-lg shadow-gold-600/20 hover:shadow-gold-600/40 hover:scale-105 active:scale-95"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <header className="border-b border-slate-800/50 sticky top-0 z-10 backdrop-blur-md bg-slate-950/90">
        <div className="max-w-7xl mx-auto px-8 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-display font-900 text-white mb-2 tracking-tight">Should I Buy/Do This Now?</h1>
            <p className="text-sm text-slate-400 font-400 tracking-wide">
              Real-time market signals • Last updated {lastUpdated?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <button
            onClick={fetchAllSignals}
            className="px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-white rounded-xl hover:from-gold-500 hover:to-gold-400 text-sm font-semibold transition-all duration-200 whitespace-nowrap shadow-lg shadow-gold-600/20 hover:shadow-gold-600/40 hover:scale-105 active:scale-95"
          >
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-16">
        {signals && <SignalGrid signals={signals} />}
      </main>
    </div>
  )
}
