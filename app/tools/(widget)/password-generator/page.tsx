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

type GeneratorMode = 'random' | 'memorable' | 'phrase'

/** Стойкость в битах энтропии плюс подпись, из чего эти биты набраны. */
interface Strength {
	bits: number
	caption: string
}

interface Generated extends Strength {
	value: string
}

/** Как склеиваем слова во фразу. Число добавляется только там, где сказано. */
interface PhraseFormat {
	key: string
	label: string
	withNumber: boolean
	join: (words: string[], number: number) => string
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

const capitalize = (word: string) =>
	word.charAt(0).toUpperCase() + word.slice(1)

const PHRASE_FORMATS: PhraseFormat[] = [
	{
		key: 'dash',
		label: 'через дефис',
		withNumber: false,
		join: words => words.join('-')
	},
	{
		key: 'dot',
		label: 'через точку',
		withNumber: false,
		join: words => words.join('.')
	},
	{
		key: 'camel',
		label: 'СлитноСЗаглавных',
		withNumber: false,
		join: words => words.map(capitalize).join('')
	},
	{
		key: 'dash-number',
		label: 'дефис и число',
		withNumber: true,
		join: (words, number) => `${words.join('-')}-${number}`
	}
]

/** Сколько слов в фразе. Пять — 65 бит, разумный минимум для важного аккаунта. */
const WORD_COUNTS = [4, 5, 6, 7]

/**
 * Случайное число от 0 до max-1 на криптостойком источнике.
 *
 * Math.random() здесь не годится: он не криптостойкий, а из этих чисел
 * выбираются слова пароля. Хвост диапазона, который не делится на max нацело,
 * отбрасываем — иначе первые значения выпадали бы чаще (смещение остатка).
 */
const randomInt = (max: number): number => {
	const limit = Math.floor(0x100000000 / max) * max
	const buffer = new Uint32Array(1)
	let value = 0

	do {
		crypto.getRandomValues(buffer)
		value = buffer[0]
	} while (value >= limit)

	return value % max
}

// Паролей в секунду. Оценка для быстрого хэша (MD5/SHA-1 на GPU) — ровно та же,
// по которой считает калькулятор в статье /blog/nadezhnyy-parol. Держать их
// одинаковыми обязательно: иначе сайт сам себе противоречит в цифрах.
const BRUTE_FORCE_SPEED = 1e10

const plural = (n: number, one: string, few: string, many: string): string => {
	const mod10 = n % 10
	const mod100 = n % 100
	if (mod10 === 1 && mod100 !== 11) return one
	if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
	return many
}

/**
 * Среднее время полного перебора: половина пространства вариантов, делённая на
 * скорость атаки. Считается из энтропии в битах, а не из внешнего вида строки —
 * для парольной фразы атакующий перебирает слова из словаря, а не символы, и
 * это на порядки меньше комбинаций.
 */
const formatCrackTime = (bits: number): string => {
	const seconds = Math.pow(2, bits) / 2 / BRUTE_FORCE_SPEED

	if (seconds < 1) return 'мгновенно'
	if (seconds < 60) {
		const value = Math.round(seconds)
		return `${value} ${plural(value, 'секунду', 'секунды', 'секунд')}`
	}

	const minutes = seconds / 60
	if (minutes < 60) {
		const value = Math.round(minutes)
		return `${value} ${plural(value, 'минуту', 'минуты', 'минут')}`
	}

	const hours = minutes / 60
	if (hours < 24) {
		const value = Math.round(hours)
		return `${value} ${plural(value, 'час', 'часа', 'часов')}`
	}

	const days = hours / 24
	if (days < 31) {
		const value = Math.round(days)
		return `${value} ${plural(value, 'день', 'дня', 'дней')}`
	}

	const months = days / 30.4
	if (months < 12) {
		const value = Math.round(months)
		return `${value} ${plural(value, 'месяц', 'месяца', 'месяцев')}`
	}

	const years = days / 365
	// Возраст Вселенной — 13,8 млрд лет. Дальше цифра перестаёт что-либо значить
	// для человека, и честнее сказать это словами, чем печатать 10^24 лет.
	if (years > 1.4e10) return 'дольше, чем существует Вселенная'

	const scales: [number, string, string, string][] = [
		[1e9, 'миллиард', 'миллиарда', 'миллиардов'],
		[1e6, 'миллион', 'миллиона', 'миллионов'],
		[1e3, 'тысяча', 'тысячи', 'тысяч']
	]

	for (const [size, one, few, many] of scales) {
		if (years >= size) {
			const value = Math.round(years / size)
			return `${value} ${plural(value, one, few, many)} лет`
		}
	}

	const value = Math.round(years)
	return `${value} ${plural(value, 'год', 'года', 'лет')}`
}

export default function PasswordGeneratorPage() {
	const widget = getWidgetById('password-generator')!
	const [password, setPassword] = useState('')
	const [options, setOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS)
	const [strength, setStrength] = useState<Strength | null>(null)
	const [showPassword, setShowPassword] = useState(true)
	const [mode, setMode] = useState<GeneratorMode>('random')
	const [formatKey, setFormatKey] = useState(PHRASE_FORMATS[0].key)
	const [wordCount, setWordCount] = useState(5)
	const [wordlist, setWordlist] = useState<readonly string[] | null>(null)
	const [customWords, setCustomWords] = useState('')
	const [copied, setCopied] = useState(false)

	// Character sets
	const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
	const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const NUMBERS = '0123456789'
	const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
	const SIMILAR = 'il1Lo0O'
	const AMBIGUOUS = '{}[]()/\\\\\'"`~,;.<>'

	const generatePassword = useCallback((): Generated | null => {
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

		// Энтропия честная: длина × log2(размер алфавита) уже после исключений.
		// Снятая галочка «без похожих» реально уменьшает алфавит, и это видно.
		return {
			value: newPassword,
			bits: options.length * Math.log2(charset.length),
			caption: `${options.length} ${plural(options.length, 'символ', 'символа', 'символов')} · алфавит ${charset.length}`
		}
	}, [options, AMBIGUOUS])

	// Одна механика на оба словесных режима: выбрать N слов из словаря
	// НЕЗАВИСИМО (с возвращением) и склеить выбранным форматом.
	//
	// Раньше режим «Из слов» брал четыре слова и просто перемешивал их между
	// собой — это 4! = 24 варианта, около 8 бит, пароль ломался мгновенно.
	// Перестановка фиксированного набора не создаёт энтропию, её создаёт только
	// независимый выбор каждого слова из большого словаря.
	const buildPhrase = useCallback(
		(dictionary: readonly string[]): Generated => {
			const format =
				PHRASE_FORMATS.find(item => item.key === formatKey) ?? PHRASE_FORMATS[0]

			const words = Array.from(
				{ length: wordCount },
				() => dictionary[randomInt(dictionary.length)]
			)
			const number = randomInt(100)

			const bits =
				wordCount * Math.log2(dictionary.length) +
				(format.withNumber ? Math.log2(100) : 0)

			return {
				value: format.join(words, number),
				bits,
				caption: `${wordCount} ${plural(wordCount, 'слово', 'слова', 'слов')} из словаря в ${dictionary.length.toLocaleString('ru-RU')}${format.withNumber ? ' и число' : ''}`
			}
		},
		[formatKey, wordCount]
	)

	const generate = useCallback(() => {
		// Пока словарь не подгрузился, собирать фразу не из чего — показываем
		// пустое состояние, а не пароль из четырёх слов-заглушек.
		if (mode !== 'random') {
			if (!wordlist) return

			const custom = customWords
				.trim()
				.split(/\s+/)
				.filter(word => word.length > 0)

			const dictionary =
				mode === 'phrase' && custom.length >= 2
					? Array.from(new Set(custom))
					: wordlist

			const built = buildPhrase(dictionary)
			setPassword(built.value)
			setStrength({ bits: built.bits, caption: built.caption })
			return
		}

		const next = generatePassword()

		if (next === null) {
			// Все наборы символов сняты — пароль собирать не из чего. Пустое поле
			// с подсказкой честнее тоста, который исчезнет через секунду.
			setPassword('')
			setStrength(null)
			return
		}

		setPassword(next.value)
		setStrength({ bits: next.bits, caption: next.caption })
	}, [mode, wordlist, customWords, buildPhrase, generatePassword])

	// Словарь на 7776 слов весит около 90 КБ — тем, кто пришёл за случайным
	// паролем, он не нужен, поэтому грузим его только при первом заходе в
	// словесный режим.
	useEffect(() => {
		if (mode === 'random' || wordlist) return

		let cancelled = false
		import('@/lib/constants/eff-wordlist').then(module => {
			if (!cancelled) setWordlist(module.EFF_WORDLIST)
		})

		return () => {
			cancelled = true
		}
	}, [mode, wordlist])

	// Пароль пересобирается сам при любой смене параметров — раньше человек
	// двигал ползунок длины и ничего не происходило, пока он не нажмёт кнопку.
	useEffect(() => {
		generate()
	}, [generate])

	const copyToClipboard = useCallback(
		async (value = password) => {
			if (!value) return

			try {
				await navigator.clipboard.writeText(value)
				setCopied(true)
				toast.success('Скопировано')
				setTimeout(() => setCopied(false), 2000)
			} catch {
				toast.error('Не удалось скопировать — сохраните пароль вручную')
			}
		},
		[password]
	)

	// Цвет по битам энтропии, а не по баллам эвристики: меньше 40 бит пароль
	// ломается за обозримое время, 60+ — уже серьёзно, 80+ перебором
	// практически недостижим.
	const strengthTone = !strength
		? 'text-muted-foreground'
		: strength.bits >= 80
			? 'text-emerald-600 dark:text-emerald-400'
			: strength.bits >= 60
				? 'text-foreground'
				: strength.bits >= 40
					? 'text-amber-600 dark:text-amber-400'
					: 'text-red-600 dark:text-red-500'

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
							onClick={() => copyToClipboard()}
							disabled={!password}
							title='Скопировать пароль'
							className={toolIconButton}
						>
							{copied ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
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
				    Он и есть результат работы инструмента, всё остальное вокруг.
				    Кликабелен целиком: копировать нужно чаще, чем выделять
				    вручную, а иконка в шапке для этого же действия — не
				    единственный путь. */}
				<div className='px-5 py-10 sm:px-6 sm:py-14'>
					<button
						type='button'
						onClick={() => copyToClipboard()}
						disabled={!password}
						title='Скопировать пароль'
						className='min-h-[3rem] w-full cursor-pointer text-center font-mono text-2xl break-all select-all transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default disabled:hover:opacity-100 sm:text-3xl lg:text-4xl'
					>
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
					</button>

					{/* Вместо абстрактной шкалы «сильный/слабый» — сколько займёт
					    перебор. Оценка «сильный» ничего не говорит о том, по чьей она
					    шкале, и врала на парольных фразах: четыре словарных слова
					    набирали максимум баллов за длину, хотя по словарю ломаются
					    несопоставимо быстрее случайной строки той же длины. */}
					{password && strength && (
						<div className='mt-6 text-center'>
							<p className={cn('text-sm font-medium', strengthTone)}>
								Перебор займёт {formatCrackTime(strength.bits)}
							</p>
							<p className='mt-1 text-xs text-muted-foreground'>
								{strength.caption} · {Math.round(strength.bits)}{' '}
								{plural(Math.round(strength.bits), 'бит', 'бита', 'бит')}
							</p>
						</div>
					)}
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
						<div className='flex w-full flex-wrap items-center gap-x-6 gap-y-3'>
							<div className='flex flex-wrap items-center gap-1.5'>
								<span className='mr-1 text-sm text-muted-foreground'>Слов</span>
								{WORD_COUNTS.map(count => (
									<button
										key={count}
										type='button'
										onClick={() => setWordCount(count)}
										aria-pressed={wordCount === count}
										title={`${count} слова — около ${Math.round(count * Math.log2(7776))} бит`}
										className={toolPill(
											wordCount === count,
											'min-w-10 text-center'
										)}
									>
										{count}
									</button>
								))}
							</div>

							<div className='flex flex-wrap items-center gap-1.5'>
								{PHRASE_FORMATS.map(format => (
									<button
										key={format.key}
										type='button'
										onClick={() => setFormatKey(format.key)}
										aria-pressed={formatKey === format.key}
										className={toolPill(formatKey === format.key)}
									>
										{format.label}
									</button>
								))}
							</div>
						</div>
					)}

					{mode === 'phrase' && (
						<div className='w-full space-y-2'>
							<textarea
								value={customWords}
								onChange={event => setCustomWords(event.target.value)}
								placeholder='Свои слова через пробел — фраза соберётся из них'
								spellCheck={false}
								className='min-h-[3.5rem] w-full resize-none rounded-lg border bg-background px-3 py-2 font-mono text-sm placeholder:font-sans placeholder:text-muted-foreground/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							/>
							{/* Прямо говорим, чем расплачивается свой словарь: десять своих
							    слов дают заметно меньше вариантов, чем 7776 из готового. */}
							<p className='text-xs text-muted-foreground'>
								{customWords.trim().split(/\s+/).filter(Boolean).length >= 2
									? 'Слова берутся из вашего списка — чем он короче, тем меньше вариантов у пароля.'
									: 'Пока поле пустое, слова берутся из словаря на 7776 слов.'}
							</p>
						</div>
					)}
				</div>
			</Card>

			<PasswordSeo />
		</WidgetSEOWrapper>
	)
}
