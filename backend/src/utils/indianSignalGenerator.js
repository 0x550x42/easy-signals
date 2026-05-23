export const generateIndianSignals = () => {
	// Mock data for MVP - all signals based on public economic indicators
	const signals = [
		{
			id: 'gold',
			decision: 'WAIT',
			reason: 'Consolidating at ₹65k. Wait for dip below ₹64k.',
			price: 65000,
			change24h: 0.5
		},
		{
			id: 'silver',
			decision: 'YES',
			reason: 'Silver 15% below gold ratio. Good entry point.',
			price: 750,
			change24h: 1.2
		},
		{
			id: 'nifty',
			decision: 'NO',
			reason: 'Nifty PE at 22x, above 10-year avg. Overvalued.',
			price: 22500,
			change24h: -0.8
		},
		{
			id: 'realEstate',
			decision: 'WAIT',
			reason: 'Rates at 6.5%. Likely to drop further by Sept.',
			price: null,
			change24h: null
		},
		{
			id: 'fd',
			decision: 'YES',
			reason: 'FD rates at 6.5% PA. Beat inflation expectations.',
			price: null,
			change24h: null
		},
		{
			id: 'goldScheme',
			decision: 'WAIT',
			reason: 'Gold prices consolidating. Wait for clarity.',
			price: null,
			change24h: null
		},
		{
			id: 'personalLoan',
			decision: 'NO',
			reason: 'Personal loan rates at 12-14%. Too expensive now.',
			price: null,
			change24h: null
		},
		{
			id: 'vehiclePurchase',
			decision: 'WAIT',
			reason: 'New models launching in June. Wait for options.',
			price: null,
			change24h: null
		},
		{
			id: 'healthInsurance',
			decision: 'YES',
			reason: 'Premium increases effective 1 June. Buy before.',
			price: null,
			change24h: null
		},
		{
			id: 'domesticTravel',
			decision: 'WAIT',
			reason: 'Peak season over. Prices drop 20-30% by July.',
			price: null,
			change24h: null
		},
		{
			id: 'crypto',
			decision: 'WAIT',
			reason: 'Bitcoin at resistance. Watch for breakout above ₹45L.',
			price: 4500000,
			change24h: 2.3
		},
		{
			id: 'inrStrength',
			decision: 'NO',
			reason: 'INR weakening (₹83.5 vs USD). Foreign travel expensive.',
			price: 83.5,
			change24h: -0.3
		}
	]

	return signals
}
