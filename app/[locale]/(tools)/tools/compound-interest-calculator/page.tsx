'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Calculator,
  TrendingUp,
  Calendar,
  DollarSign,
  Percent,
  PiggyBank,
  BarChart3,
  Info,
  Copy,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
// Charts temporarily disabled due to dependency conflicts
// TODO: Add recharts when dependency issues are resolved

type CompoundingFrequency = 'daily' | 'monthly' | 'quarterly' | 'annually'

interface CalculationResult {
  finalAmount: number
  totalInterest: number
  totalContributions: number
  effectiveRate: number
  chartData: ChartDataPoint[]
  yearlyBreakdown: YearlyBreakdown[]
}

interface ChartDataPoint {
  period: string
  principal: number
  interest: number
  total: number
}

interface YearlyBreakdown {
  year: number
  startBalance: number
  contribution: number
  interest: number
  endBalance: number
}

const COMPOUNDING_FREQUENCIES = {
  daily: { label: 'Ежедневно', value: 365 },
  monthly: { label: 'Ежемесячно', value: 12 },
  quarterly: { label: 'Ежеквартально', value: 4 },
  annually: { label: 'Ежегодно', value: 1 }
}

const INVESTMENT_EXAMPLES = [
  { name: 'Консервативный портфель', rate: 5, years: 10, contribution: 1000 },
  { name: 'Сбалансированный портфель', rate: 8, years: 15, contribution: 2000 },
  { name: 'Агрессивный портфель', rate: 12, years: 20, contribution: 3000 },
  { name: 'Пенсионные накопления', rate: 7, years: 30, contribution: 500 }
]

