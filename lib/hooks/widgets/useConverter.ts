import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import {
	convertToAllUnits,
	parseInput,
	formatNumber,
	formatWithUnit,
	DEFAULT_CONFIG,
	type Unit,
	type ConversionResult,
	type ConverterConfig
} from '@/lib/utils/unit-converter'

export interface ConverterState {
	inputValue: string
	inputUnit: Unit
	config: ConverterConfig
	results: ConversionResult | null
	lastEditedField: 'input' | 'px' | 'rem' | 'em' | null
}

export interface ConverterActions {
	setInputValue: (value: string) => void
	setFieldValue: (field: 'px' | 'rem' | 'em', value: string) => void
	setBaseFont: (size: number) => void
	setParentFont: (size: number) => void
	setViewportWidth: (width: number) => void
	setViewportHeight: (height: number) => void
	loadPreset: (px: number) => void
	reset: () => void
	formatValue: (value: number, decimals?: number) => string
	formatValueWithUnit: (value: number, unit: Unit, decimals?: number) => string
}

export interface UseConverterReturn extends ConverterState, ConverterActions {}

/**
 * Custom hook for unit converter
 * Manages state and conversion logic with auto-calculation
 */
export function useConverter(): UseConverterReturn {
	const [inputValue, setInputValueState] = useState<string>('16')
	const [inputUnit, setInputUnit] = useState<Unit>('px')
	const [config, setConfig] = useState<ConverterConfig>(DEFAULT_CONFIG)
	const [results, setResults] = useState<ConversionResult | null>(null)
	const [lastEditedField, setLastEditedField] = useState<
		'input' | 'px' | 'rem' | 'em' | null
	>('input')

	// Debounce timer ref
	const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined)

	/**
	 * Calculate conversions
	 */
	const calculate = useCallback(
		(value: string, unit: Unit) => {
			if (!value || value === '') {
				setResults(null)
				return
			}

			const numValue = parseFloat(value)
			if (isNaN(numValue) || !isFinite(numValue)) {
				setResults(null)
				return
			}

			const conversions = convertToAllUnits(numValue, unit, config)
			setResults(conversions)
		},
		[config]
	)

	/**
	 * Auto-calculate with debounce when input or config changes
	 */
	useEffect(() => {
		// Clear previous timer
		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current)
		}

		// Set new timer for auto-calculation
		debounceTimer.current = setTimeout(() => {
			calculate(inputValue, inputUnit)
		}, 300)

		// Cleanup
		return () => {
			if (debounceTimer.current) {
				clearTimeout(debounceTimer.current)
			}
		}
	}, [inputValue, inputUnit, config, calculate])

	/**
	 * Set input value (main input field)
	 */
	const setInputValue = useCallback((value: string) => {
		const parsed = parseInput(value)
		setInputValueState(parsed.value.toString())
		setInputUnit(parsed.unit)
		setLastEditedField('input')
	}, [])

	/**
	 * Set field value (bidirectional editing)
	 */
	const setFieldValue = useCallback(
		(field: 'px' | 'rem' | 'em', value: string) => {
			const numValue = parseFloat(value)
			if (isNaN(numValue) || !isFinite(numValue)) {
				setInputValueState('')
				setResults(null)
				return
			}

			setInputValueState(numValue.toString())
			setInputUnit(field)
			setLastEditedField(field)
		},
		[]
	)

	/**
	 * Set base font size
	 */
	const setBaseFont = useCallback((size: number) => {
		setConfig(prev => ({
			...prev,
			baseFontSize: size
		}))
	}, [])

	/**
	 * Set parent font size
	 */
	const setParentFont = useCallback((size: number) => {
		setConfig(prev => ({
			...prev,
			parentFontSize: size
		}))
	}, [])

	/**
	 * Set viewport width
	 */
	const setViewportWidth = useCallback((width: number) => {
		setConfig(prev => ({
			...prev,
			viewportWidth: width
		}))
	}, [])

	/**
	 * Set viewport height
	 */
	const setViewportHeight = useCallback((height: number) => {
		setConfig(prev => ({
			...prev,
			viewportHeight: height
		}))
	}, [])

	/**
	 * Load preset value
	 */
	const loadPreset = useCallback((px: number) => {
		setInputValueState(px.toString())
		setInputUnit('px')
		setLastEditedField('input')
	}, [])

	/**
	 * Reset to default
	 */
	const reset = useCallback(() => {
		setInputValueState('16')
		setInputUnit('px')
		setConfig(DEFAULT_CONFIG)
		setResults(null)
		setLastEditedField('input')
	}, [])

	/**
	 * Format number helper
	 */
	const formatValue = useCallback((value: number, decimals: number = 3) => {
		return formatNumber(value, decimals)
	}, [])

	/**
	 * Format value with unit helper
	 */
	const formatValueWithUnit = useCallback(
		(value: number, unit: Unit, decimals: number = 3) => {
			return formatWithUnit(value, unit, decimals)
		},
		[]
	)

	return {
		// State
		inputValue,
		inputUnit,
		config,
		results,
		lastEditedField,

		// Actions
		setInputValue,
		setFieldValue,
		setBaseFont,
		setParentFont,
		setViewportWidth,
		setViewportHeight,
		loadPreset,
		reset,
		formatValue,
		formatValueWithUnit
	}
}
