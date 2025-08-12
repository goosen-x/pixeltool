import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

export interface ConversionUnit {
  id: string
  name: string
  symbol: string
  factor: number // Conversion factor to base unit
  offset?: number // For temperature conversions
}

export interface ConversionCategory {
  id: string
  name: string
  baseUnit: string
  units: ConversionUnit[]
}

export interface ConverterConfig<T = number> {
  categories: ConversionCategory[]
  defaultCategory?: string
  defaultFromUnit?: string
  defaultToUnit?: string
  precision?: number
  customConvert?: (value: T, from: string, to: string) => T
  format?: (value: T) => string
  parse?: (value: string) => T
}

export interface ConversionResult<T = number> {
  value: T
  from: ConversionUnit
  to: ConversionUnit
  formatted: string
}

export function useConverter<T = number>(config: ConverterConfig<T>) {
  const [category, setCategory] = useState(
    config.defaultCategory || config.categories[0]?.id || ''
  )
  const [fromUnit, setFromUnit] = useState(config.defaultFromUnit || '')
  const [toUnit, setToUnit] = useState(config.defaultToUnit || '')
  const [inputValue, setInputValue] = useState('')
  const [result, setResult] = useState<ConversionResult<T> | null>(null)
  const [history, setHistory] = useState<ConversionResult<T>[]>([])
  const [favorites, setFavorites] = useState<Array<{ from: string; to: string }>>([])

  // Get current category data
  const currentCategory = config.categories.find(c => c.id === category)
  const units = currentCategory?.units || []

  // Initialize units when category changes
  useEffect(() => {
    if (currentCategory && !fromUnit) {
      setFromUnit(units[0]?.id || '')
    }
    if (currentCategory && !toUnit) {
      setToUnit(units[1]?.id || units[0]?.id || '')
    }
  }, [category, currentCategory, fromUnit, toUnit, units])

  // Parse input value
  const parseValue = useCallback((value: string): T | null => {
    if (!value) return null
    
    if (config.parse) {
      try {
        return config.parse(value)
      } catch {
        return null
      }
    }
    
    const parsed = parseFloat(value)
    return isNaN(parsed) ? null : (parsed as unknown as T)
  }, [config])

  // Format output value
  const formatValue = useCallback((value: T): string => {
    if (config.format) {
      return config.format(value)
    }
    
    const num = value as unknown as number
    const precision = config.precision ?? 6
    
    // Use appropriate formatting based on value magnitude
    if (Math.abs(num) >= 1000000) {
      return num.toExponential(precision)
    } else if (Math.abs(num) < 0.0001 && num !== 0) {
      return num.toExponential(precision)
    } else {
      return parseFloat(num.toFixed(precision)).toString()
    }
  }, [config])

  // Perform conversion
  const convert = useCallback((
    value: T,
    fromUnitId: string,
    toUnitId: string
  ): T | null => {
    if (!currentCategory) return null
    
    const from = units.find(u => u.id === fromUnitId)
    const to = units.find(u => u.id === toUnitId)
    
    if (!from || !to) return null
    
    // Use custom conversion if provided
    if (config.customConvert) {
      return config.customConvert(value, fromUnitId, toUnitId)
    }
    
    // Standard conversion through base unit
    let baseValue = (value as unknown as number) * from.factor
    if (from.offset) baseValue += from.offset
    
    let result = baseValue / to.factor
    if (to.offset) result -= to.offset
    
    return result as unknown as T
  }, [currentCategory, units, config])

  // Handle conversion
  const handleConvert = useCallback(() => {
    const value = parseValue(inputValue)
    if (value === null) {
      toast.error('Please enter a valid number')
      return
    }
    
    const from = units.find(u => u.id === fromUnit)
    const to = units.find(u => u.id === toUnit)
    
    if (!from || !to) {
      toast.error('Please select units')
      return
    }
    
    const convertedValue = convert(value, fromUnit, toUnit)
    if (convertedValue === null) {
      toast.error('Conversion failed')
      return
    }
    
    const conversionResult: ConversionResult<T> = {
      value: convertedValue,
      from,
      to,
      formatted: formatValue(convertedValue)
    }
    
    setResult(conversionResult)
    
    // Add to history
    setHistory(prev => [conversionResult, ...prev.slice(0, 19)])
  }, [inputValue, fromUnit, toUnit, units, parseValue, convert, formatValue])

  // Auto-convert when inputs change
  useEffect(() => {
    if (inputValue && fromUnit && toUnit) {
      handleConvert()
    }
  }, [inputValue, fromUnit, toUnit])

  // Swap units
  const swapUnits = useCallback(() => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    toast.success('Units swapped')
  }, [fromUnit, toUnit])

  // Add to favorites
  const addToFavorites = useCallback(() => {
    if (!fromUnit || !toUnit) return
    
    const exists = favorites.some(
      f => f.from === fromUnit && f.to === toUnit
    )
    
    if (!exists) {
      setFavorites(prev => [...prev, { from: fromUnit, to: toUnit }])
      toast.success('Added to favorites')
    }
  }, [fromUnit, toUnit, favorites])

  // Load favorite
  const loadFavorite = useCallback((favorite: { from: string; to: string }) => {
    setFromUnit(favorite.from)
    setToUnit(favorite.to)
    toast.success('Favorite loaded')
  }, [])

  // Clear all
  const clear = useCallback(() => {
    setInputValue('')
    setResult(null)
    toast.success('Cleared')
  }, [])

  // Copy result
  const copyResult = useCallback(() => {
    if (!result) {
      toast.error('No result to copy')
      return
    }
    
    const text = `${inputValue} ${result.from.symbol} = ${result.formatted} ${result.to.symbol}`
    navigator.clipboard.writeText(text)
    toast.success('Result copied!')
  }, [inputValue, result])

  return {
    // State
    category,
    fromUnit,
    toUnit,
    inputValue,
    result,
    history,
    favorites,
    currentCategory,
    units,
    
    // Actions
    setCategory,
    setFromUnit,
    setToUnit,
    setInputValue,
    handleConvert,
    swapUnits,
    addToFavorites,
    loadFavorite,
    clear,
    copyResult,
    
    // Utilities
    parseValue,
    formatValue,
    convert
  }
}

// Example: Temperature converter
export const temperatureCategories: ConversionCategory[] = [
  {
    id: 'temperature',
    name: 'Temperature',
    baseUnit: 'kelvin',
    units: [
      { id: 'celsius', name: 'Celsius', symbol: '°C', factor: 1, offset: 273.15 },
      { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F', factor: 5/9, offset: 459.67 },
      { id: 'kelvin', name: 'Kelvin', symbol: 'K', factor: 1, offset: 0 }
    ]
  }
]

// Example: Length converter
export const lengthCategories: ConversionCategory[] = [
  {
    id: 'length',
    name: 'Length',
    baseUnit: 'meter',
    units: [
      { id: 'meter', name: 'Meter', symbol: 'm', factor: 1 },
      { id: 'kilometer', name: 'Kilometer', symbol: 'km', factor: 1000 },
      { id: 'centimeter', name: 'Centimeter', symbol: 'cm', factor: 0.01 },
      { id: 'millimeter', name: 'Millimeter', symbol: 'mm', factor: 0.001 },
      { id: 'mile', name: 'Mile', symbol: 'mi', factor: 1609.344 },
      { id: 'yard', name: 'Yard', symbol: 'yd', factor: 0.9144 },
      { id: 'foot', name: 'Foot', symbol: 'ft', factor: 0.3048 },
      { id: 'inch', name: 'Inch', symbol: 'in', factor: 0.0254 }
    ]
  }
]