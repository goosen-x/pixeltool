import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

export type CalculationType =
	| 'percentOfNumber'
	| 'whatPercent'
	| 'findTotal'
	| 'percentChange'
	| 'addPercent'
	| 'subtractPercent'

export interface PercentageResult {
	type: CalculationType
	result: number
	formula: string
	explanation: string
}

export function usePercentageCalculator() {
	const [activeType, setActiveType] =
		useState<CalculationType>('percentOfNumber')
	const [values, setValues] = useState({
		// Percent of number
		percentOfValue: '',
		percentOfPercentage: '',

		// What percent
		whatPercentValue1: '',
		whatPercentValue2: '',

		// Find total
		findTotalValue: '',
		findTotalPercentage: '',

		// Percent change
		changeOldValue: '',
		changeNewValue: '',

		// Add/Subtract percent
		addSubtractValue: '',
		addSubtractPercentage: ''
	})

	const [results, setResults] = useState<
		Record<CalculationType, PercentageResult | null>
	>({
		percentOfNumber: null,
		whatPercent: null,
		findTotal: null,
		percentChange: null,
		addPercent: null,
		subtractPercent: null
	})

	// Update value
	const updateValue = useCallback((field: string, value: string) => {
		setValues(prev => ({ ...prev, [field]: value }))
	}, [])

	// Calculate percent of number
	const calculatePercentOfNumber = useCallback(() => {
		const value = parseFloat(values.percentOfValue)
		const percentage = parseFloat(values.percentOfPercentage)

		if (isNaN(value) || isNaN(percentage)) {
			setResults(prev => ({ ...prev, percentOfNumber: null }))
			return
		}

		const result = (value * percentage) / 100

		setResults(prev => ({
			...prev,
			percentOfNumber: {
				type: 'percentOfNumber',
				result,
				formula: `${value} × ${percentage}% = ${result}`,
				explanation: `${percentage}% of ${value} is ${result}`
			}
		}))
	}, [values.percentOfValue, values.percentOfPercentage])

	// Calculate what percent
	const calculateWhatPercent = useCallback(() => {
		const value1 = parseFloat(values.whatPercentValue1)
		const value2 = parseFloat(values.whatPercentValue2)

		if (isNaN(value1) || isNaN(value2) || value2 === 0) {
			setResults(prev => ({ ...prev, whatPercent: null }))
			return
		}

		const result = (value1 / value2) * 100

		setResults(prev => ({
			...prev,
			whatPercent: {
				type: 'whatPercent',
				result,
				formula: `(${value1} ÷ ${value2}) × 100 = ${result}%`,
				explanation: `${value1} is ${result.toFixed(2)}% of ${value2}`
			}
		}))
	}, [values.whatPercentValue1, values.whatPercentValue2])

	// Calculate find total
	const calculateFindTotal = useCallback(() => {
		const value = parseFloat(values.findTotalValue)
		const percentage = parseFloat(values.findTotalPercentage)

		if (isNaN(value) || isNaN(percentage) || percentage === 0) {
			setResults(prev => ({ ...prev, findTotal: null }))
			return
		}

		const result = (value / percentage) * 100

		setResults(prev => ({
			...prev,
			findTotal: {
				type: 'findTotal',
				result,
				formula: `${value} ÷ ${percentage}% = ${result}`,
				explanation: `If ${value} is ${percentage}%, then the total is ${result}`
			}
		}))
	}, [values.findTotalValue, values.findTotalPercentage])

	// Calculate percent change
	const calculatePercentChange = useCallback(() => {
		const oldValue = parseFloat(values.changeOldValue)
		const newValue = parseFloat(values.changeNewValue)

		if (isNaN(oldValue) || isNaN(newValue) || oldValue === 0) {
			setResults(prev => ({ ...prev, percentChange: null }))
			return
		}

		const change = newValue - oldValue
		const result = (change / oldValue) * 100

		setResults(prev => ({
			...prev,
			percentChange: {
				type: 'percentChange',
				result,
				formula: `((${newValue} - ${oldValue}) ÷ ${oldValue}) × 100 = ${result}%`,
				explanation: `${result > 0 ? 'Increase' : 'Decrease'} of ${Math.abs(result).toFixed(2)}%`
			}
		}))
	}, [values.changeOldValue, values.changeNewValue])

	// Calculate add percent
	const calculateAddPercent = useCallback(() => {
		const value = parseFloat(values.addSubtractValue)
		const percentage = parseFloat(values.addSubtractPercentage)

		if (isNaN(value) || isNaN(percentage)) {
			setResults(prev => ({ ...prev, addPercent: null }))
			return
		}

		const increase = (value * percentage) / 100
		const result = value + increase

		setResults(prev => ({
			...prev,
			addPercent: {
				type: 'addPercent',
				result,
				formula: `${value} + (${value} × ${percentage}%) = ${result}`,
				explanation: `${value} increased by ${percentage}% is ${result}`
			}
		}))
	}, [values.addSubtractValue, values.addSubtractPercentage])

	// Calculate subtract percent
	const calculateSubtractPercent = useCallback(() => {
		const value = parseFloat(values.addSubtractValue)
		const percentage = parseFloat(values.addSubtractPercentage)

		if (isNaN(value) || isNaN(percentage)) {
			setResults(prev => ({ ...prev, subtractPercent: null }))
			return
		}

		const decrease = (value * percentage) / 100
		const result = value - decrease

		setResults(prev => ({
			...prev,
			subtractPercent: {
				type: 'subtractPercent',
				result,
				formula: `${value} - (${value} × ${percentage}%) = ${result}`,
				explanation: `${value} decreased by ${percentage}% is ${result}`
			}
		}))
	}, [values.addSubtractValue, values.addSubtractPercentage])

	// Auto-calculate based on active type and values
	useEffect(() => {
		switch (activeType) {
			case 'percentOfNumber':
				calculatePercentOfNumber()
				break
			case 'whatPercent':
				calculateWhatPercent()
				break
			case 'findTotal':
				calculateFindTotal()
				break
			case 'percentChange':
				calculatePercentChange()
				break
			case 'addPercent':
				calculateAddPercent()
				break
			case 'subtractPercent':
				calculateSubtractPercent()
				break
		}
	}, [
		activeType,
		values,
		calculatePercentOfNumber,
		calculateWhatPercent,
		calculateFindTotal,
		calculatePercentChange,
		calculateAddPercent,
		calculateSubtractPercent
	])

	// Copy result
	const copyResult = useCallback(
		(type: CalculationType) => {
			const result = results[type]
			if (!result) {
				toast.error('No result to copy')
				return
			}

			const text = `${result.explanation}\nFormula: ${result.formula}`
			navigator.clipboard.writeText(text)
			toast.success('Result copied!')
		},
		[results]
	)

	// Reset all
	const reset = useCallback(() => {
		setValues({
			percentOfValue: '',
			percentOfPercentage: '',
			whatPercentValue1: '',
			whatPercentValue2: '',
			findTotalValue: '',
			findTotalPercentage: '',
			changeOldValue: '',
			changeNewValue: '',
			addSubtractValue: '',
			addSubtractPercentage: ''
		})
		setResults({
			percentOfNumber: null,
			whatPercent: null,
			findTotal: null,
			percentChange: null,
			addPercent: null,
			subtractPercent: null
		})
		toast.success('Calculator reset')
	}, [])

	// Load example for current type
	const loadExample = useCallback(() => {
		switch (activeType) {
			case 'percentOfNumber':
				updateValue('percentOfValue', '200')
				updateValue('percentOfPercentage', '15')
				break
			case 'whatPercent':
				updateValue('whatPercentValue1', '25')
				updateValue('whatPercentValue2', '200')
				break
			case 'findTotal':
				updateValue('findTotalValue', '30')
				updateValue('findTotalPercentage', '15')
				break
			case 'percentChange':
				updateValue('changeOldValue', '100')
				updateValue('changeNewValue', '125')
				break
			case 'addPercent':
			case 'subtractPercent':
				updateValue('addSubtractValue', '100')
				updateValue('addSubtractPercentage', '20')
				break
		}
		toast.success('Example loaded')
	}, [activeType, updateValue])

	return {
		// State
		activeType,
		values,
		results,

		// Actions
		setActiveType,
		updateValue,
		copyResult,
		reset,
		loadExample,

		// Individual calculators (for manual trigger if needed)
		calculatePercentOfNumber,
		calculateWhatPercent,
		calculateFindTotal,
		calculatePercentChange,
		calculateAddPercent,
		calculateSubtractPercent
	}
}
