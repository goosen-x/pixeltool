'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { 
  Code2,
  Copy,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  FileCode,
  Sparkles,
  Zap,
  Bug,
  Terminal,
  BookOpen,
  FileJson
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
// Simple JavaScript syntax checker without external dependencies

type ParseMode = 'es5' | 'es6' | 'es2020' | 'latest'
type SourceType = 'script' | 'module'

interface SyntaxError {
  message: string
  line: number
  column: number
  suggestion?: string
}

interface ParseResult {
  valid: boolean
  errors: SyntaxError[]
  warnings: string[]
  ast?: any
  stats?: {
    functions: number
    variables: number
    classes: number
    imports: number
    exports: number
  }
}

interface CodeExample {
  name: string
  code: string
  description: string
  mode: ParseMode
}

const CODE_EXAMPLES: CodeExample[] = [
  {
    name: 'ES6 стрелочная функция',
    code: `const greet = (name) => {
  console.log(\`Hello, \${name}!\`);
};

greet('World');`,
    description: 'Стрелочная функция с шаблонной строкой',
    mode: 'es6'
  },
  {
    name: 'ES6 класс',
    code: `class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return \`Hi, I'm \${this.name}\`;
  }
}`,
    description: 'Класс ES6 с конструктором',
    mode: 'es6'
  },
  {
    name: 'ES6 деструктуризация',
    code: `const person = { name: 'John', age: 30 };
const { name, age } = person;

const numbers = [1, 2, 3];
const [first, ...rest] = numbers;`,
    description: 'Деструктуризация объектов и массивов',
    mode: 'es6'
  },
  {
    name: 'ES2020 async/await',
    code: `async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}`,
    description: 'Асинхронная функция',
    mode: 'es2020'
  },
  {
    name: 'ES6 модули',
    code: `// utils.js
export const sum = (a, b) => a + b;
export const multiply = (a, b) => a * b;

// main.js
import { sum, multiply } from './utils.js';`,
    description: 'Импорт/экспорт ES6',
    mode: 'es6'
  },
  {
    name: 'ES2020 optional chaining',
    code: `const user = {
  name: 'John',
  address: {
    city: 'New York'
  }
};

const zipCode = user.address?.zipCode ?? '00000';`,
    description: 'Optional chaining и nullish coalescing',
    mode: 'es2020'
  },
  {
    name: 'Ошибка синтаксиса',
    code: `function broken() {
  const x = 10
  if (x > 5 {
    console.log('Greater than 5');
  }
}`,
    description: 'Пример с ошибкой',
    mode: 'es6'
  }
]

const COMMON_ERRORS = [
  { pattern: /Unexpected token \(/, suggestion: 'Проверьте расстановку скобок' },
  { pattern: /Unexpected token \)/, suggestion: 'Лишняя закрывающая скобка' },
  { pattern: /Unexpected token \{/, suggestion: 'Проверьте фигурные скобки' },
  { pattern: /Unexpected token \}/, suggestion: 'Лишняя закрывающая фигурная скобка' },
  { pattern: /Unexpected end of input/, suggestion: 'Не хватает закрывающей скобки или точки с запятой' },
  { pattern: /Unexpected identifier/, suggestion: 'Неожиданный идентификатор. Возможно, пропущена запятая или точка с запятой' },
  { pattern: /Unexpected reserved word/, suggestion: 'Используется зарезервированное слово' },
  { pattern: /Unexpected string/, suggestion: 'Неожиданная строка. Проверьте синтаксис' },
  { pattern: /Missing semicolon/, suggestion: 'Пропущена точка с запятой' }
]

