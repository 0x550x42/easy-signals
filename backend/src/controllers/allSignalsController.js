import { generateIndianSignals } from '../utils/indianSignalGenerator.js'
import { fetchMetalPrices, fetchCryptoPrices, fetchForexRates } from '../utils/priceApis.js'
import { generateSignal } from '../utils/signalGenerator.js'

// Generate crypto signal from live BTC price
const generateCryptoSignal = (btc) => {
	const { priceINR, change24h } = btc
	let decision = 'WAIT'
	let reason = ''

	if (change24h !== null && change24h < -5) {
		decision = 'YES'
		reason = `Bitcoin down ${Math.abs(change24h).toFixed(1)}% today. Potential dip buying opportunity.`
	} else if (change24h !== null && change24h > 5) {
		decision = 'NO'
		reason = `Bitcoin up ${change24h.toFixed(1)}% today. Wait for pullback before entering.`
	} else {
		decision = 'WAIT'
		reason = `Bitcoin at ₹${(priceINR / 100000).toFixed(1)}L. Consolidating — no strong signal yet.`
	}

	return { decision, reason, price: priceINR, change24h }
}

// Generate INR strength signal from USD/INR rate
const generateForexSignal = (forex) => {
	const { usdInr } = forex
	let decision = 'NO'
	let reason = ''

	if (usdInr > 85) {
		decision = 'NO'
		reason = `INR weak at ₹${usdInr} vs USD. Foreign travel and imports are expensive right now.`
	} else if (usdInr < 82) {
		decision = 'YES'
		reason = `INR strong at ₹${usdInr} vs USD. Good time for foreign travel or imports.`
	} else {
		decision = 'WAIT'
		reason = `INR at ₹${usdInr} vs USD. Moderate — watch for movement before major FX decisions.`
	}

	return { decision, reason, price: usdInr, change24h: forex.change24h }
}

export const getAllSignals = async (req, res) => {
	try {
		const baseSignals = generateIndianSignals()

		// Fetch all live data in parallel
		const [metals, crypto, forex] = await Promise.allSettled([
			fetchMetalPrices(),
			fetchCryptoPrices(),
			fetchForexRates(),
		])

		const metalsData = metals.status === 'fulfilled' ? metals.value : null
		const cryptoData = crypto.status === 'fulfilled' ? crypto.value : null
		const forexData  = forex.status  === 'fulfilled' ? forex.value  : null

		const updatedSignals = baseSignals.map(signal => {
			// Gold — live from GoldAPI
			if (signal.id === 'gold' && metalsData) {
				const s = generateSignal('gold', metalsData.gold)
				return { id: 'gold', ...s }
			}

			// Silver — live from GoldAPI
			if (signal.id === 'silver' && metalsData) {
				const s = generateSignal('silver', metalsData.silver)
				return { id: 'silver', ...s }
			}

			// Bitcoin — live from CoinGecko
			if (signal.id === 'crypto' && cryptoData) {
				return { id: 'crypto', ...generateCryptoSignal(cryptoData.bitcoin) }
			}

			// INR Strength — live from Frankfurter
			if (signal.id === 'inrStrength' && forexData) {
				return { id: 'inrStrength', ...generateForexSignal(forexData) }
			}

			return signal
		})

		res.json({
			signals: updatedSignals,
			timestamp: new Date().toISOString(),
			country: 'India',
			currency: 'INR',
			liveSources: {
				metals:  metals.status  === 'fulfilled',
				crypto:  crypto.status  === 'fulfilled',
				forex:   forex.status   === 'fulfilled',
			}
		})
	} catch (error) {
		console.error('Error in getAllSignals:', error)
		res.status(500).json({ error: 'Failed to fetch signals' })
	}
}
