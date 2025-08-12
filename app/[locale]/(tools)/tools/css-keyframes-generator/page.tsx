'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { 
  Play,
  Pause,
  RotateCcw,
  Copy,
  RefreshCw,
  Plus,
  Trash2,
  Sparkles,
  Zap,
  Move,
  Scale,
  RotateCw,
  Eye,
  Palette,
  Activity,
  ArrowRight,
  Info
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type AnimationType = 'transform' | 'opacity' | 'color' | 'position' | 'custom'
type EasingType = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'cubic-bezier'

interface Keyframe {
  id: string
  percentage: number
  properties: { [key: string]: string }
}

interface AnimationPreset {
  name: string
  type: AnimationType
  icon: any
  keyframes: Keyframe[]
  duration: number
  easing: EasingType
  infinite: boolean
}

const ANIMATION_PRESETS: AnimationPreset[] = [
  {
    name: 'Fade In',
    type: 'opacity',
    icon: Eye,
    duration: 1,
    easing: 'ease',
    infinite: false,
    keyframes: [
      { id: '1', percentage: 0, properties: { opacity: '0' } },
      { id: '2', percentage: 100, properties: { opacity: '1' } }
    ]
  },
  {
    name: 'Slide In',
    type: 'transform',
    icon: ArrowRight,
    duration: 0.5,
    easing: 'ease-out',
    infinite: false,
    keyframes: [
      { id: '1', percentage: 0, properties: { transform: 'translateX(-100%)' } },
      { id: '2', percentage: 100, properties: { transform: 'translateX(0)' } }
    ]
  },
  {
    name: 'Bounce',
    type: 'transform',
    icon: Activity,
    duration: 1,
    easing: 'ease',
    infinite: true,
    keyframes: [
      { id: '1', percentage: 0, properties: { transform: 'translateY(0)' } },
      { id: '2', percentage: 50, properties: { transform: 'translateY(-30px)' } },
      { id: '3', percentage: 100, properties: { transform: 'translateY(0)' } }
    ]
  },
  {
    name: 'Rotate',
    type: 'transform',
    icon: RotateCw,
    duration: 2,
    easing: 'linear',
    infinite: true,
    keyframes: [
      { id: '1', percentage: 0, properties: { transform: 'rotate(0deg)' } },
      { id: '2', percentage: 100, properties: { transform: 'rotate(360deg)' } }
    ]
  },
  {
    name: 'Pulse',
    type: 'transform',
    icon: Zap,
    duration: 1.5,
    easing: 'ease-in-out',
    infinite: true,
    keyframes: [
      { id: '1', percentage: 0, properties: { transform: 'scale(1)' } },
      { id: '2', percentage: 50, properties: { transform: 'scale(1.1)' } },
      { id: '3', percentage: 100, properties: { transform: 'scale(1)' } }
    ]
  },
  {
    name: 'Color Change',
    type: 'color',
    icon: Palette,
    duration: 3,
    easing: 'linear',
    infinite: true,
    keyframes: [
      { id: '1', percentage: 0, properties: { backgroundColor: '#3b82f6' } },
      { id: '2', percentage: 33, properties: { backgroundColor: '#ef4444' } },
      { id: '3', percentage: 66, properties: { backgroundColor: '#10b981' } },
      { id: '4', percentage: 100, properties: { backgroundColor: '#3b82f6' } }
    ]
  },
  {
    name: 'Shake',
    type: 'transform',
    icon: Move,
    duration: 0.5,
    easing: 'ease',
    infinite: false,
    keyframes: [
      { id: '1', percentage: 0, properties: { transform: 'translateX(0)' } },
      { id: '2', percentage: 25, properties: { transform: 'translateX(-10px)' } },
      { id: '3', percentage: 50, properties: { transform: 'translateX(10px)' } },
      { id: '4', percentage: 75, properties: { transform: 'translateX(-10px)' } },
      { id: '5', percentage: 100, properties: { transform: 'translateX(0)' } }
    ]
  },
  {
    name: 'Swing',
    type: 'transform',
    icon: Activity,
    duration: 1,
    easing: 'ease-in-out',
    infinite: false,
    keyframes: [
      { id: '1', percentage: 0, properties: { transform: 'rotate(0deg)' } },
      { id: '2', percentage: 20, properties: { transform: 'rotate(15deg)' } },
      { id: '3', percentage: 40, properties: { transform: 'rotate(-10deg)' } },
      { id: '4', percentage: 60, properties: { transform: 'rotate(5deg)' } },
      { id: '5', percentage: 80, properties: { transform: 'rotate(-5deg)' } },
      { id: '6', percentage: 100, properties: { transform: 'rotate(0deg)' } }
    ]
  }
]