export default function CompoundInterestCalculatorPage() {
  const [principal, setPrincipal] = useState<string>('10000')
  const [interestRate, setInterestRate] = useState<string>('8')
  const [years, setYears] = useState<string>('10')
  const [monthlyContribution, setMonthlyContribution] = useState<string>('500')
  const [compoundingFrequency, setCompoundingFrequency] = useState<CompoundingFrequency>('monthly')
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Auto-calculate when inputs change
  useEffect(() => {
    if (principal && interestRate && years) {
      const timer = setTimeout(() => {
        calculateCompoundInterest()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [principal, interestRate, years, monthlyContribution, compoundingFrequency])

  const calculateCompoundInterest = () => {
    setIsCalculating(true)

    setTimeout(() => {
      try {
        const P = parseFloat(principal) || 0
        const r = parseFloat(interestRate) / 100 || 0
        const t = parseFloat(years) || 0
        const PMT = parseFloat(monthlyContribution) || 0
        const n = COMPOUNDING_FREQUENCIES[compoundingFrequency].value

        // Calculate compound interest with monthly contributions
        let balance = P
        const chartData: ChartDataPoint[] = []
        const yearlyBreakdown: YearlyBreakdown[] = []
        
        // For chart - show monthly data points
        for (let month = 0; month <= t * 12; month++) {
          const yearProgress = month / 12
          
          // Calculate current balance with compound interest
          const compoundBalance = P * Math.pow(1 + r/n, n * yearProgress)
          
          // Calculate contribution accumulation with compound interest
          const contributionBalance = PMT * 12 * ((Math.pow(1 + r/n, n * yearProgress) - 1) / (r/n))
          
          balance = compoundBalance + contributionBalance
          
          if (month % 3 === 0) { // Show quarterly points
            chartData.push({
              period: `${Math.floor(yearProgress)}г ${(month % 12)/3}кв`,
              principal: P + PMT * month,
              interest: balance - (P + PMT * month),
              total: balance
            })
          }
        }

        // Calculate yearly breakdown
        let currentBalance = P
        for (let year = 1; year <= t; year++) {
          const startBalance = currentBalance
          const yearContribution = PMT * 12
          
          // Calculate balance at end of year
          const endBalance = 
            startBalance * Math.pow(1 + r/n, n) + 
            yearContribution * ((Math.pow(1 + r/n, n) - 1) / (r/n))
          
          const yearInterest = endBalance - startBalance - yearContribution

          yearlyBreakdown.push({
            year,
            startBalance,
            contribution: yearContribution,
            interest: yearInterest,
            endBalance
          })

          currentBalance = endBalance
        }

        const finalAmount = balance
        const totalContributions = P + (PMT * 12 * t)
        const totalInterest = finalAmount - totalContributions
        
        // Calculate effective annual rate
        const effectiveRate = (Math.pow(1 + r/n, n) - 1) * 100

        setResult({
          finalAmount,
          totalInterest,
          totalContributions,
          effectiveRate,
          chartData,
          yearlyBreakdown
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

  const loadExample = (example: typeof INVESTMENT_EXAMPLES[0]) => {
    setPrincipal('100000')
    setInterestRate(example.rate.toString())
    setYears(example.years.toString())
    setMonthlyContribution(example.contribution.toString())
    toast.success(`Загружен пример: ${example.name}`)
  }

  const copyResults = () => {
    if (!result) return

    const text = `
Калькулятор сложного процента

Начальная сумма: ${formatCurrency(parseFloat(principal))}
Процентная ставка: ${interestRate}% годовых
Срок инвестирования: ${years} лет
Ежемесячное пополнение: ${formatCurrency(parseFloat(monthlyContribution || '0'))}
Частота капитализации: ${COMPOUNDING_FREQUENCIES[compoundingFrequency].label}

Результаты:
Итоговая сумма: ${formatCurrency(result.finalAmount)}
Общий доход: ${formatCurrency(result.totalInterest)}
Общие взносы: ${formatCurrency(result.totalContributions)}
Эффективная годовая ставка: ${formatPercent(result.effectiveRate)}
    `.trim()

    navigator.clipboard.writeText(text)
    toast.success('Результаты скопированы в буфер обмена!')
  }

  const reset = () => {
    setPrincipal('10000')
    setInterestRate('8')
    setYears('10')
    setMonthlyContribution('500')
    setCompoundingFrequency('monthly')
    setResult(null)
    toast.success('Данные сброшены')
  }

  // CustomTooltip temporarily removed due to dependency conflicts

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Параметры инвестирования</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="principal" className="flex items-center gap-2">
                <PiggyBank className="w-4 h-4" />
                Начальная сумма (₽)
              </Label>
              <Input
                id="principal"
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="100000"
                min="0"
                step="1000"
                className="mt-1"
              />
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
                placeholder="8"
                min="0"
                max="100"
                step="0.1"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="years" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Срок инвестирования (лет)
              </Label>
              <Input
                id="years"
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="10"
                min="1"
                max="50"
                step="1"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="contribution" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Ежемесячное пополнение (₽)
              </Label>
              <Input
                id="contribution"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                placeholder="5000"
                min="0"
                step="100"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="frequency">Частота капитализации</Label>
              <Select 
                value={compoundingFrequency} 
                onValueChange={(value: CompoundingFrequency) => setCompoundingFrequency(value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(COMPOUNDING_FREQUENCIES).map(([key, freq]) => (
                    <SelectItem key={key} value={key}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2 space-y-2">
              <p className="text-sm text-muted-foreground">Примеры инвестиционных стратегий:</p>
              <div className="grid grid-cols-2 gap-2">
                {INVESTMENT_EXAMPLES.map((example, index) => (
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
              {/* Main Result */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border">
                <div className="text-sm text-muted-foreground mb-1">Итоговая сумма</div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-400">
                  {formatCurrency(result.finalAmount)}
                </div>
                <div className="text-sm text-green-600 dark:text-green-500 mt-1">
                  +{formatPercent((result.finalAmount / result.totalContributions - 1) * 100)} от вложений
                </div>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">Общие взносы</div>
                  <div className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                    {formatCurrency(result.totalContributions)}
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">Общий доход</div>
                  <div className="text-xl font-semibold text-purple-700 dark:text-purple-400">
                    {formatCurrency(result.totalInterest)}
                  </div>
                </div>
                
                <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">Эффективная ставка</div>
                  <div className="text-xl font-semibold text-orange-700 dark:text-orange-400">
                    {formatPercent(result.effectiveRate)}
                  </div>
                </div>
                
                <div className="p-3 bg-pink-50 dark:bg-pink-950/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">Доля процентов</div>
                  <div className="text-xl font-semibold text-pink-700 dark:text-pink-400">
                    {formatPercent((result.totalInterest / result.finalAmount) * 100)}
                  </div>
                </div>
              </div>

              {/* Monthly Income */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Если снимать 4% в год, ежемесячный доход составит:
                </div>
                <div className="text-lg font-semibold">
                  {formatCurrency((result.finalAmount * 0.04) / 12)}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Chart */}
      {result && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            График роста капитала
          </h3>
          
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Показано первые 10 лет роста капитала
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {result.chartData.slice(0, 10).map((item, index) => {
                const maxValue = Math.max(...result.chartData.slice(0, 10).map(d => d.total))
                const percentage = (item.total / maxValue) * 100
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">Год {item.period}</span>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          {formatCurrency(item.total)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          +{formatCurrency(item.interest)} проценты
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                           style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Yearly Breakdown Table */}
      {result && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Детализация по годам</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Год</th>
                  <th className="text-right p-2">Начальный баланс</th>
                  <th className="text-right p-2">Взносы</th>
                  <th className="text-right p-2">Проценты</th>
                  <th className="text-right p-2">Конечный баланс</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlyBreakdown.map((year, index) => (
                  <tr key={index} className="border-b hover:bg-muted/30">
                    <td className="p-2">{year.year}</td>
                    <td className="p-2 text-right font-mono">
                      {formatCurrency(year.startBalance)}
                    </td>
                    <td className="p-2 text-right font-mono text-blue-600">
                      {formatCurrency(year.contribution)}
                    </td>
                    <td className="p-2 text-right font-mono text-green-600">
                      {formatCurrency(year.interest)}
                    </td>
                    <td className="p-2 text-right font-mono font-semibold">
                      {formatCurrency(year.endBalance)}
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
          О сложном проценте
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium mb-2">Формула расчета</h4>
            <p className="text-muted-foreground mb-2">
              Сложный процент рассчитывается по формуле:
            </p>
            <p className="font-mono bg-background p-2 rounded">
              A = P(1 + r/n)^(nt) + PMT × ((1 + r/n)^(nt) - 1) / (r/n)
            </p>
            <ul className="text-muted-foreground mt-2 space-y-1 text-xs">
              <li>A - итоговая сумма</li>
              <li>P - начальная сумма</li>
              <li>r - годовая ставка</li>
              <li>n - частота капитализации</li>
              <li>t - срок в годах</li>
              <li>PMT - регулярный платеж</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Принцип работы</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Проценты начисляются на проценты</li>
              <li>• Чем чаще капитализация, тем больше доход</li>
              <li>• Регулярные пополнения значительно увеличивают результат</li>
              <li>• Время - главный фактор роста капитала</li>
              <li>• Даже небольшая разница в ставке дает большой эффект на дистанции</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}