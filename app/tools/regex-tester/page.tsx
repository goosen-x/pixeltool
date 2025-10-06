'use client'

import { useState, useEffect } from 'react'
import { WidgetLayout } from '@/components/widgets/WidgetLayout'
import { WidgetSection } from '@/components/widgets/WidgetSection'
import { WidgetInput } from '@/components/widgets/WidgetInput'
import { WidgetOutput } from '@/components/widgets/WidgetOutput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import {
	Regex,
	Copy,
	RefreshCw,
	Code,
	Search,
	AlertCircle,
	CheckCircle,
	Info,
	BookOpen,
	Lightbulb,
	FileCode,
	Zap,
	Globe,
	Hash,
	Type
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useWidgetKeyboard } from '@/lib/hooks/useWidgetKeyboard'

type RegexFlavor = 'javascript' | 'php' | 'python'

interface RegexMatch {
	match: string
	index: number
	length: number
	groups?: { [key: string]: string }
}

interface RegexPattern {
	name: string
	pattern: string
	description: string
	example: string
	category: string
}

const REGEX_PATTERNS: RegexPattern[] = [
	// Валидация
	{
		name: 'Email',
		pattern: '^[\\w.-]+@[\\w.-]+\\.\\w+$',
		description: 'Email адрес',
		example: 'user@example.com',
		category: 'validation'
	},
	{
		name: 'URL',
		pattern:
			'^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&\\/\\/=]*)$',
		description: 'HTTP/HTTPS URL',
		example: 'https://example.com',
		category: 'validation'
	},
	{
		name: 'IPv4',
		pattern:
			'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
		description: 'IPv4 адрес',
		example: '192.168.1.1',
		category: 'validation'
	},
	{
		name: 'Телефон (RU)',
		pattern:
			'^\\+?7[\\s-]?\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{2}[\\s-]?\\d{2}$',
		description: 'Российский телефон',
		example: '+7 (999) 123-45-67',
		category: 'validation'
	},
	{
		name: 'Дата (DD.MM.YYYY)',
		pattern: '^(0[1-9]|[12][0-9]|3[01])\\.(0[1-9]|1[012])\\.\\d{4}$',
		description: 'Дата в формате ДД.ММ.ГГГГ',
		example: '31.12.2023',
		category: 'validation'
	},

	// Числа
	{
		name: 'Целое число',
		pattern: '^-?\\d+$',
		description: 'Целое положительное или отрицательное',
		example: '-123',
		category: 'numbers'
	},
	{
		name: 'Десятичное число',
		pattern: '^-?\\d+(\\.\\d+)?$',
		description: 'Число с плавающей точкой',
		example: '123.45',
		category: 'numbers'
	},
	{
		name: 'Процент',
		pattern: '^\\d{1,3}%$',
		description: 'Процентное значение',
		example: '75%',
		category: 'numbers'
	},
	{
		name: 'Денежная сумма',
		pattern: '^\\d{1,3}(,\\d{3})*(\\.\\d{2})?$',
		description: 'Денежный формат',
		example: '1,234.56',
		category: 'numbers'
	},

	// Текст
	{
		name: 'Только буквы',
		pattern: '^[a-zA-Zа-яА-Я]+$',
		description: 'Латиница и кириллица',
		example: 'Текст',
		category: 'text'
	},
	{
		name: 'Буквы и цифры',
		pattern: '^[a-zA-Zа-яА-Я0-9]+$',
		description: 'Буквенно-цифровые символы',
		example: 'Text123',
		category: 'text'
	},
	{
		name: 'Слово',
		pattern: '\\b\\w+\\b',
		description: 'Отдельное слово',
		example: 'word',
		category: 'text'
	},
	{
		name: 'Пробелы',
		pattern: '\\s+',
		description: 'Один или более пробелов',
		example: '   ',
		category: 'text'
	},

	// HTML/XML
	{
		name: 'HTML тег',
		pattern: '<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)',
		description: 'HTML тег с содержимым',
		example: '<div>content</div>',
		category: 'html'
	},
	{
		name: 'HTML атрибут',
		pattern: '\\w+="[^"]*"',
		description: 'Атрибут HTML',
		example: 'class="example"',
		category: 'html'
	},
	{
		name: 'Комментарий HTML',
		pattern: '<!--[\\s\\S]*?-->',
		description: 'HTML комментарий',
		example: '<!-- comment -->',
		category: 'html'
	},

	// Программирование
	{
		name: 'Переменная PHP',
		pattern: '\\$[a-zA-Z_][a-zA-Z0-9_]*',
		description: 'PHP переменная',
		example: '$variable',
		category: 'code'
	},
	{
		name: 'Функция',
		pattern: '\\b[a-zA-Z_][a-zA-Z0-9_]*\\s*\\(',
		description: 'Вызов функции',
		example: 'function(',
		category: 'code'
	},
	{
		name: 'Комментарий JS',
		pattern: '\\/\\/.*$|\\/\\*[\\s\\S]*?\\*\\/',
		description: 'JavaScript комментарий',
		example: '// comment',
		category: 'code'
	},
	{
		name: 'HEX цвет',
		pattern: '#[0-9A-Fa-f]{6}',
		description: 'HEX код цвета',
		example: '#FF5733',
		category: 'code'
	}
]

