import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

export interface CalculatorField<T = string> {
  name: string
  value: T
  error?: string
  required?: boolean
  validator?: (value: T) => string | undefined
}

export interface CalculatorResult {
  [key: string]: any
}

export interface CalculatorConfig<TFields extends Record<string, any>, TResult> {
  fields: TFields
  calculate: (fields: TFields) => TResult | null
  validate?: (fields: TFields) => Record<string, string>
  format?: (result: TResult) => string
  autoCalculate?: boolean
}

export function useCalculator<
  TFields extends Record<string, any>,
  TResult extends CalculatorResult
>(config: CalculatorConfig<TFields, TResult>) {
  const [fields, setFields] = useState<TFields>(config.fields)
  const [result, setResult] = useState<TResult | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isCalculating, setIsCalculating] = useState(false)
  const [history, setHistory] = useState<Array<{ fields: TFields; result: TResult }>>([])

  // Validate all fields
  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Custom validation
    if (config.validate) {
      Object.assign(newErrors, config.validate(fields))
    }
    
    // Required field validation
    Object.entries(fields).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        const fieldName = key.charAt(0).toUpperCase() + key.slice(1)
        newErrors[key] = `${fieldName} is required`
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [fields, config])

  // Calculate result
  const calculate = useCallback(() => {
    if (!validate()) {
      toast.error('Please fix the errors before calculating')
      return
    }

    setIsCalculating(true)
    
    try {
      const calculatedResult = config.calculate(fields)
      
      if (calculatedResult) {
        setResult(calculatedResult)
        
        // Add to history
        setHistory(prev => [
          { fields: { ...fields }, result: calculatedResult },
          ...prev.slice(0, 9) // Keep last 10 calculations
        ])
        
        toast.success('Calculation complete!')
      } else {
        toast.error('Unable to calculate with current values')
      }
    } catch (error) {
      toast.error('Calculation failed')
      console.error('Calculator error:', error)
    } finally {
      setIsCalculating(false)
    }
  }, [fields, validate, config])

  // Auto-calculate when fields change
  useEffect(() => {
    if (config.autoCalculate && Object.values(fields).every(v => v !== '' && v !== null)) {
      calculate()
    }
  }, [fields, calculate, config.autoCalculate])

  // Update single field
  const updateField = useCallback(<K extends keyof TFields>(
    name: K,
    value: TFields[K]
  ) => {
    setFields(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[name as string]
      return newErrors
    })
  }, [])

  // Update multiple fields
  const updateFields = useCallback((updates: Partial<TFields>) => {
    setFields(prev => ({ ...prev, ...updates }))
    
    // Clear errors for updated fields
    setErrors(prev => {
      const newErrors = { ...prev }
      Object.keys(updates).forEach(key => delete newErrors[key])
      return newErrors
    })
  }, [])

  // Reset calculator
  const reset = useCallback(() => {
    setFields(config.fields)
    setResult(null)
    setErrors({})
    toast.success('Calculator reset')
  }, [config.fields])

  // Copy result to clipboard
  const copyResult = useCallback(() => {
    if (!result) {
      toast.error('No result to copy')
      return
    }

    const text = config.format 
      ? config.format(result)
      : JSON.stringify(result, null, 2)
    
    navigator.clipboard.writeText(text)
    toast.success('Result copied!')
  }, [result, config])

  // Load from history
  const loadFromHistory = useCallback((index: number) => {
    const historyItem = history[index]
    if (historyItem) {
      setFields(historyItem.fields)
      setResult(historyItem.result)
      toast.success('Loaded from history')
    }
  }, [history])

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([])
    toast.success('History cleared')
  }, [])

  return {
    // State
    fields,
    result,
    errors,
    isCalculating,
    history,
    
    // Actions
    calculate,
    updateField,
    updateFields,
    reset,
    copyResult,
    loadFromHistory,
    clearHistory,
    
    // Validation
    validate,
    hasErrors: Object.keys(errors).length > 0
  }
}

