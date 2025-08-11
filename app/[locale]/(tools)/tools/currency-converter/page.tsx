'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowUpDown,
  Copy,
  RefreshCw,
  DollarSign,
  Euro,
  PoundSterling,
  IndianRupee,
  Banknote,
  TrendingUp,
  TrendingDown,
  Calculator,
  Info,
  Globe,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Currency {
  code: string
  name: string
  symbol: string
  icon: any
  flag: string
}

interface ExchangeRate {
  from: string
  to: string
  rate: number
  trend?: 'up' | 'down' | 'stable'
  changePercent?: number
}

// Fixed exchange rates (as of example date)
const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'Доллар США', symbol: '$', icon: DollarSign, flag: '🇺🇸' },
  { code: 'EUR', name: 'Евро', symbol: '€', icon: Euro, flag: '🇪🇺' },
  { code: 'GBP', name: 'Фунт стерлингов', symbol: '£', icon: PoundSterling, flag: '🇬🇧' },
  { code: 'RUB', name: 'Российский рубль', symbol: '₽', icon: Banknote, flag: '🇷🇺' },
  { code: 'CNY', name: 'Китайский юань', symbol: '¥', icon: Banknote, flag: '🇨🇳' },
  { code: 'JPY', name: 'Японская иена', symbol: '¥', icon: Banknote, flag: '🇯🇵' },
  { code: 'INR', name: 'Индийская рупия', symbol: '₹', icon: IndianRupee, flag: '🇮🇳' },
  { code: 'CHF', name: 'Швейцарский франк', symbol: 'Fr', icon: Banknote, flag: '🇨🇭' },
  { code: 'CAD', name: 'Канадский доллар', symbol: 'C$', icon: DollarSign, flag: '🇨🇦' },
  { code: 'AUD', name: 'Австралийский доллар', symbol: 'A$', icon: DollarSign, flag: '🇦🇺' }
]

// Fixed exchange rates relative to USD
const EXCHANGE_RATES: { [key: string]: number } = {
  'USD': 1.0000,
  'EUR': 0.9200,
  'GBP': 0.7900,
  'RUB': 92.5000,
  'CNY': 7.2500,
  'JPY': 149.5000,
  'INR': 83.2000,
  'CHF': 0.8800,
  'CAD': 1.3600,
  'AUD': 1.5200
}