export default function JavaScriptSyntaxCheckerPage() {
  const [code, setCode] = useState('')
  const [mode, setMode] = useState<ParseMode>('latest')
  const [sourceType, setSourceType] = useState<SourceType>('script')
  const [allowJsx, setAllowJsx] = useState(false)
  const [result, setResult] = useState<ParseResult | null>(null)
  const [highlightedCode, setHighlightedCode] = useState('')

  useEffect(() => {
    if (code) {
      checkSyntax()
    } else {
      setResult(null)
      setHighlightedCode('')
    }
  }, [code, mode, sourceType, allowJsx])

  const checkSyntax = () => {
    if (!code.trim()) {
      setResult(null)
      return
    }

    const errors: SyntaxError[] = []
    const warnings: string[] = []
    let ast: any = null

    try {
      // Простая проверка синтаксиса через Function constructor
      try {
        if (sourceType === 'module') {
          // Проверяем модульный синтаксис
          new Function('"use strict"; import { x } from "y"; export default {};')
        }
        
        // Основная проверка
        new Function('"use strict";\n' + code)
        
        // Дополнительные проверки для ES6+
        if (mode !== 'es5') {
          checkES6Syntax(code)
        }
        
        if (mode === 'es2020' || mode === 'latest') {
          checkES2020Syntax(code)
        }
        
        if (allowJsx) {
          checkJSXSyntax(code)
        }
      } catch (syntaxError: any) {
        throw syntaxError
      }

      // Анализируем код для статистики
      const stats = analyzeCode(code)

      // Проверяем на потенциальные проблемы
      checkForWarnings(code, warnings)

      setResult({
        valid: true,
        errors: [],
        warnings,
        ast,
        stats
      })

      // Подсвечиваем код (базовая подсветка)
      highlightCode(code)

    } catch (error: any) {
      // Парсим ошибку
      // Парсим ошибку из сообщения
      let line = 1
      let column = 1
      
      // Пытаемся извлечь номер строки из сообщения
      const lineMatch = error.message.match(/line (\d+)/i)
      if (lineMatch) {
        line = parseInt(lineMatch[1])
      } else if (error.stack) {
        // Пробуем из stack trace
        const stackMatch = error.stack.match(/<anonymous>:(\d+):(\d+)/)
        if (stackMatch) {
          line = parseInt(stackMatch[1]) - 1 // Вычитаем 1 т.к. добавляли "use strict"
          column = parseInt(stackMatch[2])
        }
      }
      
      const syntaxError: SyntaxError = {
        message: error.message.replace(/^Unexpected token.*?:/, 'Syntax error:'),
        line,
        column
      }

      // Добавляем предложения по исправлению
      for (const { pattern, suggestion } of COMMON_ERRORS) {
        if (pattern.test(error.message)) {
          syntaxError.suggestion = suggestion
          break
        }
      }

      errors.push(syntaxError)

      setResult({
        valid: false,
        errors,
        warnings,
        ast: null
      })

      // Подсвечиваем место ошибки
      highlightError(code, syntaxError)
    }
  }

  const checkES6Syntax = (code: string) => {
    // Проверяем ES6 фичи
    const es6Features = [
      { pattern: /=>/, name: 'arrow functions' },
      { pattern: /class\s+\w+/, name: 'classes' },
      { pattern: /`[^`]*\${[^}]+}[^`]*`/, name: 'template literals' },
      { pattern: /\.\.\.[^.]/, name: 'spread operator' },
      { pattern: /const\s+{[^}]+}\s*=/, name: 'destructuring' },
      { pattern: /import\s+.*\s+from/, name: 'ES6 imports' },
      { pattern: /export\s+(default|const|let|var|function|class)/, name: 'ES6 exports' }
    ]
    
    if (mode === 'es5') {
      for (const feature of es6Features) {
        if (feature.pattern.test(code)) {
          throw new Error(`ES6 feature not allowed in ES5 mode: ${feature.name}`)
        }
      }
    }
  }
  
  const checkES2020Syntax = (code: string) => {
    // Проверяем ES2020 фичи
    const es2020Features = [
      { pattern: /\?\./, name: 'optional chaining' },
      { pattern: /\?\?/, name: 'nullish coalescing' },
      { pattern: /#\w+/, name: 'private fields' }
    ]
    
    if (mode === 'es5' || mode === 'es6') {
      for (const feature of es2020Features) {
        if (feature.pattern.test(code)) {
          throw new Error(`ES2020 feature not allowed in ${mode.toUpperCase()} mode: ${feature.name}`)
        }
      }
    }
  }
  
  const checkJSXSyntax = (code: string) => {
    // Простая проверка JSX
    if (/<\w+[^>]*>/.test(code) && !allowJsx) {
      throw new Error('JSX syntax detected but JSX is not enabled')
    }
  }
  
  const analyzeCode = (code: string): any => {
    const stats = {
      functions: 0,
      variables: 0,
      classes: 0,
      imports: 0,
      exports: 0
    }

    // Подсчет функций
    const functionMatches = code.match(/function\s+\w+|\w+\s*:\s*function|\w+\s*=>|\w+\s*:\s*\([^)]*\)\s*=>/g)
    stats.functions = functionMatches ? functionMatches.length : 0
    
    // Подсчет переменных
    const varMatches = code.match(/(?:const|let|var)\s+\w+/g)
    stats.variables = varMatches ? varMatches.length : 0
    
    // Подсчет классов
    const classMatches = code.match(/class\s+\w+/g)
    stats.classes = classMatches ? classMatches.length : 0
    
    // Подсчет импортов
    const importMatches = code.match(/import\s+.*\s+from/g)
    stats.imports = importMatches ? importMatches.length : 0
    
    // Подсчет экспортов
    const exportMatches = code.match(/export\s+(default|const|let|var|function|class|{)/g)
    stats.exports = exportMatches ? exportMatches.length : 0
    
    return stats
  }

  const checkForWarnings = (code: string, warnings: string[]) => {
    // Проверка на console.log
    if (code.includes('console.log')) {
      warnings.push('Используется console.log - не забудьте удалить в production')
    }

    // Проверка на debugger
    if (code.includes('debugger')) {
      warnings.push('Используется debugger - удалите перед развертыванием')
    }

    // Проверка на var
    if (code.includes('var ')) {
      warnings.push('Используется var - рекомендуется использовать let/const')
    }

    // Проверка на == вместо ===
    if (code.includes('==') && !code.includes('===')) {
      warnings.push('Используется == - рекомендуется использовать ===')
    }
  }

  const highlightCode = (code: string) => {
    // Базовая подсветка синтаксиса
    let highlighted = code
      // Ключевые слова
      .replace(/\b(const|let|var|function|class|if|else|for|while|do|switch|case|break|continue|return|try|catch|finally|throw|new|this|super|import|export|default|from|async|await|yield)\b/g, 
        '<span class="text-blue-600 dark:text-blue-400">$1</span>')
      // Строки
      .replace(/(['"`])([^'"`]*)\1/g, 
        '<span class="text-green-600 dark:text-green-400">$1$2$1</span>')
      // Числа
      .replace(/\b(\d+)\b/g, 
        '<span class="text-purple-600 dark:text-purple-400">$1</span>')
      // Комментарии
      .replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, 
        '<span class="text-gray-500 dark:text-gray-400">$1</span>')

    setHighlightedCode(highlighted)
  }

  const highlightError = (code: string, error: SyntaxError) => {
    const lines = code.split('\n')
    const errorLine = lines[error.line - 1]
    
    if (errorLine) {
      const before = lines.slice(0, error.line - 1).join('\n')
      const after = lines.slice(error.line).join('\n')
      
      const highlighted = 
        (before ? before + '\n' : '') +
        `<span class="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">${errorLine}</span>` +
        (after ? '\n' + after : '')
      
      setHighlightedCode(highlighted)
    }
  }

  const loadExample = (example: CodeExample) => {
    setCode(example.code)
    setMode(example.mode)
    toast.success(`Загружен пример: ${example.name}`)
  }

  const copyResult = () => {
    if (!result) return

    const text = result.valid 
      ? `✅ Синтаксис корректен\n\nСтатистика:\nФункций: ${result.stats?.functions || 0}\nПеременных: ${result.stats?.variables || 0}\nКлассов: ${result.stats?.classes || 0}`
      : `❌ Ошибка синтаксиса\n\n${result.errors.map(e => `Ошибка в строке ${e.line}:${e.column}\n${e.message}${e.suggestion ? '\nПредложение: ' + e.suggestion : ''}`).join('\n\n')}`

    navigator.clipboard.writeText(text)
    toast.success('Результат скопирован!')
  }

  const reset = () => {
    setCode('')
    setResult(null)
    setHighlightedCode('')
    toast.success('Проверка сброшена')
  }

  const formatCode = () => {
    try {
      // Простое форматирование с отступами
      const formatted = code
        .replace(/\{/g, ' {\n  ')
        .replace(/\}/g, '\n}')
        .replace(/;/g, ';\n')
        .replace(/\n\s*\n/g, '\n')
        .trim()
      
      setCode(formatted)
      toast.success('Код отформатирован')
    } catch (err) {
      toast.error('Ошибка форматирования')
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Settings */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base mb-3 block">Версия ECMAScript</Label>
            <RadioGroup value={mode} onValueChange={(value: ParseMode) => setMode(value)}>
              <div className="grid grid-cols-4 gap-4">
                <div 
                  className={cn(
                    "relative flex items-center space-x-3 rounded-lg border p-3 cursor-pointer transition-colors",
                    mode === 'es5' ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                  )}
                  onClick={() => setMode('es5')}
                >
                  <RadioGroupItem value="es5" id="es5" />
                  <Label htmlFor="es5" className="cursor-pointer">ES5</Label>
                </div>
                <div 
                  className={cn(
                    "relative flex items-center space-x-3 rounded-lg border p-3 cursor-pointer transition-colors",
                    mode === 'es6' ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                  )}
                  onClick={() => setMode('es6')}
                >
                  <RadioGroupItem value="es6" id="es6" />
                  <Label htmlFor="es6" className="cursor-pointer">ES6/ES2015</Label>
                </div>
                <div 
                  className={cn(
                    "relative flex items-center space-x-3 rounded-lg border p-3 cursor-pointer transition-colors",
                    mode === 'es2020' ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                  )}
                  onClick={() => setMode('es2020')}
                >
                  <RadioGroupItem value="es2020" id="es2020" />
                  <Label htmlFor="es2020" className="cursor-pointer">ES2020</Label>
                </div>
                <div 
                  className={cn(
                    "relative flex items-center space-x-3 rounded-lg border p-3 cursor-pointer transition-colors",
                    mode === 'latest' ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                  )}
                  onClick={() => setMode('latest')}
                >
                  <RadioGroupItem value="latest" id="latest" />
                  <Label htmlFor="latest" className="cursor-pointer">Latest</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="source-type"
                  checked={sourceType === 'module'}
                  onCheckedChange={(checked) => setSourceType(checked ? 'module' : 'script')}
                />
                <Label htmlFor="source-type">Модуль (ES6 imports)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="jsx"
                  checked={allowJsx}
                  onCheckedChange={setAllowJsx}
                />
                <Label htmlFor="jsx">Поддержка JSX</Label>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Code Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="code-input" className="text-base">JavaScript код</Label>
                <div className="flex gap-2">
                  <Button onClick={formatCode} variant="outline" size="sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Формат
                  </Button>
                </div>
              </div>
              
              <Textarea
                id="code-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Введите JavaScript код для проверки..."
                className="font-mono text-sm"
                rows={12}
              />

              {/* Code Preview with Syntax Highlighting */}
              {highlightedCode && (
                <div>
                  <Label>Предпросмотр</Label>
                  <div 
                    className="mt-1 p-4 rounded-lg bg-muted font-mono text-sm whitespace-pre overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                  />
                </div>
              )}

              {/* Results */}
              {result && (
                <div className={cn(
                  "p-4 rounded-lg",
                  result.valid 
                    ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
                )}>
                  <div className="flex items-start gap-3">
                    {result.valid ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h3 className={cn(
                        "font-semibold",
                        result.valid ? "text-green-900 dark:text-green-100" : "text-red-900 dark:text-red-100"
                      )}>
                        {result.valid ? 'Синтаксис корректен' : 'Ошибка синтаксиса'}
                      </h3>
                      
                      {result.errors.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {result.errors.map((error, index) => (
                            <div key={index} className="text-sm">
                              <div className="font-medium text-red-800 dark:text-red-200">
                                Строка {error.line}, столбец {error.column}
                              </div>
                              <div className="text-red-700 dark:text-red-300">
                                {error.message}
                              </div>
                              {error.suggestion && (
                                <div className="text-red-600 dark:text-red-400 italic">
                                  Предложение: {error.suggestion}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {result.warnings.length > 0 && (
                        <div className="mt-3 space-y-1">
                          <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Предупреждения:</h4>
                          {result.warnings.map((warning, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm text-yellow-700 dark:text-yellow-300">
                              <AlertCircle className="w-4 h-4 mt-0.5" />
                              <span>{warning}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {result.stats && result.valid && (
                        <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                          <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Статистика:</h4>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                            <div className="text-center p-2 rounded bg-white/50 dark:bg-black/20">
                              <div className="text-2xl font-bold text-green-600">{result.stats.functions}</div>
                              <div className="text-xs text-muted-foreground">Функций</div>
                            </div>
                            <div className="text-center p-2 rounded bg-white/50 dark:bg-black/20">
                              <div className="text-2xl font-bold text-green-600">{result.stats.variables}</div>
                              <div className="text-xs text-muted-foreground">Переменных</div>
                            </div>
                            <div className="text-center p-2 rounded bg-white/50 dark:bg-black/20">
                              <div className="text-2xl font-bold text-green-600">{result.stats.classes}</div>
                              <div className="text-xs text-muted-foreground">Классов</div>
                            </div>
                            <div className="text-center p-2 rounded bg-white/50 dark:bg-black/20">
                              <div className="text-2xl font-bold text-green-600">{result.stats.imports}</div>
                              <div className="text-xs text-muted-foreground">Импортов</div>
                            </div>
                            <div className="text-center p-2 rounded bg-white/50 dark:bg-black/20">
                              <div className="text-2xl font-bold text-green-600">{result.stats.exports}</div>
                              <div className="text-xs text-muted-foreground">Экспортов</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button onClick={copyResult} disabled={!result} className="gap-2">
                  <Copy className="w-4 h-4" />
                  Копировать результат
                </Button>
                <Button onClick={reset} variant="outline" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Сброс
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Examples */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FileCode className="w-5 h-5" />
              Примеры кода
            </h3>
            <div className="space-y-2">
              {CODE_EXAMPLES.map((example, index) => (
                <Button
                  key={index}
                  onClick={() => loadExample(example)}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                >
                  <div>
                    <div className="font-medium">{example.name}</div>
                    <div className="text-xs text-muted-foreground">{example.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </Card>

          {/* ES6 Features */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              ES6+ возможности
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium mb-1">ES6 (ES2015)</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• let/const</li>
                  <li>• Стрелочные функции</li>
                  <li>• Классы</li>
                  <li>• Шаблонные строки</li>
                  <li>• Деструктуризация</li>
                  <li>• Модули</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">ES2020+</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Optional chaining (?.)</li>
                  <li>• Nullish coalescing (??)</li>
                  <li>• BigInt</li>
                  <li>• Dynamic import</li>
                  <li>• Private fields (#)</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Советы
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Используйте &apos;use strict&apos; для строгого режима</li>
              <li>• Предпочитайте const для неизменяемых значений</li>
              <li>• Используйте === вместо ==</li>
              <li>• Объявляйте переменные перед использованием</li>
              <li>• Избегайте глобальных переменных</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}