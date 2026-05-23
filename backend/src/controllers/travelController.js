import { calculateTravelCosts } from '../utils/travelEstimator.js'

export const estimateTripCost = async (req, res) => {
	try {
		const { destination, startDate, endDate, travelers, tripType } =
			req.body

		if (!destination || !startDate || !endDate || !travelers) {
			return res.status(400).json({ error: 'Missing required fields' })
		}

		const estimate = await calculateTravelCosts({
			destination,
			startDate,
			endDate,
			travelers,
			tripType
		})

		res.json(estimate)
	} catch (error) {
		console.error('Error calculating travel costs:', error)
		res.status(500).json({ error: 'Failed to calculate travel costs' })
	}
}
