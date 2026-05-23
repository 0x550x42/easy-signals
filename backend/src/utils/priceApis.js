import axios from 'axios'

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY || 'demo'
const METALS_API_KEY = process.env.METALS_API_KEY || 'demo'

export const fetchMetalPrices = async () => {
	try {
		// Mock data for MVP - replace with real API calls
		const mockData = {
			gold: {
				price: 65000,
				change24h: 0.5,
				trend: 'up',
				ma50: 64500,
				ma200: 63000
			},
			silver: {
				price: 750,
				change24h: 0.3,
				trend: 'up',
				ma50: 740,
				ma200: 720
			},
			diamond: {
				price: 45000,
				change24h: 0.1,
				trend: 'stable',
				rapaportIndex: 98.5
			}
		}

		// TODO: Replace with real API calls to Alpha Vantage, Metals-API, and Twelve Data
		return mockData
	} catch (error) {
		console.error('Error fetching metal prices:', error)
		throw error
	}
}
