import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

export type LoanType = 'amortizing' | 'interestOnly' | 'balloon'

export interface LoanInput {
  principal: string
  rate: string
  term: string
  loanType: LoanType
  downPayment?: string
  extraPayment?: string
}

export interface MonthlyPayment {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export interface LoanResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  payoffDate: Date
  paymentSchedule: MonthlyPayment[]
  summary: {
    loanAmount: number
    totalInterest: number
    totalPayment: number
    monthlyPayment: number
    payoffTime: string
  }
}

export function useLoanCalculator(initialValues?: Partial<LoanInput>) {
  const [input, setInput] = useState<LoanInput>({
    principal: '',
    rate: '',
    term: '',
    loanType: 'amortizing',
    downPayment: '',
    extraPayment: '',
    ...initialValues
  })

  const [result, setResult] = useState<LoanResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Update single field
  const updateField = useCallback(<K extends keyof LoanInput>(
    field: K,
    value: LoanInput[K]
  ) => {
    setInput(prev => ({ ...prev, [field]: value }))
  }, [])

  // Calculate loan payments
  const calculate = useCallback(() => {
    const principal = parseFloat(input.principal) || 0
    const annualRate = parseFloat(input.rate) / 100 || 0
    const termYears = parseFloat(input.term) || 0
    const downPayment = parseFloat(input.downPayment || '0') || 0
    const extraPayment = parseFloat(input.extraPayment || '0') || 0

    if (principal <= 0) {
      toast.error('Please enter a loan amount')
      return
    }

    if (annualRate < 0) {
      toast.error('Please enter a valid interest rate')
      return
    }

    if (termYears <= 0) {
      toast.error('Please enter a loan term')
      return
    }

    setIsCalculating(true)

    try {
      const loanAmount = principal - downPayment
      const monthlyRate = annualRate / 12
      const numberOfPayments = termYears * 12

      let monthlyPayment: number = 0
      let paymentSchedule: MonthlyPayment[] = []

      if (input.loanType === 'amortizing') {
        // Standard amortizing loan
        if (monthlyRate === 0) {
          monthlyPayment = loanAmount / numberOfPayments
        } else {
          monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                         (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
        }

        // Generate payment schedule
        let balance = loanAmount
        let totalPayment = 0
        let actualPayoffMonth = numberOfPayments

        for (let month = 1; month <= numberOfPayments && balance > 0; month++) {
          const interestPayment = balance * monthlyRate
          let principalPayment = monthlyPayment - interestPayment + extraPayment
          
          // Don't overpay
          if (principalPayment > balance) {
            principalPayment = balance
            monthlyPayment = interestPayment + principalPayment
            actualPayoffMonth = month
          }

          balance = Math.max(0, balance - principalPayment)
          totalPayment += monthlyPayment

          paymentSchedule.push({
            month,
            payment: monthlyPayment,
            principal: principalPayment - extraPayment,
            interest: interestPayment,
            balance
          })

          if (balance <= 0.01) { // Essentially paid off
            actualPayoffMonth = month
            break
          }
        }

      } else if (input.loanType === 'interestOnly') {
        // Interest-only loan
        monthlyPayment = loanAmount * monthlyRate
        
        for (let month = 1; month <= numberOfPayments; month++) {
          const interestPayment = loanAmount * monthlyRate
          const principalPayment = extraPayment
          
          paymentSchedule.push({
            month,
            payment: monthlyPayment + extraPayment,
            principal: principalPayment,
            interest: interestPayment,
            balance: loanAmount - (principalPayment * month)
          })
        }

      } else if (input.loanType === 'balloon') {
        // Balloon loan (interest-only with principal due at end)
        monthlyPayment = loanAmount * monthlyRate
        
        for (let month = 1; month < numberOfPayments; month++) {
          paymentSchedule.push({
            month,
            payment: monthlyPayment,
            principal: 0,
            interest: monthlyPayment,
            balance: loanAmount
          })
        }
        
        // Final balloon payment
        paymentSchedule.push({
          month: numberOfPayments,
          payment: monthlyPayment + loanAmount,
          principal: loanAmount,
          interest: monthlyPayment,
          balance: 0
        })
      }

      const totalPayment = paymentSchedule.reduce((sum, payment) => sum + payment.payment, 0)
      const totalInterest = totalPayment - loanAmount
      
      const payoffDate = new Date()
      payoffDate.setMonth(payoffDate.getMonth() + paymentSchedule.length)

      const payoffYears = Math.floor(paymentSchedule.length / 12)
      const payoffMonths = paymentSchedule.length % 12
      const payoffTimeString = payoffYears > 0 
        ? `${payoffYears} years ${payoffMonths > 0 ? `${payoffMonths} months` : ''}`
        : `${payoffMonths} months`

      const loanResult: LoanResult = {
        monthlyPayment,
        totalPayment,
        totalInterest,
        payoffDate,
        paymentSchedule,
        summary: {
          loanAmount,
          totalInterest,
          totalPayment,
          monthlyPayment,
          payoffTime: payoffTimeString.trim()
        }
      }

      setResult(loanResult)
      toast.success('Loan calculation completed!')
    } catch (error) {
      toast.error('Calculation failed')
      console.error('Loan calculation error:', error)
    } finally {
      setIsCalculating(false)
    }
  }, [input])

  // Auto-calculate when inputs change
  useEffect(() => {
    if (input.principal && input.rate && input.term) {
      const timer = setTimeout(() => {
        calculate()
      }, 500) // Debounce
      return () => clearTimeout(timer)
    } else {
      setResult(null)
    }
  }, [input.principal, input.rate, input.term, input.loanType, input.downPayment, input.extraPayment, calculate])

  // Copy results
  const copyResults = useCallback(() => {
    if (!result) {
      toast.error('No results to copy')
      return
    }

    const text = `
Loan Calculator Results

Loan Details:
- Loan Amount: $${result.summary.loanAmount.toLocaleString()}
- Interest Rate: ${input.rate}%
- Term: ${input.term} years
- Loan Type: ${input.loanType}
${input.downPayment ? `- Down Payment: $${parseFloat(input.downPayment).toLocaleString()}` : ''}
${input.extraPayment ? `- Extra Payment: $${parseFloat(input.extraPayment).toLocaleString()}` : ''}

Payment Summary:
- Monthly Payment: $${result.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Total Payment: $${result.totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Total Interest: $${result.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Payoff Time: ${result.summary.payoffTime}
- Payoff Date: ${result.payoffDate.toLocaleDateString()}
    `.trim()

    navigator.clipboard.writeText(text)
    toast.success('Results copied to clipboard!')
  }, [input, result])

  // Reset calculator
  const reset = useCallback(() => {
    setInput({
      principal: '',
      rate: '',
      term: '',
      loanType: 'amortizing',
      downPayment: '',
      extraPayment: ''
    })
    setResult(null)
    toast.success('Calculator reset')
  }, [])

  // Load example
  const loadExample = useCallback(() => {
    setInput({
      principal: '300000',
      rate: '4.5',
      term: '30',
      loanType: 'amortizing',
      downPayment: '60000',
      extraPayment: '100'
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

// Helper functions
export function calculateAffordability(monthlyIncome: number, monthlyDebt: number, interestRate: number, termYears: number): number {
  const maxDebtToIncomeRatio = 0.28 // 28% rule
  const maxMonthlyPayment = monthlyIncome * maxDebtToIncomeRatio - monthlyDebt
  
  if (maxMonthlyPayment <= 0) return 0
  
  const monthlyRate = interestRate / 100 / 12
  const numberOfPayments = termYears * 12
  
  if (monthlyRate === 0) {
    return maxMonthlyPayment * numberOfPayments
  }
  
  return maxMonthlyPayment * (Math.pow(1 + monthlyRate, numberOfPayments) - 1) / 
         (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))
}