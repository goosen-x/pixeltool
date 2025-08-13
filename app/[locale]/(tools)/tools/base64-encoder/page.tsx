'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { WidgetLayout } from '@/components/widgets/WidgetLayout'
import { WidgetSection } from '@/components/widgets/WidgetSection'
import { WidgetOutput } from '@/components/widgets/WidgetOutput'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { 
  Lock,
  Unlock,
  Copy,
  RefreshCw,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  FileCode,
  Image,
  Upload,
  Download,
  Sparkles,
  Info,
  Loader2,
  Settings,
  FileInput,
  FileOutput,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type Mode = 'encode' | 'decode'
type DataType = 'text' | 'file' | 'url'

interface Example {
  name: string
  input: string
  type: DataType
  description: string
}

const EXAMPLES: Example[] = [
  {
    name: 'Простой текст',
    input: 'Hello, World!',
    type: 'text',
    description: 'Базовая строка текста'
  },
  {
    name: 'JSON данные',
    input: '{"name":"John","age":30,"city":"New York"}',
    type: 'text',
    description: 'JSON объект'
  },
  {
    name: 'HTML код',
    input: '<!DOCTYPE html>\n<html>\n<body>\n<h1>Hello World</h1>\n</body>\n</html>',
    type: 'text',
    description: 'HTML документ'
  },
  {
    name: 'CSS стили',
    input: 'body {\n  margin: 0;\n  padding: 0;\n  font-family: Arial, sans-serif;\n}',
    type: 'text',
    description: 'CSS правила'
  },
  {
    name: 'Email адрес',
    input: 'user@example.com',
    type: 'text',
    description: 'Email для защиты от спама'
  },
  {
    name: 'Base64 строка',
    input: 'SGVsbG8sIFdvcmxkIQ==',
    type: 'text',
    description: 'Закодированный текст'
  },
  {
    name: 'Data URL',
    input: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
    type: 'url',
    description: 'Data URL формат'
  },
  {
    name: 'Длинный текст',
    input: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: 'text',
    description: 'Параграф текста'
  }
]

export default function Base64EncoderPage() {
  const [mode, setMode] = useState<Mode>('encode')
  const [dataType, setDataType] = useState<DataType>('text')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [urlSafe, setUrlSafe] = useState(false)
  const [addLineBreaks, setAddLineBreaks] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [stats, setStats] = useState({
    inputSize: 0,
    outputSize: 0,
    compressionRatio: 0
  })

  useEffect(() => {
    if (input && dataType === 'text') {
      processText()
    } else if (!input) {
      setOutput('')
      setStats({ inputSize: 0, outputSize: 0, compressionRatio: 0 })
    }
  }, [input, mode, urlSafe, addLineBreaks, dataType])

  const processText = () => {
    try {
      let result = ''
      
      if (mode === 'encode') {
        if (dataType === 'url' && input.startsWith('data:')) {
          // Extract base64 from data URL
          const base64Part = input.split(',')[1] || ''
          result = base64Part
        } else {
          // Encode text to base64
          result = btoa(unescape(encodeURIComponent(input)))
          
          if (urlSafe) {
            result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
          }
          
          if (addLineBreaks) {
            result = result.match(/.{1,76}/g)?.join('\n') || result
          }
        }
      } else {
        // Decode base64
        let toDecode = input.trim()
        
        if (dataType === 'url' && input.startsWith('data:')) {
          // Extract base64 from data URL
          toDecode = input.split(',')[1] || ''
        }
        
        if (urlSafe) {
          // Convert URL-safe base64 back to standard
          toDecode = toDecode.replace(/-/g, '+').replace(/_/g, '/')
          // Add padding if needed
          const padding = toDecode.length % 4
          if (padding) {
            toDecode += '='.repeat(4 - padding)
          }
        }
        
        // Remove line breaks
        toDecode = toDecode.replace(/\s/g, '')
        
        result = decodeURIComponent(escape(atob(toDecode)))
      }
      
      setOutput(result)
      setIsValid(true)
      
      // Calculate stats
      const inputBytes = new Blob([input]).size
      const outputBytes = new Blob([result]).size
      const ratio = mode === 'encode' 
        ? (outputBytes / inputBytes - 1) * 100 
        : (1 - outputBytes / inputBytes) * 100
      
      setStats({
        inputSize: inputBytes,
        outputSize: outputBytes,
        compressionRatio: ratio
      })
    } catch (error) {
      setOutput('')
      setIsValid(false)
      setStats({ inputSize: 0, outputSize: 0, compressionRatio: 0 })
      
      if (mode === 'decode') {
        toast.error('Невалидная Base64 строка')
      }
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    
    setFile(selectedFile)
    setIsProcessing(true)
    
    try {
      if (mode === 'encode') {
        // Read file as base64
        const reader = new FileReader()
        reader.onload = (event) => {
          const base64 = event.target?.result as string
          const base64Data = base64.split(',')[1]
          setOutput(base64Data)
          setInput(`Файл: ${selectedFile.name} (${formatFileSize(selectedFile.size)})`)
          
          // Calculate stats
          setStats({
            inputSize: selectedFile.size,
            outputSize: new Blob([base64Data]).size,
            compressionRatio: (new Blob([base64Data]).size / selectedFile.size - 1) * 100
          })
          setIsProcessing(false)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        // Decode base64 file content
        const reader = new FileReader()
        reader.onload = (event) => {
          const content = event.target?.result as string
          try {
            const decoded = atob(content.trim())
            setOutput(decoded)
            setInput(`Файл: ${selectedFile.name}`)
            
            setStats({
              inputSize: selectedFile.size,
              outputSize: new Blob([decoded]).size,
              compressionRatio: (1 - new Blob([decoded]).size / selectedFile.size) * 100
            })
          } catch (error) {
            toast.error('Файл содержит невалидную Base64 строку')
          }
          setIsProcessing(false)
        }
        reader.readAsText(selectedFile)
      }
    } catch (error) {
      toast.error('Ошибка обработки файла')
      setIsProcessing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Скопировано в буфер обмена!')
  }

  const downloadOutput = () => {
    if (!output) return
    
    const blob = new Blob([output], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt'
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Файл загружен')
  }

  const loadExample = (example: Example) => {
    setInput(example.input)
    setDataType(example.type)
    if (example.input.startsWith('SGVs') || example.input.includes('base64')) {
      setMode('decode')
    } else {
      setMode('encode')
    }
    toast.success(`Загружен пример: ${example.name}`)
  }

  const swapInputOutput = () => {
    setInput(output)
    setMode(mode === 'encode' ? 'decode' : 'encode')
  }

  const reset = () => {
    setInput('')
    setOutput('')
    setFile(null)
    setDataType('text')
    setIsValid(true)
    setStats({ inputSize: 0, outputSize: 0, compressionRatio: 0 })
    toast.success('Очищено')
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <WidgetLayout>
      {/* Mode Selection */}
      <WidgetSection
        icon={<Settings className="h-5 w-5" />}
        title="Настройки"
        description="Выберите режим работы"
      >
        <div className="space-y-4">
          <div>
            <Label className="text-base mb-3 block">Режим работы</Label>
            <RadioGroup value={mode} onValueChange={(value: Mode) => setMode(value)}>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={cn(
                    "relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all",
                    mode === 'encode' ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                  )}
                  onClick={() => setMode('encode')}
                >
                  <RadioGroupItem value="encode" id="encode" />
                  <Label htmlFor="encode" className="cursor-pointer flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    <span className="font-medium">Кодировать</span>
                  </Label>
                </div>
                <div 
                  className={cn(
                    "relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all",
                    mode === 'decode' ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                  )}
                  onClick={() => setMode('decode')}
                >
                  <RadioGroupItem value="decode" id="decode" />
                  <Label htmlFor="decode" className="cursor-pointer flex items-center gap-2">
                    <Unlock className="w-5 h-5" />
                    <span className="font-medium">Декодировать</span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base mb-3 block">Тип данных</Label>
            <RadioGroup value={dataType} onValueChange={(value: DataType) => setDataType(value)}>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="text" />
                  <Label htmlFor="text" className="cursor-pointer flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Текст
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="file" id="file" />
                  <Label htmlFor="file" className="cursor-pointer flex items-center gap-2">
                    <FileCode className="w-4 h-4" />
                    Файл
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="url" id="url" />
                  <Label htmlFor="url" className="cursor-pointer flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Data URL
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {mode === 'encode' && (
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="url-safe"
                  checked={urlSafe}
                  onCheckedChange={setUrlSafe}
                />
                <Label htmlFor="url-safe">URL-безопасный</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="line-breaks"
                  checked={addLineBreaks}
                  onCheckedChange={setAddLineBreaks}
                />
                <Label htmlFor="line-breaks">Разбивать на строки (76 символов)</Label>
              </div>
            </div>
          )}
        </div>
      </WidgetSection>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <WidgetSection
            icon={<FileInput className="h-5 w-5" />}
            title="Входные данные"
          >
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base">
                {mode === 'encode' ? 'Исходные данные' : 'Base64 данные'}
              </Label>
              {!isValid && mode === 'decode' && (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="w-3 h-3" />
                  Невалидный Base64
                </Badge>
              )}
            </div>
            
            {dataType === 'file' ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Нажмите для выбора файла
                    </span>
                  </label>
                </div>
                {file && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === 'encode' 
                    ? dataType === 'url' 
                      ? 'Вставьте data URL...'
                      : 'Введите текст для кодирования...'
                    : 'Вставьте Base64 строку для декодирования...'
                }
                rows={12}
                className="font-mono"
              />
            )}
          </WidgetSection>

          {/* Statistics */}
          {(input || file) && (
            <WidgetOutput
              gradientFrom="from-primary/10"
              gradientTo="to-accent/10"
            >
              <h3 className="font-semibold mb-4">Статистика</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatFileSize(stats.inputSize)}</div>
                  <div className="text-sm text-muted-foreground">Входной размер</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatFileSize(stats.outputSize)}</div>
                  <div className="text-sm text-muted-foreground">Выходной размер</div>
                </div>
                <div className="text-center">
                  <div className={cn(
                    "text-2xl font-bold",
                    stats.compressionRatio > 0 ? "text-red-600" : "text-green-600"
                  )}>
                    {stats.compressionRatio > 0 ? '+' : ''}{stats.compressionRatio.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {mode === 'encode' ? 'Увеличение' : 'Сжатие'}
                  </div>
                </div>
              </div>
            </WidgetOutput>
          )}
        </div>

        {/* Output */}
        <div className="space-y-4">
          <WidgetSection
            icon={<FileOutput className="h-5 w-5" />}
            title={mode === 'encode' ? 'Base64 результат' : 'Декодированные данные'}
          >
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base">
                {mode === 'encode' ? 'Base64 результат' : 'Декодированные данные'}
              </Label>
              <div className="flex gap-2">
                {output && (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copyToClipboard(output)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={downloadOutput}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {isProcessing ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Textarea
                value={output}
                readOnly
                placeholder={
                  mode === 'encode' 
                    ? 'Base64 результат появится здесь...'
                    : 'Декодированный текст появится здесь...'
                }
                rows={12}
                className="font-mono"
              />
            )}
          </WidgetSection>

          {/* Actions */}
          <WidgetSection
            icon={<Zap className="h-5 w-5" />}
            title="Действия"
          >
            <div className="space-y-2">
              <Button
                onClick={swapInputOutput}
                className="w-full"
                disabled={!output}
                variant="outline"
              >
                <ArrowUpDown className="w-5 h-5 mr-2" />
                Поменять местами и {mode === 'encode' ? 'декодировать' : 'кодировать'}
              </Button>
              <Button
                onClick={reset}
                className="w-full"
                variant="outline"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Очистить все
              </Button>
            </div>
          </WidgetSection>
        </div>
      </div>

      {/* Examples and Tips */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WidgetSection
            icon={<Sparkles className="h-5 w-5" />}
            title="Примеры использования"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Примеры
            </h3>
            
            <div className="grid md:grid-cols-2 gap-3">
              {EXAMPLES.map((example, index) => (
                <Button
                  key={index}
                  onClick={() => loadExample(example)}
                  className="h-auto p-4 justify-start text-left"
                  variant="outline"
                >
                  <div className="w-full">
                    <div className="font-medium">{example.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {example.description}
                    </div>
                    {example.type !== 'text' && (
                      <Badge variant="secondary" className="mt-2">
                        {example.type === 'file' ? 'Файл' : 'Data URL'}
                      </Badge>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </WidgetSection>
        </div>

        <div className="space-y-6">
          <WidgetSection
            icon={<Info className="h-5 w-5" />}
            title="Информация"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" />
              О Base64
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Base64 — схема кодирования, представляющая двоичные данные в ASCII формате.
              </p>
              <div>
                <h4 className="font-medium text-foreground mb-1">Применение:</h4>
                <ul className="space-y-1">
                  <li>• Встраивание изображений в HTML/CSS</li>
                  <li>• Передача данных в JSON</li>
                  <li>• Email вложения</li>
                  <li>• Хранение бинарных данных</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Особенности:</h4>
                <ul className="space-y-1">
                  <li>• Увеличивает размер на ~33%</li>
                  <li>• Безопасен для передачи</li>
                  <li>• Поддерживается везде</li>
                </ul>
              </div>
            </div>
          </WidgetSection>
        </div>
      </div>
    </WidgetLayout>
  )
}