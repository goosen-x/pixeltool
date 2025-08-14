'use client'

import { useState, useEffect, useCallback } from 'react'
import { WidgetLayout } from '@/components/widgets/WidgetLayout'
import { WidgetSection } from '@/components/widgets/WidgetSection'
import { WidgetInput } from '@/components/widgets/WidgetInput'
import { WidgetOutput } from '@/components/widgets/WidgetOutput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { 
  Layers,
  Copy,
  RefreshCw,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Move,
  Maximize2,
  Sparkles,
  Palette,
  Code2,
  Download
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useWidgetKeyboard } from '@/lib/hooks/widgets'

interface Shadow {
  id: string
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: string
  opacity: number
  inset: boolean
  enabled: boolean
}

interface PresetShadow {
  name: string
  category: string
  shadows: Omit<Shadow, 'id' | 'enabled'>[]
}

const PRESET_SHADOWS: PresetShadow[] = [
  {
    name: 'Простая тень',
    category: 'basic',
    shadows: [
      { offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: '#000000', opacity: 10, inset: false }
    ]
  },
  {
    name: 'Мягкая тень',
    category: 'basic',
    shadows: [
      { offsetX: 0, offsetY: 1, blur: 3, spread: 0, color: '#000000', opacity: 10, inset: false },
      { offsetX: 0, offsetY: 1, blur: 2, spread: 0, color: '#000000', opacity: 6, inset: false }
    ]
  },
  {
    name: 'Материальная тень',
    category: 'material',
    shadows: [
      { offsetX: 0, offsetY: 2, blur: 4, spread: -1, color: '#000000', opacity: 20, inset: false },
      { offsetX: 0, offsetY: 4, blur: 5, spread: 0, color: '#000000', opacity: 14, inset: false },
      { offsetX: 0, offsetY: 1, blur: 10, spread: 0, color: '#000000', opacity: 12, inset: false }
    ]
  },
  {
    name: 'Глубокая тень',
    category: 'material',
    shadows: [
      { offsetX: 0, offsetY: 10, blur: 15, spread: -3, color: '#000000', opacity: 30, inset: false },
      { offsetX: 0, offsetY: 4, blur: 6, spread: -2, color: '#000000', opacity: 15, inset: false }
    ]
  },
  {
    name: 'Неоморфизм',
    category: 'neumorphism',
    shadows: [
      { offsetX: 20, offsetY: 20, blur: 60, spread: 0, color: '#bebebe', opacity: 100, inset: false },
      { offsetX: -20, offsetY: -20, blur: 60, spread: 0, color: '#ffffff', opacity: 100, inset: false }
    ]
  },
  {
    name: 'Внутренняя тень',
    category: 'inset',
    shadows: [
      { offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: '#000000', opacity: 6, inset: true }
    ]
  },
  {
    name: 'Вдавленная кнопка',
    category: 'inset',
    shadows: [
      { offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: '#000000', opacity: 10, inset: true },
      { offsetX: 0, offsetY: 2, blur: 4, spread: -1, color: '#000000', opacity: 6, inset: true }
    ]
  },
  {
    name: 'Светящаяся тень',
    category: 'glow',
    shadows: [
      { offsetX: 0, offsetY: 0, blur: 20, spread: 3, color: '#3b82f6', opacity: 50, inset: false }
    ]
  },
  {
    name: 'Неоновое свечение',
    category: 'glow',
    shadows: [
      { offsetX: 0, offsetY: 0, blur: 10, spread: 1, color: '#f43f5e', opacity: 80, inset: false },
      { offsetX: 0, offsetY: 0, blur: 20, spread: 5, color: '#f43f5e', opacity: 60, inset: false },
      { offsetX: 0, offsetY: 0, blur: 40, spread: 10, color: '#f43f5e', opacity: 40, inset: false }
    ]
  }
]

const CATEGORY_LABELS = {
  basic: 'Базовые',
  material: 'Material Design',
  neumorphism: 'Неоморфизм',
  inset: 'Внутренние',
  glow: 'Свечение'
}

