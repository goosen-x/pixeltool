'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Eye,
  Copy,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  Palette,
  Type,
  Shuffle,
  Sun,
  Moon
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ContrastResult {
  ratio: number
  normalTextAA: boolean
  normalTextAAA: boolean
  largeTextAA: boolean
  largeTextAAA: boolean
  uiComponentAA: boolean
}

interface ColorSuggestion {
  color: string
  ratio: number
  passesAA: boolean
  passesAAA: boolean
}

interface ColorPair {
  name: string
  foreground: string
  background: string
}

const COLOR_PAIRS: ColorPair[] = [
  { name: 'Классический', foreground: '#000000', background: '#ffffff' },
  { name: 'GitHub', foreground: '#24292e', background: '#ffffff' },
  { name: 'Material Blue', foreground: '#1976d2', background: '#ffffff' },
  { name: 'Success', foreground: '#155724', background: '#d4edda' },
  { name: 'Warning', foreground: '#856404', background: '#fff3cd' },
  { name: 'Danger', foreground: '#721c24', background: '#f8d7da' },
  { name: 'Info', foreground: '#004085', background: '#d1ecf1' },
  { name: 'Dark Mode', foreground: '#e4e4e7', background: '#18181b' },
  { name: 'Purple Brand', foreground: '#ffffff', background: '#6b46c1' },
  { name: 'Pastel', foreground: '#374151', background: '#fef3c7' }
]

const WCAG_GUIDELINES = {
  normalTextAA: 4.5,
  normalTextAAA: 7,
  largeTextAA: 3,
  largeTextAAA: 4.5,
  uiComponentAA: 3
}

