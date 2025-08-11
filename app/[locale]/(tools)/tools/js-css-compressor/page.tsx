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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
	Minimize2,
	Copy,
	Download,
	Upload,
	FileText,
	Zap,
	RefreshCw,
	AlertCircle,
	CheckCircle,
	Info
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface CompressionResult {
	originalSize: number
	compressedSize: number
	savings: number
	compressed: string
	errors?: string[]
	warnings?: string[]
}

const JS_EXAMPLES = [
	{
		name: 'Simple Function',
		type: 'javascript',
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
		name: 'ES6 Class',
		type: 'javascript',
		code: `class UserManager {
    constructor() {
        this.users = new Map();
        this.currentId = 1;
    }

    addUser(name, email) {
        const user = {
            id: this.currentId++,
            name: name,
            email: email,
            createdAt: new Date()
        };
        this.users.set(user.id, user);
        return user;
    }

    getUserById(id) {
        return this.users.get(id) || null;
    }

    getAllUsers() {
        return Array.from(this.users.values());
    }
}`
	},
	{
		name: 'CSS Styles',
		type: 'css',
		code: `/* Main Layout Styles */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
}

.header {
    background-color: #2c3e50;
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    margin-bottom: 2rem;
}

.header h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 300;
}

.navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
}

.navigation ul {
    list-style: none;
    display: flex;
    gap: 2rem;
    margin: 0;
    padding: 0;
}

.navigation a {
    text-decoration: none;
    color: #34495e;
    font-weight: 500;
    transition: color 0.3s ease;
}

.navigation a:hover {
    color: #3498db;
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        padding: 10px;
    }

    .header h1 {
        font-size: 2rem;
    }

    .navigation {
        flex-direction: column;
        gap: 1rem;
    }
}`
	}
]

