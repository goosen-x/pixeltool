'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Home,
  Calculator,
  Calendar,
  DollarSign,
  Percent,
  TrendingDown,
  PieChart,
  Info,
  Copy,
  RefreshCw,
  FileText,
  Wallet
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
// Charts temporarily disabled due to dependency conflicts
// TODO: Add recharts when dependency issues are resolved

type LoanType = 'mortgage' | 'auto' | 'consumer' | 'business'
type PaymentType = 'annuity' | 'differentiated'

interface LoanCalculationResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  overpaymentPercent: number
  paymentSchedule: PaymentScheduleItem[]
  earlyPayoffAmount: number
  pieChartData: PieChartItem[]
  lineChartData: LineChartItem[]
}

interface PaymentScheduleItem {
  month: number
  payment: number
  principal: number
  interest: number
  remainingBalance: number
}

interface PieChartItem {
  name: string
  value: number
  color: string
}

interface LineChartItem {
  month: string
  payment: number
  principal: number
  interest: number
}

const LOAN_TYPES = {
  mortgage: { label: 'Ипотека', minRate: 8, maxRate: 15, maxTerm: 30 },
  auto: { label: 'Автокредит', minRate: 10, maxRate: 20, maxTerm: 7 },
  consumer: { label: 'Потребительский', minRate: 12, maxRate: 25, maxTerm: 5 },
  business: { label: 'Бизнес-кредит', minRate: 9, maxRate: 18, maxTerm: 10 }
}

const LOAN_EXAMPLES = [
  { name: 'Квартира в новостройке', type: 'mortgage', amount: 5000000, rate: 12, term: 20, downPayment: 20 },
  { name: 'Вторичное жилье', type: 'mortgage', amount: 3000000, rate: 11, term: 15, downPayment: 15 },
  { name: 'Новый автомобиль', type: 'auto', amount: 1500000, rate: 15, term: 5, downPayment: 10 },
  { name: 'Потребительский кредит', type: 'consumer', amount: 500000, rate: 18, term: 3, downPayment: 0 }
]

