export const calculateTravelCosts = async (tripData) => {
	const { startDate, endDate, travelers, tripType } = tripData

	// Calculate number of days
	const start = new Date(startDate)
	const end = new Date(endDate)
	const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24))

	// Base costs by trip type (per person, per day)
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

	const baseCosts = costs[tripType] || costs.mid

	// Calculate estimates
	const flights = baseCosts.flights * travelers
	const hotels = baseCosts.hotel * nights * travelers
	const food = baseCosts.food * nights * travelers
	const transport = baseCosts.transport * nights * travelers
	const activities = baseCosts.activities * nights * travelers
	const insurance = (flights + hotels) * 0.05 // 5% insurance
	const currency = (flights + hotels) * 0.02 // 2% currency exchange buffer

	const total =
		flights + hotels + food + transport + activities + insurance + currency

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
		breakdown: {
			accommodation: hotels,
			meals: food,
			activities: activities,
			transport: transport,
			insurance: insurance,
			currency: currency
		}
	}
}