const EASING_FUNCTIONS = [
  { value: 'linear', label: 'Linear' },
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'cubic-bezier', label: 'Cubic Bezier' }
]

const CSS_PROPERTIES = [
  { category: 'Transform', properties: ['transform', 'transform-origin'] },
  { category: 'Position', properties: ['top', 'right', 'bottom', 'left'] },
  { category: 'Size', properties: ['width', 'height', 'max-width', 'max-height'] },
  { category: 'Spacing', properties: ['margin', 'padding'] },
  { category: 'Colors', properties: ['color', 'background-color', 'border-color'] },
  { category: 'Effects', properties: ['opacity', 'filter', 'box-shadow', 'text-shadow'] },
  { category: 'Border', properties: ['border-width', 'border-radius'] }
]

export default function CSSKeyframesGeneratorPage() {
  const [animationName, setAnimationName] = useState('myAnimation')
  const [duration, setDuration] = useState(1)
  const [easing, setEasing] = useState<EasingType>('ease')
  const [cubicBezier, setCubicBezier] = useState('0.25, 0.1, 0.25, 1')
  const [delay, setDelay] = useState(0)
  const [iterationCount, setIterationCount] = useState('1')
  const [infinite, setInfinite] = useState(false)
  const [direction, setDirection] = useState('normal')
  const [fillMode, setFillMode] = useState('none')
  const [keyframes, setKeyframes] = useState<Keyframe[]>([
    { id: '1', percentage: 0, properties: { transform: 'scale(1)' } },
    { id: '2', percentage: 50, properties: { transform: 'scale(1.2)' } },
    { id: '3', percentage: 100, properties: { transform: 'scale(1)' } }
  ])
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState('transform')
  const [propertyValue, setPropertyValue] = useState('')

  useEffect(() => {
    if (infinite) {
      setIterationCount('infinite')
    } else if (iterationCount === 'infinite') {
      setIterationCount('1')
    }
  }, [infinite])

  const addKeyframe = () => {
    const newKeyframe: Keyframe = {
      id: Date.now().toString(),
      percentage: 50,
      properties: {}
    }
    setKeyframes([...keyframes, newKeyframe].sort((a, b) => a.percentage - b.percentage))
  }

  const updateKeyframe = (id: string, field: 'percentage' | 'properties', value: any) => {
    setKeyframes(keyframes.map(kf => {
      if (kf.id === id) {
        if (field === 'percentage') {
          return { ...kf, percentage: value }
        } else {
          return { ...kf, properties: value }
        }
      }
      return kf
    }).sort((a, b) => a.percentage - b.percentage))
  }

  const deleteKeyframe = (id: string) => {
    if (keyframes.length > 2) {
      setKeyframes(keyframes.filter(kf => kf.id !== id))
    } else {
      toast.error('Минимум 2 ключевых кадра необходимо')
    }
  }

  const addPropertyToKeyframe = (keyframeId: string, property: string, value: string) => {
    const keyframe = keyframes.find(kf => kf.id === keyframeId)
    if (keyframe) {
      const updatedProperties = { ...keyframe.properties, [property]: value }
      updateKeyframe(keyframeId, 'properties', updatedProperties)
    }
  }

  const removePropertyFromKeyframe = (keyframeId: string, property: string) => {
    const keyframe = keyframes.find(kf => kf.id === keyframeId)
    if (keyframe) {
      const updatedProperties = { ...keyframe.properties }
      delete updatedProperties[property]
      updateKeyframe(keyframeId, 'properties', updatedProperties)
    }
  }

  const loadPreset = (preset: AnimationPreset) => {
    setAnimationName(preset.name.toLowerCase().replace(/\s+/g, '-'))
    setDuration(preset.duration)
    setEasing(preset.easing)
    setInfinite(preset.infinite)
    setKeyframes(preset.keyframes.map(kf => ({ ...kf, id: Date.now().toString() + kf.id })))
    toast.success(`Загружен пресет: ${preset.name}`)
  }

  const generateCSS = (): string => {
    const easingValue = easing === 'cubic-bezier' ? `cubic-bezier(${cubicBezier})` : easing
    
    let css = `@keyframes ${animationName} {\n`
    
    keyframes.forEach(keyframe => {
      css += `  ${keyframe.percentage}% {\n`
      Object.entries(keyframe.properties).forEach(([prop, value]) => {
        css += `    ${prop}: ${value};\n`
      })
      css += `  }\n`
    })
    
    css += `}\n\n`
    css += `.animated-element {\n`
    css += `  animation-name: ${animationName};\n`
    css += `  animation-duration: ${duration}s;\n`
    css += `  animation-timing-function: ${easingValue};\n`
    if (delay > 0) css += `  animation-delay: ${delay}s;\n`
    css += `  animation-iteration-count: ${iterationCount};\n`
    if (direction !== 'normal') css += `  animation-direction: ${direction};\n`
    if (fillMode !== 'none') css += `  animation-fill-mode: ${fillMode};\n`
    css += `}\n\n`
    css += `/* Сокращенная запись */\n`
    css += `.animated-element {\n`
    css += `  animation: ${animationName} ${duration}s ${easingValue}`
    if (delay > 0) css += ` ${delay}s`
    css += ` ${iterationCount}`
    if (direction !== 'normal') css += ` ${direction}`
    if (fillMode !== 'none') css += ` ${fillMode}`
    css += `;\n}`
    
    return css
  }

  const copyCSS = () => {
    navigator.clipboard.writeText(generateCSS())
    toast.success('CSS скопирован!')
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const reset = () => {
    setAnimationName('myAnimation')
    setDuration(1)
    setEasing('ease')
    setCubicBezier('0.25, 0.1, 0.25, 1')
    setDelay(0)
    setIterationCount('1')
    setInfinite(false)
    setDirection('normal')
    setFillMode('none')
    setKeyframes([
      { id: '1', percentage: 0, properties: { transform: 'scale(1)' } },
      { id: '2', percentage: 50, properties: { transform: 'scale(1.2)' } },
      { id: '3', percentage: 100, properties: { transform: 'scale(1)' } }
    ])
    setIsPlaying(false)
    toast.success('Генератор сброшен')
  }

  const getAnimationStyle = () => {
    if (!isPlaying) return {}
    
    const easingValue = easing === 'cubic-bezier' ? `cubic-bezier(${cubicBezier})` : easing
    
    return {
      animation: `${animationName} ${duration}s ${easingValue} ${delay}s ${iterationCount} ${direction} ${fillMode}`,
      ...keyframes.reduce((acc, kf) => {
        if (kf.percentage === 0) {
          return { ...acc, ...kf.properties }
        }
        return acc
      }, {})
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Animation Settings */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Настройки анимации</h3>
            
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Название анимации</Label>
                  <Input
                    id="name"
                    value={animationName}
                    onChange={(e) => setAnimationName(e.target.value)}
                    placeholder="myAnimation"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">Длительность (сек)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider
                      value={[duration]}
                      onValueChange={([value]) => setDuration(value)}
                      min={0.1}
                      max={10}
                      step={0.1}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-mono">{duration}s</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="easing">Функция плавности</Label>
                  <Select value={easing} onValueChange={(value: EasingType) => setEasing(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EASING_FUNCTIONS.map(func => (
                        <SelectItem key={func.value} value={func.value}>
                          {func.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {easing === 'cubic-bezier' && (
                    <Input
                      value={cubicBezier}
                      onChange={(e) => setCubicBezier(e.target.value)}
                      placeholder="0.25, 0.1, 0.25, 1"
                      className="mt-2"
                    />
                  )}
                </div>

                <div>
                  <Label htmlFor="delay">Задержка (сек)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider
                      value={[delay]}
                      onValueChange={([value]) => setDelay(value)}
                      min={0}
                      max={5}
                      step={0.1}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-mono">{delay}s</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="iterations">Количество повторов</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="iterations"
                      type="number"
                      value={iterationCount === 'infinite' ? '' : iterationCount}
                      onChange={(e) => setIterationCount(e.target.value)}
                      disabled={infinite}
                      min="1"
                      className="flex-1"
                    />
                    <div className="flex items-center gap-2">
                      <Switch
                        id="infinite"
                        checked={infinite}
                        onCheckedChange={setInfinite}
                      />
                      <Label htmlFor="infinite">Бесконечно</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="direction">Направление</Label>
                  <Select value={direction} onValueChange={setDirection}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="reverse">Reverse</SelectItem>
                      <SelectItem value="alternate">Alternate</SelectItem>
                      <SelectItem value="alternate-reverse">Alternate Reverse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="fill-mode">Fill Mode</Label>
                <Select value={fillMode} onValueChange={setFillMode}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="forwards">Forwards</SelectItem>
                    <SelectItem value="backwards">Backwards</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Keyframes Editor */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Ключевые кадры</h3>
              <Button onClick={addKeyframe} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Добавить кадр
              </Button>
            </div>

            <div className="space-y-4">
              {keyframes.map((keyframe) => (
                <div key={keyframe.id} className="p-4 rounded-lg border bg-muted/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Label>Позиция:</Label>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={keyframe.percentage}
                            onChange={(e) => updateKeyframe(keyframe.id, 'percentage', parseInt(e.target.value) || 0)}
                            min="0"
                            max="100"
                            className="w-20"
                          />
                          <span className="text-sm">%</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => deleteKeyframe(keyframe.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Properties */}
                  <div className="space-y-2">
                    {Object.entries(keyframe.properties).map(([prop, value]) => (
                      <div key={prop} className="flex items-center gap-2">
                        <code className="inline-code">{prop}:</code>
                        <Input
                          value={value}
                          onChange={(e) => addPropertyToKeyframe(keyframe.id, prop, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={() => removePropertyFromKeyframe(keyframe.id, prop)}
                          size="sm"
                          variant="ghost"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {/* Add Property */}
                    <div className="flex items-center gap-2 pt-2">
                      <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CSS_PROPERTIES.map(category => (
                            <div key={category.category}>
                              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                                {category.category}
                              </div>
                              {category.properties.map(prop => (
                                <SelectItem key={prop} value={prop}>
                                  {prop}
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={propertyValue}
                        onChange={(e) => setPropertyValue(e.target.value)}
                        placeholder="Значение"
                        className="flex-1"
                      />
                      <Button
                        onClick={() => {
                          if (propertyValue) {
                            addPropertyToKeyframe(keyframe.id, selectedProperty, propertyValue)
                            setPropertyValue('')
                          }
                        }}
                        size="sm"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Generated CSS */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Сгенерированный CSS</h3>
              <Button onClick={copyCSS} size="sm" className="gap-2">
                <Copy className="w-4 h-4" />
                Копировать
              </Button>
            </div>
            
            <pre className="p-4 rounded-lg bg-muted overflow-x-auto">
              <code className="text-sm">{generateCSS()}</code>
            </pre>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Предпросмотр</h3>
            
            <div className="flex justify-center items-center h-48 bg-muted/20 rounded-lg mb-4">
              <div
                className="w-24 h-24 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold"
                style={getAnimationStyle()}
              >
                DEMO
              </div>
            </div>

            <div className="flex justify-center gap-2">
              <Button
                onClick={togglePlayPause}
                variant={isPlaying ? 'secondary' : 'default'}
                className="gap-2"
              >
                {isPlaying ? (
                  <><Pause className="w-4 h-4" /> Пауза</>
                ) : (
                  <><Play className="w-4 h-4" /> Играть</>
                )}
              </Button>
              <Button onClick={reset} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Сброс
              </Button>
            </div>
          </Card>

          {/* Presets */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Готовые анимации</h3>
            
            <div className="space-y-2">
              {ANIMATION_PRESETS.map((preset, index) => {
                const Icon = preset.icon
                return (
                  <Button
                    key={index}
                    onClick={() => loadPreset(preset)}
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {preset.name}
                  </Button>
                )
              })}
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Советы
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Используйте transform для лучшей производительности</li>
              <li>• Избегайте анимации width/height, используйте scale</li>
              <li>• will-change подготовит браузер к анимации</li>
              <li>• animation-fill-mode сохранит состояние анимации</li>
              <li>• Комбинируйте несколько свойств в одном кадре</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}