const REGEX_FLAGS = {
	javascript: [
		{ flag: 'g', name: 'Global', description: 'Все совпадения' },
		{ flag: 'i', name: 'Case Insensitive', description: 'Без учета регистра' },
		{ flag: 'm', name: 'Multiline', description: 'Многострочный режим' },
		{ flag: 's', name: 'Dotall', description: 'Точка включает перенос строки' },
		{ flag: 'u', name: 'Unicode', description: 'Поддержка Unicode' }
	],
	php: [
		{ flag: 'i', name: 'Case Insensitive', description: 'Без учета регистра' },
		{ flag: 'm', name: 'Multiline', description: 'Многострочный режим' },
		{ flag: 's', name: 'Dotall', description: 'Точка включает перенос строки' },
		{ flag: 'x', name: 'Extended', description: 'Игнорировать пробелы' },
		{ flag: 'u', name: 'Unicode', description: 'Поддержка Unicode' }
	],
	python: [
		{ flag: 're.I', name: 'IGNORECASE', description: 'Без учета регистра' },
		{ flag: 're.M', name: 'MULTILINE', description: 'Многострочный режим' },
		{
			flag: 're.S',
			name: 'DOTALL',
			description: 'Точка включает перенос строки'
		},
		{ flag: 're.X', name: 'VERBOSE', description: 'Игнорировать пробелы' },
		{ flag: 're.U', name: 'UNICODE', description: 'Поддержка Unicode' }
	]
}

