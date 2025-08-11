'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Palette,
  Copy,
  RefreshCw,
  Plus,
  Trash2,
  Move,
  Sparkles,
  Download,
  Sliders,
  Maximize2,
  RotateCw
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type GradientType = 'linear' | 'radial' | 'conic'
type LinearDirection = 'to top' | 'to bottom' | 'to left' | 'to right' | 'to top left' | 'to top right' | 'to bottom left' | 'to bottom right' | 'custom'
type RadialShape = 'circle' | 'ellipse'
type RadialSize = 'closest-side' | 'farthest-side' | 'closest-corner' | 'farthest-corner'

interface ColorStop {
  id: string
  color: string
  position: number
  opacity: number
}

interface GradientSettings {
  type: GradientType
  linearDirection: LinearDirection
  linearAngle: number
  radialShape: RadialShape
  radialSize: RadialSize
  radialPositionX: number
  radialPositionY: number
  conicAngle: number
  conicPositionX: number
  conicPositionY: number
  repeating: boolean
  colorStops: ColorStop[]
}

interface PresetGradient {
  name: string
  category: string
  settings: Partial<GradientSettings>
}

const PRESET_GRADIENTS: PresetGradient[] = [
  {
    name: 'Закат',
    category: 'nature',
    settings: {
      type: 'linear',
      linearDirection: 'to bottom',
      colorStops: [
        { id: '1', color: '#ff6b6b', position: 0, opacity: 100 },
        { id: '2', color: '#feca57', position: 50, opacity: 100 },
        { id: '3', color: '#48dbfb', position: 100, opacity: 100 }
      ]
    }
  },
  {
    name: 'Океан',
    category: 'nature',
    settings: {
      type: 'linear',
      linearDirection: 'to bottom right',
      colorStops: [
        { id: '1', color: '#0575e6', position: 0, opacity: 100 },
        { id: '2', color: '#021b79', position: 100, opacity: 100 }
      ]
    }
  },
  {
    name: 'Радуга',
    category: 'nature',
    settings: {
      type: 'linear',
      linearDirection: 'to right',
      colorStops: [
        { id: '1', color: '#ff0000', position: 0, opacity: 100 },
        { id: '2', color: '#ff8800', position: 17, opacity: 100 },
        { id: '3', color: '#ffff00', position: 33, opacity: 100 },
        { id: '4', color: '#00ff00', position: 50, opacity: 100 },
        { id: '5', color: '#00ffff', position: 67, opacity: 100 },
        { id: '6', color: '#0000ff', position: 83, opacity: 100 },
        { id: '7', color: '#ff00ff', position: 100, opacity: 100 }
      ]
    }
  },
  {
    name: 'Пламя',
    category: 'effects',
    settings: {
      type: 'radial',
      radialShape: 'ellipse',
      radialSize: 'farthest-corner',
      colorStops: [
        { id: '1', color: '#ffeb3b', position: 0, opacity: 100 },
        { id: '2', color: '#ff9800', position: 40, opacity: 100 },
        { id: '3', color: '#f44336', position: 100, opacity: 100 }
      ]
    }
  },
  {
    name: 'Северное сияние',
    category: 'effects',
    settings: {
      type: 'linear',
      linearDirection: 'to top right',
      colorStops: [
        { id: '1', color: '#667eea', position: 0, opacity: 100 },
        { id: '2', color: '#764ba2', position: 50, opacity: 100 },
        { id: '3', color: '#f093fb', position: 100, opacity: 100 }
      ]
    }
  },
  {
    name: 'Металлик',
    category: 'material',
    settings: {
      type: 'linear',
      linearDirection: 'to bottom',
      colorStops: [
        { id: '1', color: '#c0c0c0', position: 0, opacity: 100 },
        { id: '2', color: '#ffffff', position: 50, opacity: 100 },
        { id: '3', color: '#c0c0c0', position: 100, opacity: 100 }
      ]
    }
  },
  {
    name: 'Стекло',
    category: 'material',
    settings: {
      type: 'linear',
      linearDirection: 'to bottom',
      colorStops: [
        { id: '1', color: '#ffffff', position: 0, opacity: 20 },
        { id: '2', color: '#ffffff', position: 50, opacity: 10 },
        { id: '3', color: '#000000', position: 100, opacity: 5 }
      ]
    }
  },
  {
    name: 'Коническая радуга',
    category: 'conic',
    settings: {
      type: 'conic',
      conicAngle: 0,
      colorStops: [
        { id: '1', color: '#ff0000', position: 0, opacity: 100 },
        { id: '2', color: '#ffff00', position: 17, opacity: 100 },
        { id: '3', color: '#00ff00', position: 33, opacity: 100 },
        { id: '4', color: '#00ffff', position: 50, opacity: 100 },
        { id: '5', color: '#0000ff', position: 67, opacity: 100 },
        { id: '6', color: '#ff00ff', position: 83, opacity: 100 },
        { id: '7', color: '#ff0000', position: 100, opacity: 100 }
      ]
    }
  },
  {
    name: 'Спиннер',
    category: 'conic',
    settings: {
      type: 'conic',
      conicAngle: 0,
      colorStops: [
        { id: '1', color: '#3b82f6', position: 0, opacity: 100 },
        { id: '2', color: '#3b82f6', position: 25, opacity: 100 },
        { id: '3', color: '#ffffff', position: 25, opacity: 100 },
        { id: '4', color: '#ffffff', position: 100, opacity: 100 }
      ]
    }
  }
]

