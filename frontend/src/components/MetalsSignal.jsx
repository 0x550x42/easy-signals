import { useState, useEffect } from 'react'
import axios from 'axios'

export default function MetalsSignal({ userFinance }) {
  const [signals, setSignals] = useState({
    gold: null,
    silver: null,
    diamond: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSignals()
  }, [])

  const fetchSignals = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/signals/metals')
      setSignals(response.data)
    } catch (err) {
      setError('Failed to fetch metal signals')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const SignalCard = ({ metal, data }) => {
    if (!data) return null

    const getColor = (decision) => {
      switch (decision) {
        case 'YES':
          return 'bg-green-50 border-green-200'
        case 'NO':
          return 'bg-red-50 border-red-200'
        case 'WAIT':
          return 'bg-yellow-50 border-yellow-200'
        default:
          return 'bg-gray-50 border-gray-200'
      }
    }

    const getDecisionColor = (decision) => {
      switch (decision) {
        case 'YES':
          return 'text-green-700'
        case 'NO':
          return 'text-red-700'
        case 'WAIT':
          return 'text-yellow-700'
        default:
          return 'text-gray-700'
      }
    }

    return (
      <div className={`border-2 rounded-lg p-6 ${getColor(data.decision)}`}>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 capitalize">{metal}</h3>
          <span className={`text-2xl font-bold ${getDecisionColor(data.decision)}`}>
            {data.decision}
          </span>
        </div>
        <p className="text-gray-700 mb-4">{data.reason}</p>
        <div className="text-sm text-gray-600">
          <p>Current Price: ${data.price?.toFixed(2) || 'N/A'}</p>
          <p>24h Change: {data.change24h?.toFixed(2) || 'N/A'}%</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-8">Loading precious metals data...</div>
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SignalCard metal="gold" data={signals.gold} />
      <SignalCard metal="silver" data={signals.silver} />
      <SignalCard metal="diamond" data={signals.diamond} />
    </div>
  )
}
