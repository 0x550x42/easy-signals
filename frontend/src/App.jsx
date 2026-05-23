import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check backend connectivity
    fetch('/api/health')
      .then(res => res.json())
      .catch(err => console.error('Backend connection failed:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-slate-400">Loading...</div>
        </div>
      ) : (
        <Dashboard />
      )}
    </div>
  )
}

export default App