export default function CSSBoxShadowGeneratorPage() {
  const [shadows, setShadows] = useState<Shadow[]>([
    {
      id: '1',
      offsetX: 0,
      offsetY: 4,
      blur: 6,
      spread: -1,
      color: '#000000',
      opacity: 10,
      inset: false,
      enabled: true
    }
  ])
  const [selectedShadowId, setSelectedShadowId] = useState<string>('1')
  const [boxColor, setBoxColor] = useState('#ffffff')
  const [bgColor, setBgColor] = useState('#f3f4f6')
  const [borderRadius, setBorderRadius] = useState(8)
  const [boxSize, setBoxSize] = useState(200)
  const [showCode, setShowCode] = useState(true)

  const selectedShadow = shadows.find(s => s.id === selectedShadowId)

  const generateCSS = useCallback((): string => {
    const enabledShadows = shadows.filter(s => s.enabled)
    if (enabledShadows.length === 0) return 'none'

    return enabledShadows
      .map(shadow => {
        const { offsetX, offsetY, blur, spread, color, opacity, inset } = shadow
        const rgba = hexToRgba(color, opacity / 100)
        const insetStr = inset ? 'inset ' : ''
        return `${insetStr}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${rgba}`
      })
      .join(', ')
  }, [shadows])

  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const updateShadow = (id: string, updates: Partial<Shadow>) => {
    setShadows(prev => prev.map(shadow => 
      shadow.id === id ? { ...shadow, ...updates } : shadow
    ))
  }

  const addShadow = useCallback(() => {
    const newId = Date.now().toString()
    const newShadow: Shadow = {
      id: newId,
      offsetX: 0,
      offsetY: 10,
      blur: 20,
      spread: 0,
      color: '#000000',
      opacity: 20,
      inset: false,
      enabled: true
    }
    setShadows(prev => [...prev, newShadow])
    setSelectedShadowId(newId)
    toast.success('Новая тень добавлена')
  }, [])

  const deleteShadow = (id: string) => {
    if (shadows.length === 1) {
      toast.error('Должна остаться хотя бы одна тень')
      return
    }
    
    setShadows(prev => prev.filter(s => s.id !== id))
    if (selectedShadowId === id) {
      setSelectedShadowId(shadows.find(s => s.id !== id)?.id || '')
    }
    toast.success('Тень удалена')
  }

  const copyCSSCode = useCallback(() => {
    const css = `box-shadow: ${generateCSS()};`
    navigator.clipboard.writeText(css)
    toast.success('CSS код скопирован!')
  }, [generateCSS])

  const copyFullCSS = () => {
    const css = `.element {
  box-shadow: ${generateCSS()};
  border-radius: ${borderRadius}px;
  background-color: ${boxColor};
}`
    navigator.clipboard.writeText(css)
    toast.success('Полный CSS код скопирован!')
  }

  const loadPreset = useCallback((preset: PresetShadow) => {
    const newShadows: Shadow[] = preset.shadows.map((shadow, index) => ({
      ...shadow,
      id: Date.now().toString() + index,
      enabled: true
    }))
    setShadows(newShadows)
    setSelectedShadowId(newShadows[0].id)
    toast.success(`Загружен пресет: ${preset.name}`)
  }, [])

  const generateRandomShadow = useCallback(() => {
    const randomPreset = PRESET_SHADOWS[Math.floor(Math.random() * PRESET_SHADOWS.length)]
    loadPreset(randomPreset)
  }, [loadPreset])

  const reset = useCallback(() => {
    setShadows([
      {
        id: '1',
        offsetX: 0,
        offsetY: 4,
        blur: 6,
        spread: -1,
        color: '#000000',
        opacity: 10,
        inset: false,
        enabled: true
      }
    ])
    setSelectedShadowId('1')
    setBoxColor('#ffffff')
    setBgColor('#f3f4f6')
    setBorderRadius(8)
    setBoxSize(200)
    toast.success('Настройки сброшены')
  }, [])

  const downloadAsImage = () => {
    // In a real implementation, this would use canvas to create an image
    toast.info('Функция экспорта в разработке')
  }

  // Keyboard shortcuts
  useWidgetKeyboard({
    widgetId: 'css-box-shadow-generator',
    shortcuts: [
      {
        key: 'g',
        ctrl: true,
        description: 'Generate random shadow',
        action: generateRandomShadow
      },
      {
        key: 'r',
        ctrl: true,
        description: 'Reset',
        action: reset
      },
      {
        key: 'c',
        ctrl: true,
        shift: true,
        description: 'Copy CSS',
        action: copyCSSCode
      },
      {
        key: 'l',
        ctrl: true,
        description: 'Add layer',
        action: addShadow
      }
    ]
  })

  return (
    <WidgetLayout>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          {/* Shadow Layers */}
          <WidgetSection
            icon={<Layers className="w-5 w-5" />}
            title="Слои теней"
          >
            <div className="flex items-center justify-between mb-4">
              <div></div>
              <Button onClick={addShadow} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Добавить
              </Button>
            </div>

            <div className="space-y-2">
              {shadows.map((shadow, index) => (
                <div
                  key={shadow.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors",
                    selectedShadowId === shadow.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                  )}
                  onClick={() => setSelectedShadowId(shadow.id)}
                >
                  <Switch
                    checked={shadow.enabled}
                    onCheckedChange={(checked) => updateShadow(shadow.id, { enabled: checked })}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Тень {index + 1}</span>
                      {shadow.inset && <Badge variant="secondary" className="text-xs">Inset</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {shadow.offsetX}/{shadow.offsetY}/{shadow.blur}/{shadow.spread}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: hexToRgba(shadow.color, shadow.opacity / 100) }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteShadow(shadow.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </WidgetSection>

          {/* Shadow Settings */}
          {selectedShadow && (
            <WidgetSection
              icon={<Move className="w-5 h-5" />}
              title="Настройки тени"
            >
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="offset-x">Смещение X</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        id="offset-x"
                        value={[selectedShadow.offsetX]}
                        onValueChange={(value) => updateShadow(selectedShadow.id, { offsetX: value[0] })}
                        min={-50}
                        max={50}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm w-10 text-right">{selectedShadow.offsetX}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="offset-y">Смещение Y</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        id="offset-y"
                        value={[selectedShadow.offsetY]}
                        onValueChange={(value) => updateShadow(selectedShadow.id, { offsetY: value[0] })}
                        min={-50}
                        max={50}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm w-10 text-right">{selectedShadow.offsetY}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="blur">Размытие</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        id="blur"
                        value={[selectedShadow.blur]}
                        onValueChange={(value) => updateShadow(selectedShadow.id, { blur: value[0] })}
                        min={0}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm w-10 text-right">{selectedShadow.blur}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="spread">Растяжение</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        id="spread"
                        value={[selectedShadow.spread]}
                        onValueChange={(value) => updateShadow(selectedShadow.id, { spread: value[0] })}
                        min={-50}
                        max={50}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm w-10 text-right">{selectedShadow.spread}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="color">Цвет</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="color"
                        type="color"
                        value={selectedShadow.color}
                        onChange={(e) => updateShadow(selectedShadow.id, { color: e.target.value })}
                        className="w-20 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={selectedShadow.color}
                        onChange={(e) => updateShadow(selectedShadow.id, { color: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="opacity">Прозрачность</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        id="opacity"
                        value={[selectedShadow.opacity]}
                        onValueChange={(value) => updateShadow(selectedShadow.id, { opacity: value[0] })}
                        min={0}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm w-10 text-right">{selectedShadow.opacity}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="inset"
                    checked={selectedShadow.inset}
                    onCheckedChange={(checked) => updateShadow(selectedShadow.id, { inset: checked })}
                  />
                  <Label htmlFor="inset">Внутренняя тень (inset)</Label>
                </div>
              </div>
            </WidgetSection>
          )}

          {/* Box Settings */}
          <WidgetSection
            icon={<Palette className="w-5 h-5" />}
            title="Настройки элемента"
          >
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="box-color">Цвет элемента</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="box-color"
                      type="color"
                      value={boxColor}
                      onChange={(e) => setBoxColor(e.target.value)}
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={boxColor}
                      onChange={(e) => setBoxColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bg-color">Цвет фона</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="bg-color"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="border-radius">Скругление углов</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider
                      id="border-radius"
                      value={[borderRadius]}
                      onValueChange={(value) => setBorderRadius(value[0])}
                      min={0}
                      max={50}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm w-10 text-right">{borderRadius}px</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="box-size">Размер элемента</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider
                      id="box-size"
                      value={[boxSize]}
                      onValueChange={(value) => setBoxSize(value[0])}
                      min={100}
                      max={300}
                      step={10}
                      className="flex-1"
                    />
                    <span className="text-sm w-10 text-right">{boxSize}px</span>
                  </div>
                </div>
              </div>
            </div>
          </WidgetSection>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          {/* Preview Box */}
          <WidgetSection
            icon={<Eye className="w-5 h-5" />}
            title="Предпросмотр"
          >
            <div className="flex items-center justify-between mb-4">
              <div></div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowCode(!showCode)}
                  variant="outline"
                  size="sm"
                >
                  {showCode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showCode ? 'Скрыть код' : 'Показать код'}
                </Button>
                <Button onClick={reset} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Сбросить
                </Button>
              </div>
            </div>

            <div
              className="flex items-center justify-center p-12 rounded-lg transition-colors"
              style={{ backgroundColor: bgColor }}
            >
              <div
                className="transition-all"
                style={{
                  width: `${boxSize}px`,
                  height: `${boxSize}px`,
                  backgroundColor: boxColor,
                  borderRadius: `${borderRadius}px`,
                  boxShadow: generateCSS()
                }}
              />
            </div>

            {showCode && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Label>CSS код</Label>
                  <div className="flex gap-2">
                    <Button onClick={copyCSSCode} size="sm" variant="outline">
                      <Copy className="w-4 h-4 mr-2" />
                      Копировать
                    </Button>
                    <Button onClick={copyFullCSS} size="sm" variant="outline">
                      <Code2 className="w-4 h-4 mr-2" />
                      Полный CSS
                    </Button>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm font-mono">
                    box-shadow: {generateCSS()};
                  </code>
                </div>
              </div>
            )}
          </WidgetSection>

          {/* Presets */}
          <WidgetSection
            icon={<Sparkles className="w-5 h-5" />}
            title="Готовые пресеты"
          >
            
            <div className="space-y-4">
              {Object.entries(CATEGORY_LABELS).map(([category, label]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">{label}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_SHADOWS
                      .filter(preset => preset.category === category)
                      .map((preset, index) => (
                        <Button
                          key={index}
                          onClick={() => loadPreset(preset)}
                          variant="outline"
                          size="sm"
                          className="justify-start"
                        >
                          <div className="flex items-center gap-2 w-full">
                            <div
                              className="w-8 h-8 bg-white rounded"
                              style={{
                                boxShadow: preset.shadows
                                  .map(s => {
                                    const rgba = hexToRgba(s.color, s.opacity / 100)
                                    const insetStr = s.inset ? 'inset ' : ''
                                    return `${insetStr}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${rgba}`
                                  })
                                  .join(', ')
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
          </WidgetSection>
        </div>
      </div>

      {/* Tips */}
      <WidgetSection
        icon={<Code2 className="w-5 h-5" />}
        title="Советы по CSS тени"
      >
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-medium mb-2">Основы теней</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• offsetX/Y - смещение тени</li>
              <li>• blur - размытие краев</li>
              <li>• spread - увеличение/уменьшение размера</li>
              <li>• inset - внутренняя тень</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Принципы дизайна</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Используйте мягкие тени для современного вида</li>
              <li>• Комбинируйте несколько теней для глубины</li>
              <li>• Светлые тени сверху создают выпуклость</li>
              <li>• Темные тени снизу создают подъем</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Производительность</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Избегайте большого blur на мобильных</li>
              <li>• Множественные тени могут влиять на FPS</li>
              <li>• Используйте will-change для анимаций</li>
              <li>• Тестируйте на разных устройствах</li>
            </ul>
          </div>
        </div>
      </WidgetSection>
    </WidgetLayout>
  )
}