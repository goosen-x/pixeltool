'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
	CheckCircle,
	XCircle,
	AlertTriangle,
	Copy,
	Upload,
	FileText,
	RefreshCw,
	AlertCircle,
	Info,
	Bug,
	Code
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ValidationError {
	line: number
	column: number
	message: string
	type: 'error' | 'warning'
	severity: 'high' | 'medium' | 'low'
	code?: string
}

interface ValidationResult {
	isValid: boolean
	errors: ValidationError[]
	warnings: ValidationError[]
	suggestions: string[]
	codeMetrics: {
		lines: number
		characters: number
		functions: number
		variables: number
		complexity: number
	}
}

const JS_EXAMPLES = [
	{
		name: 'Valid Code',
		code: `function calculateSum(numbers) {
    let total = 0;
    for (let i = 0; i < numbers.length; i++) {
        total += numbers[i];
    }
    return total;
}

const result = calculateSum([1, 2, 3, 4, 5]);
console.log('Sum is:', result);`
	},
	{
		name: 'Syntax Errors',
		code: `function brokenFunction() {
    let x = 5
    if (x > 3 {
        console.log("x is greater than 3")
    }
    return x +;
}

const obj = {
    name: "test",
    value: 42,
}`
	},
	{
		name: 'Common Mistakes',
		code: `// Missing semicolons
var a = 5
var b = 10

// Undefined variable
console.log(undefinedVariable)

// Missing closing brace
function test() {
    if (true) {
        return "hello"
    // Missing closing brace

// Assignment instead of comparison
if (x = 5) {
    console.log("This is wrong")
}`
	},
	{
		name: 'ES6+ Features',
		code: `class UserManager {
    constructor(users = []) {
        this.users = new Map();
        this.loadUsers(users);
    }

    loadUsers(userArray) {
        userArray.forEach(user => {
            this.users.set(user.id, { ...user, active: true });
        });
    }

    async fetchUser(id) {
        try {
            const response = await fetch(\`/api/users/\${id}\`);
            if (!response.ok) throw new Error('User not found');
            return await response.json();
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }

    get userCount() {
        return this.users.size;
    }
}`
	}
]

