/**
 * Unit Converter Utilities
 * Pure functions for converting between CSS units (px, rem, em, %, pt, vw, vh)
 */

export type Unit = 'px' | 'rem' | 'em' | '%' | 'pt' | 'vw' | 'vh'

export interface ConversionResult {
	px: number
	rem: number
	em: number
	percent: number
	pt: number
	vw: number
	vh: number
}

export interface ConverterConfig {
	baseFontSize: number // Root font size (for rem)
	parentFontSize: number // Parent font size (for em)
	viewportWidth: number // Viewport width (for vw)
	viewportHeight: number // Viewport height (for vh)
}

/**
 * Detect unit from input string
 * @example "24px" → "px", "1.5rem" → "rem"
 */
export function detectUnit(input: string): Unit {
	const normalized = input.trim().toLowerCase()

	if (normalized.endsWith('rem')) return 'rem'
	if (normalized.endsWith('em')) return 'em'
	if (normalized.endsWith('px')) return 'px'
	if (normalized.endsWith('%')) return '%'
	if (normalized.endsWith('pt')) return 'pt'
	if (normalized.endsWith('vw')) return 'vw'
	if (normalized.endsWith('vh')) return 'vh'

	// Default to px if no unit specified
	return 'px'
}

/**
 * Extract numeric value from input string
 * @example "24px" → 24, "1.5rem" → 1.5
 */
export function extractNumericValue(input: string): number {
	const match = input.match(/^-?\d*\.?\d+/)
	return match ? parseFloat(match[0]) : 0
}

/**
 * Convert any unit to pixels (canonical format)
 */
export function toPixels(
	value: number,
	fromUnit: Unit,
	config: ConverterConfig
): number {
	switch (fromUnit) {
		case 'px':
			return value
		case 'rem':
			return value * config.baseFontSize
		case 'em':
			return value * config.parentFontSize
		case '%':
			return (value / 100) * config.parentFontSize
		case 'pt':
			return value / 0.75 // 1px = 0.75pt
		case 'vw':
			return (value / 100) * config.viewportWidth
		case 'vh':
			return (value / 100) * config.viewportHeight
		default:
			return value
	}
}

/**
 * Convert pixels to specific unit
 */
export function fromPixels(
	pxValue: number,
	toUnit: Unit,
	config: ConverterConfig
): number {
	switch (toUnit) {
		case 'px':
			return pxValue
		case 'rem':
			return pxValue / config.baseFontSize
		case 'em':
			return pxValue / config.parentFontSize
		case '%':
			return (pxValue / config.parentFontSize) * 100
		case 'pt':
			return pxValue * 0.75 // 1px = 0.75pt
		case 'vw':
			return (pxValue / config.viewportWidth) * 100
		case 'vh':
			return (pxValue / config.viewportHeight) * 100
		default:
			return pxValue
	}
}

/**
 * Convert value to all units at once
 */
export function convertToAllUnits(
	value: number,
	fromUnit: Unit,
	config: ConverterConfig
): ConversionResult {
	// First convert to pixels (canonical format)
	const pxValue = toPixels(value, fromUnit, config)

	// Then convert to all units
	return {
		px: fromPixels(pxValue, 'px', config),
		rem: fromPixels(pxValue, 'rem', config),
		em: fromPixels(pxValue, 'em', config),
		percent: fromPixels(pxValue, '%', config),
		pt: fromPixels(pxValue, 'pt', config),
		vw: fromPixels(pxValue, 'vw', config),
		vh: fromPixels(pxValue, 'vh', config)
	}
}

/**
 * Format number with specified decimal places, removing trailing zeros
 */
export function formatNumber(value: number, decimals: number = 3): string {
	const rounded = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
	return parseFloat(rounded.toFixed(decimals)).toString()
}

/**
 * Format value with unit
 */
export function formatWithUnit(value: number, unit: Unit, decimals: number = 3): string {
	return `${formatNumber(value, decimals)}${unit}`
}

/**
 * Parse input string to value and unit
 */
export function parseInput(input: string): { value: number; unit: Unit } {
	const unit = detectUnit(input)
	const value = extractNumericValue(input)
	return { value, unit }
}

/**
 * Default configuration
 */
export const DEFAULT_CONFIG: ConverterConfig = {
	baseFontSize: 16,
	parentFontSize: 16,
	viewportWidth: 1440,
	viewportHeight: 900
}

/**
 * Common preset sizes
 */
export const PRESET_SIZES = {
	typography: [
		{ label: 'Caption', px: 12 },
		{ label: 'Body S', px: 14 },
		{ label: 'Body', px: 16 },
		{ label: 'H6', px: 18 },
		{ label: 'H5', px: 20 },
		{ label: 'H4', px: 24 },
		{ label: 'H3', px: 28 },
		{ label: 'H2', px: 32 },
		{ label: 'H1', px: 36 },
		{ label: 'Display', px: 48 }
	],
	spacing: [
		{ label: 'XXS', px: 4 },
		{ label: 'XS', px: 8 },
		{ label: 'S', px: 12 },
		{ label: 'M', px: 16 },
		{ label: 'L', px: 24 },
		{ label: 'XL', px: 32 },
		{ label: 'XXL', px: 48 },
		{ label: 'XXXL', px: 64 }
	],
	common: [
		{ label: 'Icon S', px: 16 },
		{ label: 'Icon M', px: 24 },
		{ label: 'Icon L', px: 32 },
		{ label: 'Button', px: 40 },
		{ label: 'Input', px: 48 }
	]
}

/**
 * Validation
 */
export function isValidNumber(value: string): boolean {
	const num = parseFloat(value)
	return !isNaN(num) && isFinite(num)
}

export function isPositiveNumber(value: string): boolean {
	const num = parseFloat(value)
	return isValidNumber(value) && num > 0
}
