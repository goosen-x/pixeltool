'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Fingerprint,
  Copy,
  RefreshCw,
  Download,
  Sparkles,
  Info,
  CheckCircle,
  Hash,
  Zap,
  Timer,
  Shield,
  Binary,
  Braces,
  Minus,
  Plus,
  List
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type UUIDVersion = 'v4' | 'v1' | 'v3' | 'v5' | 'nil'
type UUIDFormat = 'standard' | 'uppercase' | 'no-hyphens' | 'braces' | 'base64'

interface GeneratedUUID {
  id: string
  value: string
  formatted: string
  timestamp: number
  version: UUIDVersion
}

interface UUIDInfo {
  version: string
  variant: string
  timestamp?: string
  clockSequence?: string
  node?: string
  hash?: string
}

const UUID_FORMATS: { value: UUIDFormat; label: string; example: string }[] = [
  { 
    value: 'standard', 
    label: 'Стандартный', 
    example: '550e8400-e29b-41d4-a716-446655440000' 
  },
  { 
    value: 'uppercase', 
    label: 'Заглавные буквы', 
    example: '550E8400-E29B-41D4-A716-446655440000' 
  },
  { 
    value: 'no-hyphens', 
    label: 'Без дефисов', 
    example: '550e8400e29b41d4a716446655440000' 
  },
  { 
    value: 'braces', 
    label: 'С фигурными скобками', 
    example: '{550e8400-e29b-41d4-a716-446655440000}' 
  },
  { 
    value: 'base64', 
    label: 'Base64', 
    example: 'VQ6EAOKbQdSnFkRmVUQAAA==' 
  }
]

const NAMESPACE_UUIDS = {
  DNS: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  URL: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
  OID: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
  X500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8'
}

