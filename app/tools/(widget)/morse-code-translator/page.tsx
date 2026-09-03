'use client'

import { useMemo, useRef, useState } from 'react'
import { ArrowLeftRight, Check, Copy, Play, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import {
	textToMorse,
	morseToText,
	detectTextLang,
	detectMorseLang,
	type MorseLang
} from '@/lib/utils/morse-code'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { MorseCodeTranslatorSeo } from './MorseCodeTranslatorSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

type Direction = 'encode' | 'decode'

// Длительность единицы сигнала в мс: точка — одна единица, тире — три,
// пауза между буквами — три, между словами — семь. Стандартное
// соотношение телеграфной азбуки Морзе.
const UNIT_MS = 80

export default function MorseCodeTranslatorPage() {
	const widget = getWidgetById('morse-code-translator')!

	const [direction, setDirection] = useState<Direction>('encode')
	// 'en' по умолчанию: у общих для обеих таблиц кодов (SOS и подобные)
	// нет способа доказать язык — русская таблица распознаёт даже чужие
	// коды (просто как другую букву), поэтому неоднозначность решаем в
	// пользу международного стандарта, а не тихо съезжаем на кириллицу.
	const [lang, setLang] = useState<MorseLang>('en')
	// SOS сразу в поле, не в плейсхолдере — показывает рабочий пример без
	// лишнего клика.
	const [input, setInput] = useState('SOS')
	const [copied, setCopied] = useState(false)
	const [playing, setPlaying] = useState(false)
	const audioCtxRef = useRef<AudioContext | null>(null)

	const output = useMemo(() => {
		if (!input.trim()) return ''
		return direction === 'encode'
			? textToMorse(input)
			: morseToText(input, lang)
	}, [input, direction, lang])

	const morseToPlay = direction === 'encode' ? output : input

	// При кодировании язык каждой буквы однозначен (кириллица и латиница не
	// пересекаются), поэтому detectTextLang здесь чисто для того, чтобы при
	// свапе направления декодер сразу открылся на подходящем языке — сама
	// кодировка от lang не зависит и мешать смешанный текст не мешает.
	//
	// При декодировании код Морзе неоднозначен: КАЖДЫЙ код существует в
	// обеих таблицах и означает РАЗНЫЕ буквы («...-» — это либо V, либо Ж).
	// Без разделителя языка внутри самого кода честно разделить смешанное
	// сообщение невозможно — detectMorseLang берёт язык с меньшим числом
	// нераспознанных «?» на весь ввод целиком, а не пословно.
	const updateInput = (value: string, dir: Direction) => {
		setInput(value)
		setLang(prev =>
			dir === 'encode'
				? detectTextLang(value, prev)
				: detectMorseLang(value, prev)
		)
	}

	const swapDirection = () => {
		const nextDirection = direction === 'encode' ? 'decode' : 'encode'
		setDirection(nextDirection)
		updateInput(output, nextDirection)
	}

	const copyResult = async () => {
		if (!output) return
		await navigator.clipboard.writeText(output)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const playMorse = () => {
		if (!morseToPlay.trim() || playing) return

		const ctx = audioCtxRef.current ?? new AudioContext()
		audioCtxRef.current = ctx
		setPlaying(true)

		const unit = UNIT_MS / 1000
		const startedAt = ctx.currentTime
		let time = startedAt

		const words = morseToPlay.trim().split('/')
		words.forEach((word, wordIndex) => {
			const letters = word.trim().split(/\s+/).filter(Boolean)
			letters.forEach((letter, letterIndex) => {
				;[...letter].forEach((symbol, symbolIndex) => {
					const duration = (symbol === '-' ? 3 : 1) * unit
					const osc = ctx.createOscillator()
					osc.frequency.value = 600
					osc.connect(ctx.destination)
					osc.start(time)
					osc.stop(time + duration)
					time += duration
					if (symbolIndex < letter.length - 1) time += unit
				})
				if (letterIndex < letters.length - 1) time += 3 * unit
			})
			if (wordIndex < words.length - 1) time += 7 * unit
		})

		setTimeout(() => setPlaying(false), (time - startedAt) * 1000 + 100)
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Шапка: направление и язык слева, действия справа. */}
				<div className={toolBar}>
					<div className={toolToggleTrack}>
						{(
							[
								['encode', 'Текст → Морзе'],
								['decode', 'Морзе → Текст']
							] as [Direction, string][]
						).map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setDirection(value)}
								aria-pressed={direction === value}
								className={toolToggleOption(direction === value)}
							>
								{label}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={playMorse}
							disabled={!morseToPlay.trim() || playing}
							title='Прослушать'
							className={toolIconButton}
						>
							<Play className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={swapDirection}
							disabled={!output}
							title='Поменять местами'
							className={toolIconButton}
						>
							<ArrowLeftRight className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyResult}
							disabled={!output}
							title='Скопировать результат'
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
							onClick={() => setInput('')}
							disabled={!input}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Рабочая область: ввод слева, результат справа. */}
				<div className='grid md:grid-cols-2'>
					<Textarea
						value={input}
						onChange={event => updateInput(event.target.value, direction)}
						placeholder={
							direction === 'encode'
								? 'Введите текст, например: SOS'
								: 'Введите код Морзе, например: ... --- ... (SOS)'
						}
						spellCheck={false}
						aria-label='Исходные данные'
						className='min-h-[12rem] resize-none rounded-none border-0 px-5 py-6 font-mono text-base focus-visible:ring-0 sm:px-6 md:border-r md:text-sm'
					/>

					{output ? (
						<pre className='min-h-[12rem] overflow-auto px-5 py-6 font-mono text-sm break-all whitespace-pre-wrap sm:px-6'>
							{output}
						</pre>
					) : (
						<p className='flex min-h-[12rem] items-center justify-center px-5 text-center text-sm text-muted-foreground'>
							Результат появится здесь
						</p>
					)}
				</div>

				{/* Нижняя полоса: выбор языка — нужен только при декодировании
				(каждый код Морзе соответствует и русской, и английской букве
				одновременно, поэтому расшифровка неоднозначна и требует выбора
				языка; при кодировании буквы кириллицы и латиницы не пересекаются,
				язык определяется однозначно по каждой букве, выбирать нечего). */}
				{direction === 'decode' && (
					<div className={toolFooterBar}>
						<span className='text-sm text-muted-foreground'>Язык</span>
						<div className={toolToggleTrack}>
							{(
								[
									['ru', 'Русский'],
									['en', 'English']
								] as [MorseLang, string][]
							).map(([value, label]) => (
								<button
									key={value}
									type='button'
									onClick={() => setLang(value)}
									aria-pressed={lang === value}
									className={toolToggleOption(lang === value)}
								>
									{label}
								</button>
							))}
						</div>
					</div>
				)}
			</Card>

			<ToolScreenshot slug='morse-code-translator' />
			<MorseCodeTranslatorSeo />
		</WidgetSEOWrapper>
	)
}