const CATEGORY_LABELS = {
  nature: 'Природа',
  effects: 'Эффекты',
  material: 'Материалы',
  conic: 'Конические'
}

export default function CSSGradientGeneratorPage() {
  const [settings, setSettings] = useState<GradientSettings>({
    type: 'linear',
    linearDirection: 'to bottom',
    linearAngle: 180,
    radialShape: 'ellipse',
    radialSize: 'farthest-corner',
    radialPositionX: 50,
    radialPositionY: 50,
    conicAngle: 0,
    conicPositionX: 50,
    conicPositionY: 50,
    repeating: false,
    colorStops: [
      { id: '1', color: '#3b82f6', position: 0, opacity: 100 },
      { id: '2', color: '#8b5cf6', position: 100, opacity: 100 }
    ]
  })

  const [selectedStopId, setSelectedStopId] = useState<string>('1')

  const selectedStop = settings.colorStops.find(s => s.id === selectedStopId)

  const generateGradientCSS = (): string => {
    const { type, colorStops, repeating } = settings
    const prefix = repeating ? 'repeating-' : ''

    const stops = colorStops
      .sort((a, b) => a.position - b.position)
      .map(stop => {
        const rgba = hexToRgba(stop.color, stop.opacity / 100)
        return `${rgba} ${stop.position}%`
      })
      .join(', ')

    switch (type) {
      case 'linear': {
        const direction = settings.linearDirection === 'custom' 
          ? `${settings.linearAngle}deg`
          : settings.linearDirection
        return `${prefix}linear-gradient(${direction}, ${stops})`
      }

      case 'radial': {
        const { radialShape, radialSize, radialPositionX, radialPositionY } = settings
        const position = `at ${radialPositionX}% ${radialPositionY}%`
        return `${prefix}radial-gradient(${radialShape} ${radialSize} ${position}, ${stops})`
      }

      case 'conic': {
        const { conicAngle, conicPositionX, conicPositionY } = settings
        const from = `from ${conicAngle}deg`
        const position = `at ${conicPositionX}% ${conicPositionY}%`
        return `${prefix}conic-gradient(${from} ${position}, ${stops})`
      }
    }
  }

  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const updateSettings = (updates: Partial<GradientSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  const updateColorStop = (id: string, updates: Partial<ColorStop>) => {
    setSettings(prev => ({
      ...prev,
      colorStops: prev.colorStops.map(stop =>
        stop.id === id ? { ...stop, ...updates } : stop
      )
    }))
  }

  const addColorStop = () => {
    const newStop: ColorStop = {
      id: Date.now().toString(),
      color: '#000000',
      position: 50,
      opacity: 100
    }
    setSettings(prev => ({
      ...prev,
      colorStops: [...prev.colorStops, newStop]
    }))
    setSelectedStopId(newStop.id)
    toast.success('Цветовая остановка добавлена')
  }

  const deleteColorStop = (id: string) => {
    if (settings.colorStops.length <= 2) {
      toast.error('Минимум 2 цвета необходимо для градиента')
      return
    }
    
    setSettings(prev => ({
      ...prev,
      colorStops: prev.colorStops.filter(s => s.id !== id)
    }))
    
    if (selectedStopId === id) {
      setSelectedStopId(settings.colorStops.find(s => s.id !== id)?.id || '')
    }
    toast.success('Цветовая остановка удалена')
  }

  const copyGradientCSS = () => {
    const css = `background: ${generateGradientCSS()};`
    navigator.clipboard.writeText(css)
    toast.success('CSS код скопирован!')
  }

  const copyFullCSS = () => {
    const gradient = generateGradientCSS()
    const css = `.element {
  background: ${gradient};
  
  /* Fallback для старых браузеров */
  background: ${settings.colorStops[0].color};
  background: -webkit-${gradient};
  background: -moz-${gradient};
  background: -o-${gradient};
}`
    navigator.clipboard.writeText(css)
    toast.success('Полный CSS код скопирован!')
  }

  const loadPreset = (preset: PresetGradient) => {
    setSettings(prev => ({
      ...prev,
      ...preset.settings,
      colorStops: preset.settings.colorStops || prev.colorStops
    }))
    setSelectedStopId(preset.settings.colorStops?.[0]?.id || '1')
    toast.success(`Загружен пресет: ${preset.name}`)
  }

  const reset = () => {
    setSettings({
      type: 'linear',
      linearDirection: 'to bottom',
      linearAngle: 180,
      radialShape: 'ellipse',
      radialSize: 'farthest-corner',
      radialPositionX: 50,
      radialPositionY: 50,
      conicAngle: 0,
      conicPositionX: 50,
      conicPositionY: 50,
      repeating: false,
      colorStops: [
        { id: '1', color: '#3b82f6', position: 0, opacity: 100 },
        { id: '2', color: '#8b5cf6', position: 100, opacity: 100 }
      ]
    })
    setSelectedStopId('1')
    toast.success('Настройки сброшены')
  }

  const randomGradient = () => {
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    const numStops = Math.floor(Math.random() * 3) + 2
    
    const colorStops: ColorStop[] = []
    for (let i = 0; i < numStops; i++) {
      colorStops.push({
        id: Date.now().toString() + i,
        color: randomColor(),
        position: Math.round((100 / (numStops - 1)) * i),
        opacity: 100
      })
    }

    setSettings(prev => ({
      ...prev,
      colorStops
    }))
    setSelectedStopId(colorStops[0].id)
    toast.success('Случайный градиент создан!')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          {/* Gradient Type */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Тип градиента</h3>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(['linear', 'radial', 'conic'] as GradientType[]).map(type => (
                <Button
                  key={type}
                  onClick={() => updateSettings({ type })}
                  variant={settings.type === type ? 'default' : 'outline'}
                  className="capitalize"
                >
                  {type === 'linear' ? 'Линейный' : type === 'radial' ? 'Радиальный' : 'Конический'}
                </Button>
              ))}
            </div>

            {/* Type-specific settings */}
            {settings.type === 'linear' && (
              <div className="space-y-4">
                <div>
                  <Label>Направление</Label>
                  <Select 
                    value={settings.linearDirection} 
                    onValueChange={(value: LinearDirection) => updateSettings({ linearDirection: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to top">Вверх</SelectItem>
                      <SelectItem value="to bottom">Вниз</SelectItem>
                      <SelectItem value="to left">Влево</SelectItem>
                      <SelectItem value="to right">Вправо</SelectItem>
                      <SelectItem value="to top left">Вверх влево</SelectItem>
                      <SelectItem value="to top right">Вверх вправо</SelectItem>
                      <SelectItem value="to bottom left">Вниз влево</SelectItem>
                      <SelectItem value="to bottom right">Вниз вправо</SelectItem>
                      <SelectItem value="custom">Произвольный угол</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {settings.linearDirection === 'custom' && (
                  <div>
                    <Label>Угол (градусы)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        value={[settings.linearAngle]}
                        onValueChange={(value) => updateSettings({ linearAngle: value[0] })}
                        min={0}
                        max={360}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm w-12 text-right">{settings.linearAngle}°</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {settings.type === 'radial' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Форма</Label>
                    <Select 
                      value={settings.radialShape} 
                      onValueChange={(value: RadialShape) => updateSettings({ radialShape: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="circle">Круг</SelectItem>
                        <SelectItem value="ellipse">Эллипс</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Размер</Label>
                    <Select 
                      value={settings.radialSize} 
                      onValueChange={(value: RadialSize) => updateSettings({ radialSize: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="closest-side">Ближайшая сторона</SelectItem>
                        <SelectItem value="farthest-side">Дальняя сторона</SelectItem>
                        <SelectItem value="closest-corner">Ближайший угол</SelectItem>
                        <SelectItem value="farthest-corner">Дальний угол</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Позиция X (%)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        value={[settings.radialPositionX]}
                        onValueChange={(value) => updateSettings({ radialPositionX: value[0] })}
                        min={0}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm w-10 text-right">{settings.radialPositionX}%</span>
                    </div>
                  </div>

                  <div>
                    <Label>Позиция Y (%)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        value={[settings.radialPositionY]}
                        onValueChange={(value) => updateSettings({ radialPositionY: value[0] })}
                        min={0}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm w-10 text-right">{settings.radialPositionY}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {settings.type === 'conic' && (
              <div className="space-y-4">
                <div>
                  <Label>Начальный угол</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider
                      value={[settings.conicAngle]}
                      onValueChange={(value) => updateSettings({ conicAngle: value[0] })}
                      min={0}
                      max={360}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm w-12 text-right">{settings.conicAngle}°</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Позиция X (%)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        value={[settings.conicPositionX]}
                        onValueChange={(value) => updateSettings({ conicPositionX: value[0] })}
                        min={0}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm w-10 text-right">{settings.conicPositionX}%</span>
                    </div>
                  </div>

                  <div>
                    <Label>Позиция Y (%)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        value={[settings.conicPositionY]}
                        onValueChange={(value) => updateSettings({ conicPositionY: value[0] })}
                        min={0}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm w-10 text-right">{settings.conicPositionY}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
              <input
                id="repeating"
                type="checkbox"
                checked={settings.repeating}
                onChange={(e) => updateSettings({ repeating: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="repeating">Повторяющийся градиент</Label>
            </div>
          </Card>

          {/* Color Stops */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Цветовые остановки</h3>
              <Button onClick={addColorStop} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Добавить
              </Button>
            </div>

            <div className="space-y-2 mb-4">
              {settings.colorStops
                .sort((a, b) => a.position - b.position)
                .map((stop) => (
                  <div
                    key={stop.id}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors",
                      selectedStopId === stop.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                    )}
                    onClick={() => setSelectedStopId(stop.id)}
                  >
                    <div
                      className="w-8 h-8 rounded border flex-shrink-0"
                      style={{ backgroundColor: hexToRgba(stop.color, stop.opacity / 100) }}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{stop.position}%</div>
                      <div className="text-xs text-muted-foreground">{stop.color}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteColorStop(stop.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              }
            </div>

            {selectedStop && (
              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Цвет</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="color"
                        value={selectedStop.color}
                        onChange={(e) => updateColorStop(selectedStop.id, { color: e.target.value })}
                        className="w-20 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={selectedStop.color}
                        onChange={(e) => updateColorStop(selectedStop.id, { color: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Позиция (%)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        value={[selectedStop.position]}
                        onValueChange={(value) => updateColorStop(selectedStop.id, { position: value[0] })}
                        min={0}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm w-10 text-right">{selectedStop.position}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Прозрачность</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider
                      value={[selectedStop.opacity]}
                      onValueChange={(value) => updateColorStop(selectedStop.id, { opacity: value[0] })}
                      min={0}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm w-10 text-right">{selectedStop.opacity}%</span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          {/* Preview Box */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Предпросмотр</h3>
              <div className="flex gap-2">
                <Button onClick={randomGradient} variant="outline" size="sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Случайный
                </Button>
                <Button onClick={reset} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Сбросить
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div
                className="h-64 rounded-lg border"
                style={{ background: generateGradientCSS() }}
              />

              <div className="grid grid-cols-3 gap-2">
                <div
                  className="h-20 rounded border"
                  style={{ background: generateGradientCSS() }}
                />
                <div
                  className="h-20 rounded-full border"
                  style={{ background: generateGradientCSS() }}
                />
                <div
                  className="h-20 rounded-lg border flex items-center justify-center text-white font-semibold"
                  style={{ background: generateGradientCSS() }}
                >
                  Текст
                </div>
              </div>
            </div>
          </Card>

          {/* CSS Code */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">CSS код</h3>
              <div className="flex gap-2">
                <Button onClick={copyGradientCSS} size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Копировать
                </Button>
                <Button onClick={copyFullCSS} size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Полный CSS
                </Button>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <code className="text-sm font-mono break-all">
                background: {generateGradientCSS()};
              </code>
            </div>
          </Card>

          {/* Presets */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Готовые пресеты
            </h3>
            
            <div className="space-y-4">
              {Object.entries(CATEGORY_LABELS).map(([category, label]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">{label}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_GRADIENTS
                      .filter(preset => preset.category === category)
                      .map((preset, index) => (
                        <Button
                          key={index}
                          onClick={() => loadPreset(preset)}
                          variant="outline"
                          size="sm"
                          className="h-auto p-2"
                        >
                          <div className="w-full">
                            <div
                              className="w-full h-12 rounded mb-2"
                              style={{
                                background: generateGradientCSS.call({
                                  settings: { ...settings, ...preset.settings }
                                })
                              }}
                            />
                            <span className="text-xs">{preset.name}</span>
                          </div>
                        </Button>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Tips */}
      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Sliders className="w-4 h-4" />
          Советы по градиентам
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-medium mb-2">Типы градиентов</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• <strong>Linear</strong> - прямолинейный переход</li>
              <li>• <strong>Radial</strong> - круговой/эллиптический</li>
              <li>• <strong>Conic</strong> - конический (круговая диаграмма)</li>
              <li>• <strong>Repeating</strong> - повторяющийся паттерн</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Оптимизация</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Используйте 2-3 цвета для чистых переходов</li>
              <li>• Добавляйте прозрачность для наложений</li>
              <li>• Повторяющиеся градиенты для паттернов</li>
              <li>• CSS переменные для динамических цветов</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Применение</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Фоны для секций и кнопок</li>
              <li>• Оверлеи для изображений</li>
              <li>• Декоративные элементы</li>
              <li>• Индикаторы прогресса</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}