export default function LoanCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState<string>('1000000')
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>('20')
  const [interestRate, setInterestRate] = useState<string>('12')
  const [loanTermYears, setLoanTermYears] = useState<string>('10')
  const [loanType, setLoanType] = useState<LoanType>('mortgage')
  const [paymentType, setPaymentType] = useState<PaymentType>('annuity')
  const [result, setResult] = useState<LoanCalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Auto-calculate when inputs change
  useEffect(() => {
    if (loanAmount && interestRate && loanTermYears) {
      const timer = setTimeout(() => {
        calculateLoan()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [loanAmount, downPaymentPercent, interestRate, loanTermYears, loanType, paymentType])

  const calculateLoan = () => {
    setIsCalculating(true)

    setTimeout(() => {
      try {
        const amount = parseFloat(loanAmount) || 0
        const downPayment = (parseFloat(downPaymentPercent) || 0) / 100 * amount
        const principal = amount - downPayment
        const rate = parseFloat(interestRate) / 100 / 12 // Monthly rate
        const months = parseFloat(loanTermYears) * 12

        let monthlyPayment: number
        let totalPayment: number
        let totalInterest: number
        const paymentSchedule: PaymentScheduleItem[] = []
        const lineChartData: LineChartItem[] = []

        if (paymentType === 'annuity') {
          // Annuity payment calculation
          monthlyPayment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
          totalPayment = monthlyPayment * months
          totalInterest = totalPayment - principal

          let remainingBalance = principal
          for (let i = 1; i <= months; i++) {
            const interestPayment = remainingBalance * rate
            const principalPayment = monthlyPayment - interestPayment
            remainingBalance -= principalPayment

            paymentSchedule.push({
              month: i,
              payment: monthlyPayment,
              principal: principalPayment,
              interest: interestPayment,
              remainingBalance: Math.max(0, remainingBalance)
            })

            // Add data for line chart (every 12 months)
            if (i % 12 === 0 || i === 1) {
              lineChartData.push({
                month: `${Math.ceil(i / 12)}г`,
                payment: monthlyPayment,
                principal: principalPayment,
                interest: interestPayment
              })
            }
          }
        } else {
          // Differentiated payment calculation
          const monthlyPrincipal = principal / months
          totalPayment = 0

          let remainingBalance = principal
          for (let i = 1; i <= months; i++) {
            const interestPayment = remainingBalance * rate
            const payment = monthlyPrincipal + interestPayment
            remainingBalance -= monthlyPrincipal

            totalPayment += payment

            paymentSchedule.push({
              month: i,
              payment,
              principal: monthlyPrincipal,
              interest: interestPayment,
              remainingBalance: Math.max(0, remainingBalance)
            })

            // Add data for line chart (every 12 months)
            if (i % 12 === 0 || i === 1) {
              lineChartData.push({
                month: `${Math.ceil(i / 12)}г`,
                payment,
                principal: monthlyPrincipal,
                interest: interestPayment
              })
            }
          }

          totalInterest = totalPayment - principal
          monthlyPayment = paymentSchedule[0].payment // First month payment
        }

        const overpaymentPercent = (totalInterest / principal) * 100

        // Calculate early payoff amount (50% of loan term)
        const halfTermMonths = Math.floor(months / 2)
        const earlyPayoffAmount = paymentSchedule[halfTermMonths - 1]?.remainingBalance || 0

        // Pie chart data
        const pieChartData: PieChartItem[] = [
          { name: 'Основной долг', value: principal, color: '#3b82f6' },
          { name: 'Проценты', value: totalInterest, color: '#ef4444' }
        ]
        
        if (downPayment > 0) {
          pieChartData.unshift({ name: 'Первый взнос', value: downPayment, color: '#10b981' })
        }

        setResult({
          monthlyPayment,
          totalPayment,
          totalInterest,
          overpaymentPercent,
          paymentSchedule,
          earlyPayoffAmount,
          pieChartData,
          lineChartData
        })
      } catch (error) {
        toast.error('Ошибка при расчете')
        console.error('Calculation error:', error)
      } finally {
        setIsCalculating(false)
      }
    }, 300)
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercent = (value: number): string => {
    return `${value.toFixed(2)}%`
  }

  const loadExample = (example: typeof LOAN_EXAMPLES[0]) => {
    setLoanAmount(example.amount.toString())
    setDownPaymentPercent(example.downPayment.toString())
    setInterestRate(example.rate.toString())
    setLoanTermYears(example.term.toString())
    setLoanType(example.type as LoanType)
    toast.success(`Загружен пример: ${example.name}`)
  }

  const copyResults = () => {
    if (!result) return

    const amount = parseFloat(loanAmount)
    const downPayment = (parseFloat(downPaymentPercent) || 0) / 100 * amount
    
    const text = `
Расчет кредита

Тип кредита: ${LOAN_TYPES[loanType].label}
Сумма кредита: ${formatCurrency(amount)}
Первоначальный взнос: ${formatCurrency(downPayment)} (${downPaymentPercent}%)
Процентная ставка: ${interestRate}% годовых
Срок кредита: ${loanTermYears} лет
Тип платежа: ${paymentType === 'annuity' ? 'Аннуитетный' : 'Дифференцированный'}

Результаты:
Ежемесячный платеж: ${formatCurrency(result.monthlyPayment)}
Общая сумма платежей: ${formatCurrency(result.totalPayment)}
Переплата по процентам: ${formatCurrency(result.totalInterest)}
Переплата в процентах: ${formatPercent(result.overpaymentPercent)}
    `.trim()

    navigator.clipboard.writeText(text)
    toast.success('Результаты скопированы в буфер обмена!')
  }

  const reset = () => {
    setLoanAmount('1000000')
    setDownPaymentPercent('20')
    setInterestRate('12')
    setLoanTermYears('10')
    setLoanType('mortgage')
    setPaymentType('annuity')
    setResult(null)
    toast.success('Данные сброшены')
  }

  // CustomTooltip temporarily removed due to dependency conflicts

  const downloadSchedule = () => {
    if (!result) return

    const csv = [
      'Месяц,Платеж,Основной долг,Проценты,Остаток долга',
      ...result.paymentSchedule.map(item => 
        `${item.month},${item.payment.toFixed(2)},${item.principal.toFixed(2)},${item.interest.toFixed(2)},${item.remainingBalance.toFixed(2)}`
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'payment_schedule.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('График платежей сохранен')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Параметры кредита</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="loan-type">Тип кредита</Label>
              <Select 
                value={loanType} 
                onValueChange={(value: LoanType) => setLoanType(value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LOAN_TYPES).map(([key, type]) => (
                    <SelectItem key={key} value={key}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Сумма кредита (₽)
              </Label>
              <Input
                id="amount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="1000000"
                min="0"
                step="100000"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="down-payment" className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Первоначальный взнос (%)
              </Label>
              <Input
                id="down-payment"
                type="number"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(e.target.value)}
                placeholder="20"
                min="0"
                max="90"
                step="5"
                className="mt-1"
              />
              {downPaymentPercent && (
                <p className="text-sm text-muted-foreground mt-1">
                  {formatCurrency((parseFloat(downPaymentPercent) / 100) * parseFloat(loanAmount))}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="rate" className="flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Годовая процентная ставка (%)
              </Label>
              <Input
                id="rate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="12"
                min="0.1"
                max="50"
                step="0.1"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Рекомендуемый диапазон для {LOAN_TYPES[loanType].label}: {LOAN_TYPES[loanType].minRate}-{LOAN_TYPES[loanType].maxRate}%
              </p>
            </div>

            <div>
              <Label htmlFor="term" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Срок кредита (лет)
              </Label>
              <Input
                id="term"
                type="number"
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(e.target.value)}
                placeholder="10"
                min="1"
                max={LOAN_TYPES[loanType].maxTerm}
                step="1"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Максимальный срок: {LOAN_TYPES[loanType].maxTerm} лет
              </p>
            </div>

            <div>
              <Label htmlFor="payment-type">Тип платежа</Label>
              <Select 
                value={paymentType} 
                onValueChange={(value: PaymentType) => setPaymentType(value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annuity">Аннуитетный</SelectItem>
                  <SelectItem value="differentiated">Дифференцированный</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2 space-y-2">
              <p className="text-sm text-muted-foreground">Примеры кредитов:</p>
              <div className="grid grid-cols-2 gap-2">
                {LOAN_EXAMPLES.map((example, index) => (
                  <Button
                    key={index}
                    onClick={() => loadExample(example)}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    {example.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={copyResults} variant="outline" disabled={!result}>
                <Copy className="w-4 h-4 mr-2" />
                Копировать
              </Button>
              <Button onClick={reset} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Сбросить
              </Button>
            </div>
          </div>
        </Card>

        {/* Results */}
        {result && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Результаты расчета
            </h3>

            <div className="space-y-4">
              {/* Monthly Payment */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border">
                <div className="text-sm text-muted-foreground mb-1">Ежемесячный платеж</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                  {formatCurrency(result.monthlyPayment)}
                </div>
                {paymentType === 'differentiated' && (
                  <div className="text-sm text-blue-600 dark:text-blue-500 mt-1">
                    от {formatCurrency(result.paymentSchedule[result.paymentSchedule.length - 1].payment)} 
                    {' '}до {formatCurrency(result.paymentSchedule[0].payment)}
                  </div>
                )}
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">Сумма кредита</div>
                  <div className="text-xl font-semibold text-green-700 dark:text-green-400">
                    {formatCurrency(parseFloat(loanAmount) - (parseFloat(downPaymentPercent) / 100 * parseFloat(loanAmount)))}
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">Переплата</div>
                  <div className="text-xl font-semibold text-red-700 dark:text-red-400">
                    {formatCurrency(result.totalInterest)}
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">Общая сумма</div>
                  <div className="text-xl font-semibold text-purple-700 dark:text-purple-400">
                    {formatCurrency(result.totalPayment)}
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">Переплата %</div>
                  <div className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                    {formatPercent(result.overpaymentPercent)}
                  </div>
                </div>
              </div>

              {/* Early Payoff */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">
                  При досрочном погашении через {Math.floor(parseFloat(loanTermYears) / 2)} лет:
                </div>
                <div className="text-lg font-semibold">
                  Остаток долга: {formatCurrency(result.earlyPayoffAmount)}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Charts */}
      {result && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Структура платежей
            </h3>
            
            <div className="space-y-3">
              {result.pieChartData.map((item, index) => {
                const percentage = ((item.value / result.totalPayment) * 100).toFixed(1)
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{percentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: item.color 
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Line Chart */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Динамика платежей
            </h3>
            
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Показаны первые 12 месяцев платежей
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {result.lineChartData.slice(0, 12).map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 py-2 border-b border-muted text-sm">
                    <div className="font-medium">{item.month}</div>
                    {paymentType === 'differentiated' && (
                      <div className="text-purple-600">
                        {formatCurrency(item.payment)}
                      </div>
                    )}
                    <div className="text-blue-600">
                      {formatCurrency(item.principal)}
                    </div>
                    <div className="text-red-600">
                      {formatCurrency(item.interest)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground border-t pt-2">
                <div>Месяц</div>
                {paymentType === 'differentiated' && <div>Платеж</div>}
                <div>Основной долг</div>
                <div>Проценты</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Payment Schedule */}
      {result && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              График платежей
            </h3>
            <Button onClick={downloadSchedule} variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Скачать CSV
            </Button>
          </div>
          
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b sticky top-0 bg-background">
                  <th className="text-left p-2">Месяц</th>
                  <th className="text-right p-2">Платеж</th>
                  <th className="text-right p-2">Основной долг</th>
                  <th className="text-right p-2">Проценты</th>
                  <th className="text-right p-2">Остаток долга</th>
                </tr>
              </thead>
              <tbody>
                {result.paymentSchedule.filter((_, i) => i % 12 === 0 || i === result.paymentSchedule.length - 1).map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/30">
                    <td className="p-2">{item.month}</td>
                    <td className="p-2 text-right font-mono">
                      {formatCurrency(item.payment)}
                    </td>
                    <td className="p-2 text-right font-mono text-blue-600">
                      {formatCurrency(item.principal)}
                    </td>
                    <td className="p-2 text-right font-mono text-red-600">
                      {formatCurrency(item.interest)}
                    </td>
                    <td className="p-2 text-right font-mono font-semibold">
                      {formatCurrency(item.remainingBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Info */}
      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Info className="w-4 h-4" />
          О кредитных расчетах
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium mb-2">Типы платежей</h4>
            <ul className="text-muted-foreground space-y-1">
              <li><strong>Аннуитетный</strong> - равные платежи на весь срок кредита</li>
              <li><strong>Дифференцированный</strong> - уменьшающиеся платежи</li>
              <li>• При аннуитете в начале больше процентов</li>
              <li>• При дифференцированном - равномерное погашение долга</li>
              <li>• Аннуитет удобнее для планирования бюджета</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Рекомендации</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Первоначальный взнос снижает переплату</li>
              <li>• Досрочное погашение экономит на процентах</li>
              <li>• Сравнивайте полную стоимость кредита</li>
              <li>• Платеж не должен превышать 40% дохода</li>
              <li>• Учитывайте дополнительные расходы</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}