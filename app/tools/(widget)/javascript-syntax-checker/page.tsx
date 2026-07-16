'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Code2, Copy, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { JsSyntaxSeo } from './JsSyntaxSeo'
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
	{
		pattern: /Unexpected token \(/,
		suggestion: 'Проверьте расстановку скобок'
	},
	{ pattern: /Unexpected token \)/, suggestion: 'Лишняя закрывающая скобка' },
	{ pattern: /Unexpected token \{/, suggestion: 'Проверьте фигурные скобки' },
	{
		pattern: /Unexpected token \}/,
		suggestion: 'Лишняя закрывающая фигурная скобка'
	},
	{
		pattern: /Unexpected end of input/,
		suggestion: 'Не хватает закрывающей скобки или точки с запятой'
	},
	{
		pattern: /Unexpected identifier/,
		suggestion:
			'Неожиданный идентификатор. Возможно, пропущена запятая или точка с запятой'
	},
	{
		pattern: /Unexpected reserved word/,
		suggestion: 'Используется зарезервированное слово'
	},
	{
		pattern: /Unexpected string/,
		suggestion: 'Неожиданная строка. Проверьте синтаксис'
	},
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
		const ast: any = null

		try {
			// Простая проверка синтаксиса через Function constructor
			try {
				if (sourceType === 'module') {
					// Проверяем модульный синтаксис
					new Function(
						'"use strict"; import { x } from "y"; export default {};'
					)
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
				message: error.message.replace(
					/^Unexpected token.*?:/,
					'Syntax error:'
				),
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
			{
				pattern: /export\s+(default|const|let|var|function|class)/,
				name: 'ES6 exports'
			}
		]

		if (mode === 'es5') {
			for (const feature of es6Features) {
				if (feature.pattern.test(code)) {
					throw new Error(
						`ES6 feature not allowed in ES5 mode: ${feature.name}`
					)
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
					throw new Error(
						`ES2020 feature not allowed in ${mode.toUpperCase()} mode: ${feature.name}`
					)
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
		const functionMatches = code.match(
			/function\s+\w+|\w+\s*:\s*function|\w+\s*=>|\w+\s*:\s*\([^)]*\)\s*=>/g
		)
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
		const exportMatches = code.match(
			/export\s+(default|const|let|var|function|class|{)/g
		)
		stats.exports = exportMatches ? exportMatches.length : 0

		return stats
	}

	const checkForWarnings = (code: string, warnings: string[]) => {
		// Проверка на console.log
		if (code.includes('console.log')) {
			warnings.push(
				'Используется console.log - не забудьте удалить в production'
			)
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
		const highlighted = code
			// Ключевые слова
			.replace(
				/\b(const|let|var|function|class|if|else|for|while|do|switch|case|break|continue|return|try|catch|finally|throw|new|this|super|import|export|default|from|async|await|yield)\b/g,
				'<span class="text-blue-600 dark:text-blue-400">$1</span>'
			)
			// Строки
			.replace(
				/(['"`])([^'"`]*)\1/g,
				'<span class="text-green-600 dark:text-green-400">$1$2$1</span>'
			)
			// Числа
			.replace(
				/\b(\d+)\b/g,
				'<span class="text-purple-600 dark:text-purple-400">$1</span>'
			)
			// Комментарии
			.replace(
				/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
				'<span class="text-gray-500 dark:text-gray-400">$1</span>'
			)

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
			// Сначала схлопываем любое существующее форматирование в одну строку,
			// затем расставляем переносы и отступы заново по вложенности скобок.
			// Благодаря нормализации повторное нажатие даёт тот же результат, а не
			// плодит пробелы.
			const withBreaks = code
				.replace(/\s+/g, ' ')
				.trim()
				.replace(/([{;])/g, '$1\n')
				.replace(/\}/g, '\n}\n')

			let indent = 0
			const formatted = withBreaks
				.split('\n')
				.map(line => line.trim())
				.filter(Boolean)
				.map(line => {
					if (line.startsWith('}')) indent = Math.max(0, indent - 1)
					const out = '  '.repeat(indent) + line
					if (line.endsWith('{')) indent++
					return out
				})
				.join('\n')

			setCode(formatted)
			toast.success('Код отформатирован')
		} catch {
			toast.error('Ошибка форматирования')
		}
	}

	return (
		<div className='mx-auto max-w-5xl'>
			<Card className='space-y-8 p-6 sm:p-8'>
				{/* Быстрый старт: примеры кода + настройки проверки */}
				<div className='space-y-5 border-b pb-7'>
					<div className='space-y-2'>
						<Label className='text-sm font-medium'>Примеры кода</Label>
						<div className='flex flex-wrap gap-2'>
							{CODE_EXAMPLES.map((example, index) => (
								<Button
									key={index}
									onClick={() => loadExample(example)}
									variant='outline'
									size='sm'
									className='text-xs'
									title={example.description}
								>
									{example.name}
								</Button>
							))}
						</div>
					</div>

					<div className='flex flex-wrap items-center gap-x-6 gap-y-3'>
						<div className='flex items-center gap-2'>
							<span className='text-sm text-muted-foreground'>Версия</span>
							{(
								[
									['es5', 'ES5'],
									['es6', 'ES6'],
									['es2020', 'ES2020'],
									['latest', 'Latest']
								] as [ParseMode, string][]
							).map(([value, label]) => (
								<Button
									key={value}
									variant={mode === value ? 'default' : 'outline'}
									size='sm'
									onClick={() => setMode(value)}
								>
									{label}
								</Button>
							))}
						</div>
						<div className='flex items-center gap-2'>
							<Switch
								id='source-type'
								checked={sourceType === 'module'}
								onCheckedChange={checked =>
									setSourceType(checked ? 'module' : 'script')
								}
							/>
							<Label htmlFor='source-type' className='text-sm'>
								Модуль (import/export)
							</Label>
						</div>
						<div className='flex items-center gap-2'>
							<Switch id='jsx' checked={allowJsx} onCheckedChange={setAllowJsx} />
							<Label htmlFor='jsx' className='text-sm'>
								JSX
							</Label>
						</div>
					</div>
				</div>

				{/* Две колонки: ввод кода и результат */}
				<div className='grid gap-8 lg:grid-cols-2 lg:gap-10'>
					{/* Ввод */}
					<div className='space-y-4'>
						<div className='flex items-center justify-between gap-3'>
							<h3 className='text-lg font-semibold'>JavaScript код</h3>
							<div className='flex gap-2'>
								<Button onClick={formatCode} variant='outline' size='sm'>
									Форматировать
								</Button>
								<Button onClick={reset} variant='outline' size='sm'>
									Очистить
								</Button>
							</div>
						</div>
						<Textarea
							id='code-input'
							value={code}
							onChange={e => setCode(e.target.value)}
							placeholder='Вставьте JavaScript код для проверки…'
							className='min-h-[320px] font-mono text-sm'
							spellCheck={false}
						/>
					</div>

					{/* Результат */}
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold'>Результат</h3>
						{result ? (
							<div
								className={cn(
									'rounded-xl border border-l-4 bg-muted/40 p-4',
									result.valid ? 'border-l-green-500' : 'border-l-red-500'
								)}
							>
								<div className='flex items-start gap-3'>
										{result.valid ? (
											<CheckCircle className='w-5 h-5 text-green-600 dark:text-green-400 mt-0.5' />
										) : (
											<XCircle className='w-5 h-5 text-red-600 dark:text-red-400 mt-0.5' />
										)}
										<div className='flex-1'>
											<h3 className='text-base font-semibold text-foreground'>
												{result.valid
													? 'Синтаксис корректен'
													: 'Ошибка синтаксиса'}
											</h3>

											{result.errors.length > 0 && (
												<div className='mt-2 space-y-2'>
													{result.errors.map((error, index) => (
														<div key={index} className='text-sm'>
															<div className='font-medium text-red-800 dark:text-red-200'>
																Строка {error.line}, столбец {error.column}
															</div>
															<div className='text-red-700 dark:text-red-300'>
																{error.message}
															</div>
															{error.suggestion && (
																<div className='text-red-600 dark:text-red-400 italic'>
																	Предложение: {error.suggestion}
																</div>
															)}
														</div>
													))}
												</div>
											)}

											{result.warnings.length > 0 && (
												<div className='mt-3 space-y-1'>
													<p className='text-sm font-medium text-amber-600 dark:text-amber-400'>
														Предупреждения
													</p>
													{result.warnings.map((warning, index) => (
														<div
															key={index}
															className='flex items-start gap-2 text-sm text-amber-600 dark:text-amber-400'
														>
															<AlertCircle className='w-4 h-4 mt-0.5' />
															<span>{warning}</span>
														</div>
													))}
												</div>
											)}

											{result.stats && result.valid && (
												<div className='mt-3 grid grid-cols-3 gap-2 border-t pt-3'>
													{(
														[
															['Функций', result.stats.functions],
															['Переменных', result.stats.variables],
															['Классов', result.stats.classes],
															['Импортов', result.stats.imports],
															['Экспортов', result.stats.exports]
														] as [string, number][]
													).map(([label, value]) => (
														<div
															key={label}
															className='rounded bg-white/60 p-2 text-center dark:bg-black/20'
														>
															<div className='text-xl font-bold text-green-600'>
																{value}
															</div>
															<div className='text-xs text-muted-foreground'>
																{label}
															</div>
														</div>
													))}
												</div>
											)}
											{result.valid && (
												<Button
													onClick={copyResult}
													variant='outline'
													size='sm'
													className='mt-4'
												>
													<Copy className='mr-2 h-4 w-4' />
													Копировать результат
												</Button>
											)}
										</div>
									</div>
								</div>
							) : (
								<div className='flex min-h-[320px] items-center justify-center rounded-xl border border-dashed text-muted-foreground'>
									<div className='space-y-3 text-center'>
										<Code2 className='mx-auto h-12 w-12 opacity-20' />
										<p className='text-sm'>
											Вставьте код — здесь появится результат проверки
										</p>
									</div>
								</div>
							)}
					</div>
				</div>
			</Card>
			<JsSyntaxSeo />
		</div>
	)
}
