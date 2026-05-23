export const calculateTravelCosts = async (tripData) => {
	const { startDate, endDate, travelers, tripType } = tripData

	const start = new Date(startDate)
	const end = new Date(endDate)
	const nights = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))

	// Per person costs (INR)
	const costs = {
		budget: {
			flights: 3000,
			hotel: 1500,
			food: 500,
			transport: 300,
			activities: 200
		},
		mid: {
			flights: 5000,
			hotel: 3000,
			food: 1000,
			transport: 500,
			activities: 500
		},
		luxury: {
			flights: 10000,
			hotel: 8000,
			food: 2500,
			transport: 1000,
			activities: 1500
		}
	}

	const base = costs[tripType] || costs.mid

	const flights    = Math.round(base.flights * travelers)
	const hotels     = Math.round(base.hotel * nights * travelers)
	const food       = Math.round(base.food * nights * travelers)
	const transport  = Math.round(base.transport * nights * travelers)
	const activities = Math.round(base.activities * nights * travelers)
	const insurance  = Math.round((flights + hotels) * 0.05)
	const currency   = Math.round((flights + hotels) * 0.02)
	const total      = flights + hotels + food + transport + activities + insurance + currency

	return {
		flights,
		hotels,
		food,
		transport,
		activities,
		insurance,
		currency,
		total,
		nights,
		travelers: Number(travelers),
		tripType,
	}
}
