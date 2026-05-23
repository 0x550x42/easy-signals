import { fetchMetalPrices } from '../utils/priceApis.js'
import { generateSignal } from '../utils/signalGenerator.js'

export const getMetalSignals = async (req, res) => {
	try {
		const prices = await fetchMetalPrices()

		const goldSignal = generateSignal('gold', prices.gold)
		const silverSignal = generateSignal('silver', prices.silver)
		const diamondSignal = generateSignal('diamond', prices.diamond)

		res.json({
			gold: goldSignal,
			silver: silverSignal,
			diamond: diamondSignal,
			timestamp: new Date().toISOString()
		})
	} catch (error) {
		console.error('Error fetching metal signals:', error)
		res.status(500).json({ error: 'Failed to fetch metal signals' })
	}
}
