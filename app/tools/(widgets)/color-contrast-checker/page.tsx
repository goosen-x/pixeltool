'use client'

import { ContrastGuide } from './ContrastGuide'
import { useState, useCallback, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import {
	Copy,
	RefreshCw,
	CheckCircle,
	AlertCircle,
	XCircle,
	Palette,
	Type,
	Shuffle
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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
		toast.success('Цвета поменяны местами')
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
		toast.success('Случайные цвета сгенерированы')
	}

	const loadColorPair = (pair: ColorPair) => {
		setForeground(pair.foreground)
		setBackground(pair.background)
		toast.success(`Загружена пара: ${pair.name}`)
	}

	const copyResults = () => {
		if (!result) return

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
		toast.success('Результаты скопированы!')
	}

	const reset = () => {
		setForeground('#000000')
		setBackground('#ffffff')
		setFontSize(16)
		setFontWeight('normal')
		toast.success('Настройки сброшены')
	}

	const getStatusIcon = (passes: boolean) => {
		return passes ? (
			<CheckCircle className='w-4 h-4 text-green-500' />
		) : (
			<XCircle className='w-4 h-4 text-red-500' />
		)
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

	return (
		<div className='max-w-7xl mx-auto space-y-6'>
			<Card className='space-y-6 p-6'>
				{/* Готовые пары — ряд наверху: с них удобно начинать */}
				<div className='flex flex-wrap items-center gap-2'>
					<span className='mr-1 text-sm font-medium text-muted-foreground'>
						Готовые пары:
					</span>
					{COLOR_PAIRS.map((pair, index) => (
						<Button
							key={index}
							onClick={() => loadColorPair(pair)}
							variant='outline'
							size='sm'
							className='h-auto cursor-pointer gap-2 py-1.5'
						>
							<span
								className='flex h-5 w-9 items-center justify-center rounded border text-[10px] font-bold'
								style={{
									backgroundColor: pair.background,
									color: pair.foreground
								}}
								aria-hidden
							>
								Aa
							</span>
							<span className='text-xs'>{pair.name}</span>
						</Button>
					))}
				</div>

				<div className='grid gap-8 border-t pt-6 lg:grid-cols-2'>
					{/* Слева: что задаём и как это выглядит */}
					<div className='space-y-5'>
						<div className='grid gap-4 sm:grid-cols-2'>
							<div>
								<Label htmlFor='foreground' className='flex items-center gap-2'>
									<Type className='h-4 w-4' />
									Цвет текста
								</Label>
								<div className='mt-2 flex gap-2'>
									<Input
										id='foreground'
										type='color'
										value={foreground}
										onChange={e => setForeground(e.target.value)}
										className='h-10 w-14 cursor-pointer p-1'
									/>
									<Input
										type='text'
										value={foreground}
										onChange={e => setForeground(e.target.value)}
										placeholder='#000000'
										className='flex-1 font-mono'
									/>
								</div>
							</div>

							<div>
								<Label htmlFor='background' className='flex items-center gap-2'>
									<Palette className='h-4 w-4' />
									Цвет фона
								</Label>
								<div className='mt-2 flex gap-2'>
									<Input
										id='background'
										type='color'
										value={background}
										onChange={e => setBackground(e.target.value)}
										className='h-10 w-14 cursor-pointer p-1'
									/>
									<Input
										type='text'
										value={background}
										onChange={e => setBackground(e.target.value)}
										placeholder='#ffffff'
										className='flex-1 font-mono'
									/>
								</div>
							</div>
						</div>

						<div className='flex flex-wrap gap-2'>
							<Button
								onClick={swapColors}
								variant='outline'
								size='sm'
								className='cursor-pointer'
							>
								<RefreshCw className='mr-2 h-4 w-4' />
								Поменять местами
							</Button>
							<Button
								onClick={randomColors}
								variant='outline'
								size='sm'
								className='cursor-pointer'
							>
								<Shuffle className='mr-2 h-4 w-4' />
								Случайные
							</Button>
							<Button
								onClick={copyResults}
								variant='outline'
								size='sm'
								className='cursor-pointer'
							>
								<Copy className='mr-2 h-4 w-4' />
								Скопировать отчёт
							</Button>
							<Button
								onClick={reset}
								variant='ghost'
								size='sm'
								className='cursor-pointer'
							>
								Сбросить
							</Button>
						</div>

						<div className='grid gap-4 sm:grid-cols-2'>
							<div>
								<Label htmlFor='font-size'>Размер шрифта</Label>
								<div className='mt-1 flex items-center gap-2'>
									<Slider
										id='font-size'
										value={[fontSize]}
										onValueChange={value => setFontSize(value[0])}
										min={10}
										max={48}
										step={1}
										className='flex-1'
									/>
									<span className='w-12 text-right text-sm'>{fontSize}px</span>
								</div>
							</div>

							<div>
								<Label htmlFor='font-weight'>Начертание</Label>
								<div className='mt-1 flex items-center gap-2'>
									<Select
										value={fontWeight}
										onValueChange={(value: 'normal' | 'bold') =>
											setFontWeight(value)
										}
									>
										<SelectTrigger className='flex-1 cursor-pointer'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='normal' className='cursor-pointer'>
												Обычный
											</SelectItem>
											<SelectItem value='bold' className='cursor-pointer'>
												Жирный
											</SelectItem>
										</SelectContent>
									</Select>
									<Badge
										variant={
											isLargeText(fontSize, fontWeight)
												? 'secondary'
												: 'outline'
										}
										className='shrink-0'
									>
										{isLargeText(fontSize, fontWeight) ? 'Крупный' : 'Обычный'}
									</Badge>
								</div>
							</div>
						</div>

						{/* Предпросмотр — под своими же настройками */}
						<div
							className='rounded-lg border p-6'
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
								<button
									className='cursor-pointer rounded border px-3 py-1.5 text-sm'
									style={{
										color: foreground,
										borderColor: foreground,
										backgroundColor: 'transparent'
									}}
								>
									Кнопка
								</button>
								<div
									className='h-2 flex-1 rounded'
									style={{ backgroundColor: foreground, opacity: 0.2 }}
								/>
							</div>
						</div>
					</div>

					{/* Справа: вердикт */}
					<div className='space-y-5'>
						<div className='flex flex-col items-center gap-2 text-center'>
							<span className='text-sm text-muted-foreground'>
								Коэффициент контрастности
							</span>
							<span
								className={cn(
									'font-mono text-5xl font-bold tabular-nums',
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
							<span className='text-sm text-muted-foreground'>
								{level.hint}
							</span>
						</div>

						<div className='space-y-2'>
							{CRITERIA.map((c, index) => (
								<div
									key={index}
									className='flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2'
								>
									<div className='min-w-0'>
										<span className='text-sm'>{c.label}</span>
										<span className='ml-2 font-mono text-xs text-muted-foreground'>
											{c.threshold}
										</span>
									</div>
									{getStatusIcon(c.passed)}
								</div>
							))}
						</div>

						{(suggestions.foreground.length > 0 ||
							suggestions.background.length > 0) && (
							<div className='space-y-4 border-t pt-5'>
								<h3 className='flex items-center gap-2 text-sm font-medium'>
									<AlertCircle className='h-4 w-4 text-amber-600' />
									Как починить
								</h3>

								{suggestions.foreground.length > 0 && (
									<div>
										<p className='mb-2 text-xs text-muted-foreground'>
											Затемнить текст:
										</p>
										<div className='flex flex-wrap gap-2'>
											{suggestions.foreground.map((s, index) => (
												<Button
													key={index}
													onClick={() => setForeground(s.color)}
													variant='outline'
													size='sm'
													className='cursor-pointer gap-2'
												>
													<span
														className='h-4 w-4 rounded border'
														style={{ backgroundColor: s.color }}
														aria-hidden
													/>
													<span className='font-mono text-xs'>{s.color}</span>
													<span className='font-mono text-xs text-muted-foreground'>
														{s.ratio.toFixed(1)}:1
													</span>
												</Button>
											))}
										</div>
									</div>
								)}

								{suggestions.background.length > 0 && (
									<div>
										<p className='mb-2 text-xs text-muted-foreground'>
											Осветлить фон:
										</p>
										<div className='flex flex-wrap gap-2'>
											{suggestions.background.map((s, index) => (
												<Button
													key={index}
													onClick={() => setBackground(s.color)}
													variant='outline'
													size='sm'
													className='cursor-pointer gap-2'
												>
													<span
														className='h-4 w-4 rounded border'
														style={{ backgroundColor: s.color }}
														aria-hidden
													/>
													<span className='font-mono text-xs'>{s.color}</span>
													<span className='font-mono text-xs text-muted-foreground'>
														{s.ratio.toFixed(1)}:1
													</span>
												</Button>
											))}
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</Card>

			<ContrastGuide />
		</div>
	)
}
