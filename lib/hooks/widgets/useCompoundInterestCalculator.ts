import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

export type CompoundingFrequency = 'daily' | 'monthly' | 'quarterly' | 'annually'

export interface CompoundInterestInput {
  principal: string
  rate: string
  time: string
  contribution: string
  contributionFrequency: CompoundingFrequency
  compoundingFrequency: CompoundingFrequency
}

export interface ChartDataPoint {
  period: string
  principal: number
  interest: number
  total: number
}

export interface YearlyBreakdown {
  year: number
  startBalance: number
  contribution: number
  interest: number
  endBalance: number
}

export interface CompoundInterestResult {
  finalAmount: number
  totalInterest: number
  totalContributions: number
  effectiveRate: number
  chartData: ChartDataPoint[]
  yearlyBreakdown: YearlyBreakdown[]
}

const COMPOUNDING_FREQUENCIES = {
  daily: 365,
  monthly: 12,
  quarterly: 4,
  annually: 1
}

export function useCompoundInterestCalculator(initialValues?: Partial<CompoundInterestInput>) {
  const [input, setInput] = useState<CompoundInterestInput>({
    principal: '',
    rate: '',
    time: '',
    contribution: '',
    contributionFrequency: 'monthly',
    compoundingFrequency: 'annually',
    ...initialValues
  })

  const [result, setResult] = useState<CompoundInterestResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Update single field
  const updateField = useCallback(<K extends keyof CompoundInterestInput>(
    field: K,
    value: CompoundInterestInput[K]
  ) => {
    setInput(prev => ({ ...prev, [field]: value }))
  }, [])

  // Calculate compound interest
  const calculate = useCallback(() => {
    const principal = parseFloat(input.principal) || 0
    const annualRate = parseFloat(input.rate) / 100 || 0
    const years = parseFloat(input.time) || 0
    const monthlyContribution = parseFloat(input.contribution) || 0

    if (principal === 0 && monthlyContribution === 0) {
      toast.error('Please enter either principal amount or monthly contribution')
      return
    }

    if (annualRate === 0) {
      toast.error('Please enter an interest rate')
      return
    }

    if (years === 0) {
      toast.error('Please enter a time period')
      return
    }

    setIsCalculating(true)

    try {
      const n = COMPOUNDING_FREQUENCIES[input.compoundingFrequency]
      const contributionPeriods = COMPOUNDING_FREQUENCIES[input.contributionFrequency]
      const contributionAmount = monthlyContribution * (12 / contributionPeriods)
      
      // Calculate final amount with compound interest and regular contributions
      let balance = principal
      const chartData: ChartDataPoint[] = []
      const yearlyBreakdown: YearlyBreakdown[] = []
      
      // Monthly tracking for chart
      for (let month = 0; month <= years * 12; month++) {
        const year = Math.floor(month / 12)
        const isYearEnd = month % 12 === 0 && month > 0
        
        if (month === 0) {
          chartData.push({
            period: 'Start',
            principal: principal,
            interest: 0,
            total: principal
          })
        } else {
          // Apply interest
          const monthlyRate = annualRate / 12
          const previousBalance = balance
          
          // Add contribution
          if (month % (12 / contributionPeriods) === 0) {
            balance += contributionAmount
          }
          
          // Apply compound interest based on frequency
          if (month % (12 / n) === 0) {
            const periodRate = annualRate / n
            balance = balance * (1 + periodRate)
          }
          
          // Add to chart data every 12 months or at the end
          if (isYearEnd || month === years * 12) {
            const totalContributions = principal + (contributionAmount * contributionPeriods * year)
            const interest = balance - totalContributions
            
            chartData.push({
              period: `Year ${year}`,
              principal: totalContributions,
              interest: Math.max(0, interest),
              total: balance
            })
          }
        }
        
        // Yearly breakdown
        if (isYearEnd) {
          const yearStartBalance = yearlyBreakdown.length > 0 
            ? yearlyBreakdown[yearlyBreakdown.length - 1].endBalance 
            : principal
          const yearContribution = contributionAmount * contributionPeriods
          const yearInterest = balance - yearStartBalance - yearContribution
          
          yearlyBreakdown.push({
            year,
            startBalance: yearStartBalance,
            contribution: yearContribution,
            interest: yearInterest,
            endBalance: balance
          })
        }
      }
      
      // Final calculations
      const totalContributions = principal + (contributionAmount * contributionPeriods * years)
      const totalInterest = balance - totalContributions
      const effectiveRate = principal > 0 
        ? (Math.pow(balance / principal, 1 / years) - 1) * 100
        : 0

      const calculationResult: CompoundInterestResult = {
        finalAmount: balance,
        totalInterest,
        totalContributions,
        effectiveRate,
        chartData,
        yearlyBreakdown
      }

      setResult(calculationResult)
      toast.success('Calculation completed!')
    } catch (error) {
      toast.error('Calculation failed')
      console.error('Compound interest calculation error:', error)
    } finally {
      setIsCalculating(false)
    }
  }, [input])

  // Auto-calculate when inputs change
  useEffect(() => {
    if (input.principal || input.contribution) {
      calculate()
    }
  }, [input.principal, input.rate, input.time, input.contribution, input.contributionFrequency, input.compoundingFrequency, calculate])

  // Copy results
  const copyResults = useCallback(() => {
    if (!result) {
      toast.error('No results to copy')
      return
    }

    const text = `
Compound Interest Calculator Results

Initial Investment: $${parseFloat(input.principal || '0').toLocaleString()}
Interest Rate: ${input.rate}%
Time Period: ${input.time} years
Regular Contribution: $${parseFloat(input.contribution || '0').toLocaleString()} ${input.contributionFrequency}
Compounding: ${input.compoundingFrequency}

Results:
Final Amount: $${result.finalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Total Interest Earned: $${result.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Total Contributions: $${result.totalContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Effective Annual Rate: ${result.effectiveRate.toFixed(2)}%

Yearly Breakdown:
${result.yearlyBreakdown.map(year => 
  `Year ${year.year}: $${year.endBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
).join('\n')}
    `.trim()

    navigator.clipboard.writeText(text)
    toast.success('Results copied to clipboard!')
  }, [input, result])

  // Reset calculator
  const reset = useCallback(() => {
    setInput({
      principal: '',
      rate: '',
      time: '',
      contribution: '',
      contributionFrequency: 'monthly',
      compoundingFrequency: 'annually'
    })
    setResult(null)
    toast.success('Calculator reset')
  }, [])

  // Load example
  const loadExample = useCallback(() => {
    setInput({
      principal: '10000',
      rate: '7',
      time: '10',
      contribution: '500',
      contributionFrequency: 'monthly',
      compoundingFrequency: 'annually'
    })
    toast.success('Example loaded')
  }, [])

  return {
    // State
    input,
    result,
    isCalculating,
    
    // Actions
    updateField,
    calculate,
    copyResults,
    reset,
    loadExample
  }
}

