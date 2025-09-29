'use client'

// Force dynamic rendering to avoid build-time errors
export const dynamic = 'force-dynamic'

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
import {
	Code,
	CheckCircle,
	AlertCircle,
	XCircle,
	Copy,
	RefreshCw,
	FileCode,
	Info,
	Lightbulb,
	Terminal,
	Eye
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type PHPVersion = 'php5' | 'php7' | 'php8'
type ErrorSeverity = 'error' | 'warning' | 'notice'

interface PHPError {
	line: number
	column: number
	message: string
	severity: ErrorSeverity
	type: string
}

interface SyntaxCheckResult {
	isValid: boolean
	errors: PHPError[]
	warnings: PHPError[]
	notices: PHPError[]
	phpVersion: PHPVersion
}

const PHP_EXAMPLES = {
	valid: `<?php
class HelloWorld {
    private $message;
    
    public function __construct($message = "Hello, World!") {
        $this->message = $message;
    }
    
    public function say(): string {
        return $this->message;
    }
}

$hello = new HelloWorld();
echo $hello->say();
?>`,

	invalid: `<?php
class HelloWorld {
    private $message
    
    public function __construct($message = "Hello, World!") {
        $this->message = $message;
    }
    
    public function say() string {
        return $this->message;
    }
}

$hello = new HelloWorld();
echo $hello->say()
?>`,

	php8: `<?php
class User {
    public function __construct(
        public string $name,
        public int $age,
        public string $email
    ) {}
    
    public function getInfo(): array {
        return match($this->age) {
            0...17 => ['status' => 'minor'],
            18...64 => ['status' => 'adult'],
            default => ['status' => 'senior']
        };
    }
}

$user = new User("John", 25, "john@example.com");
echo json_encode($user->getInfo());
?>`
}

export default function PHPSyntaxCheckerPage() {
	const [phpCode, setPhpCode] = useState('')
	const [phpVersion, setPhpVersion] = useState<PHPVersion>('php8')
	const [checkResult, setCheckResult] = useState<SyntaxCheckResult | null>(null)
	const [isChecking, setIsChecking] = useState(false)
	const [showLineNumbers, setShowLineNumbers] = useState(true)

	// Auto-check when code changes
	useEffect(() => {
		if (phpCode.trim()) {
			const timer = setTimeout(() => {
				checkSyntax()
			}, 1000)
			return () => clearTimeout(timer)
		} else {
			setCheckResult(null)
		}
	}, [phpCode, phpVersion])

	const checkSyntax = async () => {
		setIsChecking(true)

		setTimeout(() => {
			try {
				const result = validatePHPSyntax(phpCode, phpVersion)
				setCheckResult(result)
			} catch (error) {
				toast.error('Ошибка при проверке синтаксиса')
				console.error('PHP syntax check error:', error)
			} finally {
				setIsChecking(false)
			}
		}, 300)
	}

	const validatePHPSyntax = (
		code: string,
		version: PHPVersion
	): SyntaxCheckResult => {
		const errors: PHPError[] = []
		const warnings: PHPError[] = []
		const notices: PHPError[] = []

		const lines = code.split('\n')

		// Basic PHP syntax validation
		let inPhpTags = false
		let braceCount = 0
		let parenCount = 0
		let inString = false
		let stringChar = ''

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i]
			const lineNum = i + 1

			// Check for PHP opening/closing tags
			if (line.includes('<?php')) {
				inPhpTags = true
			}
			if (line.includes('?>')) {
				inPhpTags = false
			}

			if (!inPhpTags && line.trim() && !line.includes('<?php')) {
				notices.push({
					line: lineNum,
					column: 1,
					message: 'Code outside PHP tags',
					severity: 'notice',
					type: 'syntax'
				})
			}

			if (inPhpTags) {
				// Check for common syntax errors

				// Missing semicolons (basic check)
				if (
					line.trim() &&
					!line.trim().endsWith(';') &&
					!line.trim().endsWith('{') &&
					!line.trim().endsWith('}') &&
					!line.includes('?>') &&
					!line.includes('<?php') &&
					!line.trim().startsWith('//') &&
					!line.trim().startsWith('/*') &&
					!line.trim().startsWith('*') &&
					!line.includes('if') &&
					!line.includes('else') &&
					!line.includes('for') &&
					!line.includes('while') &&
					!line.includes('foreach') &&
					!line.includes('function') &&
					!line.includes('class') &&
					!line.includes('interface') &&
					!line.includes('namespace')
				) {
					const trimmed = line.trim()
					if (
						trimmed.length > 0 &&
						!trimmed.endsWith(':') &&
						!trimmed.startsWith('}') &&
						(trimmed.includes('=') ||
							trimmed.includes('echo') ||
							trimmed.includes('return'))
					) {
						errors.push({
							line: lineNum,
							column: line.length,
							message: 'Missing semicolon',
							severity: 'error',
							type: 'syntax'
						})
					}
				}

				// Check for unmatched braces
				for (let j = 0; j < line.length; j++) {
					const char = line[j]

					if (!inString) {
						if (char === '"' || char === "'") {
							inString = true
							stringChar = char
						} else if (char === '{') {
							braceCount++
						} else if (char === '}') {
							braceCount--
						} else if (char === '(') {
							parenCount++
						} else if (char === ')') {
							parenCount--
						}
					} else {
						if (char === stringChar && line[j - 1] !== '\\') {
							inString = false
							stringChar = ''
						}
					}
				}

				// Check for variable syntax
				const varMatches = line.match(/\$[a-zA-Z_][a-zA-Z0-9_]*/g)
				if (varMatches) {
					varMatches.forEach(variable => {
						if (!/^\$[a-zA-Z_][a-zA-Z0-9_]*$/.test(variable)) {
							errors.push({
								line: lineNum,
								column: line.indexOf(variable) + 1,
								message: `Invalid variable name: ${variable}`,
								severity: 'error',
								type: 'variable'
							})
						}
					})
				}

				// PHP version-specific checks
				if (version === 'php5') {
					// PHP 5 doesn't support some features
					if (line.includes('??')) {
						errors.push({
							line: lineNum,
							column: line.indexOf('??') + 1,
							message:
								'Null coalescing operator (??) is not supported in PHP 5',
							severity: 'error',
							type: 'version'
						})
					}
					if (line.includes('...')) {
						errors.push({
							line: lineNum,
							column: line.indexOf('...') + 1,
							message: 'Variadic functions are not supported in PHP 5',
							severity: 'error',
							type: 'version'
						})
					}
				}

				if (version !== 'php8') {
					// PHP 8 specific features
					if (line.includes('match(')) {
						errors.push({
							line: lineNum,
							column: line.indexOf('match(') + 1,
							message: 'Match expressions are only supported in PHP 8+',
							severity: 'error',
							type: 'version'
						})
					}
					if (
						line.includes('public string') ||
						line.includes('private string') ||
						line.includes('protected string')
					) {
						errors.push({
							line: lineNum,
							column: 1,
							message:
								'Constructor property promotion is only supported in PHP 8+',
							severity: 'error',
							type: 'version'
						})
					}
				}

				// Common warnings
				if (line.includes('mysql_')) {
					warnings.push({
						line: lineNum,
						column: line.indexOf('mysql_') + 1,
						message:
							'mysql_ functions are deprecated, use mysqli_ or PDO instead',
						severity: 'warning',
						type: 'deprecated'
					})
				}

				if (line.includes('ereg')) {
					warnings.push({
						line: lineNum,
						column: line.indexOf('ereg') + 1,
						message:
							'ereg functions are deprecated, use preg_ functions instead',
						severity: 'warning',
						type: 'deprecated'
					})
				}
			}
		}

		// Check for unmatched braces at the end
		if (braceCount !== 0) {
			errors.push({
				line: lines.length,
				column: 1,
				message:
					braceCount > 0 ? 'Missing closing brace' : 'Extra closing brace',
				severity: 'error',
				type: 'syntax'
			})
		}

		if (parenCount !== 0) {
			errors.push({
				line: lines.length,
				column: 1,
				message:
					parenCount > 0
						? 'Missing closing parenthesis'
						: 'Extra closing parenthesis',
				severity: 'error',
				type: 'syntax'
			})
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings,
			notices,
			phpVersion: version
		}
	}

	const loadExample = (type: keyof typeof PHP_EXAMPLES) => {
		setPhpCode(PHP_EXAMPLES[type])
		toast.success('Пример загружен')
	}

	const clearCode = () => {
		setPhpCode('')
		setCheckResult(null)
		toast.success('Код очищен')
	}

	const copyCode = () => {
		navigator.clipboard.writeText(phpCode)
		toast.success('Код скопирован в буфер обмена!')
	}

	const getErrorIcon = (severity: ErrorSeverity) => {
		switch (severity) {
			case 'error':
				return <XCircle className='w-4 h-4 text-red-500' />
			case 'warning':
				return <AlertCircle className='w-4 h-4 text-yellow-500' />
			case 'notice':
				return <Info className='w-4 h-4 text-blue-500' />
		}
	}

	const getErrorBadgeVariant = (severity: ErrorSeverity) => {
		switch (severity) {
			case 'error':
				return 'destructive'
			case 'warning':
				return 'default'
			case 'notice':
				return 'secondary'
			default:
				return 'outline'
		}
	}

	return (
		<div className='max-w-7xl mx-auto space-y-6'>
			{/* Controls */}
			<Card className='p-4'>
				<div className='flex items-center justify-between flex-wrap gap-4'>
					<div className='flex items-center gap-4'>
						<div>
							<Label htmlFor='php-version'>Версия PHP:</Label>
							<Select
								value={phpVersion}
								onValueChange={(value: PHPVersion) => setPhpVersion(value)}
							>
								<SelectTrigger className='w-32'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='php5'>PHP 5.x</SelectItem>
									<SelectItem value='php7'>PHP 7.x</SelectItem>
									<SelectItem value='php8'>PHP 8.x</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<Button
							onClick={() => setShowLineNumbers(!showLineNumbers)}
							variant='outline'
							size='sm'
						>
							<Eye className='w-4 h-4 mr-2' />
							{showLineNumbers ? 'Скрыть номера' : 'Показать номера'}
						</Button>
					</div>

					<div className='flex items-center gap-2'>
						<Button
							onClick={() => loadExample('valid')}
							variant='outline'
							size='sm'
						>
							Валидный код
						</Button>
						<Button
							onClick={() => loadExample('invalid')}
							variant='outline'
							size='sm'
						>
							С ошибками
						</Button>
						<Button
							onClick={() => loadExample('php8')}
							variant='outline'
							size='sm'
						>
							PHP 8
						</Button>
						<Button onClick={copyCode} variant='outline' size='sm'>
							<Copy className='w-4 h-4 mr-2' />
							Копировать
						</Button>
						<Button onClick={clearCode} variant='outline' size='sm'>
							<RefreshCw className='w-4 h-4 mr-2' />
							Очистить
						</Button>
					</div>
				</div>
			</Card>

			{/* Code Editor */}
			<Card className='p-6'>
				<Label htmlFor='php-code' className='mb-2 block'>
					PHP код
				</Label>
				<div className='relative'>
					<Textarea
						id='php-code'
						value={phpCode}
						onChange={e => setPhpCode(e.target.value)}
						placeholder='Вставьте ваш PHP код здесь...'
						className='min-h-96 font-mono text-sm'
						style={{
							lineHeight: '1.5',
							tabSize: 4
						}}
					/>
					{showLineNumbers && (
						<div className='absolute left-2 top-3 text-xs text-muted-foreground pointer-events-none select-none font-mono leading-6'>
							{phpCode.split('\n').map((_, index) => (
								<div key={index} className='h-6'>
									{index + 1}
								</div>
							))}
						</div>
					)}
				</div>

				{isChecking && (
					<div className='mt-4 flex items-center gap-2 text-sm text-muted-foreground'>
						<RefreshCw className='w-4 h-4 animate-spin' />
						Проверка синтаксиса...
					</div>
				)}
			</Card>

			{/* Results */}
			{checkResult && (
				<>
					{/* Status */}
					<Card className='p-4'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-3'>
								{checkResult.isValid ? (
									<>
										<CheckCircle className='w-6 h-6 text-green-500' />
										<div>
											<h3 className='font-semibold text-green-700 dark:text-green-400'>
												Синтаксис корректен
											</h3>
											<p className='text-sm text-muted-foreground'>
												Код прошел проверку для {phpVersion.toUpperCase()}
											</p>
										</div>
									</>
								) : (
									<>
										<XCircle className='w-6 h-6 text-red-500' />
										<div>
											<h3 className='font-semibold text-red-700 dark:text-red-400'>
												Найдены ошибки в коде
											</h3>
											<p className='text-sm text-muted-foreground'>
												Обнаружено {checkResult.errors.length} ошибок
											</p>
										</div>
									</>
								)}
							</div>

							<div className='flex items-center gap-2'>
								<Badge variant={getErrorBadgeVariant('error')}>
									{checkResult.errors.length} ошибок
								</Badge>
								<Badge variant={getErrorBadgeVariant('warning')}>
									{checkResult.warnings.length} предупреждений
								</Badge>
								<Badge variant={getErrorBadgeVariant('notice')}>
									{checkResult.notices.length} уведомлений
								</Badge>
							</div>
						</div>
					</Card>

					{/* Error Details */}
					{(checkResult.errors.length > 0 ||
						checkResult.warnings.length > 0 ||
						checkResult.notices.length > 0) && (
						<Card className='p-6'>
							<h3 className='font-semibold mb-4 flex items-center gap-2'>
								<Terminal className='w-5 h-5' />
								Детали проверки
							</h3>

							<div className='space-y-3 max-h-96 overflow-auto'>
								{[
									...checkResult.errors,
									...checkResult.warnings,
									...checkResult.notices
								]
									.sort((a, b) => a.line - b.line)
									.map((issue, index) => (
										<div
											key={index}
											className={cn(
												'p-3 rounded-lg border-l-4 bg-muted/30',
												issue.severity === 'error' &&
													'border-red-500 bg-red-50 dark:bg-red-950/20',
												issue.severity === 'warning' &&
													'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20',
												issue.severity === 'notice' &&
													'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
											)}
										>
											<div className='flex items-start gap-3'>
												{getErrorIcon(issue.severity)}
												<div className='flex-1 min-w-0'>
													<div className='flex items-center gap-2 mb-1'>
														<Badge variant='outline' className='text-xs'>
															Строка {issue.line}
														</Badge>
														<Badge variant='outline' className='text-xs'>
															{issue.type}
														</Badge>
													</div>
													<p className='text-sm font-medium'>{issue.message}</p>
												</div>
											</div>
										</div>
									))}
							</div>
						</Card>
					)}
				</>
			)}

			{!checkResult && !isChecking && (
				<Card className='p-6'>
					<div className='flex items-center justify-center h-40 text-muted-foreground'>
						<div className='text-center'>
							<FileCode className='w-12 h-12 mx-auto mb-3 opacity-50' />
							<p>Введите PHP код для проверки синтаксиса</p>
							<p className='text-sm mt-2'>
								Результат будет показан автоматически
							</p>
						</div>
					</div>
				</Card>
			)}

			{/* Tips */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-4 flex items-center gap-2'>
					<Lightbulb className='w-4 h-4' />
					Советы по PHP
				</h3>
				<div className='grid md:grid-cols-2 gap-6 text-sm'>
					<div>
						<h4 className='font-medium mb-2'>Основные правила</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>• Всегда заканчивайте инструкции точкой с запятой</li>
							<li>• Используйте правильные открывающие теги &lt;?php</li>
							<li>• Следите за балансом скобок и кавычек</li>
							<li>• Имена переменных должны начинаться с $</li>
						</ul>
					</div>
					<div>
						<h4 className='font-medium mb-2'>Различия версий</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>
								• <strong>PHP 5</strong>: Базовый ООП, нет современного
								синтаксиса
							</li>
							<li>
								• <strong>PHP 7</strong>: Типизация, null coalescing operator
							</li>
							<li>
								• <strong>PHP 8</strong>: Match expressions, constructor
								properties
							</li>
							<li>• Избегайте устаревших функций (mysql_, ereg)</li>
						</ul>
					</div>
				</div>
			</Card>

			{/* Info */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-4 flex items-center gap-2'>
					<Info className='w-4 h-4' />О проверке синтаксиса
				</h3>
				<div className='grid md:grid-cols-3 gap-6 text-sm'>
					<div>
						<h4 className='font-medium mb-2'>Что проверяется</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>• Синтаксические ошибки</li>
							<li>• Несбалансированные скобки</li>
							<li>• Неправильные имена переменных</li>
							<li>• Совместимость с версией PHP</li>
						</ul>
					</div>
					<div>
						<h4 className='font-medium mb-2'>Типы сообщений</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>
								• <span className='text-red-600 font-medium'>Ошибки</span> -
								критические проблемы
							</li>
							<li>
								•{' '}
								<span className='text-yellow-600 font-medium'>
									Предупреждения
								</span>{' '}
								- потенциальные проблемы
							</li>
							<li>
								• <span className='text-blue-600 font-medium'>Уведомления</span>{' '}
								- рекомендации
							</li>
						</ul>
					</div>
					<div>
						<h4 className='font-medium mb-2'>Ограничения</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>• Базовая проверка синтаксиса</li>
							<li>• Не проверяет логику выполнения</li>
							<li>• Не валидирует подключаемые файлы</li>
							<li>• Работает в браузере без сервера</li>
						</ul>
					</div>
				</div>
			</Card>
		</div>
	)
}
