'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { 
  FileJson,
  Copy,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileCode,
  Braces,
  List,
  ChevronRight,
  ChevronLeft,
  Download,
  Upload,
  Sparkles,
  Info,
  BarChart3
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type Format = 'json' | 'yaml'
type ValidationResult = {
  valid: boolean
  error?: string
  line?: number
  column?: number
}

interface Example {
  name: string
  description: string
  content: string
  format: Format
}

const EXAMPLES: Example[] = [
  {
    name: 'Package.json',
    description: 'NPM пакет',
    format: 'json',
    content: `{
  "name": "my-app",
  "version": "1.0.0",
  "description": "My awesome application",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "jest": "^29.0.0"
  }
}`
  },
  {
    name: 'API Response',
    description: 'REST API ответ',
    format: 'json',
    content: `{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "roles": ["admin", "user"]
    },
    "meta": {
      "timestamp": "2024-01-01T12:00:00Z",
      "version": "v1"
    }
  }
}`
  },
  {
    name: 'Docker Compose',
    description: 'Docker конфигурация',
    format: 'yaml',
    content: `version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - db_data:/var/lib/postgresql/data
volumes:
  db_data:`
  },
  {
    name: 'Kubernetes Config',
    description: 'K8s Deployment',
    format: 'yaml',
    content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: myapp:latest
        ports:
        - containerPort: 8080`
  },
  {
    name: 'OpenAPI Schema',
    description: 'API спецификация',
    format: 'yaml',
    content: `openapi: 3.0.0
info:
  title: My API
  version: 1.0.0
  description: Example API
paths:
  /users:
    get:
      summary: Get all users
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string`
  },
  {
    name: 'Ошибка JSON',
    description: 'Пример с ошибкой',
    format: 'json',
    content: `{
  "name": "Test",
  "array": [1, 2, 3,],
  "object": {
    "key": "value"
    "missing": "comma"
  },
  trailing: comma,
}`
  }
]

export default function JsonYamlFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [inputFormat, setInputFormat] = useState<Format>('json')
  const [outputFormat, setOutputFormat] = useState<Format>('json')
  const [indentSize, setIndentSize] = useState(2)
  const [sortKeys, setSortKeys] = useState(false)
  const [minify, setMinify] = useState(false)
  const [validation, setValidation] = useState<ValidationResult>({ valid: true })
  const [stats, setStats] = useState({ lines: 0, size: 0, keys: 0, depth: 0 })

  useEffect(() => {
    if (input) {
      formatAndValidate()
    } else {
      setOutput('')
      setValidation({ valid: true })
      setStats({ lines: 0, size: 0, keys: 0, depth: 0 })
    }
  }, [input, inputFormat, outputFormat, indentSize, sortKeys, minify])

  const formatAndValidate = () => {
    try {
      let data: any
      
      // Парсим входные данные
      if (inputFormat === 'json') {
        data = JSON.parse(input)
      } else {
        // Простой YAML парсер
        data = parseYAML(input)
      }

      // Сортировка ключей
      if (sortKeys && typeof data === 'object' && !Array.isArray(data)) {
        data = sortObjectKeys(data)
      }

      // Форматирование вывода
      let formatted: string
      if (outputFormat === 'json') {
        if (minify) {
          formatted = JSON.stringify(data)
        } else {
          formatted = JSON.stringify(data, null, indentSize)
        }
      } else {
        // Простой YAML форматтер
        formatted = toYAML(data, minify ? 0 : indentSize)
      }

      setOutput(formatted)
      setValidation({ valid: true })
      
      // Подсчет статистики
      calculateStats(data, formatted)
      
    } catch (error: any) {
      setValidation({
        valid: false,
        error: error.message,
        line: extractLineNumber(error),
        column: extractColumnNumber(error)
      })
      setOutput('')
    }
  }

  const parseYAML = (yaml: string): any => {
    // Очень базовый YAML парсер
    const lines = yaml.trim().split('\n')
    const result: any = {}
    const stack: any[] = [result]
    const indentStack: number[] = [0]
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()
      
      if (!trimmed || trimmed.startsWith('#')) continue
      
      const indent = line.length - line.trimStart().length
      
      // Обработка массивов
      if (trimmed.startsWith('- ')) {
        const value = trimmed.substring(2).trim()
        const parent = stack[stack.length - 1]
        if (!Array.isArray(parent)) {
          throw new Error(`Ошибка в строке ${i + 1}: Массив вне контекста`)
        }
        parent.push(parseValue(value))
        continue
      }
      
      // Обработка пар ключ-значение
      const colonIndex = trimmed.indexOf(':')
      if (colonIndex === -1) {
        throw new Error(`Ошибка в строке ${i + 1}: Ожидается ':' после ключа`)
      }
      
      const key = trimmed.substring(0, colonIndex).trim()
      const value = trimmed.substring(colonIndex + 1).trim()
      
      // Находим правильный уровень вложенности
      while (indentStack.length > 1 && indent <= indentStack[indentStack.length - 1]) {
        stack.pop()
        indentStack.pop()
      }
      
      const parent = stack[stack.length - 1]
      
      if (!value) {
        // Начало объекта или массива
        const nextLine = lines[i + 1]
        if (nextLine && nextLine.trim().startsWith('- ')) {
          parent[key] = []
          stack.push(parent[key])
          indentStack.push(indent)
        } else {
          parent[key] = {}
          stack.push(parent[key])
          indentStack.push(indent)
        }
      } else {
        parent[key] = parseValue(value)
      }
    }
    
    return result
  }

  const parseValue = (value: string): any => {
    if (!value) return null
    if (value === 'null') return null
    if (value === 'true') return true
    if (value === 'false') return false
    if (/^-?\d+$/.test(value)) return parseInt(value)
    if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value)
    if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1)
    if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1)
    return value
  }

  const toYAML = (data: any, indent: number, level: number = 0): string => {
    const spaces = ' '.repeat(indent * level)
    
    if (data === null) return 'null'
    if (typeof data === 'boolean') return String(data)
    if (typeof data === 'number') return String(data)
    if (typeof data === 'string') {
      if (data.includes('\n') || data.includes('"') || data.includes("'")) {
        return `"${data.replace(/"/g, '\\"')}"`
      }
      return data
    }
    
    if (Array.isArray(data)) {
      if (data.length === 0) return '[]'
      return data.map((item, i) => {
        const itemStr = toYAML(item, indent, level + 1)
        if (typeof item === 'object' && item !== null) {
          return `${i === 0 ? '' : spaces}- ${itemStr.substring(indent * (level + 1))}`
        }
        return `${i === 0 ? '' : spaces}- ${itemStr}`
      }).join('\n')
    }
    
    if (typeof data === 'object') {
      const entries = Object.entries(data)
      if (entries.length === 0) return '{}'
      return entries.map(([key, value], i) => {
        const valueStr = toYAML(value, indent, level + 1)
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          return `${i === 0 ? '' : spaces}${key}:\n${valueStr}`
        } else if (Array.isArray(value)) {
          return `${i === 0 ? '' : spaces}${key}:\n${' '.repeat(indent * (level + 1))}${valueStr}`
        }
        return `${i === 0 ? '' : spaces}${key}: ${valueStr}`
      }).join('\n')
    }
    
    return String(data)
  }

  const sortObjectKeys = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys)
    }
    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((result: any, key) => {
          result[key] = sortObjectKeys(obj[key])
          return result
        }, {})
    }
    return obj
  }

  const extractLineNumber = (error: any): number => {
    const match = error.message.match(/line (\d+)|position (\d+)/i)
    if (match) {
      const position = parseInt(match[1] || match[2])
      return input.substring(0, position).split('\n').length
    }
    return 1
  }

  const extractColumnNumber = (error: any): number => {
    const match = error.message.match(/column (\d+)|position (\d+)/i)
    if (match) {
      const position = parseInt(match[1] || match[2])
      const lines = input.substring(0, position).split('\n')
      return lines[lines.length - 1].length + 1
    }
    return 1
  }

  const calculateStats = (data: any, formatted: string) => {
    const lines = formatted.split('\n').length
    const size = new Blob([formatted]).size
    const keys = countKeys(data)
    const depth = getMaxDepth(data)
    
    setStats({ lines, size, keys, depth })
  }

  const countKeys = (obj: any, count = 0): number => {
    if (obj !== null && typeof obj === 'object') {
      if (Array.isArray(obj)) {
        return obj.reduce((acc, item) => acc + countKeys(item), count)
      }
      return Object.keys(obj).reduce(
        (acc, key) => acc + 1 + countKeys(obj[key]),
        count
      )
    }
    return count
  }

  const getMaxDepth = (obj: any, currentDepth = 0): number => {
    if (obj !== null && typeof obj === 'object') {
      if (Array.isArray(obj)) {
        return Math.max(...obj.map(item => getMaxDepth(item, currentDepth + 1)), currentDepth)
      }
      return Math.max(
        ...Object.values(obj).map(value => getMaxDepth(value, currentDepth + 1)),
        currentDepth
      )
    }
    return currentDepth
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(output)
    toast.success('Результат скопирован!')
  }

  const downloadOutput = () => {
    const blob = new Blob([output], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `formatted.${outputFormat}`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Файл загружен')
  }

  const loadExample = (example: Example) => {
    setInput(example.content)
    setInputFormat(example.format)
    toast.success(`Загружен пример: ${example.name}`)
  }

  const swapFormats = () => {
    setInputFormat(outputFormat)
    setOutputFormat(inputFormat)
    if (output) {
      setInput(output)
    }
  }

  const reset = () => {
    setInput('')
    setOutput('')
    setValidation({ valid: true })
    setStats({ lines: 0, size: 0, keys: 0, depth: 0 })
    toast.success('Форматтер сброшен')
  }

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Format Selection */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <RadioGroup value={inputFormat} onValueChange={(value: Format) => setInputFormat(value)}>
            <div className="flex items-center gap-4">
              <Label className="text-base">Входной формат:</Label>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="input-json" />
                <Label htmlFor="input-json">JSON</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yaml" id="input-yaml" />
                <Label htmlFor="input-yaml">YAML</Label>
              </div>
            </div>
          </RadioGroup>

          <Button onClick={swapFormats} variant="outline" size="sm" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            Поменять
          </Button>

          <RadioGroup value={outputFormat} onValueChange={(value: Format) => setOutputFormat(value)}>
            <div className="flex items-center gap-4">
              <Label className="text-base">Выходной формат:</Label>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="output-json" />
                <Label htmlFor="output-json">JSON</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yaml" id="output-yaml" />
                <Label htmlFor="output-yaml">YAML</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base">Входные данные</Label>
              {validation.valid && input && (
                <Badge variant="outline" className="gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Валидный
                </Badge>
              )}
              {!validation.valid && (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="w-3 h-3" />
                  Ошибка
                </Badge>
              )}
            </div>
            
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Вставьте ${inputFormat.toUpperCase()} для форматирования...`}
              className={cn(
                "font-mono text-sm min-h-[400px]",
                !validation.valid && "border-red-500"
              )}
            />
            
            {!validation.valid && validation.error && (
              <div className="mt-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  <div>
                    <div className="font-medium">{validation.error}</div>
                    {validation.line && (
                      <div className="text-xs mt-1">
                        Строка: {validation.line}, Столбец: {validation.column || 1}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Options */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Настройки</h3>
            
            <div className="space-y-4">
              <div>
                <Label>Отступ (пробелы)</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Slider
                    value={[indentSize]}
                    onValueChange={([value]) => setIndentSize(value)}
                    min={0}
                    max={8}
                    step={1}
                    className="flex-1"
                    disabled={minify}
                  />
                  <span className="w-8 text-sm font-mono">{indentSize}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="sort-keys" className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  Сортировать ключи
                </Label>
                <Switch
                  id="sort-keys"
                  checked={sortKeys}
                  onCheckedChange={setSortKeys}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="minify" className="flex items-center gap-2">
                  <Braces className="w-4 h-4" />
                  Минифицировать
                </Label>
                <Switch
                  id="minify"
                  checked={minify}
                  onCheckedChange={setMinify}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base">Результат</Label>
              <div className="flex gap-2">
                <Button onClick={copyOutput} size="sm" variant="outline" disabled={!output}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button onClick={downloadOutput} size="sm" variant="outline" disabled={!output}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Textarea
              value={output}
              readOnly
              placeholder="Отформатированный результат появится здесь..."
              className="font-mono text-sm min-h-[400px] bg-muted/50"
            />
          </Card>

          {/* Statistics */}
          {output && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Статистика
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">{stats.lines}</div>
                  <div className="text-sm text-muted-foreground">Строк</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">{formatSize(stats.size)}</div>
                  <div className="text-sm text-muted-foreground">Размер</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">{stats.keys}</div>
                  <div className="text-sm text-muted-foreground">Ключей</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">{stats.depth}</div>
                  <div className="text-sm text-muted-foreground">Глубина</div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Examples and Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Примеры
            </h3>
            
            <div className="grid md:grid-cols-2 gap-3">
              {EXAMPLES.map((example, index) => (
                <Button
                  key={index}
                  onClick={() => loadExample(example)}
                  variant="outline"
                  className="h-auto p-4 justify-start text-left"
                >
                  <div>
                    <div className="flex items-center gap-2 font-medium">
                      <FileCode className="w-4 h-4" />
                      {example.name}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {example.description}
                    </div>
                    <Badge variant="secondary" className="mt-2">
                      {example.format.toUpperCase()}
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Действия</h3>
            <div className="space-y-2">
              <Button onClick={reset} variant="outline" className="w-full gap-2">
                <RefreshCw className="w-4 h-4" />
                Сбросить все
              </Button>
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Советы
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• JSON требует двойные кавычки для строк</li>
              <li>• YAML чувствителен к отступам</li>
              <li>• Используйте сортировку для сравнения</li>
              <li>• Минификация уменьшает размер файла</li>
              <li>• Проверяйте синтаксис перед использованием</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}