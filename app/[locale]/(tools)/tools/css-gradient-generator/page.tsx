'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Palette,
  Copy,
  RefreshCw,
  Plus,
  Trash2,
  Sparkles,
  Download,
  Sliders,
  RotateCw,
  Search
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCSSGradientGenerator } from '@/lib/hooks/widgets'
import { useTranslations } from 'next-intl'

export default function CSSGradientGeneratorPage() {
  const t = useTranslations('widgets.cssGradientGenerator')
  
  const {
    settings,
    selectedStopId,
    selectedStop,
    activeCategory,
    searchQuery,
    exportFormat,
    gradientCSS,
    categories,
    filteredGradients,
    setSelectedStopId,
    setActiveCategory,
    setSearchQuery,
    setExportFormat,
    updateGradientType,
    updateLinearDirection,
    updateLinearAngle,
    updateRadialShape,
    updateRadialSize,
    updateRadialPosition,
    updateConicAngle,
    updateConicPosition,
    toggleRepeating,
    addColorStop,
    removeColorStop,
    updateSelectedStop,
    applyPresetGradient,
    generateRandom,
    copyCSS,
    exportGradient,
    resetGradient
  } = useCSSGradientGenerator({
    translations: {
      copied: 'CSS copied to clipboard!',
      copyError: 'Failed to copy CSS',
      gradientApplied: 'Gradient applied!',
      colorStopAdded: 'Color stop added',
      colorStopRemoved: 'Color stop removed',
      gradientRandomized: 'Random gradient generated'
    }
  })

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Actions */}
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <h1 className="text-2xl font-bold">CSS Gradient Generator</h1>
        <div className="flex gap-2">
          <Button onClick={generateRandom} variant="outline" size="sm" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Random
          </Button>
          <Button onClick={resetGradient} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Preview */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Preview</Label>
            <div className="flex gap-2">
              <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as 'css' | 'scss' | 'tailwind')}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="scss">SCSS</SelectItem>
                  <SelectItem value="tailwind">Tailwind</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={copyCSS} className="gap-2">
                <Copy className="w-4 h-4" />
                Copy CSS
              </Button>
            </div>
          </div>

          {/* Gradient Preview */}
          <div 
            className="w-full h-48 rounded-lg border shadow-inner relative overflow-hidden"
            style={{ background: gradientCSS }}
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2220%22%20height=%2220%22%20viewBox=%220%200%2020%2020%22%3E%3Cg%20fill=%22%239C92AC%22%20fill-opacity=%220.1%22%3E%3Cpolygon%20points=%220,0%2010,10%200,20%22/%3E%3Cpolygon%20points=%2210,0%2020,0%2020,10%22/%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          </div>

          {/* CSS Output */}
          <div className="relative">
            <code className="block p-3 bg-muted rounded-lg text-sm font-mono overflow-x-auto">
              background: {gradientCSS};
            </code>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gradient Type */}
          <Card className="p-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">Gradient Type</Label>
              
              <div className="grid grid-cols-3 gap-2">
                {(['linear', 'radial', 'conic'] as const).map((type) => (
                  <Button
                    key={type}
                    onClick={() => updateGradientType(type)}
                    variant={settings.type === type ? 'default' : 'outline'}
                    size="sm"
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="repeating"
                  checked={settings.repeating}
                  onChange={toggleRepeating}
                  className="rounded"
                />
                <Label htmlFor="repeating">Repeating</Label>
              </div>
            </div>
          </Card>

          {/* Type-specific Settings */}
          {settings.type === 'linear' && (
            <Card className="p-6">
              <div className="space-y-4">
                <Label className="text-base font-semibold">Linear Settings</Label>
                
                <div>
                  <Label>Direction</Label>
                  <Select 
                    value={settings.linearDirection} 
                    onValueChange={updateLinearDirection}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to top">To Top</SelectItem>
                      <SelectItem value="to bottom">To Bottom</SelectItem>
                      <SelectItem value="to left">To Left</SelectItem>
                      <SelectItem value="to right">To Right</SelectItem>
                      <SelectItem value="to top left">To Top Left</SelectItem>
                      <SelectItem value="to top right">To Top Right</SelectItem>
                      <SelectItem value="to bottom left">To Bottom Left</SelectItem>
                      <SelectItem value="to bottom right">To Bottom Right</SelectItem>
                      <SelectItem value="custom">Custom Angle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {settings.linearDirection === 'custom' && (
                  <div>
                    <Label>Angle (degrees)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        value={[settings.linearAngle]}
                        onValueChange={(value) => updateLinearAngle(value[0])}
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
            </Card>
          )}

          {settings.type === 'radial' && (
            <Card className="p-6">
              <div className="space-y-4">
                <Label className="text-base font-semibold">Radial Settings</Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Shape</Label>
                    <Select value={settings.radialShape} onValueChange={updateRadialShape}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="circle">Circle</SelectItem>
                        <SelectItem value="ellipse">Ellipse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Size</Label>
                    <Select value={settings.radialSize} onValueChange={updateRadialSize}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="closest-side">Closest Side</SelectItem>
                        <SelectItem value="farthest-side">Farthest Side</SelectItem>
                        <SelectItem value="closest-corner">Closest Corner</SelectItem>
                        <SelectItem value="farthest-corner">Farthest Corner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Position</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <Label className="text-xs">X: {settings.radialPositionX}%</Label>
                      <Slider
                        value={[settings.radialPositionX]}
                        onValueChange={(value) => updateRadialPosition(value[0], settings.radialPositionY)}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Y: {settings.radialPositionY}%</Label>
                      <Slider
                        value={[settings.radialPositionY]}
                        onValueChange={(value) => updateRadialPosition(settings.radialPositionX, value[0])}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {settings.type === 'conic' && (
            <Card className="p-6">
              <div className="space-y-4">
                <Label className="text-base font-semibold">Conic Settings</Label>
                
                <div>
                  <Label>Start Angle: {settings.conicAngle}°</Label>
                  <Slider
                    value={[settings.conicAngle]}
                    onValueChange={(value) => updateConicAngle(value[0])}
                    min={0}
                    max={360}
                    step={1}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Position</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <Label className="text-xs">X: {settings.conicPositionX}%</Label>
                      <Slider
                        value={[settings.conicPositionX]}
                        onValueChange={(value) => updateConicPosition(value[0], settings.conicPositionY)}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Y: {settings.conicPositionY}%</Label>
                      <Slider
                        value={[settings.conicPositionY]}
                        onValueChange={(value) => updateConicPosition(settings.conicPositionX, value[0])}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Color Stops */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Color Stops</Label>
                <Button onClick={addColorStop} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Stop
                </Button>
              </div>

              <div className="space-y-3">
                {settings.colorStops
                  .sort((a, b) => a.position - b.position)
                  .map((stop) => (
                    <div
                      key={stop.id}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-colors",
                        selectedStopId === stop.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setSelectedStopId(stop.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: stop.color }}
                        />
                        <div className="flex-1 space-y-2">
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <Label className="text-xs">Color</Label>
                              <Input
                                type="color"
                                value={stop.color}
                                onChange={(e) => updateSelectedStop({ color: e.target.value })}
                                className="h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Position: {stop.position}%</Label>
                              <Slider
                                value={[stop.position]}
                                onValueChange={(value) => updateSelectedStop({ position: value[0] })}
                                min={0}
                                max={100}
                                step={1}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Opacity: {stop.opacity}%</Label>
                              <Slider
                                value={[stop.opacity]}
                                onValueChange={(value) => updateSelectedStop({ opacity: value[0] })}
                                min={0}
                                max={100}
                                step={1}
                              />
                            </div>
                          </div>
                        </div>
                        {settings.colorStops.length > 2 && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeColorStop(stop.id)
                            }}
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Presets */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">Presets</Label>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search gradients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-1">
                <Button
                  onClick={() => setActiveCategory('all')}
                  variant={activeCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    variant={activeCategory === category ? 'default' : 'outline'}
                    size="sm"
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Gradient List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredGradients.map((gradient) => (
                  <button
                    key={gradient.name}
                    onClick={() => applyPresetGradient(gradient)}
                    className="w-full p-3 text-left rounded-lg border hover:border-primary/50 transition-colors group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{gradient.name}</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {gradient.category}
                        </Badge>
                      </div>
                      <div
                        className="w-full h-6 rounded"
                        style={{
                          background: gradient.settings.colorStops
                            ? `linear-gradient(to right, ${gradient.settings.colorStops
                                .sort((a, b) => (a.position || 0) - (b.position || 0))
                                .map(stop => `${stop.color} ${stop.position || 0}%`)
                                .join(', ')})`
                            : 'linear-gradient(to right, #3b82f6, #8b5cf6)'
                        }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Export Options */}
          <Card className="p-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">Export</Label>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => exportGradient('css')}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  CSS
                </Button>
                <Button
                  onClick={() => exportGradient('scss')}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  SCSS
                </Button>
                <Button
                  onClick={() => exportGradient('tailwind')}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Tailwind
                </Button>
                <Button
                  onClick={() => exportGradient('json')}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  JSON
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Info Section */}
      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-3">About CSS Gradients</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-medium mb-2">Gradient Types</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• <strong>Linear</strong> - straight line transition</li>
              <li>• <strong>Radial</strong> - circular/elliptical</li>
              <li>• <strong>Conic</strong> - conic (pie chart style)</li>
              <li>• <strong>Repeating</strong> - repeating pattern</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Optimization</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Use 2-3 colors for clean transitions</li>
              <li>• Add transparency for overlays</li>
              <li>• Repeating gradients for patterns</li>
              <li>• CSS variables for dynamic colors</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Applications</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Backgrounds for sections and buttons</li>
              <li>• Image overlays</li>
              <li>• Decorative elements</li>
              <li>• Progress indicators</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}