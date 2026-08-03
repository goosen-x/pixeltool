'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { Check, Copy, Eye, EyeOff, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

import { TextRoll } from '@/components/core/text-roll'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { PasswordSeo } from './PasswordSeo'

interface PasswordOptions {
	length: number
	uppercase: boolean
	lowercase: boolean
	numbers: boolean
	symbols: boolean
	excludeSimilar: boolean
	excludeAmbiguous: boolean
}

interface PasswordHistory {
	password: string
	strength: number
	timestamp: number
}

type GeneratorMode = 'random' | 'memorable' | 'phrase'

interface MemorablePattern {
	pattern: string
	example: string
}

const DEFAULT_OPTIONS: PasswordOptions = {
	length: 16,
	uppercase: true,
	lowercase: true,
	numbers: true,
	symbols: true,
	excludeSimilar: false,
	excludeAmbiguous: false
}

const MEMORABLE_PATTERNS: MemorablePattern[] = [
	{ pattern: 'word-word-number', example: 'sunset-ocean-42' },
	{ pattern: 'Word@Word#Num', example: 'Forest@River#99' },
	{ pattern: 'word.word.word', example: 'coffee.mountain.thunder' },
	{ pattern: 'WordWordNumber!', example: 'BlueSkyFire7!' }
]

const WORD_THEMES: { key: string; label: string; words: string }[] = [
	{
		key: 'nature',
		label: 'Природа',
		words: 'ocean mountain forest river sunset thunder'
	},
	{
		key: 'tech',
		label: 'Технологии',
		words: 'quantum neural cyber digital matrix protocol'
	},
	{
		key: 'fantasy',
		label: 'Фэнтези',
		words: 'dragon phoenix crystal magic sword shield'
	},
	{
		key: 'space',
		label: 'Космос',
		words: 'galaxy nebula asteroid comet stellar nova'
	}
]

const COMMON_WORDS = [
	'sun',
	'moon',
	'star',
	'sky',
	'cloud',
	'rain',
	'snow',
	'wind',
	'fire',
	'water',
	'earth',
	'air',
	'ice',
	'storm',
	'thunder',
	'lightning',
	'tree',
	'forest',
	'mountain',
	'river',
	'ocean',
	'lake',
	'desert',
	'island',
	'wolf',
	'eagle',
	'lion',
	'dragon',
	'phoenix',
	'tiger',
	'bear',
	'hawk',
	'blue',
	'red',
	'green',
	'gold',
	'silver',
	'black',
	'white',
	'purple',
	'sword',
	'shield',
	'crown',
	'crystal',
	'diamond',
	'stone',
	'steel',
	'iron',
	'light',
	'dark',
	'shadow',
	'bright',
	'spark',
	'flame',
	'frost',
	'mist'
]

const HISTORY_KEY = 'password-history'