// Popular conversion pairs
const POPULAR_PAIRS = [
  { from: 'USD', to: 'EUR', label: 'USD/EUR' },
  { from: 'EUR', to: 'USD', label: 'EUR/USD' },
  { from: 'USD', to: 'RUB', label: 'USD/RUB' },
  { from: 'EUR', to: 'RUB', label: 'EUR/RUB' },
  { from: 'GBP', to: 'USD', label: 'GBP/USD' },
  { from: 'USD', to: 'CNY', label: 'USD/CNY' }
]

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState<string>('100')
  const [fromCurrency, setFromCurrency] = useState<Currency>(CURRENCIES[0]) // USD
  const [toCurrency, setToCurrency] = useState<Currency>(CURRENCIES[1]) // EUR
  const [result, setResult] = useState<number>(0)
  const [showAllCurrencies, setShowAllCurrencies] = useState(false)
  const [history, setHistory] = useState<Array<{
    from: Currency
    to: Currency
    amount: number
    result: number
    timestamp: Date
  }>>([])

  useEffect(() => {
    calculateExchange()
  }, [amount, fromCurrency, toCurrency])

  const calculateExchange = () => {
    const numAmount = parseFloat(amount) || 0
    if (numAmount <= 0) {
      setResult(0)
      return
    }

    // Convert from source currency to USD
    const amountInUSD = numAmount / EXCHANGE_RATES[fromCurrency.code]
    // Convert from USD to target currency
    const convertedAmount = amountInUSD * EXCHANGE_RATES[toCurrency.code]
    
    setResult(convertedAmount)
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    toast.success('Валюты поменяны местами')
  }

  const copyResult = () => {
    const formattedResult = `${amount} ${fromCurrency.code} = ${result.toFixed(2)} ${toCurrency.code}`
    navigator.clipboard.writeText(formattedResult)
    toast.success('Результат скопирован!')
  }

  const resetCalculator = () => {
    setAmount('100')
    setFromCurrency(CURRENCIES[0])
    setToCurrency(CURRENCIES[1])
    toast.success('Калькулятор сброшен')
  }

  const loadPopularPair = (pair: typeof POPULAR_PAIRS[0]) => {
    const from = CURRENCIES.find(c => c.code === pair.from)
    const to = CURRENCIES.find(c => c.code === pair.to)
    if (from && to) {
      setFromCurrency(from)
      setToCurrency(to)
      toast.success(`Загружена пара ${pair.label}`)
    }
  }

  const addToHistory = () => {
    if (parseFloat(amount) > 0 && result > 0) {
      const newEntry = {
        from: fromCurrency,
        to: toCurrency,
        amount: parseFloat(amount),
        result: result,
        timestamp: new Date()
      }
      setHistory(prev => [newEntry, ...prev.slice(0, 4)])
      toast.success('Добавлено в историю')
    }
  }

  const getExchangeRate = (from: string, to: string): number => {
    const fromRate = EXCHANGE_RATES[from]
    const toRate = EXCHANGE_RATES[to]
    return toRate / fromRate
  }

  const formatCurrency = (value: number, currency: Currency): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Converter */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="space-y-6">
              {/* Amount Input */}
              <div>
                <Label htmlFor="amount">Сумма</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Введите сумму"
                  className="mt-1 text-lg"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Currency Selection */}
              <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
                {/* From Currency */}
                <div>
                  <Label>Из валюты</Label>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                      <span className="text-2xl">{fromCurrency.flag}</span>
                      <div className="flex-1">
                        <div className="font-medium">{fromCurrency.code}</div>
                        <div className="text-sm text-muted-foreground">{fromCurrency.name}</div>
                      </div>
                      <fromCurrency.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* Swap Button */}
                <Button
                  onClick={swapCurrencies}
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </Button>

                {/* To Currency */}
                <div>
                  <Label>В валюту</Label>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                      <span className="text-2xl">{toCurrency.flag}</span>
                      <div className="flex-1">
                        <div className="font-medium">{toCurrency.code}</div>
                        <div className="text-sm text-muted-foreground">{toCurrency.name}</div>
                      </div>
                      <toCurrency.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Currency Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Выберите валюту</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllCurrencies(!showAllCurrencies)}
                  >
                    {showAllCurrencies ? 'Показать популярные' : 'Показать все'}
                  </Button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {(showAllCurrencies ? CURRENCIES : CURRENCIES.slice(0, 5)).map((currency) => (
                    <div key={currency.code} className="space-y-2">
                      <Button
                        variant={fromCurrency.code === currency.code ? 'default' : 'outline'}
                        size="sm"
                        className="w-full"
                        onClick={() => setFromCurrency(currency)}
                      >
                        <span className="mr-1">{currency.flag}</span>
                        {currency.code}
                      </Button>
                      <Button
                        variant={toCurrency.code === currency.code ? 'default' : 'outline'}
                        size="sm"
                        className="w-full"
                        onClick={() => setToCurrency(currency)}
                      >
                        <span className="mr-1">{currency.flag}</span>
                        {currency.code}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Result */}
              <div className="p-6 rounded-lg bg-primary/10 text-center">
                <div className="text-sm text-muted-foreground mb-2">Результат конвертации</div>
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(result, toCurrency)}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  1 {fromCurrency.code} = {getExchangeRate(fromCurrency.code, toCurrency.code).toFixed(4)} {toCurrency.code}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={addToHistory} className="gap-2">
                  <Calculator className="w-4 h-4" />
                  В историю
                </Button>
                <Button onClick={copyResult} variant="outline" className="gap-2">
                  <Copy className="w-4 h-4" />
                  Копировать
                </Button>
                <Button onClick={resetCalculator} variant="outline" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Сбросить
                </Button>
              </div>
            </div>
          </Card>

          {/* Exchange Rate Table */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Курсы обмена
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Валюта</th>
                    <th className="text-right p-2">За 1 USD</th>
                    <th className="text-right p-2">За 1 EUR</th>
                    <th className="text-right p-2">За 1 RUB</th>
                  </tr>
                </thead>
                <tbody>
                  {CURRENCIES.map((currency) => (
                    <tr key={currency.code} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span className="font-medium">{currency.code}</span>
                          <span className="text-muted-foreground hidden sm:inline">• {currency.name}</span>
                        </div>
                      </td>
                      <td className="text-right p-2 font-mono">
                        {getExchangeRate('USD', currency.code).toFixed(4)}
                      </td>
                      <td className="text-right p-2 font-mono">
                        {getExchangeRate('EUR', currency.code).toFixed(4)}
                      </td>
                      <td className="text-right p-2 font-mono">
                        {getExchangeRate('RUB', currency.code).toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Pairs */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Популярные пары
            </h3>

            <div className="space-y-2">
              {POPULAR_PAIRS.map((pair, index) => (
                <Button
                  key={index}
                  onClick={() => loadPopularPair(pair)}
                  variant="outline"
                  className="w-full justify-between"
                >
                  <span>{pair.label}</span>
                  <Badge variant="secondary">
                    {getExchangeRate(pair.from, pair.to).toFixed(4)}
                  </Badge>
                </Button>
              ))}
            </div>
          </Card>

          {/* History */}
          {history.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                История конвертаций
              </h3>

              <div className="space-y-3">
                {history.map((entry, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/50 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">
                        {entry.amount} {entry.from.code} → {entry.to.code}
                      </span>
                      <span className="text-muted-foreground">
                        {entry.timestamp.toLocaleTimeString('ru-RU', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <div className="font-mono">
                      = {entry.result.toFixed(2)} {entry.to.code}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Info */}
          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Информация
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Данный калькулятор использует фиксированные курсы валют для демонстрации.
              </p>
              <p>
                Для получения актуальных курсов используйте официальные источники:
              </p>
              <ul className="space-y-1 ml-4">
                <li>• Центральный банк РФ</li>
                <li>• Европейский центральный банк</li>
                <li>• Финансовые агрегаторы</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}