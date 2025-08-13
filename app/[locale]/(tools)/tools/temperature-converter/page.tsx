'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Thermometer,
  ArrowRightLeft,
  Copy,
  RefreshCw,
  Snowflake,
  Flame,
  Sun,
  CloudSnow,
  Info,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { WidgetLayout } from '@/components/widgets/WidgetLayout'
import { WidgetSection } from '@/components/widgets/WidgetSection'
import { WidgetInput } from '@/components/widgets/WidgetInput'
import { WidgetOutput } from '@/components/widgets/WidgetOutput'
import { useTranslations } from 'next-intl'

type TemperatureUnit = 'celsius' | 'fahrenheit' | 'kelvin' | 'rankine' | 'reaumur'

interface TemperatureValue {
  unit: TemperatureUnit
  value: number
  symbol: string
  name: string
}

interface ConversionResult {
  celsius: number
  fahrenheit: number
  kelvin: number
  rankine: number
  reaumur: number
}

// Temperature units symbols only (names will come from translations)
const TEMPERATURE_SYMBOLS: Record<TemperatureUnit, string> = {
  celsius: '°C',
  fahrenheit: '°F',
  kelvin: 'K',
  rankine: '°R',
  reaumur: '°Ré'
}

const TEMPERATURE_REFERENCES = [
  { name: 'Абсолютный ноль', celsius: -273.15, description: 'Теоретически самая низкая температура' },
  { name: 'Температура жидкого азота', celsius: -195.8, description: 'Кипение азота при нормальном давлении' },
  { name: 'Сухой лед (сублимация)', celsius: -78.5, description: 'Переход CO₂ из твердого в газообразное' },
  { name: 'Замерзание воды', celsius: 0, description: 'Точка замерзания воды при нормальном давлении' },
  { name: 'Комнатная температура', celsius: 20, description: 'Комфортная температура в помещении' },
  { name: 'Температура человека', celsius: 36.6, description: 'Нормальная температура тела' },
  { name: 'Кипение воды', celsius: 100, description: 'Точка кипения воды при нормальном давлении' },
  { name: 'Температура пара', celsius: 100, description: 'Водяной пар при атмосферном давлении' },
  { name: 'Температура духовки', celsius: 180, description: 'Средняя температура выпечки' },
  { name: 'Температура пайки', celsius: 400, description: 'Плавление припоя' }
]

const QUICK_CONVERSIONS = [
  { name: 'Ноль Цельсия', celsius: 0 },
  { name: 'Комнатная', celsius: 20 },
  { name: 'Тело человека', celsius: 36.6 },
  { name: 'Кипение воды', celsius: 100 },
  { name: 'Духовка', celsius: 180 },
  { name: 'Ноль Фаренгейта', celsius: -17.78 }
]