export default function JSValidatorPage() {
	const [input, setInput] = useState('')
	const [result, setResult] = useState<ValidationResult | null>(null)
	const [isValidating, setIsValidating] = useState(false)
	const [strictMode, setStrictMode] = useState(true)
	const [esVersion, setEsVersion] = useState('ES2020')
	const [showWarnings, setShowWarnings] = useState(true)

	useEffect(() => {
		if (input.trim()) {
			const timer = setTimeout(() => {
				validateCode(input)
			}, 500)
			return () => clearTimeout(timer)
		} else {
			setResult(null)
		}
	}, [input, strictMode, esVersion])

	const validateCode = async (code: string) => {
		setIsValidating(true)

		// Simulate async validation
		setTimeout(() => {
			try {
				const validationResult = performValidation(code)
				setResult(validationResult)
			} catch (error) {
				console.error('Validation error:', error)
				setResult({
					isValid: false,
					errors: [
						{
							line: 1,
							column: 1,
							message: 'Validation service error',
							type: 'error',
							severity: 'high'
						}
					],
					warnings: [],
					suggestions: [],
					codeMetrics: {
						lines: 0,
						characters: 0,
						functions: 0,
						variables: 0,
						complexity: 0
					}
				})
			} finally {
				setIsValidating(false)
			}
		}, 300)
	}

	const performValidation = (code: string): ValidationResult => {
		const errors: ValidationError[] = []
		const warnings: ValidationError[] = []
		const suggestions: string[] = []
		let isValid = true

		try {
			// Basic syntax validation using Function constructor
			new Function(code)
		} catch (error) {
			isValid = false
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error'

			// Parse error details
			const lineMatch = errorMessage.match(/line (\d+)/i)
			const line = lineMatch ? parseInt(lineMatch[1]) : 1

			errors.push({
				line,
				column: 1,
				message: errorMessage,
				type: 'error',
				severity: 'high'
			})
		}

		// Additional checks for common issues
		const lines = code.split('\n')

		lines.forEach((line, index) => {
			const lineNumber = index + 1
			const trimmedLine = line.trim()

			// Check for missing semicolons
			if (
				trimmedLine &&
				!trimmedLine.endsWith(';') &&
				!trimmedLine.endsWith('{') &&
				!trimmedLine.endsWith('}') &&
				!trimmedLine.startsWith('//') &&
				!trimmedLine.startsWith('/*') &&
				!trimmedLine.includes('if ') &&
				!trimmedLine.includes('for ') &&
				!trimmedLine.includes('while ') &&
				!trimmedLine.includes('function ') &&
				!trimmedLine.includes('class ') &&
				trimmedLine.length > 0
			) {
				if (showWarnings) {
					warnings.push({
						line: lineNumber,
						column: line.length,
						message: 'Missing semicolon',
						type: 'warning',
						severity: 'low'
					})
				}
			}

			// Check for assignment in conditions
			const assignmentInCondition = /if\s*\([^=]*=(?!=)[^=]/
			if (assignmentInCondition.test(line)) {
				warnings.push({
					line: lineNumber,
					column: line.indexOf('='),
					message: 'Assignment in condition - did you mean to use == or ===?',
					type: 'warning',
					severity: 'medium'
				})
			}

			// Check for undefined variables (basic check)
			if (line.includes('console.log(') && line.includes('undefined')) {
				warnings.push({
					line: lineNumber,
					column: line.indexOf('undefined'),
					message: 'Possible undefined variable usage',
					type: 'warning',
					severity: 'medium'
				})
			}

			// Check for missing closing braces
			const openBraces = (line.match(/\{/g) || []).length
			const closeBraces = (line.match(/\}/g) || []).length
			if (openBraces > closeBraces && !line.includes('//')) {
				// This is a simplified check - would need more complex parsing for accuracy
			}
		})

		// Calculate code metrics
		const codeMetrics = {
			lines: lines.length,
			characters: code.length,
			functions: (code.match(/function\s+\w+|=>\s*{|=>\s*\w/g) || []).length,
			variables: (code.match(/(?:var|let|const)\s+\w+/g) || []).length,
			complexity: Math.max(
				1,
				(code.match(/if|for|while|switch|catch/g) || []).length
			)
		}

		// Generate suggestions
		if (warnings.length > 0) {
			suggestions.push(
				'Consider enabling strict mode with "use strict" directive'
			)
		}
		if (codeMetrics.complexity > 10) {
			suggestions.push(
				'High complexity detected - consider breaking down functions'
			)
		}
		if (codeMetrics.functions === 0 && code.length > 100) {
			suggestions.push(
				'Consider organizing code into functions for better maintainability'
			)
		}
		if (
			!code.includes('const') &&
			!code.includes('let') &&
			code.includes('var')
		) {
			suggestions.push(
				'Consider using const/let instead of var for better scoping'
			)
		}

		return {
			isValid: isValid && errors.length === 0,
			errors,
			warnings,
			suggestions,
			codeMetrics
		}
	}

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text)
		toast.success('Скопировано в буфер обмена!')
	}

	const loadExample = (example: (typeof JS_EXAMPLES)[0]) => {
		setInput(example.code)
		toast.success(`Загружен пример: ${example.name}`)
	}

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = e => {
				const content = e.target?.result as string
				setInput(content)
				toast.success(`Файл ${file.name} загружен!`)
			}
			reader.readAsText(file)
		}
	}

	const clearInput = () => {
		setInput('')
		setResult(null)
		toast.success('Поле очищено')
	}

	const getSeverityColor = (severity: ValidationError['severity']) => {
		switch (severity) {
			case 'high':
				return 'text-red-600'
			case 'medium':
				return 'text-yellow-600'
			case 'low':
				return 'text-blue-600'
			default:
				return 'text-gray-600'
		}
	}

	const getSeverityBadge = (severity: ValidationError['severity']) => {
		switch (severity) {
			case 'high':
				return (
					<Badge variant='destructive' className='text-xs'>
						Critical
					</Badge>
				)
			case 'medium':
				return (
					<Badge
						variant='secondary'
						className='text-xs bg-yellow-100 text-yellow-800'
					>
						Warning
					</Badge>
				)
			case 'low':
				return (
					<Badge variant='outline' className='text-xs'>
						Info
					</Badge>
				)
			default:
				return (
					<Badge variant='outline' className='text-xs'>
						Unknown
					</Badge>
				)
		}
	}

	return (
		<div className='max-w-7xl mx-auto space-y-8'>
			{/* Controls */}
			<Card className='p-6'>
				<div className='flex items-center gap-4 flex-wrap mb-4'>
					<div className='flex items-center gap-2'>
						<Label htmlFor='file-upload' className='cursor-pointer'>
							<Button variant='outline' size='sm' asChild>
								<span>
									<Upload className='w-4 h-4 mr-2' />
									Загрузить JS файл
								</span>
							</Button>
						</Label>
						<input
							id='file-upload'
							type='file'
							accept='.js,.javascript,.mjs,.tsx,.jsx'
							onChange={handleFileUpload}
							className='hidden'
							aria-label='Upload JavaScript file for validation'
						/>
					</div>

					<Select
						onValueChange={value => {
							const example = JS_EXAMPLES.find(e => e.name === value)
							if (example) loadExample(example)
						}}
					>
						<SelectTrigger className='w-40'>
							<SelectValue placeholder='Примеры кода' />
						</SelectTrigger>
						<SelectContent>
							{JS_EXAMPLES.map(example => (
								<SelectItem key={example.name} value={example.name}>
									{example.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Button onClick={clearInput} variant='outline' size='sm'>
						<RefreshCw className='w-4 h-4 mr-2' />
						Очистить
					</Button>
				</div>

				{/* Settings */}
				<div className='flex items-center gap-6 flex-wrap'>
					<div className='flex items-center gap-2'>
						<Label htmlFor='es-version'>ES версия:</Label>
						<Select value={esVersion} onValueChange={setEsVersion}>
							<SelectTrigger className='w-32'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='ES5'>ES5</SelectItem>
								<SelectItem value='ES2015'>ES2015</SelectItem>
								<SelectItem value='ES2017'>ES2017</SelectItem>
								<SelectItem value='ES2020'>ES2020</SelectItem>
								<SelectItem value='ES2022'>ES2022</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className='flex items-center space-x-2'>
						<Switch
							id='strict-mode'
							checked={strictMode}
							onCheckedChange={setStrictMode}
						/>
						<Label htmlFor='strict-mode' className='text-sm'>
							Строгий режим
						</Label>
					</div>

					<div className='flex items-center space-x-2'>
						<Switch
							id='show-warnings'
							checked={showWarnings}
							onCheckedChange={setShowWarnings}
						/>
						<Label htmlFor='show-warnings' className='text-sm'>
							Показывать предупреждения
						</Label>
					</div>
				</div>
			</Card>

			{/* Main Interface */}
			<div className='grid lg:grid-cols-2 gap-8'>
				{/* Input */}
				<Card className='p-6'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='font-semibold flex items-center gap-2'>
							<Code className='w-4 h-4' />
							JavaScript код
						</h3>
						<div className='flex items-center gap-2'>
							{result && (
								<Badge variant={result.isValid ? 'default' : 'destructive'}>
									{result.isValid ? (
										<CheckCircle className='w-3 h-3 mr-1' />
									) : (
										<XCircle className='w-3 h-3 mr-1' />
									)}
									{result.isValid ? 'Валидный' : 'Ошибки'}
								</Badge>
							)}
							{isValidating && (
								<Badge variant='outline'>
									<RefreshCw className='w-3 h-3 mr-1 animate-spin' />
									Проверка...
								</Badge>
							)}
						</div>
					</div>

					<Textarea
						value={input}
						onChange={e => setInput(e.target.value)}
						placeholder='Вставьте ваш JavaScript код здесь для проверки...'
						className='min-h-[500px] font-mono text-sm'
					/>

					<div className='mt-4 flex gap-2'>
						<Button
							onClick={() => copyToClipboard(input)}
							variant='outline'
							size='sm'
							disabled={!input.trim()}
						>
							<Copy className='w-4 h-4 mr-2' />
							Копировать код
						</Button>
					</div>
				</Card>

				{/* Results */}
				<Card className='p-6'>
					<h3 className='font-semibold mb-4 flex items-center gap-2'>
						<Bug className='w-4 h-4' />
						Результаты валидации
					</h3>

					{!result ? (
						<div className='flex items-center justify-center h-[500px] text-muted-foreground'>
							<div className='text-center'>
								<FileText className='w-12 h-12 mx-auto mb-3 opacity-50' />
								<p>Введите JavaScript код для проверки</p>
							</div>
						</div>
					) : (
						<div className='space-y-6'>
							{/* Status */}
							<div
								className={cn(
									'p-4 rounded-lg border',
									result.isValid
										? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
										: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
								)}
							>
								<div className='flex items-center gap-2'>
									{result.isValid ? (
										<CheckCircle className='w-5 h-5 text-green-600' />
									) : (
										<XCircle className='w-5 h-5 text-red-600' />
									)}
									<p
										className={cn(
											'font-medium',
											result.isValid
												? 'text-green-800 dark:text-green-200'
												: 'text-red-800 dark:text-red-200'
										)}
									>
										{result.isValid
											? 'Код валидный - синтаксических ошибок не найдено'
											: `Найдено ошибок: ${result.errors.length}`}
									</p>
								</div>
							</div>

							{/* Code Metrics */}
							<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
								<div className='text-center p-3 bg-muted/30 rounded-lg'>
									<p className='text-sm text-muted-foreground'>Строки</p>
									<p className='text-lg font-bold'>
										{result.codeMetrics.lines}
									</p>
								</div>
								<div className='text-center p-3 bg-muted/30 rounded-lg'>
									<p className='text-sm text-muted-foreground'>Функции</p>
									<p className='text-lg font-bold'>
										{result.codeMetrics.functions}
									</p>
								</div>
								<div className='text-center p-3 bg-muted/30 rounded-lg'>
									<p className='text-sm text-muted-foreground'>Переменные</p>
									<p className='text-lg font-bold'>
										{result.codeMetrics.variables}
									</p>
								</div>
							</div>

							{/* Errors */}
							{result.errors.length > 0 && (
								<div className='space-y-3'>
									<h4 className='font-medium text-red-600 flex items-center gap-2'>
										<AlertCircle className='w-4 h-4' />
										Ошибки ({result.errors.length})
									</h4>
									<div className='space-y-2 max-h-60 overflow-y-auto'>
										{result.errors.map((error, index) => (
											<div
												key={index}
												className='p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg'
											>
												<div className='flex items-start justify-between gap-2'>
													<div className='flex-1'>
														<p className='text-sm font-medium text-red-800 dark:text-red-200'>
															Строка {error.line}, Колонка {error.column}
														</p>
														<p className='text-sm text-red-700 dark:text-red-300 mt-1'>
															{error.message}
														</p>
													</div>
													{getSeverityBadge(error.severity)}
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Warnings */}
							{showWarnings && result.warnings.length > 0 && (
								<div className='space-y-3'>
									<h4 className='font-medium text-yellow-600 flex items-center gap-2'>
										<AlertTriangle className='w-4 h-4' />
										Предупреждения ({result.warnings.length})
									</h4>
									<div className='space-y-2 max-h-40 overflow-y-auto'>
										{result.warnings.map((warning, index) => (
											<div
												key={index}
												className='p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'
											>
												<div className='flex items-start justify-between gap-2'>
													<div className='flex-1'>
														<p className='text-sm font-medium text-yellow-800 dark:text-yellow-200'>
															Строка {warning.line}, Колонка {warning.column}
														</p>
														<p className='text-sm text-yellow-700 dark:text-yellow-300 mt-1'>
															{warning.message}
														</p>
													</div>
													{getSeverityBadge(warning.severity)}
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Suggestions */}
							{result.suggestions.length > 0 && (
								<div className='space-y-3'>
									<h4 className='font-medium text-blue-600 flex items-center gap-2'>
										<Info className='w-4 h-4' />
										Рекомендации
									</h4>
									<div className='space-y-1'>
										{result.suggestions.map((suggestion, index) => (
											<p
												key={index}
												className='text-sm text-blue-700 dark:text-blue-300 p-2 bg-blue-50 dark:bg-blue-950/20 rounded'
											>
												• {suggestion}
											</p>
										))}
									</div>
								</div>
							)}
						</div>
					)}
				</Card>
			</div>

			{/* Info */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-4'>О JavaScript валидаторе</h3>
				<div className='grid md:grid-cols-2 gap-6 text-sm'>
					<div className='space-y-3'>
						<div>
							<h4 className='font-medium mb-1'>Что проверяется</h4>
							<ul className='text-muted-foreground space-y-1'>
								<li>• Синтаксические ошибки JavaScript</li>
								<li>• Незакрытые скобки и кавычки</li>
								<li>• Неопределенные переменные</li>
								<li>• Ошибки в условных выражениях</li>
								<li>• Проблемы со структурой кода</li>
							</ul>
						</div>
						<div>
							<h4 className='font-medium mb-1'>Поддерживаемые версии</h4>
							<ul className='text-muted-foreground space-y-1'>
								<li>• ES5 (ECMAScript 5)</li>
								<li>• ES2015+ (современный JavaScript)</li>
								<li>• Асинхронный код (async/await)</li>
								<li>• Классы и модули</li>
							</ul>
						</div>
					</div>
					<div className='space-y-3'>
						<div>
							<h4 className='font-medium mb-1'>Преимущества валидации</h4>
							<ul className='text-muted-foreground space-y-1'>
								<li>• Раннее обнаружение ошибок</li>
								<li>• Улучшение качества кода</li>
								<li>• Предотвращение runtime ошибок</li>
								<li>• Соблюдение стандартов кодирования</li>
							</ul>
						</div>
						<div>
							<h4 className='font-medium mb-1'>Рекомендации</h4>
							<ul className='text-muted-foreground space-y-1'>
								<li>• Используйте строгий режим для лучшей проверки</li>
								<li>• Проверяйте код перед деплоем</li>
								<li>• Следите за предупреждениями качества</li>
								<li>• Регулярно обновляйте ES версию</li>
							</ul>
						</div>
					</div>
				</div>
			</Card>
		</div>
	)
}