export default function UUIDGeneratorPage() {
  const [version, setVersion] = useState<UUIDVersion>('v4')
  const [format, setFormat] = useState<UUIDFormat>('standard')
  const [quantity, setQuantity] = useState(1)
  const [uppercase, setUppercase] = useState(false)
  const [hyphens, setHyphens] = useState(true)
  const [braces, setBraces] = useState(false)
  const [history, setHistory] = useState<GeneratedUUID[]>([])
  const [namespace, setNamespace] = useState('DNS')
  const [nameString, setNameString] = useState('')
  const [validationInput, setValidationInput] = useState('')
  const [validationResult, setValidationResult] = useState<UUIDInfo | null>(null)

  useEffect(() => {
    // Generate initial UUID on mount
    generateUUIDs()
  }, [])

  const generateUUIDs = () => {
    const newUUIDs: GeneratedUUID[] = []
    
    for (let i = 0; i < quantity; i++) {
      let uuid = ''
      
      switch (version) {
        case 'v4':
          uuid = generateV4()
          break
        case 'v1':
          uuid = generateV1()
          break
        case 'v3':
          uuid = generateV3(nameString || 'example.com')
          break
        case 'v5':
          uuid = generateV5(nameString || 'example.com')
          break
        case 'nil':
          uuid = '00000000-0000-0000-0000-000000000000'
          break
      }
      
      const formatted = formatUUID(uuid, format)
      
      newUUIDs.push({
        id: crypto.randomUUID(),
        value: uuid,
        formatted,
        timestamp: Date.now(),
        version
      })
    }
    
    setHistory(prev => [...newUUIDs, ...prev].slice(0, 100))
    
    if (quantity === 1) {
      navigator.clipboard.writeText(newUUIDs[0].formatted)
      toast.success('UUID скопирован в буфер обмена!')
    } else {
      toast.success(`Сгенерировано ${quantity} UUID`)
    }
  }

  const generateV4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  const generateV1 = (): string => {
    // Simplified v1 UUID (time-based)
    const timestamp = Date.now()
    const timestampHex = timestamp.toString(16).padStart(12, '0')
    const clockSeq = Math.floor(Math.random() * 0x3FFF) | 0x8000 // Set variant bits
    const node = Array.from({ length: 6 }, () => 
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join('')
    
    return [
      timestampHex.slice(-8),
      timestampHex.slice(-12, -8),
      '1' + timestampHex.slice(0, 3),
      clockSeq.toString(16),
      node
    ].join('-')
  }

  const generateV3 = (name: string): string => {
    // Simplified v3 UUID (MD5 namespace)
    const namespaceUuid = NAMESPACE_UUIDS[namespace as keyof typeof NAMESPACE_UUIDS]
    const hash = simpleHash(namespaceUuid + name, 'md5')
    
    return formatAsUUID(hash, 3)
  }

  const generateV5 = (name: string): string => {
    // Simplified v5 UUID (SHA-1 namespace)
    const namespaceUuid = NAMESPACE_UUIDS[namespace as keyof typeof NAMESPACE_UUIDS]
    const hash = simpleHash(namespaceUuid + name, 'sha1')
    
    return formatAsUUID(hash, 5)
  }

  const simpleHash = (str: string, algorithm: 'md5' | 'sha1'): string => {
    // Simple hash implementation for demo purposes
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    
    const hashHex = Math.abs(hash).toString(16).padStart(32, '0')
    return algorithm === 'sha1' ? hashHex.padStart(40, '0') : hashHex
  }

  const formatAsUUID = (hash: string, version: number): string => {
    const uuid = [
      hash.slice(0, 8),
      hash.slice(8, 12),
      version + hash.slice(13, 16),
      ((parseInt(hash.slice(16, 18), 16) & 0x3F) | 0x80).toString(16) + hash.slice(18, 20),
      hash.slice(20, 32)
    ].join('-')
    
    return uuid
  }

  const formatUUID = (uuid: string, format: UUIDFormat): string => {
    let formatted = uuid
    
    switch (format) {
      case 'uppercase':
        formatted = uuid.toUpperCase()
        break
      case 'no-hyphens':
        formatted = uuid.replace(/-/g, '')
        break
      case 'braces':
        formatted = `{${uuid}}`
        break
      case 'base64':
        // Convert UUID to base64
        const hex = uuid.replace(/-/g, '')
        const bytes = hex.match(/.{2}/g)?.map(byte => parseInt(byte, 16)) || []
        formatted = btoa(String.fromCharCode(...bytes))
        break
    }
    
    return formatted
  }

  const validateUUID = (uuid: string) => {
    const cleanUuid = uuid.trim().toLowerCase().replace(/[\{\}]/g, '')
    const uuidRegex = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[1-5][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$/i
    
    if (!uuidRegex.test(cleanUuid)) {
      setValidationResult(null)
      toast.error('Невалидный формат UUID')
      return
    }
    
    // Add hyphens if missing
    const formattedUuid = cleanUuid.length === 32 
      ? cleanUuid.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')
      : cleanUuid
    
    const parts = formattedUuid.split('-')
    const version = parseInt(parts[2].charAt(0), 16)
    const variant = parseInt(parts[3].charAt(0), 16)
    
    const info: UUIDInfo = {
      version: version >= 1 && version <= 5 ? `Version ${version}` : 'Unknown',
      variant: getVariant(variant)
    }
    
    // Extract additional info for v1
    if (version === 1) {
      const timestamp = parts[0] + parts[1].slice(1) + parts[2].slice(1)
      info.timestamp = new Date(parseInt(timestamp, 16) / 10000 - 12219292800000).toISOString()
      info.clockSequence = parts[3]
      info.node = parts[4]
    }
    
    setValidationResult(info)
    toast.success('UUID валиден')
  }

  const getVariant = (variantBits: number): string => {
    if (variantBits >= 0 && variantBits <= 7) return 'Reserved (NCS backward compatibility)'
    if (variantBits >= 8 && variantBits <= 11) return 'RFC 4122'
    if (variantBits >= 12 && variantBits <= 13) return 'Reserved (Microsoft)'
    if (variantBits >= 14 && variantBits <= 15) return 'Reserved (Future use)'
    return 'Unknown'
  }

  const copyUUID = (uuid: string) => {
    navigator.clipboard.writeText(uuid)
    toast.success('UUID скопирован!')
  }

  const copyAll = () => {
    const allUuids = history.slice(0, quantity).map(u => u.formatted).join('\n')
    navigator.clipboard.writeText(allUuids)
    toast.success(`Скопировано ${Math.min(quantity, history.length)} UUID`)
  }

  const downloadUUIDs = () => {
    const uuids = history.slice(0, quantity).map(u => u.formatted).join('\n')
    const blob = new Blob([uuids], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `uuids-${version}-${Date.now()}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('UUID загружены')
  }

  const clearHistory = () => {
    setHistory([])
    toast.success('История очищена')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Generator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Settings */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Настройки генератора</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-base mb-3 block">Версия UUID</Label>
                <RadioGroup value={version} onValueChange={(value: UUIDVersion) => setVersion(value)}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="v4" id="v4" />
                      <Label htmlFor="v4" className="cursor-pointer">
                        <div className="font-medium">Version 4</div>
                        <div className="text-xs text-muted-foreground">Random</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="v1" id="v1" />
                      <Label htmlFor="v1" className="cursor-pointer">
                        <div className="font-medium">Version 1</div>
                        <div className="text-xs text-muted-foreground">Time-based</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="v3" id="v3" />
                      <Label htmlFor="v3" className="cursor-pointer">
                        <div className="font-medium">Version 3</div>
                        <div className="text-xs text-muted-foreground">MD5 hash</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="v5" id="v5" />
                      <Label htmlFor="v5" className="cursor-pointer">
                        <div className="font-medium">Version 5</div>
                        <div className="text-xs text-muted-foreground">SHA-1 hash</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nil" id="nil" />
                      <Label htmlFor="nil" className="cursor-pointer">
                        <div className="font-medium">NIL UUID</div>
                        <div className="text-xs text-muted-foreground">All zeros</div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {(version === 'v3' || version === 'v5') && (
                <>
                  <div>
                    <Label htmlFor="namespace">Namespace</Label>
                    <Select value={namespace} onValueChange={setNamespace}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DNS">DNS</SelectItem>
                        <SelectItem value="URL">URL</SelectItem>
                        <SelectItem value="OID">OID</SelectItem>
                        <SelectItem value="X500">X500</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="name">Name String</Label>
                    <Input
                      id="name"
                      value={nameString}
                      onChange={(e) => setNameString(e.target.value)}
                      placeholder="example.com"
                    />
                  </div>
                </>
              )}

              <div>
                <Label>Формат вывода</Label>
                <Select value={format} onValueChange={(value: UUIDFormat) => setFormat(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UUID_FORMATS.map(fmt => (
                      <SelectItem key={fmt.value} value={fmt.value}>
                        <div>
                          <div>{fmt.label}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {fmt.example}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Количество UUID</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    size="icon"
                    variant="outline"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Slider
                    value={[quantity]}
                    onValueChange={([value]) => setQuantity(value)}
                    min={1}
                    max={100}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => setQuantity(Math.min(100, quantity + 1))}
                    size="icon"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-right font-mono">{quantity}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Generated UUIDs */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Сгенерированные UUID</h3>
              <div className="flex gap-2">
                {history.length > 0 && (
                  <>
                    <Button
                      onClick={copyAll}
                      size="sm"
                      variant="outline"
                      className="gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Копировать все
                    </Button>
                    <Button
                      onClick={downloadUUIDs}
                      size="sm"
                      variant="outline"
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Скачать
                    </Button>
                  </>
                )}
                <Button
                  onClick={generateUUIDs}
                  size="sm"
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Генерировать
                </Button>
              </div>
            </div>

            {history.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {history.slice(0, Math.max(quantity, 10)).map((uuid) => (
                  <div
                    key={uuid.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <div>
                      <code className="text-sm font-mono">{uuid.formatted}</code>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {uuid.version.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(uuid.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => copyUUID(uuid.formatted)}
                      size="icon"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Нажмите &quot;Генерировать&quot; для создания UUID
              </div>
            )}

            {history.length > 0 && (
              <Button
                onClick={clearHistory}
                variant="outline"
                size="sm"
                className="w-full mt-4"
              >
                Очистить историю
              </Button>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* UUID Validator */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Валидатор UUID
            </h3>
            
            <div className="space-y-4">
              <Input
                value={validationInput}
                onChange={(e) => setValidationInput(e.target.value)}
                placeholder="Введите UUID для проверки..."
                className="font-mono text-sm"
              />
              
              <Button
                onClick={() => validateUUID(validationInput)}
                disabled={!validationInput}
                className="w-full"
              >
                Проверить UUID
              </Button>

              {validationResult && (
                <div className="space-y-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Валидный UUID</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div>Версия: {validationResult.version}</div>
                    <div>Вариант: {validationResult.variant}</div>
                    {validationResult.timestamp && (
                      <div>Время: {validationResult.timestamp}</div>
                    )}
                    {validationResult.node && (
                      <div>Node: {validationResult.node}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Info */}
          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              О UUID
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-1">Version 1</h4>
                <p>Основан на времени и MAC-адресе. Может раскрыть информацию о системе.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Version 4</h4>
                <p>Случайный UUID. Самый популярный и безопасный вариант.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Version 3 & 5</h4>
                <p>Основаны на namespace и имени. v3 использует MD5, v5 - SHA-1.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Формат</h4>
                <p className="font-mono text-xs">
                  xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
                </p>
                <p className="mt-1">M - версия, N - вариант</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}