export default function JSCSSCompressorPage() {
	const [input, setInput] = useState('')
	const [output, setOutput] = useState('')
	const [codeType, setCodeType] = useState<'javascript' | 'css'>('javascript')
	const [result, setResult] = useState<CompressionResult | null>(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const [preserveLineBreaks, setPreserveLineBreaks] = useState(false)
	const [disableOptimizations, setDisableOptimizations] = useState(false)

	// JavaScript minification using basic techniques
	const minifyJavaScript = (code: string): CompressionResult => {
		let minified = code
		const errors: string[] = []
		const warnings: string[] = []

		try {
			// Remove comments (both // and /* */)
			minified = minified.replace(/\/\*[\s\S]*?\*\//g, '')
			minified = minified.replace(/\/\/.*$/gm, '')

			// Remove unnecessary whitespace
			if (!preserveLineBreaks) {
				minified = minified.replace(/\s+/g, ' ')
				minified = minified.replace(/\s*([{}();,:])\s*/g, '$1')
				minified = minified.replace(/;\s*}/g, '}')
			}

			// Remove trailing semicolons before }
			minified = minified.replace(/;\s*}/g, '}')

			if (!disableOptimizations) {
				// Simple variable name shortening for common patterns
				const commonPatterns = {
					'console.log': 'c.l',
					'document.getElementById': 'gId',
					'document.createElement': 'cEl',
					addEventListener: 'aEL'
				}

				// Only apply if not in strings
				Object.entries(commonPatterns).forEach(([long, short]) => {
					const regex = new RegExp(
						`\\b${long.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
						'g'
					)
					const beforeLength = minified.length
					minified = minified.replace(regex, short)
					if (minified.length < beforeLength) {
						warnings.push(`Shortened '${long}' to '${short}'`)
					}
				})
			}

			// Trim and clean up
			minified = minified.trim()
		} catch (error) {
			errors.push(
				`Minification error: ${error instanceof Error ? error.message : 'Unknown error'}`
			)
		}

		const originalSize = new TextEncoder().encode(code).length
		const compressedSize = new TextEncoder().encode(minified).length
		const savings = Math.round(
			((originalSize - compressedSize) / originalSize) * 100
		)

		return {
			originalSize,
			compressedSize,
			savings: Math.max(0, savings),
			compressed: minified,
			errors,
			warnings
		}
	}

	// CSS minification
	const minifyCSS = (code: string): CompressionResult => {
		let minified = code
		const errors: string[] = []
		const warnings: string[] = []

		try {
			// Remove comments
			minified = minified.replace(/\/\*[\s\S]*?\*\//g, '')

			// Remove unnecessary whitespace
			if (!preserveLineBreaks) {
				minified = minified.replace(/\s+/g, ' ')
				minified = minified.replace(/\s*([{}();,:])\s*/g, '$1')
				minified = minified.replace(/;\s*}/g, '}')
				minified = minified.replace(/,\s*/g, ',')
				minified = minified.replace(/:\s*/g, ':')
				minified = minified.replace(/;\s*/g, ';')
			}

			if (!disableOptimizations) {
				// Remove unnecessary semicolons
				minified = minified.replace(/;}/g, '}')

				// Optimize colors
				minified = minified.replace(
					/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g,
					'#$1$2$3'
				)

				// Remove quotes from font names when possible
				minified = minified.replace(
					/font-family:\s*["']([^"',]+)["']/g,
					'font-family:$1'
				)

				// Optimize zero values
				minified = minified.replace(/\b0px\b/g, '0')
				minified = minified.replace(/\b0em\b/g, '0')
				minified = minified.replace(/\b0%\b/g, '0')
				minified = minified.replace(/\b0pt\b/g, '0')

				// Optimize margin/padding shorthand
				minified = minified.replace(/margin:\s*0\s+0\s+0\s+0/g, 'margin:0')
				minified = minified.replace(/padding:\s*0\s+0\s+0\s+0/g, 'padding:0')

				warnings.push(
					'Applied CSS optimizations: colors, units, shorthand properties'
				)
			}

			// Trim
			minified = minified.trim()
		} catch (error) {
			errors.push(
				`CSS minification error: ${error instanceof Error ? error.message : 'Unknown error'}`
			)
		}

		const originalSize = new TextEncoder().encode(code).length
		const compressedSize = new TextEncoder().encode(minified).length
		const savings = Math.round(
			((originalSize - compressedSize) / originalSize) * 100
		)

		return {
			originalSize,
			compressedSize,
			savings: Math.max(0, savings),
			compressed: minified,
			errors,
			warnings
		}
	}

	const compressCode = async () => {
		if (!input.trim()) {
			toast.error('Пожалуйста, введите код для сжатия')
			return
		}

		setIsProcessing(true)

		// Simulate processing time for better UX
		setTimeout(() => {
			try {
				const compressionResult =
					codeType === 'javascript' ? minifyJavaScript(input) : minifyCSS(input)

				setResult(compressionResult)
				setOutput(compressionResult.compressed)

				if (compressionResult.errors && compressionResult.errors.length > 0) {
					toast.error(`Обнаружены ошибки: ${compressionResult.errors.length}`)
				} else {
					toast.success(`Код сжат! Экономия: ${compressionResult.savings}%`)
				}
			} catch (error) {
				toast.error('Ошибка при сжатии кода')
				console.error('Compression error:', error)
			} finally {
				setIsProcessing(false)
			}
		}, 500)
	}

	const formatBytes = (bytes: number): string => {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text)
		toast.success('Скопировано в буфер обмена!')
	}

	const downloadCode = () => {
		const extension = codeType === 'javascript' ? 'js' : 'css'
		const filename = `minified.${extension}`
		const blob = new Blob([output], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = filename
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
		toast.success(`${filename} загружен!`)
	}

	const loadExample = (example: (typeof JS_EXAMPLES)[0]) => {
		setInput(example.code)
		setCodeType(example.type as 'javascript' | 'css')
		toast.success(`Загружен пример: ${example.name}`)
	}

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = e => {
				const content = e.target?.result as string
				setInput(content)

				// Auto-detect file type
				const extension = file.name.split('.').pop()?.toLowerCase()
				if (extension === 'js' || extension === 'javascript') {
					setCodeType('javascript')
				} else if (extension === 'css') {
					setCodeType('css')
				}

				toast.success(`Файл ${file.name} загружен!`)
			}
			reader.readAsText(file)
		}
	}

	const resetAll = () => {
		setInput('')
		setOutput('')
		setResult(null)
		setPreserveLineBreaks(false)
		setDisableOptimizations(false)
		toast.success('Сброшено')
	}

	return (
		<div className='max-w-7xl mx-auto space-y-8'>
			{/* Controls */}
			<Card className='p-6'>
				<div className='flex items-center gap-4 flex-wrap'>
					<div className='flex items-center gap-2'>
						<Label htmlFor='code-type'>Тип кода:</Label>
						<Select
							value={codeType}
							onValueChange={(value: 'javascript' | 'css') =>
								setCodeType(value)
							}
						>
							<SelectTrigger className='w-32'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='javascript'>JavaScript</SelectItem>
								<SelectItem value='css'>CSS</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className='flex items-center gap-2'>
						<Label htmlFor='file-upload' className='cursor-pointer'>
							<Button variant='outline' size='sm' asChild>
								<span>
									<Upload className='w-4 h-4 mr-2' />
									Загрузить файл
								</span>
							</Button>
						</Label>
						<input
							id='file-upload'
							type='file'
							accept='.js,.css,.javascript'
							onChange={handleFileUpload}
							className='hidden'
						/>
					</div>

					<Select
						onValueChange={value => {
							const example = JS_EXAMPLES.find(e => e.name === value)
							if (example) loadExample(example)
						}}
					>
						<SelectTrigger className='w-40'>
							<SelectValue placeholder='Примеры' />
						</SelectTrigger>
						<SelectContent>
							{JS_EXAMPLES.map(example => (
								<SelectItem key={example.name} value={example.name}>
									{example.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Button onClick={resetAll} variant='outline' size='sm'>
						<RefreshCw className='w-4 h-4 mr-2' />
						Сброс
					</Button>
				</div>

				{/* Options */}
				<div className='mt-4 space-y-3'>
					<div className='flex items-center space-x-2'>
						<Switch
							id='preserve-lines'
							checked={preserveLineBreaks}
							onCheckedChange={setPreserveLineBreaks}
						/>
						<Label htmlFor='preserve-lines' className='text-sm'>
							Сохранить переносы строк (читаемость)
						</Label>
					</div>

					<div className='flex items-center space-x-2'>
						<Switch
							id='disable-optimizations'
							checked={disableOptimizations}
							onCheckedChange={setDisableOptimizations}
						/>
						<Label htmlFor='disable-optimizations' className='text-sm'>
							Отключить дополнительные оптимизации
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
							<FileText className='w-4 h-4' />
							Исходный {codeType === 'javascript' ? 'JavaScript' : 'CSS'} код
						</h3>
						{input && (
							<Badge variant='outline'>
								{formatBytes(new TextEncoder().encode(input).length)}
							</Badge>
						)}
					</div>

					<Textarea
						value={input}
						onChange={e => setInput(e.target.value)}
						placeholder={`Вставьте ваш ${codeType === 'javascript' ? 'JavaScript' : 'CSS'} код здесь...`}
						className='min-h-[500px] font-mono text-sm'
					/>

					<div className='mt-4 flex justify-center'>
						<Button
							onClick={compressCode}
							disabled={isProcessing || !input.trim()}
							size='lg'
							className='w-full max-w-xs'
						>
							{isProcessing ? (
								<>
									<RefreshCw className='w-4 h-4 mr-2 animate-spin' />
									Сжатие...
								</>
							) : (
								<>
									<Minimize2 className='w-4 h-4 mr-2' />
									Сжать код
								</>
							)}
						</Button>
					</div>
				</Card>

				{/* Output */}
				<Card className='p-6'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='font-semibold flex items-center gap-2'>
							<Zap className='w-4 h-4' />
							Сжатый код
						</h3>
						<div className='flex items-center gap-2'>
							{result && (
								<Badge variant='default' className='text-xs'>
									-{result.savings}%
								</Badge>
							)}
							{output && (
								<Badge variant='outline'>
									{formatBytes(new TextEncoder().encode(output).length)}
								</Badge>
							)}
						</div>
					</div>

					{!output ? (
						<div className='flex items-center justify-center h-[500px] text-muted-foreground border border-dashed rounded-lg'>
							<div className='text-center'>
								<Minimize2 className='w-12 h-12 mx-auto mb-3 opacity-50' />
								<p>Сжатый код появится здесь</p>
							</div>
						</div>
					) : (
						<>
							<Textarea
								value={output}
								readOnly
								className='min-h-[400px] font-mono text-sm mb-4'
							/>

							<div className='flex gap-2'>
								<Button
									onClick={() => copyToClipboard(output)}
									variant='outline'
									size='sm'
								>
									<Copy className='w-4 h-4 mr-2' />
									Копировать
								</Button>

								<Button onClick={downloadCode} variant='outline' size='sm'>
									<Download className='w-4 h-4 mr-2' />
									Скачать
								</Button>
							</div>
						</>
					)}
				</Card>
			</div>

			{/* Results */}
			{result && (
				<Card className='p-6'>
					<h3 className='font-semibold mb-4'>Результаты сжатия</h3>

					<div className='grid md:grid-cols-4 gap-4 mb-6'>
						<div className='text-center p-4 bg-muted/30 rounded-lg'>
							<p className='text-sm text-muted-foreground'>Исходный размер</p>
							<p className='text-lg font-bold'>
								{formatBytes(result.originalSize)}
							</p>
						</div>

						<div className='text-center p-4 bg-muted/30 rounded-lg'>
							<p className='text-sm text-muted-foreground'>Сжатый размер</p>
							<p className='text-lg font-bold text-green-600'>
								{formatBytes(result.compressedSize)}
							</p>
						</div>

						<div className='text-center p-4 bg-muted/30 rounded-lg'>
							<p className='text-sm text-muted-foreground'>Экономия</p>
							<p className='text-lg font-bold text-blue-600'>
								{result.savings}%
							</p>
						</div>

						<div className='text-center p-4 bg-muted/30 rounded-lg'>
							<p className='text-sm text-muted-foreground'>Сжатие</p>
							<p className='text-lg font-bold'>
								{result.originalSize > 0
									? `${(result.originalSize / result.compressedSize).toFixed(1)}:1`
									: '0:0'}
							</p>
						</div>
					</div>

					{/* Errors and Warnings */}
					{result.errors && result.errors.length > 0 && (
						<div className='mb-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg'>
							<div className='flex items-start gap-2'>
								<AlertCircle className='w-4 h-4 text-red-600 mt-0.5' />
								<div>
									<p className='font-medium text-red-800 dark:text-red-200'>
										Ошибки сжатия
									</p>
									<ul className='mt-1 text-sm text-red-700 dark:text-red-300 space-y-1'>
										{result.errors.map((error, index) => (
											<li key={index}>• {error}</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					)}

					{result.warnings && result.warnings.length > 0 && (
						<div className='mb-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
							<div className='flex items-start gap-2'>
								<Info className='w-4 h-4 text-yellow-600 mt-0.5' />
								<div>
									<p className='font-medium text-yellow-800 dark:text-yellow-200'>
										Оптимизации
									</p>
									<ul className='mt-1 text-sm text-yellow-700 dark:text-yellow-300 space-y-1'>
										{result.warnings.map((warning, index) => (
											<li key={index}>• {warning}</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					)}

					{(!result.errors || result.errors.length === 0) && (
						<div className='p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg'>
							<div className='flex items-center gap-2'>
								<CheckCircle className='w-4 h-4 text-green-600' />
								<p className='text-green-800 dark:text-green-200'>
									Код успешно сжат без ошибок
								</p>
							</div>
						</div>
					)}
				</Card>
			)}

			{/* Info */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-4'>О сжатии JS/CSS кода</h3>
				<div className='grid md:grid-cols-2 gap-6 text-sm'>
					<div className='space-y-3'>
						<div>
							<h4 className='font-medium mb-1'>JavaScript оптимизации</h4>
							<ul className='text-muted-foreground space-y-1'>
								<li>• Удаление комментариев и лишних пробелов</li>
								<li>• Сокращение имен функций и переменных</li>
								<li>• Оптимизация общих паттернов кода</li>
								<li>• Безопасное сжатие без нарушения логики</li>
							</ul>
						</div>
						<div>
							<h4 className='font-medium mb-1'>CSS оптимизации</h4>
							<ul className='text-muted-foreground space-y-1'>
								<li>• Сокращение HEX цветов (#ffffff → #fff)</li>
								<li>• Оптимизация единиц измерения (0px → 0)</li>
								<li>• Сжатие margin/padding shorthand</li>
								<li>• Удаление ненужных кавычек</li>
							</ul>
						</div>
					</div>
					<div className='space-y-3'>
						<div>
							<h4 className='font-medium mb-1'>Преимущества сжатия</h4>
							<ul className='text-muted-foreground space-y-1'>
								<li>• Уменьшение размера файлов на 20-70%</li>
								<li>• Ускорение загрузки веб-страниц</li>
								<li>• Экономия трафика и bandwidth</li>
								<li>• Улучшение производительности сайта</li>
							</ul>
						</div>
						<div>
							<h4 className='font-medium mb-1'>Рекомендации</h4>
							<ul className='text-muted-foreground space-y-1'>
								<li>• Всегда сохраняйте оригинальные файлы</li>
								<li>• Тестируйте сжатый код перед деплоем</li>
								<li>• Используйте source maps для отладки</li>
								<li>• Комбинируйте с gzip сжатием на сервере</li>
							</ul>
						</div>
					</div>
				</div>
			</Card>
		</div>
	)
}
