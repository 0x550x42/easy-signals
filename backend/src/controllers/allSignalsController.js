import { generateIndianSignals } from '../utils/indianSignalGenerator.js'

export const getAllSignals = async (req, res) => {
	try {
		const signals = generateIndianSignals()

		res.json({
			signals,
			timestamp: new Date().toISOString(),
			country: 'India',
			currency: 'INR'
		})
	} catch (error) {
		console.error('Error fetching all signals:', error)
		res.status(500).json({ error: 'Failed to fetch signals' })
	}
}