export default function RegexTesterPage() {
	const [pattern, setPattern] = useState('')
	const [testText, setTestText] = useState('')
	const [flavor, setFlavor] = useState<RegexFlavor>('javascript')
	const [flags, setFlags] = useState<string[]>(['g'])
	const [matches, setMatches] = useState<RegexMatch[]>([])
	const [error, setError] = useState('')
	const [highlightedText, setHighlightedText] = useState('')
	const [replacePattern, setReplacePattern] = useState('')
	const [replacedText, setReplacedText] = useState('')
	const [showReplace, setShowReplace] = useState(false)

	useEffect(() => {
		testRegex()
	}, [pattern, testText, flavor, flags])

	useEffect(() => {
		if (showReplace) {
			performReplace()
		}
	}, [pattern, testText, replacePattern, flavor, flags, showReplace])

	const testRegex = () => {
		if (!pattern || !testText) {
			setMatches([])
			setHighlightedText(testText)
			setError('')
			return
		}

		try {
			const flagString = flags.join('')

			// Создаем регулярное выражение
			const regex = new RegExp(pattern, flagString)

			// Находим все совпадения
			const foundMatches: RegexMatch[] = []
			let match
			const lastIndex = 0

			if (flags.includes('g')) {
				while ((match = regex.exec(testText)) !== null) {
					foundMatches.push({
						match: match[0],
						index: match.index,
						length: match[0].length,
						groups: match.groups
					})
					// Предотвращаем бесконечный цикл для пустых совпадений
					if (match.index === regex.lastIndex) {
						regex.lastIndex++
					}
				}
			} else {
				match = regex.exec(testText)
				if (match) {
					foundMatches.push({
						match: match[0],
						index: match.index,
						length: match[0].length,
						groups: match.groups
					})
				}
			}

			setMatches(foundMatches)
			setError('')

			// Подсветка совпадений
			let highlighted = testText
			const sortedMatches = [...foundMatches].sort((a, b) => b.index - a.index)

			sortedMatches.forEach(match => {
				const before = highlighted.substring(0, match.index)
				const matchText = highlighted.substring(
					match.index,
					match.index + match.length
				)
				const after = highlighted.substring(match.index + match.length)
				highlighted =
					before +
					`<mark class="bg-yellow-300 dark:bg-yellow-600">${matchText}</mark>` +
					after
			})

			setHighlightedText(highlighted)
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Ошибка в регулярном выражении'
			)
			setMatches([])
			setHighlightedText(testText)
		}
	}

	const performReplace = () => {
		if (!pattern || !testText) {
			setReplacedText('')
			return
		}

		try {
			const flagString = flags.join('')
			const regex = new RegExp(pattern, flagString)
			const replaced = testText.replace(regex, replacePattern)
			setReplacedText(replaced)
		} catch (err) {
			setReplacedText('')
		}
	}

	const toggleFlag = (flag: string) => {
		setFlags(prev =>
			prev.includes(flag) ? prev.filter(f => f !== flag) : [...prev, flag]
		)
	}

	const loadPattern = (regexPattern: RegexPattern) => {
		setPattern(regexPattern.pattern)
		setTestText(regexPattern.example)
		toast.success(`Загружен шаблон: ${regexPattern.name}`)
	}

	const copyPattern = () => {
		const flagString = flags.join('')
		const fullPattern = `/${pattern}/${flagString}`
		navigator.clipboard.writeText(fullPattern)
		toast.success('Регулярное выражение скопировано!')
	}

	const copyCode = () => {
		let code = ''
		const flagString = flags.join('')

		switch (flavor) {
			case 'javascript':
				code = `const regex = /${pattern}/${flagString};\nconst matches = text.match(regex);`
				break
			case 'php':
				code = `$pattern = '/${pattern}/${flagString}';\npreg_match_all($pattern, $text, $matches);`
				break
			case 'python':
				const pyFlags =
					flags
						.map(f => {
							switch (f) {
								case 'i':
									return 're.I'
								case 'm':
									return 're.M'
								case 's':
									return 're.S'
								default:
									return ''
							}
						})
						.filter(Boolean)
						.join(' | ') || '0'
				code = `import re\npattern = r'${pattern}'\nmatches = re.findall(pattern, text, ${pyFlags})`
				break
		}

		navigator.clipboard.writeText(code)
		toast.success('Код скопирован!')
	}

	const reset = () => {
		setPattern('')
		setTestText('')
		setReplacePattern('')
		setReplacedText('')
		setMatches([])
		setError('')
		setHighlightedText('')
		setFlags(['g'])
		toast.success('Тестер сброшен')
	}

	const getFlavorIcon = (flavorType: RegexFlavor) => {
		switch (flavorType) {
			case 'javascript':
				return FileCode
			case 'php':
				return Code
			case 'python':
				return Zap
		}
	}

	// Keyboard shortcuts
	const shortcuts = [
		{
			key: 'Enter',
			primary: true,
			action: testRegex,
			description: 'Тестировать'
		},
		{
			key: 'r',
			primary: true,
			action: () => setShowReplace(!showReplace),
			description: 'Переключить замену'
		},
		{
			key: 'k',
			alt: true,
			action: () => {
				setPattern('')
				setTestText('')
				setReplacePattern('')
			},
			description: 'Очистить'
		},
		{
			key: 'g',
			primary: true,
			action: () => {
				const flag =
					flavor === 'javascript' ? 'g' : flavor === 'php' ? 'g' : 're.G'
				const newFlags = flags.includes(flag)
					? flags.filter(f => f !== flag)
					: [...flags, flag]
				setFlags(newFlags)
			},
			description: 'Переключить глобальный поиск'
		}
	]

	useWidgetKeyboard({
		shortcuts,
		widgetId: 'regex-tester'
	})

	return (
		<WidgetLayout>
			{/* Flavor Selection */}
			<WidgetSection
				icon={<Globe className='h-5 w-5' />}
				title='Выбор языка'
				description='Выберите язык программирования для генерации кода'
			>
				<RadioGroup
					value={flavor}
					onValueChange={(value: RegexFlavor) => setFlavor(value)}
				>
					<div className='grid grid-cols-3 gap-4'>
						{(['javascript', 'php', 'python'] as RegexFlavor[]).map(lang => {
							const Icon = getFlavorIcon(lang)
							return (
								<div
									key={lang}
									className={cn(
										'relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors',
										flavor === lang
											? 'bg-primary/10 border-primary'
											: 'hover:bg-muted/50'
									)}
									onClick={() => setFlavor(lang)}
								>
									<RadioGroupItem value={lang} id={lang} />
									<Label
										htmlFor={lang}
										className='cursor-pointer flex items-center gap-2'
									>
										<Icon className='w-4 h-4' />
										<span className='capitalize'>{lang}</span>
									</Label>
								</div>
							)
						})}
					</div>
				</RadioGroup>
			</WidgetSection>

			<div className='grid lg:grid-cols-3 gap-6'>
				{/* Main Editor */}
				<div className='lg:col-span-2 space-y-6'>
					<WidgetSection
						icon={<Regex className='h-5 w-5' />}
						title='Тестер регулярных выражений'
					>
						<div className='space-y-4'>
							{/* Pattern Input */}
							<WidgetInput label='Регулярное выражение'>
								<div className='relative mt-1'>
									<Input
										id='pattern'
										value={pattern}
										onChange={e => setPattern(e.target.value)}
										placeholder='Например: ^[a-zA-Z0-9]+$'
										className={cn('font-mono pr-10', error && 'border-red-500')}
									/>
									<div className='absolute right-2 top-1/2 -translate-y-1/2'>
										{error ? (
											<AlertCircle className='w-4 h-4 text-red-500' />
										) : matches.length > 0 ? (
											<CheckCircle className='w-4 h-4 text-green-500' />
										) : null}
									</div>
								</div>
								{error && <p className='text-sm text-red-500 mt-1'>{error}</p>}
							</WidgetInput>

							{/* Flags */}
							<WidgetInput label='Флаги'>
								<div className='flex flex-wrap gap-2 mt-2'>
									{REGEX_FLAGS[flavor].map(({ flag, name, description }) => (
										<Button
											key={flag}
											variant={
												flags.includes(flag.split('.')[1] || flag)
													? 'default'
													: 'outline'
											}
											size='sm'
											onClick={() => toggleFlag(flag.split('.')[1] || flag)}
											title={description}
										>
											<code className='text-xs'>{flag}</code>
											<span className='ml-2'>{name}</span>
										</Button>
									))}
								</div>
							</WidgetInput>

							{/* Test Text */}
							<WidgetInput label='Тестовый текст'>
								<Textarea
									id='test-text'
									value={testText}
									onChange={e => setTestText(e.target.value)}
									placeholder='Введите текст для тестирования...'
									className='font-mono mt-1'
									rows={6}
								/>
							</WidgetInput>

							{/* Results */}
							{testText && (
								<WidgetOutput
									gradientFrom='from-green-500/10'
									gradientTo='to-blue-500/10'
								>
									<div className='space-y-3'>
										<div className='flex items-center justify-between'>
											<span className='text-sm font-medium'>Результат</span>
											<Badge variant='secondary'>
												Совпадений: {matches.length}
											</Badge>
										</div>
										<div
											className='p-4 rounded-lg bg-muted/50 font-mono text-sm whitespace-pre-wrap break-all border'
											dangerouslySetInnerHTML={{ __html: highlightedText }}
										/>
									</div>
								</WidgetOutput>
							)}

							{/* Replace Mode */}
							<WidgetInput label='Режим замены'>
								<div className='flex items-center space-x-2'>
									<Switch
										id='replace-mode'
										checked={showReplace}
										onCheckedChange={setShowReplace}
									/>
									<Label htmlFor='replace-mode'>Включить режим замены</Label>
								</div>
							</WidgetInput>

							{showReplace && (
								<>
									<WidgetInput label='Заменить на'>
										<Input
											id='replace-pattern'
											value={replacePattern}
											onChange={e => setReplacePattern(e.target.value)}
											placeholder='Например: $1 или \1'
											className='font-mono'
										/>
									</WidgetInput>

									{replacedText && (
										<WidgetOutput
											gradientFrom='from-purple-500/10'
											gradientTo='to-pink-500/10'
										>
											<div className='space-y-2'>
												<span className='text-sm font-medium'>
													Результат замены
												</span>
												<div className='p-4 rounded-lg bg-muted/50 font-mono text-sm whitespace-pre-wrap break-all border'>
													{replacedText}
												</div>
											</div>
										</WidgetOutput>
									)}
								</>
							)}

							{/* Actions */}
							<div className='flex gap-2 pt-4'>
								<Button onClick={copyPattern} className='gap-2'>
									<Copy className='w-4 h-4' />
									Копировать Regex
								</Button>
								<Button onClick={copyCode} variant='outline' className='gap-2'>
									<Code className='w-4 h-4' />
									Копировать код
								</Button>
								<Button onClick={reset} variant='outline' className='gap-2'>
									<RefreshCw className='w-4 h-4' />
									Сброс
								</Button>
							</div>
						</div>
					</WidgetSection>

					{/* Match Details */}
					{matches.length > 0 && (
						<WidgetSection
							icon={<Search className='h-5 w-5' />}
							title='Детали совпадений'
						>
							<div className='space-y-2'>
								{matches.map((match, index) => (
									<div
										key={index}
										className='p-3 rounded-lg bg-muted/50 font-mono text-sm'
									>
										<div className='flex items-center justify-between mb-1'>
											<span className='text-muted-foreground'>
												Совпадение #{index + 1}
											</span>
											<Badge variant='secondary'>Позиция: {match.index}</Badge>
										</div>
										<div className='text-green-600 dark:text-green-400'>
											&quot;{match.match}&quot;
										</div>
										{match.groups && Object.keys(match.groups).length > 0 && (
											<div className='mt-2 pt-2 border-t'>
												<div className='text-xs text-muted-foreground mb-1'>
													Группы:
												</div>
												{Object.entries(match.groups).map(([key, value]) => (
													<div key={key} className='text-xs'>
														<span className='text-muted-foreground'>
															{key}:
														</span>{' '}
														&quot;{value}&quot;
													</div>
												))}
											</div>
										)}
									</div>
								))}
							</div>
						</WidgetSection>
					)}
				</div>

				{/* Sidebar */}
				<div className='space-y-6'>
					{/* Common Patterns */}
					<WidgetSection
						icon={<Lightbulb className='h-5 w-5' />}
						title='Готовые шаблоны'
					>
						<div className='space-y-4'>
							{['validation', 'numbers', 'text', 'html', 'code'].map(
								category => (
									<div key={category}>
										<h4 className='text-sm font-medium text-muted-foreground mb-2 capitalize'>
											{category === 'validation'
												? 'Валидация'
												: category === 'numbers'
													? 'Числа'
													: category === 'text'
														? 'Текст'
														: category === 'html'
															? 'HTML/XML'
															: 'Код'}
										</h4>
										<div className='space-y-1'>
											{REGEX_PATTERNS.filter(p => p.category === category).map(
												(regexPattern, index) => (
													<Button
														key={index}
														onClick={() => loadPattern(regexPattern)}
														variant='ghost'
														size='sm'
														className='w-full justify-start text-left'
													>
														<span className='truncate'>
															{regexPattern.name}
														</span>
													</Button>
												)
											)}
										</div>
									</div>
								)
							)}
						</div>
					</WidgetSection>

					{/* Quick Reference */}
					<WidgetSection
						icon={<BookOpen className='h-5 w-5' />}
						title='Справочник'
					>
						<div className='space-y-3 text-sm'>
							<div>
								<h4 className='font-medium mb-1'>Символьные классы</h4>
								<div className='space-y-1 text-muted-foreground font-mono'>
									<div>\d - цифра [0-9]</div>
									<div>\w - буква/цифра/_ </div>
									<div>\s - пробельный символ</div>
									<div>. - любой символ</div>
								</div>
							</div>
							<div>
								<h4 className='font-medium mb-1'>Квантификаторы</h4>
								<div className='space-y-1 text-muted-foreground font-mono'>
									<div>* - 0 или более</div>
									<div>+ - 1 или более</div>
									<div>? - 0 или 1</div>
									<div>{`{n}`} - ровно n раз</div>
									<div>{`{n,}`} - n или более</div>
									<div>{`{n,m}`} - от n до m</div>
								</div>
							</div>
							<div>
								<h4 className='font-medium mb-1'>Позиция</h4>
								<div className='space-y-1 text-muted-foreground font-mono'>
									<div>^ - начало строки</div>
									<div>$ - конец строки</div>
									<div>\b - граница слова</div>
								</div>
							</div>
							<div>
								<h4 className='font-medium mb-1'>Группы</h4>
								<div className='space-y-1 text-muted-foreground font-mono'>
									<div>(...) - захват группы</div>
									<div>(?:...) - без захвата</div>
									<div>(?&lt;name&gt;...) - именованная</div>
								</div>
							</div>
						</div>
					</WidgetSection>

					{/* Tips */}
					<WidgetSection icon={<Info className='h-5 w-5' />} title='Советы'>
						<ul className='space-y-2 text-sm text-muted-foreground'>
							<li>• Используйте группы для извлечения частей текста</li>
							<li>• Флаг &apos;g&apos; для поиска всех совпадений</li>
							<li>• Экранируйте спецсимволы: . * + ? [ ] ( ) {} ^ $ \ |</li>
							<li>• Тестируйте на разных примерах текста</li>
							<li>• Именованные группы упрощают работу с результатами</li>
						</ul>
					</WidgetSection>
				</div>
			</div>
		</WidgetLayout>
	)
}
