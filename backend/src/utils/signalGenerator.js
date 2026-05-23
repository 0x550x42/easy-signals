export const generateSignal = (metal, priceData) => {
	let decision = 'WAIT'
	let reason = ''

	if (metal === 'gold') {
		// Gold signal logic
		const trend =
			priceData.change24h > 0.5
				? 'up'
				: priceData.change24h < -0.5
					? 'down'
					: 'neutral'

		if (trend === 'down' && priceData.price < priceData.ma50) {
			decision = 'YES'
			reason = 'Price below 50-day average. Good buying opportunity.'
		} else if (trend === 'up' && priceData.price > priceData.ma200) {
			decision = 'NO'
			reason = 'Strong uptrend. Wait for pullback before buying.'
		} else {
			decision = 'WAIT'
			reason = 'Consolidating. Watch for clearer signals.'
		}
	} else if (metal === 'silver') {
		const trend =
			priceData.change24h > 0.3
				? 'up'
				: priceData.change24h < -0.3
					? 'down'
					: 'neutral'

		if (trend === 'down') {
			decision = 'YES'
			reason =
				'Silver showing strength relative to gold. Consider buying.'
		} else {
			decision = 'WAIT'
			reason = 'Wait for better entry point.'
		}
	} else if (metal === 'diamond') {
		if (priceData.rapaportIndex < 100) {
			decision = 'YES'
			reason = 'Rapaport index below par. Favorable for buyers.'
		} else {
			decision = 'NO'
			reason = 'Premium pricing. Wait for better deals.'
		}
	}

	return {
		decision,
		reason,
		price: priceData.price,
		change24h: priceData.change24h,
		metadata: priceData
	}
}
