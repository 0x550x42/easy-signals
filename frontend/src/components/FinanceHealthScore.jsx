import { useState } from 'react'

export default function FinanceHealthScore({ onDataChange }) {
  const [finance, setFinance] = useState({
    annualIncome: '',
    annualExpenses: '',
    savingsBuffer: '',
    debt: '',
  })
  const [score, setScore] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    const updated = { ...finance, [name]: value }
    setFinance(updated)
    onDataChange?.(updated)
    calculateScore(updated)
  }

  const calculateScore = (data) => {
    if (!data.annualIncome || !data.annualExpenses) return
    const income = parseFloat(data.annualIncome)
    const expenses = parseFloat(data.annualExpenses)
    const savings = income - expenses
    const savingsRate = (savings / income) * 100
    const buffer = parseFloat(data.savingsBuffer) || 0
    const debt = parseFloat(data.debt) || 0
    let s = 50
    if (savingsRate >= 20) s += 20
    else if (savingsRate >= 10) s += 10
    else if (savingsRate < 0) s -= 20
    const monthlyExp = expenses / 12
    const emergencyMonths = buffer / monthlyExp
    if (emergencyMonths >= 6) s += 20
    else if (emergencyMonths >= 3) s += 10
    const dti = debt / income
    if (dti > 0.5) s -= 20
    else if (dti > 0.3) s -= 10
    setScore(Math.min(100, Math.max(0, s)))
  }

  const scoreColor = !score ? '#64748b' : score >= 75 ? '#34d399' : score >= 50 ? '#f59e0b' : '#f87171'
  const scoreLabel = !score ? '—' : score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : 'Caution'

  const fields = [
    { name: 'annualIncome',    label: 'Annual income' },
    { name: 'annualExpenses',  label: 'Annual expenses' },
    { name: 'savingsBuffer',   label: 'Savings buffer' },
    { name: 'debt',            label: 'Total debt' },
  ]

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white">Finance health score</h2>
          <p className="text-xs text-slate-500 mt-0.5">Enter your details to personalize signals</p>
        </div>
        {score !== null && (
          <div className="text-right">
            <p className="text-2xl font-bold" style={{ color: scoreColor }}>{Math.round(score)}</p>
            <p className="text-xs" style={{ color: scoreColor }}>{scoreLabel}</p>
          </div>
        )}
      </div>

      {score !== null && (
        <div className="mb-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${score}%`, background: scoreColor }}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {fields.map(({ name, label }) => (
          <div key={name}>
            <label className="block text-xs text-slate-500 mb-1">{label}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">₹</span>
              <input
                type="number"
                name={name}
                value={finance[name]}
                onChange={handleChange}
                placeholder="0"
                className="w-full pl-6 pr-3 py-2 bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:outline-none focus:border-slate-500 placeholder-slate-600"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