export default function ColorContrastCheckerPage() {
  const [foreground, setForeground] = useState('#000000')
  const [background, setBackground] = useState('#ffffff')
  const [fontSize, setFontSize] = useState(16)
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('normal')
  const [result, setResult] = useState<ContrastResult | null>(null)
  const [suggestions, setSuggestions] = useState<{
    foreground: ColorSuggestion[]
    background: ColorSuggestion[]
  }>({ foreground: [], background: [] })

  // Calculate contrast ratio whenever colors change
  useEffect(() => {
    calculateContrast()
  }, [foreground, background])

  const calculateContrast = () => {
    const ratio = getContrastRatio(foreground, background)
    const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight === 'bold')

    const contrastResult: ContrastResult = {
      ratio,
      normalTextAA: ratio >= WCAG_GUIDELINES.normalTextAA,
      normalTextAAA: ratio >= WCAG_GUIDELINES.normalTextAAA,
      largeTextAA: ratio >= WCAG_GUIDELINES.largeTextAA,
      largeTextAAA: ratio >= WCAG_GUIDELINES.largeTextAAA,
      uiComponentAA: ratio >= WCAG_GUIDELINES.uiComponentAA
    }

    setResult(contrastResult)

    // Generate suggestions if contrast fails
    if (!contrastResult.normalTextAA) {
      generateSuggestions()
    } else {
      setSuggestions({ foreground: [], background: [] })
    }
  }

  const getContrastRatio = (color1: string, color2: string): number => {
    const lum1 = getLuminance(color1)
    const lum2 = getLuminance(color2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)
    return (brightest + 0.05) / (darkest + 0.05)
  }

  const getLuminance = (color: string): number => {
    const rgb = hexToRgb(color)
    if (!rgb) return 0

    const [r, g, b] = rgb.map(val => {
      val = val / 255
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const hexToRgb = (hex: string): [number, number, number] | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null
  }

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  const generateSuggestions = () => {
    const foregroundSuggestions: ColorSuggestion[] = []
    const backgroundSuggestions: ColorSuggestion[] = []

    // Generate lighter/darker variations
    const bgRgb = hexToRgb(background)
    const fgRgb = hexToRgb(foreground)

    if (bgRgb && fgRgb) {
      // Suggest darker foreground colors
      for (let i = 0.9; i >= 0.1; i -= 0.1) {
        const newFg = rgbToHex(
          Math.round(fgRgb[0] * i),
          Math.round(fgRgb[1] * i),
          Math.round(fgRgb[2] * i)
        )
        const ratio = getContrastRatio(newFg, background)
        if (ratio >= WCAG_GUIDELINES.normalTextAA) {
          foregroundSuggestions.push({
            color: newFg,
            ratio,
            passesAA: ratio >= WCAG_GUIDELINES.normalTextAA,
            passesAAA: ratio >= WCAG_GUIDELINES.normalTextAAA
          })
        }
      }

      // Suggest lighter background colors
      for (let i = 0.1; i <= 1; i += 0.1) {
        const newBg = rgbToHex(
          Math.min(255, Math.round(bgRgb[0] + (255 - bgRgb[0]) * i)),
          Math.min(255, Math.round(bgRgb[1] + (255 - bgRgb[1]) * i)),
          Math.min(255, Math.round(bgRgb[2] + (255 - bgRgb[2]) * i))
        )
        const ratio = getContrastRatio(foreground, newBg)
        if (ratio >= WCAG_GUIDELINES.normalTextAA) {
          backgroundSuggestions.push({
            color: newBg,
            ratio,
            passesAA: ratio >= WCAG_GUIDELINES.normalTextAA,
            passesAAA: ratio >= WCAG_GUIDELINES.normalTextAAA
          })
        }
      }
    }

    setSuggestions({
      foreground: foregroundSuggestions.slice(0, 4),
      background: backgroundSuggestions.slice(0, 4)
    })
  }

  const swapColors = () => {
    const temp = foreground
    setForeground(background)
    setBackground(temp)
    toast.success('Цвета поменяны местами')
  }

  const randomColors = () => {
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    let fg = randomColor()
    let bg = randomColor()
    
    // Ensure some contrast
    while (getContrastRatio(fg, bg) < 2) {
      bg = randomColor()
    }
    
    setForeground(fg)
    setBackground(bg)
    toast.success('Случайные цвета сгенерированы')
  }

  const loadColorPair = (pair: ColorPair) => {
    setForeground(pair.foreground)
    setBackground(pair.background)
    toast.success(`Загружена пара: ${pair.name}`)
  }

  const copyResults = () => {
    if (!result) return

    const text = `
Проверка контрастности цветов WCAG

Цвет текста: ${foreground}
Цвет фона: ${background}
Коэффициент контрастности: ${result.ratio.toFixed(2)}:1

Результаты:
• Обычный текст AA (4.5:1): ${result.normalTextAA ? '✓ Пройдено' : '✗ Не пройдено'}
• Обычный текст AAA (7:1): ${result.normalTextAAA ? '✓ Пройдено' : '✗ Не пройдено'}
• Крупный текст AA (3:1): ${result.largeTextAA ? '✓ Пройдено' : '✗ Не пройдено'}
• Крупный текст AAA (4.5:1): ${result.largeTextAAA ? '✓ Пройдено' : '✗ Не пройдено'}
• UI компоненты AA (3:1): ${result.uiComponentAA ? '✓ Пройдено' : '✗ Не пройдено'}
    `.trim()

    navigator.clipboard.writeText(text)
    toast.success('Результаты скопированы!')
  }

  const reset = () => {
    setForeground('#000000')
    setBackground('#ffffff')
    setFontSize(16)
    setFontWeight('normal')
    toast.success('Настройки сброшены')
  }

  const getStatusIcon = (passes: boolean) => {
    return passes ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    )
  }

  const getContrastLevel = (ratio: number): { label: string; color: string } => {
    if (ratio >= 7) return { label: 'Отличный', color: 'text-green-600' }
    if (ratio >= 4.5) return { label: 'Хороший', color: 'text-blue-600' }
    if (ratio >= 3) return { label: 'Минимальный', color: 'text-yellow-600' }
    return { label: 'Недостаточный', color: 'text-red-600' }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Color Inputs */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Выбор цветов</h3>
          
          <div className="space-y-6">
            {/* Foreground Color */}
            <div>
              <Label htmlFor="foreground" className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                Цвет текста (передний план)
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="foreground"
                  type="color"
                  value={foreground}
                  onChange={(e) => setForeground(e.target.value)}
                  className="w-20 h-10 p-1"
                />
                <Input
                  type="text"
                  value={foreground}
                  onChange={(e) => setForeground(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 font-mono"
                />
              </div>
            </div>

            {/* Background Color */}
            <div>
              <Label htmlFor="background" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Цвет фона
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="background"
                  type="color"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="w-20 h-10 p-1"
                />
                <Input
                  type="text"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1 font-mono"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={swapColors} variant="outline" className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Поменять местами
              </Button>
              <Button onClick={randomColors} variant="outline" className="flex-1">
                <Shuffle className="w-4 h-4 mr-2" />
                Случайные
              </Button>
            </div>

            {/* Text Settings */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium">Настройки текста</h4>
              
              <div>
                <Label htmlFor="font-size">Размер шрифта (px)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Slider
                    id="font-size"
                    value={[fontSize]}
                    onValueChange={(value) => setFontSize(value[0])}
                    min={10}
                    max={48}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm w-12 text-right">{fontSize}px</span>
                </div>
              </div>

              <div>
                <Label htmlFor="font-weight">Начертание</Label>
                <Select 
                  value={fontWeight} 
                  onValueChange={(value: 'normal' | 'bold') => setFontWeight(value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Обычный</SelectItem>
                    <SelectItem value="bold">Жирный</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-muted-foreground">
                {fontSize >= 18 || (fontSize >= 14 && fontWeight === 'bold') ? (
                  <Badge variant="secondary" className="gap-1">
                    <Type className="w-3 h-3" />
                    Крупный текст
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <Type className="w-3 h-3" />
                    Обычный текст
                  </Badge>
                )}
              </div>
            </div>

            {/* Color Pairs */}
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-medium">Примеры цветовых пар</h4>
              <div className="grid grid-cols-2 gap-2">
                {COLOR_PAIRS.map((pair, index) => (
                  <Button
                    key={index}
                    onClick={() => loadColorPair(pair)}
                    variant="outline"
                    size="sm"
                    className="justify-start h-auto p-2"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex">
                        <div 
                          className="w-6 h-6 rounded-l border"
                          style={{ backgroundColor: pair.foreground }}
                        />
                        <div 
                          className="w-6 h-6 rounded-r border"
                          style={{ backgroundColor: pair.background }}
                        />
                      </div>
                      <span className="text-xs truncate">{pair.name}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={copyResults} variant="outline" disabled={!result}>
                <Copy className="w-4 h-4 mr-2" />
                Копировать результаты
              </Button>
              <Button onClick={reset} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Сбросить
              </Button>
            </div>
          </div>
        </Card>

        {/* Results and Preview */}
        <div className="space-y-6">
          {/* Preview */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Предпросмотр</h3>
            
            <div 
              className="p-8 rounded-lg border"
              style={{ backgroundColor: background }}
            >
              <p 
                className="mb-4"
                style={{ 
                  color: foreground,
                  fontSize: `${fontSize}px`,
                  fontWeight: fontWeight
                }}
              >
                Быстрая коричневая лиса перепрыгивает через ленивую собаку.
              </p>
              <p 
                className="text-sm"
                style={{ 
                  color: foreground,
                  opacity: 0.8
                }}
              >
                The quick brown fox jumps over the lazy dog.
              </p>
              <div className="mt-4 space-y-2">
                <button
                  className="px-4 py-2 rounded border"
                  style={{
                    color: foreground,
                    borderColor: foreground,
                    backgroundColor: 'transparent'
                  }}
                >
                  Кнопка
                </button>
                <div 
                  className="w-full h-2 rounded"
                  style={{ backgroundColor: foreground, opacity: 0.2 }}
                />
              </div>
            </div>
          </Card>

          {/* Results */}
          {result && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Результаты проверки</h3>
              
              {/* Contrast Ratio */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Коэффициент контрастности</span>
                  <Badge className={cn("text-lg", getContrastLevel(result.ratio).color)}>
                    {result.ratio.toFixed(2)}:1
                  </Badge>
                </div>
                <div className="text-center py-2">
                  <span className={cn("text-2xl font-bold", getContrastLevel(result.ratio).color)}>
                    {getContrastLevel(result.ratio).label}
                  </span>
                </div>
              </div>

              {/* WCAG Criteria */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    <span className="text-sm">Обычный текст AA (4.5:1)</span>
                  </div>
                  {getStatusIcon(result.normalTextAA)}
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    <span className="text-sm">Обычный текст AAA (7:1)</span>
                  </div>
                  {getStatusIcon(result.normalTextAAA)}
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Type className="w-5 h-5" />
                    <span className="text-sm">Крупный текст AA (3:1)</span>
                  </div>
                  {getStatusIcon(result.largeTextAA)}
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Type className="w-5 h-5" />
                    <span className="text-sm">Крупный текст AAA (4.5:1)</span>
                  </div>
                  {getStatusIcon(result.largeTextAAA)}
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    <span className="text-sm">UI компоненты AA (3:1)</span>
                  </div>
                  {getStatusIcon(result.uiComponentAA)}
                </div>
              </div>
            </Card>
          )}

          {/* Suggestions */}
          {(suggestions.foreground.length > 0 || suggestions.background.length > 0) && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                Рекомендуемые улучшения
              </h3>
              
              {suggestions.foreground.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Альтернативные цвета текста:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {suggestions.foreground.map((suggestion, index) => (
                      <Button
                        key={index}
                        onClick={() => setForeground(suggestion.color)}
                        variant="outline"
                        size="sm"
                        className="justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: suggestion.color }}
                          />
                          <span className="font-mono text-xs">{suggestion.color}</span>
                        </div>
                        <Badge variant={suggestion.passesAAA ? "default" : "secondary"} className="text-xs">
                          {suggestion.ratio.toFixed(1)}:1
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.background.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Альтернативные цвета фона:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {suggestions.background.map((suggestion, index) => (
                      <Button
                        key={index}
                        onClick={() => setBackground(suggestion.color)}
                        variant="outline"
                        size="sm"
                        className="justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: suggestion.color }}
                          />
                          <span className="font-mono text-xs">{suggestion.color}</span>
                        </div>
                        <Badge variant={suggestion.passesAAA ? "default" : "secondary"} className="text-xs">
                          {suggestion.ratio.toFixed(1)}:1
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* Info */}
      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Info className="w-4 h-4" />
          О стандартах WCAG
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-medium mb-2">Уровни соответствия</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• <strong>Уровень A</strong> - минимальный уровень</li>
              <li>• <strong>Уровень AA</strong> - рекомендуемый стандарт</li>
              <li>• <strong>Уровень AAA</strong> - повышенный стандарт</li>
              <li>• Большинство сайтов стремятся к уровню AA</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Требования к контрасту</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• <strong>Обычный текст:</strong> 4.5:1 (AA), 7:1 (AAA)</li>
              <li>• <strong>Крупный текст:</strong> 3:1 (AA), 4.5:1 (AAA)</li>
              <li>• <strong>UI элементы:</strong> 3:1 (AA)</li>
              <li>• Крупный текст: 18px+ или 14px+ bold</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Почему это важно</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Доступность для слабовидящих</li>
              <li>• Читаемость при ярком освещении</li>
              <li>• Снижение нагрузки на глаза</li>
              <li>• Юридические требования</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}