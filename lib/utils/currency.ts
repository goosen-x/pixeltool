export function formatCurrency(
	value: number,
	currency = 'USD',
	locale = 'en-US'
): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(value)
}

export function formatCurrencyDetailed(
	value: number,
	currency = 'USD',
	locale = 'en-US'
): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(value)
}

export function formatPercentage(value: number, decimals = 2): string {
	return `${value.toFixed(decimals)}%`
}

export function formatNumber(value: number, decimals = 0): string {
	return new Intl.NumberFormat('en-US', {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	}).format(value)
}
