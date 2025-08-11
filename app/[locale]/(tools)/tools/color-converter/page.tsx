'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Copy, Info } from 'lucide-react'
import { toast } from 'sonner'
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsb,
  rgbToCmyk,
  cmykToRgb,
  rgbToLab,
  labToRgb,
  rgbaToRgb,
  getWebsafeColor,
  formatRgb,
  formatRgba,
  formatRgbPercent,
  formatRgbaPercent,
  formatHsl,
  formatHsla,
  formatCmyk,
  formatHsb,
  formatXyz,
  formatLab,
  rgbToXyz,
  type RGB,
  type RGBA,
  type HSL,
  type CMYK,
  type LAB
} from '@/lib/utils/color-converter'

export default function ColorConverterPage() {
  const t = useTranslations('widgets.colorConverter')
  const locale = useLocale() as 'en' | 'ru'
  
  // State
  const [hexValue, setHexValue] = useState('#FF9999')
  const [rgbValue, setRgbValue] = useState<RGB>({ r: 255, g: 153, b: 153 })
  const [hslValue, setHslValue] = useState<HSL>({ h: 0, s: 100, l: 80 })
  const [cmykValue, setCmykValue] = useState<CMYK>({ c: 0, m: 40, y: 40, k: 0 })
  const [labValue, setLabValue] = useState<LAB>({ l: 73, a: 35, b: 14 })
  const [alpha, setAlpha] = useState(1)
  const [backgroundColor, setBackgroundColor] = useState<RGB>({ r: 255, g: 255, b: 255 })
  const [precision, setPrecision] = useState(2)

  // Update all color values when one changes
  const updateFromHex = (hex: string) => {
    const rgb = hexToRgb(hex)
    if (rgb) {
      setRgbValue(rgb)
      setHslValue(rgbToHsl(rgb))
      setCmykValue(rgbToCmyk(rgb))
      setLabValue(rgbToLab(rgb))
    }
  }

  const updateFromRgb = (rgb: RGB) => {
    setHexValue(rgbToHex(rgb))
    setHslValue(rgbToHsl(rgb))
    setCmykValue(rgbToCmyk(rgb))
    setLabValue(rgbToLab(rgb))
  }

  const updateFromHsl = (hsl: HSL) => {
    const rgb = hslToRgb(hsl)
    setRgbValue(rgb)
    setHexValue(rgbToHex(rgb))
    setCmykValue(rgbToCmyk(rgb))
    setLabValue(rgbToLab(rgb))
  }

  const updateFromCmyk = (cmyk: CMYK) => {
    const rgb = cmykToRgb(cmyk)
    setRgbValue(rgb)
    setHexValue(rgbToHex(rgb))
    setHslValue(rgbToHsl(rgb))
    setLabValue(rgbToLab(rgb))
  }

  const updateFromLab = (lab: LAB) => {
    const rgb = labToRgb(lab)
    setRgbValue(rgb)
    setHexValue(rgbToHex(rgb))
    setHslValue(rgbToHsl(rgb))
    setCmykValue(rgbToCmyk(rgb))
  }

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} ${t('toast.copied')}`)
  }

  // Get all conversions
  const rgba: RGBA = { ...rgbValue, a: alpha }
  const hsb = rgbToHsb(rgbValue)
  const xyz = rgbToXyz(rgbValue)
  const websafe = getWebsafeColor(hexValue)
  const rgbWithBg = rgbaToRgb(rgba, backgroundColor)

  return (
      <Card>
        <CardHeader className="sr-only">
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* All Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* HEX Input */}
            <div className="space-y-2">
              <Label>HEX</Label>
              <div className="flex items-center gap-2">
                <span className="text-xl font-mono text-muted-foreground">#</span>
                <Input
                  value={hexValue.replace('#', '')}
                  onChange={(e) => {
                    const hex = '#' + e.target.value
                    setHexValue(hex)
                    updateFromHex(hex)
                  }}
                  placeholder="000000"
                  maxLength={6}
                  className="font-mono"
                />
                <button
                  onClick={() => copyToClipboard(hexValue.toUpperCase(), 'HEX')}
                  className="p-2 hover:bg-accent hover:text-white rounded-md transition-colors"
                  title="Copy HEX"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* RGB Inputs */}
            <div className="space-y-2">
              <Label>RGB</Label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 flex-1">
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={rgbValue.r}
                    onChange={(e) => {
                      const newRgb = { ...rgbValue, r: parseInt(e.target.value) || 0 }
                      setRgbValue(newRgb)
                      updateFromRgb(newRgb)
                    }}
                    className="w-16"
                    title="Red"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={rgbValue.g}
                    onChange={(e) => {
                      const newRgb = { ...rgbValue, g: parseInt(e.target.value) || 0 }
                      setRgbValue(newRgb)
                      updateFromRgb(newRgb)
                    }}
                    className="w-16"
                    title="Green"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={rgbValue.b}
                    onChange={(e) => {
                      const newRgb = { ...rgbValue, b: parseInt(e.target.value) || 0 }
                      setRgbValue(newRgb)
                      updateFromRgb(newRgb)
                    }}
                    className="w-16"
                    title="Blue"
                  />
                </div>
                <button
                  onClick={() => copyToClipboard(formatRgb(rgbValue), 'RGB')}
                  className="p-2 hover:bg-accent hover:text-white rounded-md transition-colors"
                  title="Copy RGB"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* HSL Inputs */}
            <div className="space-y-2">
              <Label>HSL</Label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 flex-1">
                  <Input
                    type="number"
                    min="0"
                    max="360"
                    value={hslValue.h}
                    onChange={(e) => {
                      const newHsl = { ...hslValue, h: parseInt(e.target.value) || 0 }
                      setHslValue(newHsl)
                      updateFromHsl(newHsl)
                    }}
                    className="w-16"
                    title="Hue"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={hslValue.s}
                    onChange={(e) => {
                      const newHsl = { ...hslValue, s: parseInt(e.target.value) || 0 }
                      setHslValue(newHsl)
                      updateFromHsl(newHsl)
                    }}
                    className="w-16"
                    title="Saturation %"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={hslValue.l}
                    onChange={(e) => {
                      const newHsl = { ...hslValue, l: parseInt(e.target.value) || 0 }
                      setHslValue(newHsl)
                      updateFromHsl(newHsl)
                    }}
                    className="w-16"
                    title="Lightness %"
                  />
                </div>
                <button
                  onClick={() => copyToClipboard(formatHsl(hslValue), 'HSL')}
                  className="p-2 hover:bg-accent hover:text-white rounded-md transition-colors"
                  title="Copy HSL"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CMYK Inputs */}
            <div className="space-y-2">
              <Label>CMYK</Label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 flex-1">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={cmykValue.c}
                    onChange={(e) => {
                      const newCmyk = { ...cmykValue, c: parseInt(e.target.value) || 0 }
                      setCmykValue(newCmyk)
                      updateFromCmyk(newCmyk)
                    }}
                    className="w-14"
                    title="Cyan %"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={cmykValue.m}
                    onChange={(e) => {
                      const newCmyk = { ...cmykValue, m: parseInt(e.target.value) || 0 }
                      setCmykValue(newCmyk)
                      updateFromCmyk(newCmyk)
                    }}
                    className="w-14"
                    title="Magenta %"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={cmykValue.y}
                    onChange={(e) => {
                      const newCmyk = { ...cmykValue, y: parseInt(e.target.value) || 0 }
                      setCmykValue(newCmyk)
                      updateFromCmyk(newCmyk)
                    }}
                    className="w-14"
                    title="Yellow %"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={cmykValue.k}
                    onChange={(e) => {
                      const newCmyk = { ...cmykValue, k: parseInt(e.target.value) || 0 }
                      setCmykValue(newCmyk)
                      updateFromCmyk(newCmyk)
                    }}
                    className="w-14"
                    title="Key/Black %"
                  />
                </div>
                <button
                  onClick={() => copyToClipboard(formatCmyk(cmykValue), 'CMYK')}
                  className="p-2 hover:bg-accent hover:text-white rounded-md transition-colors"
                  title="Copy CMYK"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* LAB Inputs */}
            <div className="space-y-2">
              <Label>LAB</Label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 flex-1">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={labValue.l}
                    onChange={(e) => {
                      const newLab = { ...labValue, l: parseInt(e.target.value) || 0 }
                      setLabValue(newLab)
                      updateFromLab(newLab)
                    }}
                    className="w-16"
                    title="Lightness"
                  />
                  <Input
                    type="number"
                    min="-128"
                    max="127"
                    value={labValue.a}
                    onChange={(e) => {
                      const newLab = { ...labValue, a: parseInt(e.target.value) || 0 }
                      setLabValue(newLab)
                      updateFromLab(newLab)
                    }}
                    className="w-16"
                    title="A (green-red)"
                  />
                  <Input
                    type="number"
                    min="-128"
                    max="127"
                    value={labValue.b}
                    onChange={(e) => {
                      const newLab = { ...labValue, b: parseInt(e.target.value) || 0 }
                      setLabValue(newLab)
                      updateFromLab(newLab)
                    }}
                    className="w-16"
                    title="B (blue-yellow)"
                  />
                </div>
                <button
                  onClick={() => copyToClipboard(formatLab(labValue, precision), 'LAB')}
                  className="p-2 hover:bg-accent hover:text-white rounded-md transition-colors"
                  title="Copy LAB"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Alpha Channel */}
            <div className="space-y-2">
              <Label>{t('alphaChannel')} ({alpha.toFixed(2)})</Label>
              <Slider
                value={[alpha]}
                onValueChange={([v]) => setAlpha(v)}
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>
          </div>

          {/* Color Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('preview')}</Label>
              <div
                className="h-32 rounded-lg border-2 border-border transition-colors"
                style={{ backgroundColor: hexValue }}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('previewWithAlpha')}</Label>
              <div className="h-32 rounded-lg border-2 border-border bg-checkered relative overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: `rgba(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b}, ${alpha})` }}
                />
              </div>
            </div>
          </div>

          {/* All Color Values */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('allConversions')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* HEX Values */}
              <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm text-muted-foreground">HEX</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between group">
                    <code className="font-mono text-sm">{hexValue.toUpperCase()}</code>
                    <button
                      onClick={() => copyToClipboard(hexValue.toUpperCase(), 'HEX')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent hover:text-white rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between group">
                    <code className="font-mono text-sm">Websafe: {websafe.toUpperCase()}</code>
                    <button
                      onClick={() => copyToClipboard(websafe.toUpperCase(), 'Websafe')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent hover:text-white rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* RGB Values */}
              <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm text-muted-foreground">RGB</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between group">
                    <code className="font-mono text-sm">{formatRgb(rgbValue)}</code>
                    <button
                      onClick={() => copyToClipboard(formatRgb(rgbValue), 'RGB')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent hover:text-white rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between group">
                    <code className="font-mono text-sm">{formatRgba(rgba, precision)}</code>
                    <button
                      onClick={() => copyToClipboard(formatRgba(rgba, precision), 'RGBA')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent hover:text-white rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between group">
                    <code className="font-mono text-sm">{formatRgbPercent(rgbValue, precision)}</code>
                    <button
                      onClick={() => copyToClipboard(formatRgbPercent(rgbValue, precision), 'RGB %')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent hover:text-white rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* HSL Values */}
              <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm text-muted-foreground">HSL</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between group">
                    <code className="font-mono text-sm">{formatHsl(hslValue)}</code>
                    <button
                      onClick={() => copyToClipboard(formatHsl(hslValue), 'HSL')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent hover:text-white rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between group">
                    <code className="font-mono text-sm">{formatHsla({ ...hslValue, a: alpha }, precision)}</code>
                    <button
                      onClick={() => copyToClipboard(formatHsla({ ...hslValue, a: alpha }, precision), 'HSLA')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent hover:text-white rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between group">
                    <code className="font-mono text-sm">HSB/HSV: {formatHsb(hsb)}</code>
                    <button
                      onClick={() => copyToClipboard(formatHsb(hsb), 'HSB')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent hover:text-white rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* CMYK Values */}
              <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm text-muted-foreground">CMYK</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between group">
                    <code className="font-mono text-sm">{formatCmyk(cmykValue)}</code>
                    <button
                      onClick={() => copyToClipboard(formatCmyk(cmykValue), 'CMYK')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent hover:text-white rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* LAB Values */}
              <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm text-muted-foreground">LAB</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between group">
                    <code className="font-mono text-sm">{formatLab(labValue, precision)}</code>
                    <button
                      onClick={() => copyToClipboard(formatLab(labValue, precision), 'LAB')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent hover:text-white rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* XYZ Values */}
              <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm text-muted-foreground">XYZ</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between group">
                    <code className="font-mono text-sm">{formatXyz(xyz, precision)}</code>
                    <button
                      onClick={() => copyToClipboard(formatXyz(xyz, precision), 'XYZ')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent hover:text-white rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            {/* Precision */}
            <div className="space-y-2">
              <Label>{t('precision')}</Label>
              <Input
                type="number"
                min="0"
                max="6"
                value={precision}
                onChange={(e) => setPrecision(parseInt(e.target.value) || 0)}
                className="w-full"
              />
            </div>

            {/* Background Color for RGBA to RGB */}
            <div className="space-y-2">
              <Label>{t('backgroundColor')}</Label>
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded border cursor-pointer flex-shrink-0"
                  style={{ backgroundColor: rgbToHex(backgroundColor) }}
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'color'
                    input.value = rgbToHex(backgroundColor)
                    input.onchange = (e) => {
                      const rgb = hexToRgb((e.target as HTMLInputElement).value)
                      if (rgb) setBackgroundColor(rgb)
                    }
                    input.click()
                  }}
                />
                <Input
                  value={rgbToHex(backgroundColor)}
                  onChange={(e) => {
                    const rgb = hexToRgb(e.target.value)
                    if (rgb) setBackgroundColor(rgb)
                  }}
                  className="font-mono"
                />
              </div>
            </div>

            {/* RGBA with Background */}
            <div className="space-y-2">
              <Label>RGBA → RGB (with background)</Label>
              <div className="flex items-center justify-between group p-2 rounded-md bg-muted/50">
                <code className="font-mono text-sm">{formatRgb(rgbWithBg)}</code>
                <button
                  onClick={() => copyToClipboard(formatRgb(rgbWithBg), 'RGB with BG')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent hover:text-white rounded"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
  )
}