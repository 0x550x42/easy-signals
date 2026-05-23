import { useState } from 'react'
import axios from 'axios'

export default function TravelPlanner({ userFinance }) {
  const [tripData, setTripData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    tripType: 'mid',
  })

  const [estimate, setEstimate] = useState(null)
  const [affordability, setAffordability] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setTripData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateEstimate = async () => {
    try {
      const response = await axios.post('/api/travel/estimate', tripData)
      setEstimate(response.data)

      // Calculate affordability
      if (userFinance && userFinance.annualIncome) {
        const totalCost = response.data.total
        const income = parseFloat(userFinance.annualIncome)
        const expenses = parseFloat(userFinance.annualExpenses) || 0
        const monthlySurplus = (income - expenses) / 12

        setAffordability({
          cost: totalCost,
          canAfford: totalCost <= parseFloat(userFinance.savingsBuffer) || monthlySurplus > (totalCost / 6),
          percentOfIncome: ((totalCost / income) * 100).toFixed(1),
        })
      }
    } catch (err) {
      console.error('Failed to calculate estimate:', err)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Trip Planner</h3>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
            <input
              type="text"
              name="destination"
              placeholder="City or Country"
              value={tripData.destination}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trip Type</label>
            <select
              name="tripType"
              value={tripData.tripType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="budget">Budget</option>
              <option value="mid">Mid-range</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={tripData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={tripData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers</label>
          <input
            type="number"
            name="travelers"
            min="1"
            value={tripData.travelers}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          onClick={calculateEstimate}
          className="w-full bg-gold-600 text-white font-semibold py-2 rounded-lg hover:bg-gold-700"
        >
          Calculate Estimate
        </button>
      </div>

      {estimate && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-bold text-gray-900 mb-3">Trip Estimate</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Flights:</span>
              <span>₹{estimate.flights?.toFixed(0) || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Hotels:</span>
              <span>₹{estimate.hotels?.toFixed(0) || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Food & Transport:</span>
              <span>₹{estimate.local?.toFixed(0) || 0}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-bold">
              <span>Total:</span>
              <span>₹{estimate.total?.toFixed(0) || 0}</span>
            </div>
          </div>

          {affordability && (
            <div className={`mt-4 p-3 rounded ${affordability.canAfford ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={`text-sm font-semibold ${affordability.canAfford ? 'text-green-700' : 'text-red-700'}`}>
                {affordability.canAfford ? '✅ You can afford this trip' : '⚠️ Consider your budget carefully'}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {affordability.percentOfIncome}% of your annual income
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