export default function TemperatureConverterPage() {
  const t = useTranslations('widgets.temperatureConverter')
  const [inputValue, setInputValue] = useState<string>('')
  const [fromUnit, setFromUnit] = useState<TemperatureUnit>('celsius')
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [isConverting, setIsConverting] = useState(false)

  // Auto-convert when input changes
  useEffect(() => {
    if (inputValue.trim() && !isNaN(Number(inputValue))) {
      convertTemperature(Number(inputValue), fromUnit)
    } else {
      setResult(null)
    }
  }, [inputValue, fromUnit])

  const convertTemperature = async (value: number, from: TemperatureUnit) => {
    setIsConverting(true)

    // Add small delay for better UX
    setTimeout(() => {
      try {
        // Convert everything to Celsius first
        let celsius: number

        switch (from) {
          case 'celsius':
            celsius = value
            break
          case 'fahrenheit':
            celsius = (value - 32) * 5 / 9
            break
          case 'kelvin':
            celsius = value - 273.15
            break
          case 'rankine':
            celsius = (value - 491.67) * 5 / 9
            break
          case 'reaumur':
            celsius = value * 5 / 4
            break
          default:
            celsius = value
        }

        // Convert from Celsius to all other units
        const fahrenheit = (celsius * 9 / 5) + 32
        const kelvin = celsius + 273.15
        const rankine = (celsius + 273.15) * 9 / 5
        const reaumur = celsius * 4 / 5

        const conversionResult: ConversionResult = {
          celsius,
          fahrenheit,
          kelvin,
          rankine,
          reaumur
        }

        setResult(conversionResult)
      } catch (error) {
        toast.error(t('toast.conversionError'))
        console.error('Temperature conversion error:', error)
      } finally {
        setIsConverting(false)
      }
    }, 100)
  }

  const formatTemperature = (value: number, unit: TemperatureUnit): string => {
    // Round to 2 decimal places and remove unnecessary zeros
    const rounded = Math.round(value * 100) / 100
    return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(2)
  }

  const copyToClipboard = (value: string, unit: string) => {
    navigator.clipboard.writeText(`${value}${unit}`)
    toast.success(t('toast.copied'))
  }

  const copyAllResults = () => {
    if (!result) return

    const text = `
Конвертация температуры:

Цельсий: ${formatTemperature(result.celsius, 'celsius')}°C
Фаренгейт: ${formatTemperature(result.fahrenheit, 'fahrenheit')}°F
Кельвин: ${formatTemperature(result.kelvin, 'kelvin')}K
Ранкин: ${formatTemperature(result.rankine, 'rankine')}°R
Реомюр: ${formatTemperature(result.reaumur, 'reaumur')}°Ré
    `.trim()

    copyToClipboard(text, '')
  }

  const swapUnits = () => {
    // For simplicity, just swap between common units
    const commonUnits: TemperatureUnit[] = ['celsius', 'fahrenheit', 'kelvin']
    const currentIndex = commonUnits.indexOf(fromUnit)
    const nextIndex = (currentIndex + 1) % commonUnits.length
    setFromUnit(commonUnits[nextIndex])
  }

  const loadQuickConversion = (celsius: number) => {
    setInputValue(celsius.toString())
    setFromUnit('celsius')
    toast.success(t('toast.valueLoaded'))
  }

  const resetAll = () => {
    setInputValue('')
    setResult(null)
    setFromUnit('celsius')
    toast.success(t('toast.reset'))
  }

  const getTemperatureColor = (celsius: number): string => {
    if (celsius < -50) return 'text-blue-600'
    if (celsius < 0) return 'text-cyan-600'
    if (celsius < 15) return 'text-green-600'
    if (celsius < 25) return 'text-yellow-600'
    if (celsius < 35) return 'text-orange-600'
    return 'text-red-600'
  }

  const getTemperatureIcon = (celsius: number) => {
    if (celsius < -50) return <CloudSnow className="w-4 h-4" />
    if (celsius < 0) return <Snowflake className="w-4 h-4" />
    if (celsius < 25) return <Thermometer className="w-4 h-4" />
    if (celsius < 35) return <Sun className="w-4 h-4" />
    return <Flame className="w-4 h-4" />
  }

  const getTemperatureDescription = (celsius: number): string => {
    if (celsius < -100) return 'Экстремально холодно'
    if (celsius < -50) return 'Очень холодно'
    if (celsius < 0) return 'Ниже нуля'
    if (celsius < 10) return 'Холодно'
    if (celsius < 20) return 'Прохладно'
    if (celsius < 25) return 'Комфортно'
    if (celsius < 30) return 'Тепло'
    if (celsius < 40) return 'Жарко'
    if (celsius < 100) return 'Очень жарко'
    if (celsius < 200) return 'Кипяток'
    return 'Экстремально горячо'
  }

  const getRelevantReferences = (celsius: number) => {
    return TEMPERATURE_REFERENCES
      .map(ref => ({
        ...ref,
        diff: Math.abs(ref.celsius - celsius)
      }))
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 3)
  }

  // Helper functions for translation keys
  const getTemperatureDescriptionKey = (celsius: number): string => {
    if (celsius < -100) return 'extremelyCold'
    if (celsius < -50) return 'veryCold'
    if (celsius < 0) return 'belowZero'
    if (celsius < 10) return 'cold'
    if (celsius < 20) return 'cool'
    if (celsius < 25) return 'comfortable'
    if (celsius < 30) return 'warm'
    if (celsius < 40) return 'hot'
    if (celsius < 100) return 'veryHot'
    if (celsius < 200) return 'boiling'
    return 'extremelyHot'
  }

  const getReferencesKey = (name: string): string => {
    const keyMap: Record<string, string> = {
      'Абсолютный ноль': 'absoluteZero',
      'Температура жидкого азота': 'liquidNitrogen', 
      'Сухой лед (сублимация)': 'dryIce',
      'Замерзание воды': 'waterFreeze',
      'Комнатная температура': 'roomTemp',
      'Температура человека': 'bodyTemp',
      'Кипение воды': 'waterBoil',
      'Температура пара': 'steam',
      'Температура духовки': 'oven',
      'Температура пайки': 'soldering'
    }
    return keyMap[name] || name.toLowerCase()
  }

  return (
    <WidgetLayout>
      {/* Input Form */}
      <WidgetSection title={t('sections.input')}>
        <div className="grid md:grid-cols-3 gap-6 items-end">
          <WidgetInput label={t('inputs.temperature.label')} description={t('inputs.temperature.description')}>
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('inputs.temperature.placeholder')}
              className="text-lg"
              step="any"
            />
          </WidgetInput>

          <WidgetInput label={t('inputs.unit.label')} description={t('inputs.unit.description')}>
            <Select value={fromUnit} onValueChange={(value: TemperatureUnit) => setFromUnit(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(['celsius', 'fahrenheit', 'kelvin', 'rankine', 'reaumur'] as TemperatureUnit[]).map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {t(`units.${unit}`)} ({TEMPERATURE_SYMBOLS[unit]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </WidgetInput>

          <div className="flex gap-2">
            <Button onClick={swapUnits} variant="outline" size="sm">
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              {t('actions.swap')}
            </Button>
            <Button onClick={resetAll} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('actions.reset')}
            </Button>
          </div>
        </div>

        {/* Quick conversions */}
        <div className="mt-6">
          <label className="mb-3 block text-sm font-medium">{t('sections.quickValues')}</label>
          <div className="flex gap-2 flex-wrap">
            {QUICK_CONVERSIONS.map((quick, index) => (
              <Button
                key={index}
                onClick={() => loadQuickConversion(quick.celsius)}
                variant="outline"
                size="sm"
              >
                {t(`quickValues.${quick.name.toLowerCase().replace(' ', '')}`)}
              </Button>
            ))}
          </div>
        </div>
      </WidgetSection>

      {/* Results */}
      {result && (
        <WidgetSection title={t('sections.results')}>
          <WidgetOutput>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(result).map(([unit, value]) => {
              const symbol = TEMPERATURE_SYMBOLS[unit as TemperatureUnit]
              const formattedValue = formatTemperature(value, unit as TemperatureUnit)
              const colorClass = unit === 'celsius' ? getTemperatureColor(value) : 'text-foreground'
              
              return (
                <div
                  key={unit}
                  className={cn(
                    "p-4 rounded-lg border transition-colors",
                    fromUnit === unit 
                      ? "bg-primary/10 border-primary/20" 
                      : "bg-muted/30 hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t(`units.${unit}`)}
                    </span>
                    <Button
                      onClick={() => copyToClipboard(formattedValue, symbol)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className={cn("text-2xl font-bold", colorClass)}>
                    {formattedValue}{symbol}
                  </div>
                </div>
              )
            })}
          </div>
          </WidgetOutput>
        </WidgetSection>
      )}

      {/* Context Section */}
      {result && (
        <WidgetSection 
          title={t('sections.context')}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border">
              <div className="flex items-center gap-3 mb-2">
                {getTemperatureIcon(result.celsius)}
                <span className={cn("font-semibold", getTemperatureColor(result.celsius))}>
                  {t(`descriptions.${getTemperatureDescriptionKey(result.celsius)}`)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {Math.abs(result.celsius) < 273.15 
                  ? t('context.aboveAbsoluteZero', { value: (273.15 + result.celsius).toFixed(1) })
                  : t('context.aboveAbsoluteZero')
                }
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">{t('sections.referencePoints')}</h4>
              {getRelevantReferences(result.celsius).map((ref, index) => (
                <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded">
                  <span>{t(`references.${getReferencesKey(ref.name)}`)}</span>
                  <Badge variant="outline" className="text-xs">
                    {ref.diff < 0.1 ? t('context.exactly') : `±${ref.diff.toFixed(1)}°C`}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </WidgetSection>
      )}

      {!result && !isConverting && (
        <WidgetSection title={t('sections.placeholder')}>
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            <div className="text-center">
              <Thermometer className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t('placeholder.enterTemperature')}</p>
            </div>
          </div>
        </WidgetSection>
      )}

      {/* Reference table */}
      <WidgetSection title={t('sections.references')}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">{t('table.phenomenon')}</th>
                <th className="text-right p-2">°C</th>
                <th className="text-right p-2">°F</th>
                <th className="text-right p-2">K</th>
                <th className="text-left p-2">{t('table.description')}</th>
              </tr>
            </thead>
            <tbody>
              {TEMPERATURE_REFERENCES.map((ref, index) => (
                <tr key={index} className="border-b border-muted/30">
                  <td className="p-2 font-medium">{t(`references.${getReferencesKey(ref.name)}`)}</td>
                  <td className={cn("p-2 text-right font-mono", getTemperatureColor(ref.celsius))}>
                    {ref.celsius}°C
                  </td>
                  <td className="p-2 text-right font-mono">
                    {formatTemperature((ref.celsius * 9 / 5) + 32, 'fahrenheit')}°F
                  </td>
                  <td className="p-2 text-right font-mono">
                    {formatTemperature(ref.celsius + 273.15, 'kelvin')}K
                  </td>
                  <td className="p-2 text-muted-foreground">{t(`referenceDescriptions.${getReferencesKey(ref.name)}`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WidgetSection>

      {/* Info */}
      <WidgetSection title={t('sections.about')}>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-1">{t('info.mainScales')}</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• <strong>{t('info.celsiusDesc')}</strong></li>
                <li>• <strong>{t('info.fahrenheitDesc')}</strong></li>
                <li>• <strong>{t('info.kelvinDesc')}</strong></li>
                <li>• <strong>{t('info.rankineDesc')}</strong></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">{t('info.formulas')}</h4>
              <ul className="text-muted-foreground space-y-1 font-mono text-xs">
                <li>• °F = (°C × 9/5) + 32</li>
                <li>• K = °C + 273.15</li>
                <li>• °R = (°C + 273.15) × 9/5</li>
                <li>• °Ré = °C × 4/5</li>
              </ul>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-1">{t('info.applications')}</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• {t('info.cooking')}</li>
                <li>• {t('info.science')}</li>
                <li>• {t('info.medical')}</li>
                <li>• {t('info.engineering')}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">{t('info.facts')}</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• {t('info.absoluteZero')}</li>
                <li>• {t('info.sunSurface')}</li>
                <li>• {t('info.coldestEarth')}</li>
                <li>• {t('info.hottestEarth')}</li>
              </ul>
            </div>
          </div>
        </div>
      </WidgetSection>
    </WidgetLayout>
  )
}