export default function PasswordGeneratorPage() {
	const widget = getWidgetById('password-generator')!
	const [password, setPassword] = useState('')
	const [options, setOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS)
	const [strength, setStrength] = useState(0)
	const [showPassword, setShowPassword] = useState(true)
	const [history, setHistory] = useState<PasswordHistory[]>([])
	const [mode, setMode] = useState<GeneratorMode>('random')
	const [selectedPattern, setSelectedPattern] = useState(0)
	const [customWords, setCustomWords] = useState('')
	const [copied, setCopied] = useState(false)

	// Character sets
	const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
	const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const NUMBERS = '0123456789'
	const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
	const SIMILAR = 'il1Lo0O'
	const AMBIGUOUS = '{}[]()/\\\\\'"`~,;.<>'

	// В историю попадают только скопированные пароли. Раньше туда писался
	// каждый сгенерированный — при автогенерации на каждое движение ползунка
	// список превратился бы в мусор, да и «мои пароли» — это те, что человек
	// реально забрал, а не те, что промелькнули на экране.
	useEffect(() => {
		const saved = localStorage.getItem(HISTORY_KEY)
		if (!saved) return

		try {
			const parsed = JSON.parse(saved)
			if (Array.isArray(parsed)) {
				setHistory(
					parsed.map((item: PasswordHistory) => ({
						...item,
						timestamp: new Date(item.timestamp).getTime()
					}))
				)
			}
		} catch {
			localStorage.removeItem(HISTORY_KEY)
		}
	}, [])

	const calculateStrength = useCallback((pass: string): number => {
		if (!pass) return 0

		let score = 0

		// Length score
		if (pass.length >= 8) score += 20
		if (pass.length >= 12) score += 20
		if (pass.length >= 16) score += 20

		// Character diversity
		if (/[a-z]/.test(pass)) score += 10
		if (/[A-Z]/.test(pass)) score += 10
		if (/[0-9]/.test(pass)) score += 10
		if (/[^A-Za-z0-9]/.test(pass)) score += 10

		// No repeated characters
		if (!/(.)\1{2,}/.test(pass)) score += 10

		// No common patterns
		const commonPatterns = ['123', 'abc', 'password', 'qwerty', '111']
		const hasCommonPattern = commonPatterns.some(pattern =>
			pass.toLowerCase().includes(pattern)
		)
		if (!hasCommonPattern) score += 10

		return Math.min(score, 100)
	}, [])

	const generatePassword = useCallback((): string | null => {
		let charset = ''

		if (options.lowercase) charset += LOWERCASE
		if (options.uppercase) charset += UPPERCASE
		if (options.numbers) charset += NUMBERS
		if (options.symbols) charset += SYMBOLS

		if (!charset) return null

		// Remove excluded characters
		if (options.excludeSimilar) {
			charset = charset
				.split('')
				.filter(char => !SIMILAR.includes(char))
				.join('')
		}
		if (options.excludeAmbiguous) {
			charset = charset
				.split('')
				.filter(char => !AMBIGUOUS.includes(char))
				.join('')
		}

		let newPassword = ''
		const array = new Uint32Array(options.length)
		crypto.getRandomValues(array)

		for (let i = 0; i < options.length; i++) {
			newPassword += charset[array[i] % charset.length]
		}

		// Ensure at least one character from each selected type
		const ensureTypes = []
		if (options.lowercase) ensureTypes.push(LOWERCASE)
		if (options.uppercase) ensureTypes.push(UPPERCASE)
		if (options.numbers) ensureTypes.push(NUMBERS)
		if (options.symbols) ensureTypes.push(SYMBOLS)

		if (ensureTypes.length > 1 && options.length >= ensureTypes.length) {
			const positions = new Set<number>()
			while (positions.size < ensureTypes.length) {
				positions.add(Math.floor(Math.random() * options.length))
			}

			const posArray = Array.from(positions)
			ensureTypes.forEach((type, index) => {
				const pos = posArray[index]
				const char = type[Math.floor(Math.random() * type.length)]
				newPassword =
					newPassword.substring(0, pos) + char + newPassword.substring(pos + 1)
			})
		}

		return newPassword
	}, [options, AMBIGUOUS])

	const generateMemorablePassword = useCallback((): string => {
		const words = []

		// Select random words
		for (let i = 0; i < 3; i++) {
			words.push(COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)])
		}

		const capitalize = (word: string) =>
			word.charAt(0).toUpperCase() + word.slice(1)

		switch (selectedPattern) {
			case 1:
				return `${capitalize(words[0])}@${capitalize(words[1])}#${Math.floor(Math.random() * 100)}`
			case 2:
				return `${words[0]}.${words[1]}.${words[2]}`
			case 3:
				return `${capitalize(words[0])}${capitalize(words[1])}${Math.floor(Math.random() * 10)}!`
			default:
				return `${words[0]}-${words[1]}-${Math.floor(Math.random() * 100)}`
		}
	}, [selectedPattern])

	const generatePassphrase = useCallback((): string => {
		const words = customWords
			.trim()
			.split(/\s+/)
			.filter(w => w.length > 0)

		if (words.length < 4) {
			// Use default words if not enough custom words
			const defaultWords = [...COMMON_WORDS]
				.sort(() => Math.random() - 0.5)
				.slice(0, 4)
			words.push(...defaultWords)
		}

		// Shuffle and select words
		const shuffled = [...words].sort(() => Math.random() - 0.5)
		const selectedWords = shuffled.slice(0, Math.min(5, shuffled.length))

		// Create passphrase with random formatting
		const formats = [
			(list: string[]) => list.join('-'),
			(list: string[]) => list.join(' '),
			(list: string[]) =>
				list.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''),
			(list: string[]) => list.join('.') + Math.floor(Math.random() * 100)
		]

		const format = formats[Math.floor(Math.random() * formats.length)]
		return format(selectedWords)
	}, [customWords])

	const generate = useCallback(() => {
		const next =
			mode === 'memorable'
				? generateMemorablePassword()
				: mode === 'phrase'
					? generatePassphrase()
					: generatePassword()

		if (next === null) {
			// Все наборы символов сняты — пароль собирать не из чего. Пустое поле
			// с подсказкой честнее тоста, который исчезнет через секунду.
			setPassword('')
			setStrength(0)
			return
		}

		setPassword(next)
		setStrength(calculateStrength(next))
	}, [
		mode,
		generatePassword,
		generateMemorablePassword,
		generatePassphrase,
		calculateStrength
	])

	// Пароль пересобирается сам при любой смене параметров — раньше человек
	// двигал ползунок длины и ничего не происходило, пока он не нажмёт кнопку.
	useEffect(() => {
		generate()
	}, [generate])

	const rememberPassword = useCallback((value: string, score: number) => {
		setHistory(previous => {
			const next = [
				{ password: value, strength: score, timestamp: Date.now() },
				...previous.filter(item => item.password !== value)
			].slice(0, 20)
			localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
			return next
		})
	}, [])

	const copyToClipboard = useCallback(
		async (value = password, score = strength) => {
			if (!value) return

			try {
				await navigator.clipboard.writeText(value)
				setCopied(true)
				rememberPassword(value, score)
				setTimeout(() => setCopied(false), 2000)
			} catch {
				toast.error('Не удалось скопировать — сохраните пароль вручную')
			}
		},
		[password, strength, rememberPassword]
	)

	const clearHistory = useCallback(() => {
		setHistory([])
		localStorage.removeItem(HISTORY_KEY)
	}, [])

	const strengthLabel =
		strength >= 80
			? 'Очень сильный'
			: strength >= 60
				? 'Сильный'
				: strength >= 40
					? 'Средний'
					: strength >= 20
						? 'Слабый'
						: 'Очень слабый'

	const strengthTone =
		strength >= 80
			? 'bg-emerald-500'
			: strength >= 60
				? 'bg-lime-500'
				: strength >= 40
					? 'bg-amber-500'
					: 'bg-red-500'

	const charSets: {
		key: keyof PasswordOptions
		label: string
		title: string
	}[] = [
		{ key: 'uppercase', label: 'A-Z', title: 'Заглавные латинские буквы' },
		{ key: 'lowercase', label: 'a-z', title: 'Строчные латинские буквы' },
		{ key: 'numbers', label: '0-9', title: 'Цифры' },
		{ key: 'symbols', label: '!@#', title: 'Знаки препинания и символы' }
	]

	const filters: {
		key: keyof PasswordOptions
		label: string
		title: string
	}[] = [
		{
			key: 'excludeSimilar',
			label: 'Без похожих',
			title: 'Убирает i l 1 L o 0 O — их путают при чтении и наборе вручную'
		},
		{
			key: 'excludeAmbiguous',
			label: 'Без скобок и кавычек',
			title: 'Убирает { } [ ] ( ) / \\ " \' — их ломают некоторые формы ввода'
		}
	]

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: три способа собрать пароль. Раньше это был
				    сегментированный контрол по центру карточки — он висел сам по
				    себе и ни с чем не выравнивался. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{(
							[
								{ key: 'random', label: 'Случайный' },
								{ key: 'memorable', label: 'Запоминающийся' },
								{ key: 'phrase', label: 'Из слов' }
							] as { key: GeneratorMode; label: string }[]
						).map(item => (
							<button
								key={item.key}
								type='button'
								onClick={() => setMode(item.key)}
								aria-pressed={mode === item.key}
								className={toolPill(mode === item.key)}
							>
								{item.label}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => setShowPassword(v => !v)}
							title={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
							className={toolIconButton}
						>
							{showPassword ? (
								<EyeOff className='h-4 w-4' />
							) : (
								<Eye className='h-4 w-4' />
							)}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={generate}
							title='Другой пароль'
							className={toolIconButton}
						>
							<RefreshCw className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Сам пароль — на чистом фоне, без вложенной карточки с тенью.
				    Он и есть результат работы инструмента, всё остальное вокруг. */}
				<div className='px-5 py-10 sm:px-6 sm:py-14'>
					<div className='min-h-[3rem] text-center font-mono text-2xl break-all select-all sm:text-3xl lg:text-4xl'>
						{password ? (
							showPassword ? (
								<TextRoll
									key={password}
									className='inline-block'
									duration={0.4}
									getEnterDelay={i => i * 0.015}
									getExitDelay={i => i * 0.015}
									transition={{ ease: [0.25, 0.1, 0.25, 1] }}
									variants={{
										enter: {
											initial: { y: 0, opacity: 1 },
											animate: { y: -50, opacity: 0.1 }
										},
										exit: {
											initial: { y: 50, opacity: 0 },
											animate: { y: 0, opacity: 1 }
										}
									}}
								>
									{password}
								</TextRoll>
							) : (
								'•'.repeat(password.length)
							)
						) : (
							<span className='font-sans text-base text-muted-foreground'>
								Включите хотя бы один набор символов
							</span>
						)}
					</div>

					{password && (
						<div className='mt-8 flex items-center justify-center gap-3'>
							<div className='h-1 w-32 overflow-hidden rounded-full bg-muted'>
								<div
									className={cn(
										'h-full rounded-full transition-all duration-500',
										strengthTone
									)}
									style={{ width: `${strength}%` }}
								/>
							</div>
							<span className='text-sm text-muted-foreground'>
								{strengthLabel}
							</span>
						</div>
					)}

					<div className='mt-8 flex justify-center'>
						<Button
							onClick={() => copyToClipboard()}
							disabled={!password}
							size='lg'
							className='h-11 w-full max-w-xs cursor-pointer'
						>
							{copied ? (
								<>
									<Check className='mr-2 h-4 w-4' />
									Скопировано
								</>
							) : (
								<>
									<Copy className='mr-2 h-4 w-4' />
									Скопировать пароль
								</>
							)}
						</Button>
					</div>
				</div>

				{/* Полоса параметров. Всё видно сразу: раньше половина настроек
				    пряталась за иконкой-шестерёнкой без подписи. */}
				<div className={toolFooterBar}>
					{mode === 'random' && (
						<div className='flex w-full flex-wrap items-center gap-x-6 gap-y-3'>
							<div className='flex items-center gap-3'>
								<span className='text-sm text-muted-foreground'>Длина</span>
								<Slider
									value={[options.length]}
									onValueChange={([value]) =>
										setOptions({ ...options, length: value })
									}
									min={8}
									max={32}
									step={1}
									className='w-32 cursor-pointer'
								/>
								<span className='w-6 font-mono text-sm tabular-nums'>
									{options.length}
								</span>
							</div>

							<div className='flex flex-wrap items-center gap-1.5'>
								{charSets.map(set => (
									<button
										key={set.key}
										type='button'
										title={set.title}
										aria-pressed={Boolean(options[set.key])}
										onClick={() =>
											setOptions({ ...options, [set.key]: !options[set.key] })
										}
										className={toolPill(Boolean(options[set.key]), 'font-mono')}
									>
										{set.label}
									</button>
								))}
							</div>

							<div className='flex flex-wrap items-center gap-1.5'>
								{filters.map(filter => (
									<button
										key={filter.key}
										type='button'
										title={filter.title}
										aria-pressed={Boolean(options[filter.key])}
										onClick={() =>
											setOptions({
												...options,
												[filter.key]: !options[filter.key]
											})
										}
										className={toolPill(Boolean(options[filter.key]))}
									>
										{filter.label}
									</button>
								))}
							</div>
						</div>
					)}

					{mode === 'memorable' && (
						<div className='flex w-full flex-wrap items-center gap-1.5'>
							{MEMORABLE_PATTERNS.map((pattern, index) => (
								<button
									key={pattern.pattern}
									type='button'
									title={`Например: ${pattern.example}`}
									aria-pressed={selectedPattern === index}
									onClick={() => setSelectedPattern(index)}
									className={toolPill(
										selectedPattern === index,
										'font-mono text-xs sm:text-sm'
									)}
								>
									{pattern.pattern}
								</button>
							))}
						</div>
					)}

					{mode === 'phrase' && (
						<div className='w-full space-y-3'>
							<div className='flex flex-wrap items-center gap-1.5'>
								<span className='mr-1 text-sm text-muted-foreground'>
									Словарь
								</span>
								{WORD_THEMES.map(theme => (
									<button
										key={theme.key}
										type='button'
										onClick={() => setCustomWords(theme.words)}
										aria-pressed={customWords === theme.words}
										className={toolPill(customWords === theme.words)}
									>
										{theme.label}
									</button>
								))}
							</div>
							<textarea
								value={customWords}
								onChange={event => setCustomWords(event.target.value)}
								placeholder='Свои слова через пробел — из них соберётся фраза'
								spellCheck={false}
								className='min-h-[3.5rem] w-full resize-none rounded-lg border bg-background px-3 py-2 font-mono text-sm placeholder:font-sans placeholder:text-muted-foreground/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							/>
						</div>
					)}
				</div>

				{history.length > 0 && (
					<div className='flex items-center justify-between gap-4 border-t px-5 py-3 sm:px-6'>
						<span className='text-sm text-muted-foreground'>
							Скопировано паролей: {history.length}
						</span>
						<button
							type='button'
							onClick={clearHistory}
							className='cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						>
							Забыть все
						</button>
					</div>
				)}
			</Card>

			{/* Тихий список под инструментом — раньше история копилась в
			    localStorage (до 50 записей) и не показывалась вообще нигде. */}
			{history.length > 0 && (
				<div className='mt-6'>
					<p className='px-1 text-sm text-muted-foreground'>
						Недавно скопированные
					</p>
					<div className='mt-2 divide-y rounded-xl border'>
						{history.map(item => (
							<button
								key={item.timestamp}
								type='button'
								onClick={() => copyToClipboard(item.password, item.strength)}
								title='Скопировать снова'
								className='flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset'
							>
								<span className='min-w-0 flex-1 truncate font-mono text-sm'>
									{item.password}
								</span>
								<span className='shrink-0 text-xs text-muted-foreground/70'>
									{new Date(item.timestamp).toLocaleTimeString('ru-RU', {
										hour: '2-digit',
										minute: '2-digit'
									})}
								</span>
							</button>
						))}
					</div>
				</div>
			)}

			<PasswordSeo />
		</WidgetSEOWrapper>
	)
}
