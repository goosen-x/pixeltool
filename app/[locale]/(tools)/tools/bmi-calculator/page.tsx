'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WidgetShareSection, WidgetTips, WidgetKeyboardShortcuts, ShortcutHint } from '@/components/widgets'
import { useWidgetKeyboard, commonWidgetShortcuts, type KeyboardShortcut } from '@/lib/hooks/useWidgetKeyboard'
import { useBMICalculator, type ActivityLevel, type Gender, type UnitSystem } from '@/lib/hooks/widgets'
import { 
  Weight,
  Ruler,
  Copy,
  RefreshCw,
  Activity,
  Info,
  User,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const ACTIVITY_LABELS = {
  sedentary: 'Малоподвижный (мало или нет упражнений)',
  light: 'Легкая активность (1-3 дня в неделю)',
  moderate: 'Умеренная активность (3-5 дней в неделю)',
  active: 'Высокая активность (6-7 дней в неделю)',
  'very-active': 'Очень высокая активность (тяжелая работа)'
}

export default function BMICalculatorPage() {
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Use the BMI calculator hook
  const {
    input,
    result,
    healthMetrics,
    updateField,
    calculate,
    reset: resetCalculator,
    copyResults,
    loadExample: loadExampleData,
    getBMIVisualization
  } = useBMICalculator()

  // Handle reset with additional UI state
  const handleReset = () => {
    resetCalculator()
    setShowAdvanced(false)
  }

  // Handle load example with UI state
  const handleLoadExample = () => {
    loadExampleData()
    setShowAdvanced(true)
  }

  // Keyboard shortcuts
  const shortcuts: KeyboardShortcut[] = [
    {
      ...commonWidgetShortcuts.submit,
      action: calculate
    },
    {
      ...commonWidgetShortcuts.reset,
      action: handleReset
    },
    {
      key: 'c',
      ctrl: true,
      shift: true,
      description: 'Copy results',
      action: copyResults,
      enabled: !!result
    },
    {
      key: 'e',
      ctrl: true,
      description: 'Load example',
      action: handleLoadExample
    },
    {
      key: 'a',
      ctrl: true,
      description: 'Toggle advanced',
      action: () => setShowAdvanced(!showAdvanced)
    },
    {
      key: 'u',
      ctrl: true,
      description: 'Switch units',
      action: () => updateField('unitSystem', input.unitSystem === 'metric' ? 'imperial' : 'metric')
    },
    {
      key: '/',
      description: 'Focus weight input',
      action: () => {
        const inputEl = document.querySelector('#weight') as HTMLInputElement
        inputEl?.focus()
      }
    }
  ]

  useWidgetKeyboard({
    shortcuts,
    widgetId: 'bmi-calculator',
    enabled: true
  })

  // Widget tips
  const bmiTips = [
    {
      id: 'units',
      title: 'Switch Units Easily',
      description: 'Toggle between metric and imperial units at any time',
      category: 'basic' as const
    },
    {
      id: 'advanced',
      title: 'Advanced Metrics',
      description: 'Click "Show additional parameters" for body fat percentage calculation',
      category: 'advanced' as const,
      action: {
        label: 'Show Advanced',
        onClick: () => setShowAdvanced(true)
      }
    },
    {
      id: 'example',
      title: 'Quick Example',
      description: 'Click "Load example" to see sample calculations',
      category: 'basic' as const,
      action: {
        label: 'Load Example',
        onClick: handleLoadExample
      }
    },
    {
      id: 'copy',
      title: 'Copy Results',
      description: 'Copy your BMI results to share with healthcare providers',
      category: 'basic' as const
    },
    {
      id: 'accuracy',
      title: 'BMI Limitations',
      description: 'BMI doesn\'t distinguish between muscle and fat. Athletes may have high BMI despite low body fat',
      category: 'pro' as const
    }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Tips Section */}
      <WidgetTips
        tips={bmiTips}
        widgetId="bmi-calculator"
        variant="inline"
        className="mb-6"
      />
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Введите данные</h3>
          
          <div className="space-y-4">
            {/* Unit System */}
            <div>
              <Label>Система измерения</Label>
              <RadioGroup 
                value={input.unitSystem} 
                onValueChange={(value: UnitSystem) => updateField('unitSystem', value)}
                className="flex gap-4 mt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="metric" id="metric" />
                  <Label htmlFor="metric">Метрическая (кг, см)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="imperial" id="imperial" />
                  <Label htmlFor="imperial">Имперская (lbs, ft)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Weight */}
            <div>
              <Label htmlFor="weight" className="flex items-center gap-2">
                <Weight className="w-4 h-4" />
                Вес ({input.unitSystem === 'metric' ? 'кг' : 'lbs'})
              </Label>
              <Input
                id="weight"
                type="number"
                value={input.weight}
                onChange={(e) => updateField('weight', e.target.value)}
                placeholder={input.unitSystem === 'metric' ? '70' : '154'}
                min="1"
                step="0.1"
                className="mt-1"
              />
            </div>

            {/* Height */}
            {input.unitSystem === 'metric' ? (
              <div>
                <Label htmlFor="height" className="flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Рост (см)
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={input.height}
                  onChange={(e) => updateField('height', e.target.value)}
                  placeholder="175"
                  min="50"
                  max="250"
                  className="mt-1"
                />
              </div>
            ) : (
              <div>
                <Label className="flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Рост
                </Label>
                <div className="flex gap-2 mt-1">
                  <div className="flex-1">
                    <Input
                      type="number"
                      value={input.feet}
                      onChange={(e) => updateField('feet', e.target.value)}
                      placeholder="5"
                      min="3"
                      max="8"
                    />
                    <span className="text-xs text-muted-foreground">футы</span>
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      value={input.inches}
                      onChange={(e) => updateField('inches', e.target.value)}
                      placeholder="9"
                      min="0"
                      max="11"
                    />
                    <span className="text-xs text-muted-foreground">дюймы</span>
                  </div>
                </div>
              </div>
            )}

            {/* Age and Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Возраст</Label>
                <Input
                  id="age"
                  type="number"
                  value={input.age}
                  onChange={(e) => updateField('age', e.target.value)}
                  placeholder="30"
                  min="15"
                  max="100"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Пол</Label>
                <Select value={input.gender} onValueChange={(value: Gender) => updateField('gender', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Мужской</SelectItem>
                    <SelectItem value="female">Женский</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <Label htmlFor="activity">Уровень активности</Label>
              <Select value={input.activityLevel} onValueChange={(value: ActivityLevel) => updateField('activityLevel', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ACTIVITY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Options */}
            <Button
              onClick={() => setShowAdvanced(!showAdvanced)}
              variant="outline"
              className="w-full"
            >
              {showAdvanced ? 'Скрыть' : 'Показать'} дополнительные параметры
            </Button>

            {showAdvanced && (
              <div className="space-y-4 pt-2">
                <div>
                  <Label htmlFor="waist">
                    Обхват талии ({input.unitSystem === 'metric' ? 'см' : 'дюймы'})
                  </Label>
                  <Input
                    id="waist"
                    type="number"
                    value={input.waist}
                    onChange={(e) => updateField('waist', e.target.value)}
                    placeholder={input.unitSystem === 'metric' ? '80' : '31.5'}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="neck">
                    Обхват шеи ({input.unitSystem === 'metric' ? 'см' : 'дюймы'})
                  </Label>
                  <Input
                    id="neck"
                    type="number"
                    value={input.neck}
                    onChange={(e) => updateField('neck', e.target.value)}
                    placeholder={input.unitSystem === 'metric' ? '37' : '14.5'}
                    className="mt-1"
                  />
                </div>

                {input.gender === 'female' && (
                  <div>
                    <Label htmlFor="hip">
                      Обхват бедер ({input.unitSystem === 'metric' ? 'см' : 'дюймы'})
                    </Label>
                    <Input
                      id="hip"
                      type="number"
                      value={input.hip}
                      onChange={(e) => updateField('hip', e.target.value)}
                      placeholder={input.unitSystem === 'metric' ? '95' : '37.5'}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button onClick={handleLoadExample} variant="outline" className="flex-1">
                Загрузить пример
                <ShortcutHint 
                  shortcut={{ key: 'e', ctrl: true, description: '', action: handleLoadExample }} 
                  className="ml-2"
                />
              </Button>
              <Button onClick={copyResults} variant="outline" disabled={!result}>
                <Copy className="w-4 h-4 mr-2" />
                Копировать
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Сбросить
              </Button>
            </div>
          </div>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* BMI Result */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Результаты расчета
              </h3>

              <div className="space-y-6">
                {/* BMI Value */}
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">
                    {result.bmi.toFixed(1)}
                  </div>
                  <Badge className={cn("text-lg px-3 py-1", result.categoryColor)}>
                    {result.category}
                  </Badge>
                </div>

                {/* BMI Scale */}
                <div>
                  <div className="relative h-8 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 to-green-500 via-yellow-500 to-red-500 rounded-full">
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-1 h-10 bg-black rounded-full"
                      style={{ left: `${getBMIVisualization(result.bmi)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>15</span>
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                    <span>40</span>
                  </div>
                </div>

                {/* Health Risk */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Риск для здоровья:</span>
                    <Badge 
                      variant={result.healthRisk === 'Минимальный' ? 'default' : 'destructive'}
                    >
                      {result.healthRisk}
                    </Badge>
                  </div>
                </div>

                {/* Weight Recommendations */}
                <div>
                  <h4 className="font-medium mb-3">Рекомендации по весу</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Идеальный вес:</span>
                      <span className="font-medium">
                        {result.idealWeight.min.toFixed(1)} - {result.idealWeight.max.toFixed(1)} {input.unitSystem === 'metric' ? 'кг' : 'lbs'}
                      </span>
                    </div>
                    
                    {result.weightToLose > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Рекомендуется снизить:</span>
                        <Badge variant="destructive">
                          -{result.weightToLose.toFixed(1)} {input.unitSystem === 'metric' ? 'кг' : 'lbs'}
                        </Badge>
                      </div>
                    )}
                    
                    {result.weightToGain > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Рекомендуется набрать:</span>
                        <Badge variant="secondary">
                          +{result.weightToGain.toFixed(1)} {input.unitSystem === 'metric' ? 'кг' : 'lbs'}
                        </Badge>
                      </div>
                    )}

                    {result.weightToLose === 0 && result.weightToGain === 0 && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Ваш вес в пределах нормы!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Calorie Recommendations */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Калорийность рациона
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Поддержание веса</span>
                    <span className="font-mono font-semibold">{result.calories.maintenance} ккал</span>
                  </div>
                </div>

                {result.weightToLose > 0 && (
                  <>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Медленное похудение (-0.25 кг/нед)</span>
                        <span className="font-mono font-semibold">{result.calories.mildLoss} ккал</span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Похудение (-0.5 кг/нед)</span>
                        <span className="font-mono font-semibold">{result.calories.loss} ккал</span>
                      </div>
                    </div>
                  </>
                )}

                {result.weightToGain > 0 && (
                  <>
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Медленный набор (+0.25 кг/нед)</span>
                        <span className="font-mono font-semibold">{result.calories.mildGain} ккал</span>
                      </div>
                    </div>
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Набор массы (+0.5 кг/нед)</span>
                        <span className="font-mono font-semibold">{result.calories.gain} ккал</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Additional Health Metrics */}
            {healthMetrics && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Дополнительные показатели
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <div>
                      <span className="text-sm text-muted-foreground">Соотношение талия/рост</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Норма: &lt; 0.5
                      </p>
                    </div>
                    <Badge variant={healthMetrics.waistToHeight < 0.5 ? 'default' : 'destructive'}>
                      {healthMetrics.waistToHeight.toFixed(2)}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <div>
                      <span className="text-sm text-muted-foreground">Процент жира в организме</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {input.gender === 'male' ? 'Норма: 10-20%' : 'Норма: 20-30%'}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {healthMetrics.bodyFat.toFixed(1)}%
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Мышечная масса</span>
                    <span className="font-mono font-semibold">
                      {healthMetrics.leanMass.toFixed(1)} {input.unitSystem === 'metric' ? 'кг' : 'lbs'}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Info className="w-4 h-4" />
          Об индексе массы тела
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-medium mb-2">Что такое ИМТ?</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Отношение массы к квадрату роста</li>
              <li>• Оценка соответствия массы и роста</li>
              <li>• Индикатор возможных проблем</li>
              <li>• Не учитывает мышечную массу</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Ограничения ИМТ</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Не различает жир и мышцы</li>
              <li>• Не показывает распределение жира</li>
              <li>• Менее точен для спортсменов</li>
              <li>• Зависит от возраста и пола</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Дополнительные метрики</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Процент жира в организме</li>
              <li>• Соотношение талия/рост</li>
              <li>• Обхват талии</li>
              <li>• Консультация врача</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Social Share Section */}
      <WidgetShareSection
        widgetTitle="BMI Calculator"
        widgetDescription="Calculate your Body Mass Index with health insights, ideal weight range, and calorie recommendations."
        hashtags={['bmi', 'health', 'fitness', 'calculator', 'wellness']}
        variant="inline"
      />
      
      {/* Keyboard shortcuts */}
      <WidgetKeyboardShortcuts
        shortcuts={shortcuts}
        variant="floating"
        position="bottom-right"
      />
    </div>
  )
}