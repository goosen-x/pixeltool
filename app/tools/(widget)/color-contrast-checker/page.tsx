'use client'

import { ContrastGuide } from './ContrastGuide'
import { useState, useCallback, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Copy, Check, RotateCcw, Shuffle, ArrowLeftRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'

interface ContrastResult {
	ratio: number
	normalTextAA: boolean
	normalTextAAA: boolean
	largeTextAA: boolean
	largeTextAAA: boolean
	uiComponentAA: boolean
}

interface ColorSuggestion {
	color: string
	ratio: number
	passesAA: boolean
	passesAAA: boolean
}

interface ColorPair {
	name: string
	foreground: string
	background: string
}

const COLOR_PAIRS: ColorPair[] = [
	{ name: 'Классический', foreground: '#000000', background: '#ffffff' },
	{ name: 'GitHub', foreground: '#24292e', background: '#ffffff' },
	{ name: 'Material Blue', foreground: '#1976d2', background: '#ffffff' },
	{ name: 'Success', foreground: '#155724', background: '#d4edda' },
	{ name: 'Warning', foreground: '#856404', background: '#fff3cd' },
	{ name: 'Danger', foreground: '#721c24', background: '#f8d7da' },
	{ name: 'Info', foreground: '#004085', background: '#d1ecf1' },
	{ name: 'Dark Mode', foreground: '#e4e4e7', background: '#18181b' },
	{ name: 'Purple Brand', foreground: '#ffffff', background: '#6b46c1' },
	{ name: 'Pastel', foreground: '#374151', background: '#fef3c7' }
]

const WCAG_GUIDELINES = {
	normalTextAA: 4.5,
	normalTextAAA: 7,
	largeTextAA: 3,
	largeTextAAA: 4.5,
	uiComponentAA: 3
}

// WCAG задаёт порог крупного текста в пунктах: 18pt обычного или 14pt жирного.
// Размер здесь везде в пикселях, поэтому переводим: 18pt = 24px, 14pt = 18.66px.
const LARGE_TEXT_PX = 24
const LARGE_TEXT_BOLD_PX = 18.66

const isLargeText = (
	fontSize: number,
	fontWeight: 'normal' | 'bold'
): boolean =>
	fontSize >= LARGE_TEXT_PX ||
	(fontWeight === 'bold' && fontSize >= LARGE_TEXT_BOLD_PX)

export default function ColorContrastCheckerPage() {
	const [foreground, setForeground] = useState('#000000')
	const [background, setBackground] = useState('#ffffff')
	const [fontSize, setFontSize] = useState(16)
	const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('normal')
	const [copied, setCopied] = useState(false)

	// Helper functions
	const hexToRgb = useCallback(
		(hex: string): [number, number, number] | null => {
			// \d, а не \\d: с экранированным бэкслешем класс превращался в
			// [a-f, \, d] и не принимал цифры — любой цвет вроде #2563eb отваливался
			const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
			return result
				? [
						parseInt(result[1], 16),
						parseInt(result[2], 16),
						parseInt(result[3], 16)
					]
				: null
		},
		[]
	)

	const rgbToHex = useCallback((r: number, g: number, b: number): string => {
		return (
			'#' +
			[r, g, b]
				.map(x => {
					const hex = x.toString(16)
					return hex.length === 1 ? '0' + hex : hex
				})
				.join('')
		)
	}, [])

	const getLuminance = useCallback(
		(color: string): number => {
			const rgb = hexToRgb(color)
			if (!rgb) return 0

			const [r, g, b] = rgb.map(val => {
				val = val / 255
				return val <= 0.03928
					? val / 12.92
					: Math.pow((val + 0.055) / 1.055, 2.4)
			})

			return 0.2126 * r + 0.7152 * g + 0.0722 * b
		},
		[hexToRgb]
	)

	const getContrastRatio = useCallback(
		(color1: string, color2: string): number => {
			const lum1 = getLuminance(color1)
			const lum2 = getLuminance(color2)
			const brightest = Math.max(lum1, lum2)
			const darkest = Math.min(lum1, lum2)
			return (brightest + 0.05) / (darkest + 0.05)
		},
		[getLuminance]
	)

	// Результат — производное от цветов, а не состояние: считаем прямо при
	// рендере, иначе на сервере карточка отдавалась пустой и мигала до гидратации.
	const result: ContrastResult = useMemo(() => {
		const ratio = getContrastRatio(foreground, background)
		return {
			ratio,
			normalTextAA: ratio >= WCAG_GUIDELINES.normalTextAA,
			normalTextAAA: ratio >= WCAG_GUIDELINES.normalTextAAA,
			largeTextAA: ratio >= WCAG_GUIDELINES.largeTextAA,
			largeTextAAA: ratio >= WCAG_GUIDELINES.largeTextAAA,
			uiComponentAA: ratio >= WCAG_GUIDELINES.uiComponentAA
		}
	}, [foreground, background, getContrastRatio])

	// Подсказки нужны, только когда контраст не дотягивает до AA
	const suggestions = useMemo(() => {
		const empty = {
			foreground: [] as ColorSuggestion[],
			background: [] as ColorSuggestion[]
		}
		if (result.normalTextAA) return empty

		const fgRgb = hexToRgb(foreground)
		const bgRgb = hexToRgb(background)
		if (!fgRgb || !bgRgb) return empty

		const foregroundSuggestions: ColorSuggestion[] = []
		const backgroundSuggestions: ColorSuggestion[] = []

		// Затемняем текст, пока не начнёт проходить AA
		for (let i = 0.9; i >= 0.1; i -= 0.1) {
			const color = rgbToHex(
				Math.round(fgRgb[0] * i),
				Math.round(fgRgb[1] * i),
				Math.round(fgRgb[2] * i)
			)
			const ratio = getContrastRatio(color, background)
			if (ratio >= WCAG_GUIDELINES.normalTextAA) {
				foregroundSuggestions.push({
					color,
					ratio,
					passesAA: true,
					passesAAA: ratio >= WCAG_GUIDELINES.normalTextAAA
				})
			}
		}

		// Осветляем фон
		for (let i = 0.1; i <= 1; i += 0.1) {
			const color = rgbToHex(
				Math.min(255, Math.round(bgRgb[0] + (255 - bgRgb[0]) * i)),
				Math.min(255, Math.round(bgRgb[1] + (255 - bgRgb[1]) * i)),
				Math.min(255, Math.round(bgRgb[2] + (255 - bgRgb[2]) * i))
			)
			const ratio = getContrastRatio(foreground, color)
			if (ratio >= WCAG_GUIDELINES.normalTextAA) {
				backgroundSuggestions.push({
					color,
					ratio,
					passesAA: true,
					passesAAA: ratio >= WCAG_GUIDELINES.normalTextAAA
				})
			}
		}

		return {
			foreground: foregroundSuggestions.slice(0, 4),
			background: backgroundSuggestions.slice(0, 4)
		}
	}, [
		result.normalTextAA,
		foreground,
		background,
		getContrastRatio,
		hexToRgb,
		rgbToHex
	])

	const swapColors = () => {
		const temp = foreground
		setForeground(background)
		setBackground(temp)
	}

	const randomColors = () => {
		const randomColor = () =>
			'#' +
			Math.floor(Math.random() * 16777215)
				.toString(16)
				.padStart(6, '0')
		const fg = randomColor()
		let bg = randomColor()

		// Ensure some contrast
		while (getContrastRatio(fg, bg) < 2) {
			bg = randomColor()
		}

		setForeground(fg)
		setBackground(bg)
	}

	const loadColorPair = (pair: ColorPair) => {
		setForeground(pair.foreground)
		setBackground(pair.background)
	}

	const copyResults = () => {
		const text = `
Проверка контрастности цветов WCAG

Цвет текста: ${foreground}
Цвет фона: ${background}
Коэффициент контрастности: ${result.ratio.toFixed(2)}:1

Результаты:
• Обычный текст AA (4.5:1): ${result.normalTextAA ? '✓ Пройдено' : '✗ Не пройдено'}
• Обычный текст AAA (7:1): ${result.normalTextAAA ? '✓ Пройдено' : '✗ Не пройдено'}
• Крупный текст AA (3:1): ${result.largeTextAA ? '✓ Пройдено' : '✗ Не пройдено'}
• Крупный текст AAA (4.5:1): ${result.largeTextAAA ? '✓ Пройдено' : '✗ Не пройдено'}
• UI компоненты AA (3:1): ${result.uiComponentAA ? '✓ Пройдено' : '✗ Не пройдено'}
    `.trim()

		navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const reset = () => {
		setForeground('#000000')
		setBackground('#ffffff')
		setFontSize(16)
		setFontWeight('normal')
	}

	// Раньше сюда отдавался только цвет текста, и он навешивался на Badge поверх
	// синего фона по умолчанию — получалось зелёное на синем, то есть сам
	// индикатор контраста был нечитаемым. Теперь фон и текст задаются парой.
	const getContrastLevel = (
		ratio: number
	): { label: string; hint: string; text: string; chip: string } => {
		if (ratio >= 7)
			return {
				label: 'AAA',
				hint: 'Отлично — проходит самый строгий уровень',
				text: 'text-green-700 dark:text-green-400',
				chip: 'bg-green-600 text-white'
			}
		if (ratio >= 4.5)
			return {
				label: 'AA',
				hint: 'Хорошо — годится для обычного текста',
				text: 'text-blue-700 dark:text-blue-400',
				chip: 'bg-blue-600 text-white'
			}
		if (ratio >= 3)
			return {
				label: 'AA Large',
				hint: 'Только для крупного текста от 24px',
				text: 'text-amber-700 dark:text-amber-400',
				chip: 'bg-amber-400 text-black'
			}
		return {
			label: 'Fail',
			hint: 'Не проходит — текст будет плохо читаться',
			text: 'text-red-700 dark:text-red-400',
			chip: 'bg-red-600 text-white'
		}
	}

	const level = getContrastLevel(result.ratio)

	const CRITERIA = [
		{
			label: 'Обычный текст',
			threshold: 'AA · 4.5:1',
			passed: result.normalTextAA
		},
		{
			label: 'Обычный текст',
			threshold: 'AAA · 7:1',
			passed: result.normalTextAAA
		},
		{
			label: 'Крупный текст',
			threshold: 'AA · 3:1',
			passed: result.largeTextAA
		},
		{
			label: 'Крупный текст',
			threshold: 'AAA · 4.5:1',
			passed: result.largeTextAAA
		},
		{
			label: 'Элементы интерфейса',
			threshold: 'AA · 3:1',
			passed: result.uiComponentAA
		}
	]

	/** Пара «пипетка + hex»: цвет берут то из макета, то подбирают на глаз. */
	const colorControl = (
		label: string,
		value: string,
		onChange: (value: string) => void
	) => (
		<label className='flex items-center gap-2 text-sm text-muted-foreground'>
			<span>{label}</span>
			<input
				type='color'
				value={value}
				onChange={event => onChange(event.target.value)}
				aria-label={label}
				className='h-7 w-9 cursor-pointer rounded-md border bg-background p-0.5'
			/>
			<input
				value={value}
				onChange={event => onChange(event.target.value)}
				spellCheck={false}
				className='w-24 rounded-md border bg-background px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
			/>
		</label>
	)

	return (
		<>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: два цвета — весь ввод этого инструмента. */}
				<div className={toolBar}>
					{colorControl('Текст', foreground, setForeground)}
					{colorControl('Фон', background, setBackground)}

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={swapColors}
							title='Поменять цвета местами'
							className={toolIconButton}
						>
							<ArrowLeftRight className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={randomColors}
							title='Случайная пара'
							className={toolIconButton}
						>
							<Shuffle className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyResults}
							title='Скопировать отчёт'
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
							onClick={reset}
							title='Сбросить'
							className={toolIconButton}
						>
							<RotateCcw className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Рабочая область: число и живой пример рядом. Раньше вердикт жил
				    в правой колонке, а пример — в левой, и на телефоне они
				    расходились на два экрана. */}
				<div className='grid items-center gap-8 px-5 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]'>
					<div className='flex flex-col items-center gap-2 text-center'>
						<span
							className={cn(
								'font-mono text-6xl font-bold tabular-nums',
								level.text
							)}
						>
							{result.ratio.toFixed(2)}
							<span className='text-2xl'>:1</span>
						</span>
						<span
							className={cn(
								'rounded-full px-3 py-1 text-sm font-semibold',
								level.chip
							)}
						>
							{level.label}
						</span>
						<span className='text-sm text-muted-foreground'>{level.hint}</span>
					</div>

					<div
						className='rounded-xl border p-6'
						style={{ backgroundColor: background }}
					>
						<p
							style={{
								color: foreground,
								fontSize: `${fontSize}px`,
								fontWeight: fontWeight
							}}
						>
							Съешь ещё этих мягких французских булок, да выпей чаю.
						</p>
						<div className='mt-4 flex items-center gap-3'>
							<span
								className='rounded border px-3 py-1.5 text-sm'
								style={{
									color: foreground,
									borderColor: foreground,
									backgroundColor: 'transparent'
								}}
							>
								Кнопка
							</span>
							<span
								className='h-2 flex-1 rounded'
								style={{ backgroundColor: foreground, opacity: 0.2 }}
							/>
						</div>
					</div>
				</div>

				{/* Полоса критериев: пять порогов WCAG одной строкой вместо пяти
				    отдельных плашек — глазами нужен ответ «что прошло», а не
				    список из пяти карточек. */}
				<div className={toolFooterBar}>
					{CRITERIA.map((criterion, index) => (
						<span
							key={index}
							className='flex items-center gap-2 text-sm text-muted-foreground'
						>
							<span
								aria-hidden
								className={cn(
									'flex h-4 w-4 items-center justify-center rounded-full text-[0.625rem] font-bold text-white',
									criterion.passed ? 'bg-green-600' : 'bg-red-600'
								)}
							>
								{criterion.passed ? '✓' : '✕'}
							</span>
							{criterion.label}
							<span className='font-mono text-xs'>{criterion.threshold}</span>
							<span className='sr-only'>
								{criterion.passed ? 'пройдено' : 'не пройдено'}
							</span>
						</span>
					))}
				</div>

				{/* Полоса текста: размер и начертание меняют не контраст, а порог,
				    по которому его оценивают. */}
				<div className={toolFooterBar}>
					<label className='flex items-center gap-2 text-sm text-muted-foreground'>
						<span className='font-mono text-xs'>font-size</span>
						<Slider
							value={[fontSize]}
							onValueChange={([value]) => setFontSize(value)}
							min={10}
							max={48}
							step={1}
							className='w-28 cursor-pointer'
							aria-label='Размер шрифта'
						/>
						<span className='w-12 font-mono text-sm text-foreground tabular-nums'>
							{fontSize}px
						</span>
					</label>

					<div className='flex flex-wrap items-center gap-1.5'>
						{(
							[
								['normal', 'Обычный'],
								['bold', 'Жирный']
							] as ['normal' | 'bold', string][]
						).map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setFontWeight(value)}
								aria-pressed={fontWeight === value}
								className={toolPill(fontWeight === value)}
							>
								{label}
							</button>
						))}
					</div>

					<span className='text-sm text-muted-foreground'>
						{isLargeText(fontSize, fontWeight)
							? 'Считается крупным текстом — порог AA 3:1'
							: 'Считается обычным текстом — порог AA 4.5:1'}
					</span>
				</div>

				{/* Полоса подсказок появляется, только когда пара не проходит AA. */}
				{(suggestions.foreground.length > 0 ||
					suggestions.background.length > 0) && (
					<div className={toolFooterBar}>
						{suggestions.foreground.length > 0 && (
							<div className='flex flex-wrap items-center gap-1.5'>
								<span className='mr-1 text-sm text-muted-foreground'>
									Затемнить текст
								</span>
								{suggestions.foreground.map((suggestion, index) => (
									<button
										key={index}
										type='button'
										onClick={() => setForeground(suggestion.color)}
										className={toolPill(false, 'flex items-center gap-2')}
									>
										<span
											className='h-3 w-3 rounded-full border'
											style={{ backgroundColor: suggestion.color }}
											aria-hidden
										/>
										<span className='font-mono text-xs'>
											{suggestion.color}
										</span>
										<span className='font-mono text-xs'>
											{suggestion.ratio.toFixed(1)}:1
										</span>
									</button>
								))}
							</div>
						)}

						{suggestions.background.length > 0 && (
							<div className='flex flex-wrap items-center gap-1.5'>
								<span className='mr-1 text-sm text-muted-foreground'>
									Осветлить фон
								</span>
								{suggestions.background.map((suggestion, index) => (
									<button
										key={index}
										type='button'
										onClick={() => setBackground(suggestion.color)}
										className={toolPill(false, 'flex items-center gap-2')}
									>
										<span
											className='h-3 w-3 rounded-full border'
											style={{ backgroundColor: suggestion.color }}
											aria-hidden
										/>
										<span className='font-mono text-xs'>
											{suggestion.color}
										</span>
										<span className='font-mono text-xs'>
											{suggestion.ratio.toFixed(1)}:1
										</span>
									</button>
								))}
							</div>
						)}
					</div>
				)}
			</Card>

			{/* Готовые пары — тихая полка под инструментом. */}
			<div className='mt-6'>
				<p className='px-1 text-sm text-muted-foreground'>
					Готовые пары — кликните, чтобы проверить
				</p>
				<div className='mt-2 flex flex-wrap gap-2'>
					{COLOR_PAIRS.map((pair, index) => (
						<button
							key={index}
							type='button'
							onClick={() => loadColorPair(pair)}
							title={pair.name}
							className='flex cursor-pointer items-center gap-2 rounded-full border px-2 py-1 transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						>
							<span
								className='flex h-5 w-9 items-center justify-center rounded text-[0.625rem] font-bold'
								style={{
									backgroundColor: pair.background,
									color: pair.foreground
								}}
								aria-hidden
							>
								Aa
							</span>
							<span className='text-xs text-muted-foreground'>{pair.name}</span>
						</button>
					))}
				</div>
			</div>

			<ContrastGuide />
		</>
	)
}
