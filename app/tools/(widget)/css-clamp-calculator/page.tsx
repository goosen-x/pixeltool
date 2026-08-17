'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import { ClampGuide } from './ClampGuide'

type Property = 'font-size' | 'margin' | 'padding'
type Unit = 'px' | 'rem'
type Format = 'css' | 'tailwind'

const PROPERTIES: Property[] = ['font-size', 'margin', 'padding']

/** Значения по умолчанию: типовой шаг «16 → 24 на экранах 375 → 1440». */
const DEFAULTS = { min: 16, max: 24, minViewport: 375, maxViewport: 1440 }

/** Префиксы Tailwind для произвольных значений в квадратных скобках. */
const TAILWIND_PREFIX: Record<Property, string> = {
	'font-size': 'text',
	margin: 'm',
	padding: 'p'
}

export default function ClampCalculatorPage() {
	const [unit, setUnit] = useState<Unit>('rem')
	const [format, setFormat] = useState<Format>('css')
	const [property, setProperty] = useState<Property>('font-size')
	const [minValue, setMinValue] = useState<number | ''>('')
	const [maxValue, setMaxValue] = useState<number | ''>('')
	const [minViewport, setMinViewport] = useState<number | ''>('')
	const [maxViewport, setMaxViewport] = useState<number | ''>('')
	const [copied, setCopied] = useState(false)
	const [errors, setErrors] = useState<string[]>([])

	const toRem = (value: number) => +(value / 16).toFixed(3)
	const toPx = (value: number) => +(value * 16).toFixed(3)

	const numMinValue = typeof minValue === 'number' ? minValue : DEFAULTS.min
	const numMaxValue = typeof maxValue === 'number' ? maxValue : DEFAULTS.max
	const numMinViewport =
		typeof minViewport === 'number' ? minViewport : DEFAULTS.minViewport
	const numMaxViewport =
		typeof maxViewport === 'number' ? maxViewport : DEFAULTS.maxViewport

	const variablePart =
		(numMaxValue - numMinValue) / (numMaxViewport - numMinViewport)
	const constant = parseFloat(
		((numMaxValue - numMaxViewport * variablePart) / 16).toFixed(3)
	)
	const vwValue = parseFloat((100 * variablePart).toFixed(2))

	const clampValue = `clamp(${toRem(numMinValue)}rem,${constant ? ` ${constant}rem +` : ''} ${vwValue}vw, ${toRem(numMaxValue)}rem)`

	// Когда минимум/максимум растут строго пропорционально ширине viewport,
	// базовое значение формулы — ровно 0, и rem-слагаемое пропадает из вывода:
	// получается чистый vw. Добавить «0rem +» косметически ничего не даст —
	// роста от rem в этой точке действительно нет, значит нет и реакции на
	// зум браузера (см. ClampGuide, «Почему нельзя писать только vw»).
	const isPureVw = constant === 0

	const cssResult = `${property}: ${clampValue};`
	const tailwindResult = `${TAILWIND_PREFIX[property]}-[clamp(${toRem(numMinValue)}rem,_${constant ? `${constant}rem_+_` : ''}${vwValue}vw,_${toRem(numMaxValue)}rem)]`
	const result = format === 'css' ? cssResult : tailwindResult

	const validate = useCallback(() => {
		const newErrors: string[] = []

		if (
			typeof minViewport === 'number' &&
			typeof maxViewport === 'number' &&
			(minViewport < 0 || maxViewport < 1)
		) {
			newErrors.push('Ширина экрана не может быть отрицательной')
		}
		if (
			typeof minValue === 'number' &&
			typeof maxValue === 'number' &&
			minValue >= maxValue
		) {
			newErrors.push('Минимальный размер должен быть меньше максимального')
		}
		if (
			typeof minViewport === 'number' &&
			typeof maxViewport === 'number' &&
			minViewport >= maxViewport
		) {
			newErrors.push(
				'Минимальная ширина экрана должна быть меньше максимальной'
			)
		}
		if ([minValue, maxValue, minViewport, maxViewport].some(v => v === '')) {
			newErrors.push('Заполните все четыре значения')
		}

		setErrors(newErrors)
	}, [minValue, maxValue, minViewport, maxViewport])

	const copyResult = async () => {
		await navigator.clipboard.writeText(result)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const reset = () => {
		setMinValue(DEFAULTS.min)
		setMaxValue(DEFAULTS.max)
		setMinViewport(DEFAULTS.minViewport)
		setMaxViewport(DEFAULTS.maxViewport)
		setUnit('rem')
		setFormat('css')
		setProperty('font-size')
	}

	// Размеры хранятся в px независимо от выбранной единицы: так переключение
	// px ⇄ rem не теряет точность на каждом обороте.
	const handleValueChange = (
		value: string,
		setter: (v: number | '') => void
	) => {
		if (value === '') {
			setter('')
			return
		}
		const numValue = parseFloat(value)
		if (isNaN(numValue)) return

		setter(unit === 'rem' ? toPx(numValue) : numValue)
	}

	const displayValue = (value: number | '') =>
		value === '' ? '' : unit === 'px' ? value : toRem(value)

	useEffect(() => {
		validate()
	}, [validate])

	// Save to URL
	useEffect(() => {
		if ([minValue, maxValue, minViewport, maxViewport].some(v => v === ''))
			return

		const params = new URLSearchParams()
		params.set(
			'values',
			`${minValue},${maxValue},${minViewport},${maxViewport}`
		)
		window.history.replaceState({}, '', `?${params.toString()}`)
	}, [minValue, maxValue, minViewport, maxViewport])

	// Load from URL
	useEffect(() => {
		const params = new URLSearchParams(window.location.search)
		const values = params.get('values')?.split(',').map(Number)

		if (values && values.length === 4 && values.every(v => !isNaN(v))) {
			setMinValue(values[0])
			setMaxValue(values[1])
			setMinViewport(values[2])
			setMaxViewport(values[3])
		} else {
			setMinValue(DEFAULTS.min)
			setMaxValue(DEFAULTS.max)
			setMinViewport(DEFAULTS.minViewport)
			setMaxViewport(DEFAULTS.maxViewport)
		}
	}, [])

	// Демо-контейнер ресайзится мышью (CSS resize), но vw в реальном CSS
	// реагирует на ширину БРАУЗЕРА, а не этого блока — ресайз ничего бы не
	// показал. Поэтому здесь считаем результат clamp() в JS от ширины именно
	// контейнера (ResizeObserver) и применяем как px напрямую.
	const demoContainerRef = useRef<HTMLDivElement>(null)
	const [demoWidth, setDemoWidth] = useState(numMaxViewport)

	useEffect(() => {
		const el = demoContainerRef.current
		if (!el) return
		const observer = new ResizeObserver(entries => {
			setDemoWidth(entries[0].contentRect.width)
		})
		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	const demoComputedPx = Math.min(
		numMaxValue,
		Math.max(
			numMinValue,
			numMinValue + variablePart * (demoWidth - numMinViewport)
		)
	)

	/** Поле-значение в формуле: подчёркнутая строка вместо коробки Input. */
	const field = (
		value: number | '',
		onChange: (value: string) => void,
		label: string
	) => (
		<input
			type='number'
			step='any'
			value={value}
			onChange={event => onChange(event.target.value)}
			aria-label={label}
			className='w-20 border-b bg-transparent pb-1 text-center font-mono text-2xl text-foreground focus:border-primary focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
		/>
	)

	return (
		<>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: свойство, для которого собирается правило.
				    Раньше это был третий радио-список внизу карточки — рядом с
				    результатом, но управлял он его началом. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						<span className='mr-1 text-sm text-muted-foreground'>Свойство</span>
						{PROPERTIES.map(item => (
							<button
								key={item}
								type='button'
								onClick={() => setProperty(item)}
								aria-pressed={property === item}
								className={toolPill(property === item, 'font-mono')}
							>
								{item}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={reset}
							title='Вернуть значения по умолчанию'
							className={toolIconButton}
						>
							<RotateCcw className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Рабочая область: условие задачи одной фразой. Четыре числа в
				    двух подписанных колонках («Значения» / «Viewport») читались как
				    две разные настройки, хотя это одно предложение. */}
				<div className='px-5 py-8 sm:px-6'>
					<div className='flex flex-wrap items-baseline justify-center gap-x-3 gap-y-4 text-sm text-muted-foreground'>
						<span>Размер от</span>
						{field(
							displayValue(minValue),
							v => handleValueChange(v, setMinValue),
							'Минимальный размер'
						)}
						<span>до</span>
						{field(
							displayValue(maxValue),
							v => handleValueChange(v, setMaxValue),
							'Максимальный размер'
						)}
						<span className='font-mono'>{unit}</span>
						<span className='w-full text-center sm:w-auto'>
							при ширине экрана от
						</span>
						{field(
							minViewport,
							v => setMinViewport(v === '' ? '' : parseFloat(v)),
							'Минимальная ширина экрана'
						)}
						<span>до</span>
						{field(
							maxViewport,
							v => setMaxViewport(v === '' ? '' : parseFloat(v)),
							'Максимальная ширина экрана'
						)}
						<span className='font-mono'>px</span>
					</div>

					{errors.length > 0 ? (
						<p className='mt-10 text-center text-sm text-destructive'>
							{errors[0]}
						</p>
					) : (
						<>
							{/* Результат-герой: строка целиком кликабельна, отдельной
							    кнопки «Скопировать» под ней нет. */}
							<button
								type='button'
								onClick={copyResult}
								title='Скопировать'
								className='group mt-10 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border px-4 py-5 text-left transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							>
								<code className='font-mono text-sm break-all sm:text-base'>
									{result}
								</code>
								{copied ? (
									<Check className='h-4 w-4 shrink-0 text-green-600 dark:text-green-400' />
								) : (
									<Copy className='h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground' />
								)}
							</button>

							{isPureVw && (
								<p className='mt-4 text-center text-sm text-amber-600 dark:text-amber-500'>
									Минимум и максимум растут строго пропорционально ширине
									экрана, поэтому в формуле остался чистый <code>vw</code> без{' '}
									<code>rem</code>: такой размер не отреагирует на зум браузера
									и не пройдёт WCAG 1.4.4. Измените минимум или максимум.
								</p>
							)}
						</>
					)}
				</div>

				{/* Нижняя полоса: в каких единицах вводятся размеры и в каком виде
				    забирается результат. */}
				<div className={toolFooterBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						<span className='mr-1 text-sm text-muted-foreground'>Единицы</span>
						<div className={toolToggleTrack}>
							{(['px', 'rem'] as Unit[]).map(item => (
								<button
									key={item}
									type='button'
									onClick={() => setUnit(item)}
									aria-pressed={unit === item}
									className={toolToggleOption(unit === item, 'font-mono')}
								>
									{item}
								</button>
							))}
						</div>
					</div>

					<div className='flex flex-wrap items-center gap-1.5'>
						<span className='mr-1 text-sm text-muted-foreground'>
							Результат
						</span>
						<div className={toolToggleTrack}>
							{(
								[
									['css', 'CSS'],
									['tailwind', 'Tailwind']
								] as [Format, string][]
							).map(([value, label]) => (
								<button
									key={value}
									type='button'
									onClick={() => setFormat(value)}
									aria-pressed={format === value}
									className={toolToggleOption(format === value)}
								>
									{label}
								</button>
							))}
						</div>
					</div>
				</div>
			</Card>

			{/* Предпросмотр — тихий блок под инструментом: он объясняет результат,
			    но не участвует в его получении. */}
			<div className='mt-6'>
				<p className='px-1 text-sm text-muted-foreground'>
					Потяните за правый нижний угол — размер посчитан от ширины блока, как
					будто это экран. Сейчас {Math.round(demoWidth)}px →{' '}
					<span className='font-mono'>{demoComputedPx.toFixed(1)}px</span>
				</p>
				<div
					ref={demoContainerRef}
					className={cn(
						'mt-2 min-w-[15rem] max-w-full resize-x overflow-auto rounded-xl border p-6',
						'bg-muted/20'
					)}
					style={{ width: '100%' }}
				>
					<p
						className='leading-relaxed'
						style={{ [property]: `${demoComputedPx}px` }}
					>
						Этот текст меняет размер вместе с шириной блока
					</p>
				</div>
			</div>

			<ClampGuide />
		</>
	)
}
