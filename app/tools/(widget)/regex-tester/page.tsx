'use client'

import { useState, useEffect } from 'react'
import { RegexGuide } from './RegexGuide'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Code, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
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

	const copyPattern = () => {
		const flagString = flags.join('')
		const fullPattern = `/${pattern}/${flagString}`
		navigator.clipboard.writeText(fullPattern)
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
	}

	return (
		<>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: язык, под который генерируется код, и флаги. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{(['javascript', 'php', 'python'] as RegexFlavor[]).map(lang => (
							<button
								key={lang}
								type='button'
								onClick={() => setFlavor(lang)}
								aria-pressed={flavor === lang}
								className={toolPill(flavor === lang, 'font-mono')}
							>
								{lang}
							</button>
						))}
					</div>

					<div className='flex flex-wrap items-center gap-1.5'>
						<span className='mr-1 text-sm text-muted-foreground'>Флаги</span>
						{REGEX_FLAGS[flavor].map(({ flag, name, description }) => {
							const value = flag.split('.')[1] || flag
							return (
								<button
									key={flag}
									type='button'
									onClick={() => toggleFlag(value)}
									aria-pressed={flags.includes(value)}
									title={`${name} — ${description}`}
									className={toolPill(flags.includes(value), 'font-mono')}
								>
									{flag}
								</button>
							)
						})}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyPattern}
							disabled={!pattern}
							title='Скопировать выражение'
							className={toolIconButton}
						>
							<Copy className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyCode}
							disabled={!pattern}
							title={`Скопировать код для ${flavor}`}
							className={toolIconButton}
						>
							<Code className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={reset}
							title='Сбросить'
							className={toolIconButton}
						>
							<RotateCcw className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Само выражение — главное поле инструмента, поэтому оно крупное
				    и в привычной записи со слэшами и флагами. */}
				<div className='flex items-center gap-2 px-5 py-6 font-mono sm:px-6'>
					<span className='text-xl text-muted-foreground'>/</span>
					<input
						id='pattern'
						value={pattern}
						onChange={e => setPattern(e.target.value)}
						placeholder='^[a-zA-Z0-9]+$'
						spellCheck={false}
						aria-label='Регулярное выражение'
						className={cn(
							'min-w-0 flex-1 bg-transparent text-xl focus:outline-none',
							error && 'text-destructive'
						)}
					/>
					<span className='text-xl text-muted-foreground'>
						/{flags.join('')}
					</span>
					{error ? (
						<AlertCircle className='h-5 w-5 shrink-0 text-destructive' />
					) : matches.length > 0 ? (
						<CheckCircle className='h-5 w-5 shrink-0 text-green-600 dark:text-green-400' />
					) : null}
				</div>

				{error && (
					<p className='px-5 pb-4 text-sm text-destructive sm:px-6'>{error}</p>
				)}

				<div className='grid border-t lg:grid-cols-2'>
					<Textarea
						id='test-text'
						value={testText}
						onChange={e => setTestText(e.target.value)}
						placeholder='Текст, на котором проверяем'
						spellCheck={false}
						aria-label='Тестовый текст'
						className='min-h-[16rem] resize-none rounded-none border-0 px-5 py-6 font-mono text-base focus-visible:ring-0 sm:px-6 md:text-sm lg:border-r'
					/>

					<div className='min-h-[16rem] px-5 py-6 sm:px-6'>
						{testText ? (
							<>
								<p className='text-sm text-muted-foreground'>
									совпадений{' '}
									<span className='font-mono text-foreground'>
										{matches.length}
									</span>
								</p>
								<div
									className='mt-3 font-mono text-sm break-all whitespace-pre-wrap'
									dangerouslySetInnerHTML={{ __html: highlightedText }}
								/>
							</>
						) : (
							<p className='flex h-full items-center justify-center text-center text-sm text-muted-foreground'>
								Вставьте текст — совпадения подсветятся здесь
							</p>
						)}
					</div>
				</div>

				{/* Полоса замены: включается таблеткой, поле появляется рядом. */}
				<div className={toolFooterBar}>
					<button
						type='button'
						onClick={() => setShowReplace(!showReplace)}
						aria-pressed={showReplace}
						className={toolPill(showReplace)}
					>
						Замена
					</button>

					{showReplace && (
						<label className='flex min-w-0 flex-1 items-center gap-2 text-sm text-muted-foreground'>
							на
							<input
								id='replace-pattern'
								value={replacePattern}
								onChange={e => setReplacePattern(e.target.value)}
								placeholder='$1'
								spellCheck={false}
								aria-label='Строка замены'
								className='min-w-0 flex-1 rounded-md border bg-background px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							/>
						</label>
					)}
				</div>

				{showReplace && replacedText && (
					<div className='border-t px-5 py-4 sm:px-6'>
						<p className='text-sm text-muted-foreground'>После замены</p>
						<pre className='mt-2 font-mono text-sm break-all whitespace-pre-wrap'>
							{replacedText}
						</pre>
					</div>
				)}

				{matches.length > 0 && (
					<div className='max-h-64 overflow-auto border-t px-5 py-4 sm:px-6'>
						<p className='text-sm text-muted-foreground'>Совпадения</p>
						<div className='mt-2 space-y-1'>
							{matches.map((match, index) => (
								<p key={index} className='font-mono text-sm'>
									<span className='mr-2 text-xs text-muted-foreground'>
										{index + 1} · поз. {match.index}
									</span>
									<span className='text-green-600 dark:text-green-400'>
										{match.match}
									</span>
									{match.groups && Object.keys(match.groups).length > 0 && (
										<span className='ml-2 text-xs text-muted-foreground'>
											группы: {Object.values(match.groups).join(', ')}
										</span>
									)}
								</p>
							))}
						</div>
					</div>
				)}
			</Card>

			{/* Готовые шаблоны — тихая полка под инструментом. */}
			<div className='mt-6'>
				<p className='px-1 text-sm text-muted-foreground'>
					Готовые шаблоны — кликните, чтобы подставить
				</p>
				<div className='mt-2 flex flex-wrap gap-1.5'>
					{REGEX_PATTERNS.map((item, index) => (
						<button
							key={index}
							type='button'
							onClick={() => {
								setPattern(item.pattern)
								if (item.example) setTestText(item.example)
							}}
							title={`${item.description} — ${item.pattern}`}
							className={toolPill(false)}
						>
							{item.name}
						</button>
					))}
				</div>
			</div>

			<RegexGuide />
		</>
	)
}
