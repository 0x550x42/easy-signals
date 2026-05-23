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
    onDataChange(updated)
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

    // Simple scoring logic
    let scoreValue = 50 // Base score

    // Savings rate bonus
    if (savingsRate >= 20) scoreValue += 20
    else if (savingsRate >= 10) scoreValue += 10
    else if (savingsRate < 0) scoreValue -= 20

    // Emergency fund bonus
    const monthlyExpenses = expenses / 12
    const emergencyMonths = buffer / monthlyExpenses
    if (emergencyMonths >= 6) scoreValue += 20
    else if (emergencyMonths >= 3) scoreValue += 10

    // Debt penalty
    const debtToIncome = debt / income
    if (debtToIncome > 0.5) scoreValue -= 20
    else if (debtToIncome > 0.3) scoreValue -= 10

    setScore(Math.min(100, Math.max(0, scoreValue)))
  }

  const getScoreColor = () => {
    if (!score) return 'text-gray-400'
    if (score >= 75) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = () => {
    if (!score) return 'No Score'
    if (score >= 75) return 'Excellent'
    if (score >= 50) return 'Good'
    return 'Caution'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Finance Health Score</h2>

      {score !== null && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Your Health Score</p>
              <p className={`text-4xl font-bold ${getScoreColor()}`}>{score}</p>
              <p className="text-sm text-gray-600 mt-1">{getScoreLabel()}</p>
            </div>
            <div className="w-20 h-20 rounded-full border-4 border-gray-200 flex items-center justify-center">
              <span className={`text-2xl font-bold ${getScoreColor()}`}>{Math.round(score)}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label>
          <input
            type="number"
            name="annualIncome"
            placeholder="₹"
            value={finance.annualIncome}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Annual Expenses</label>
          <input
            type="number"
            name="annualExpenses"
            placeholder="₹"
            value={finance.annualExpenses}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Savings Buffer</label>
          <input
            type="number"
            name="savingsBuffer"
            placeholder="₹"
            value={finance.savingsBuffer}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Debt</label>
          <input
            type="number"
            name="debt"
            placeholder="₹"
            value={finance.debt}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )
}
