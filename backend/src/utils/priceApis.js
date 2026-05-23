import axios from 'axios'

const GOLDAPI_KEY = process.env.GOLDAPI_KEY || ''

// ─── In-memory cache ───────────────────────────────────────────────
// Keyed by source name, stores { data, fetchedAt }
// TTLs: metals = 6h (100 req/month budget), crypto/forex = 15min
const CACHE = {}
const TTL = {
	metals: 6 * 60 * 60 * 1000,   // 6 hours
	crypto:     15 * 60 * 1000,   // 15 minutes
	forex:      15 * 60 * 1000,   // 15 minutes
}

const isFresh = (key) => {
	const entry = CACHE[key]
	if (!entry) return false
	return (Date.now() - entry.fetchedAt) < TTL[key]
}

const setCache = (key, data) => {
	CACHE[key] = { data, fetchedAt: Date.now() }
}

// ─── Fallback mock data ────────────────────────────────────────────
const MOCK = {
	metals: {
		gold:   { price: 65000, change24h: 0.5,  ma50: 64500, ma200: 63000 },
		silver: { price: 750,   change24h: 1.2,  ma50: 740,   ma200: 720 },
		diamond:{ price: 45000, change24h: 0.1,  rapaportIndex: 98.5 },
	},
	crypto: {
		bitcoin: { priceINR: 4500000, change24h: 2.3 },
	},
	forex: {
		usdInr: 83.5,
		change24h: -0.3,
	},
}

// ─── GoldAPI.io — gold & silver in INR ────────────────────────────
// Returns price_gram_24k (INR per gram) — multiply by 10 for per 10g
// Signup free at goldapi.io (100 req/month)
const fetchMetalsFromGoldAPI = async () => {
	if (!GOLDAPI_KEY) throw new Error('No GOLDAPI_KEY set')
	if (isFresh('metals')) {
		console.log('📦 Metals: serving from cache')
		return CACHE.metals.data
	}

	const headers = { 'x-access-token': GOLDAPI_KEY, 'Content-Type': 'application/json' }

	const [goldRes, silverRes] = await Promise.all([
		axios.get('https://www.goldapi.io/api/XAU/INR', { headers, timeout: 6000 }),
		axios.get('https://www.goldapi.io/api/XAG/INR', { headers, timeout: 6000 }),
	])

	const g = goldRes.data
	const s = silverRes.data

	const result = {
		gold: {
			price:     Math.round((g.price_gram_24k || 0) * 10), // per 10g
			change24h: g.chp ?? null,                            // % change
			ma50:      null,
			ma200:     null,
		},
		silver: {
			price:     Math.round((s.price_gram_24k || 0) * 10),
			change24h: s.chp ?? null,
			ma50:      null,
			ma200:     null,
		},
		diamond: MOCK.metals.diamond,
	}

	setCache('metals', result)
	console.log('✅ Metals: live data from GoldAPI.io')
	return result
}

// ─── CoinGecko — Bitcoin in INR (no key needed) ───────────────────
const fetchCryptoFromCoinGecko = async () => {
	if (isFresh('crypto')) {
		console.log('📦 Crypto: serving from cache')
		return CACHE.crypto.data
	}

	const res = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
		params: {
			ids: 'bitcoin',
			vs_currencies: 'inr',
			include_24hr_change: true,
		},
		timeout: 6000,
	})

	const btc = res.data?.bitcoin
	if (!btc) throw new Error('CoinGecko returned empty data')

	const result = {
		bitcoin: {
			priceINR:  Math.round(btc.inr),
			change24h: btc.inr_24h_change ? parseFloat(btc.inr_24h_change.toFixed(2)) : null,
		},
	}

	setCache('crypto', result)
	console.log('✅ Crypto: live data from CoinGecko')
	return result
}

// ─── Frankfurter.app — USD/INR rate (no key needed) ───────────────
const fetchForexFromFrankfurter = async () => {
	if (isFresh('forex')) {
		console.log('📦 Forex: serving from cache')
		return CACHE.forex.data
	}

	const [todayRes, yesterdayRes] = await Promise.all([
		axios.get('https://api.frankfurter.app/latest?from=USD&to=INR', { timeout: 6000 }),
		axios.get('https://api.frankfurter.app/latest?from=USD&to=INR', { timeout: 6000 }), // same endpoint, ECB updates daily
	])

	const usdInr = todayRes.data?.rates?.INR
	if (!usdInr) throw new Error('Frankfurter returned empty data')

	const result = {
		usdInr:    parseFloat(usdInr.toFixed(2)),
		change24h: null, // ECB doesn't give intraday change; kept null
	}

	setCache('forex', result)
	console.log('✅ Forex: live USD/INR from Frankfurter')
	return result
}

// ─── Public exports ────────────────────────────────────────────────

export const fetchMetalPrices = async () => {
	try {
		return await fetchMetalsFromGoldAPI()
	} catch (err) {
		console.warn('⚠️  Metals live fetch failed, using mock:', err.message)
		return MOCK.metals
	}
}

export const fetchCryptoPrices = async () => {
	try {
		return await fetchCryptoFromCoinGecko()
	} catch (err) {
		console.warn('⚠️  Crypto live fetch failed, using mock:', err.message)
		return MOCK.crypto
	}
}

export const fetchForexRates = async () => {
	try {
		return await fetchForexFromFrankfurter()
	} catch (err) {
		console.warn('⚠️  Forex live fetch failed, using mock:', err.message)
		return MOCK.forex
	}
}
