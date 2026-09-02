'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { useCopyToClipboard } from '@/lib/hooks/useCopyToClipboard'
import {
	buildCss,
	computeNestedRadius,
	computeOuterRadius
} from '@/lib/utils/nested-radius'
import { NestedBorderRadiusSeo } from './NestedBorderRadiusSeo'

/**
 * Что считаем. Третий режим — «одинаковый радиус» — не расчёт, а образец
 * того, как выглядит распространённая ошибка: переключаясь на него и
 * обратно, видно, ради чего вообще нужна формула. Без этой возможности
 * инструмент отвечает на вопрос «сколько», но не показывает «зачем».
 */
type Mode = 'inner' | 'outer' | 'same'

const MODES: [Mode, string][] = [
	['inner', 'Внутренний: Rₑ − E'],
	['outer', 'Внешний: Rᵢ + E'],
	['same', 'Одинаковый']
]

/**
 * Цвета направляющих окружностей — та же пара, что проверена валидатором
 * палитры для графика сложного процента: разделение по дальтонизму ΔE 23.1
 * в светлой теме и 19.6 в тёмной. Окружности вдобавок подписаны в легенде,
 * так что цвет здесь не единственный различитель.
 */
const OUTER_GUIDE = 'var(--guide-outer)'
const INNER_GUIDE = 'var(--guide-inner)'

const round = (value: number) => Math.round(value * 100) / 100

export default function NestedBorderRadiusPage() {
	const widget = getWidgetById('nested-border-radius')!

	const [mode, setMode] = useState<Mode>('inner')
	const [radius, setRadius] = useState(40)
	const [padding, setPadding] = useState(20)
	const [border, setBorder] = useState(3)
	const [showCircles, setShowCircles] = useState(true)
	const [zoomed, setZoomed] = useState(false)

	const { copyToClipboard, copiedItem } = useCopyToClipboard()

	const gap = { padding, border }
	const computed = computeNestedRadius({ outerRadius: radius, gap })

	// В режиме «внешний» заданное значение — радиус внутреннего элемента,
	// а внешний из него выводится; в «одинаковом» оба равны заданному.
	const outerRadius =
		mode === 'outer' ? computeOuterRadius(radius, gap) : radius
	const innerRadius =
		mode === 'outer' ? radius : mode === 'same' ? radius : computed.innerRadius

	const css =
		mode === 'same'
			? `.card {\n\tborder-radius: ${radius}px;\n\tpadding: ${padding}px;\n}\n\n.card__inner {\n\t/* тот же радиус, что снаружи — дуги не эквидистантны */\n\tborder-radius: ${radius}px;\n}`
			: buildCss(outerRadius, gap)

	/**
	 * Подсветка дуги угла: рамка того же радиуса поверх элемента, обрезанная
	 * до верхнего левого квадрата стороной в радиус. Видна ровно та дуга, о
	 * которой идёт речь, — полная окружность вокруг элемента показывала бы то
	 * же самое, но мешала бы читать саму фигуру.
	 */
	const cornerArc = (cornerRadius: number, color: string) => (
		<span
			aria-hidden='true'
			className='pointer-events-none absolute'
			style={{
				inset: -border,
				borderRadius: cornerRadius,
				border: `${Math.max(2, border)}px solid ${color}`,
				clipPath: `polygon(0 0, ${cornerRadius}px 0, ${cornerRadius}px ${cornerRadius}px, 0 ${cornerRadius}px)`
			}}
		/>
	)

	const label = (text: string, color: string, style: React.CSSProperties) => (
		<span
			className='pointer-events-none absolute font-mono text-[0.5rem] leading-none font-bold'
			style={{ color, ...style }}
		>
			{text}
		</span>
	)

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card
				className='overflow-hidden p-0'
				style={
					{
						'--guide-outer': '#2a78d6',
						'--guide-inner': '#1baf7a'
					} as React.CSSProperties
				}
			>
				<div className={toolBar}>
					<div className={toolToggleTrack}>
						{MODES.map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setMode(value)}
								aria-pressed={mode === value}
								className={toolToggleOption(mode === value)}
							>
								{label}
							</button>
						))}
					</div>

					<button
						type='button'
						onClick={() => setShowCircles(!showCircles)}
						aria-pressed={showCircles}
						className={toolPill(showCircles)}
					>
						дуги и подписи
					</button>

					<button
						type='button'
						onClick={() => setZoomed(!zoomed)}
						aria-pressed={zoomed}
						className={toolPill(zoomed)}
					>
						крупно
					</button>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => copyToClipboard(css, 'css')}
							title='Скопировать CSS'
							className={toolIconButton}
						>
							{copiedItem === 'css' ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
					</div>
				</div>

				<div className='grid items-center gap-8 px-5 py-10 sm:px-6 md:grid-cols-2'>
					{/* Превью. Внешняя рамка, внутри вложенная — обе с рассчитанными
					    радиусами, поверх пунктирные окружности радиусов. */}
					<div className='relative mx-auto aspect-square w-full max-w-[18rem] overflow-hidden rounded-xl'>
						<div
							className='absolute aspect-square w-full max-w-[18rem] border border-solid border-foreground/70 transition-transform'
							style={{
								borderRadius: outerRadius,
								padding,
								borderWidth: border,
								transformOrigin: '0 0',
								transform: zoomed ? 'scale(2.4)' : 'scale(1)'
							}}
						>
							{showCircles && cornerArc(outerRadius, OUTER_GUIDE)}
							{showCircles &&
								label(`${round(outerRadius)}px`, OUTER_GUIDE, {
									left: border + 4,
									top: outerRadius + 6
								})}
							{showCircles &&
								label(`${padding}px`, 'currentColor', {
									left: outerRadius + 6,
									top: padding / 2,
									translate: '0 -50%',
									opacity: 0.6
								})}

							<div
								className='relative h-full w-full border border-solid border-foreground/40 bg-muted/40'
								style={{ borderRadius: innerRadius, borderWidth: border }}
							>
								{showCircles && cornerArc(innerRadius, INNER_GUIDE)}
								{showCircles &&
									label(`${round(innerRadius)}px`, INNER_GUIDE, {
										left: innerRadius * 0.5 + 4,
										top: innerRadius * 0.5 + 4
									})}
							</div>
						</div>
					</div>

					<div className='space-y-4'>
						<div className='flex flex-wrap items-baseline gap-x-6 gap-y-2'>
							<span className='text-sm text-muted-foreground'>
								Внешний радиус{' '}
								<span className='font-mono text-lg text-foreground'>
									{round(outerRadius)}px
								</span>
							</span>
							<span className='text-sm text-muted-foreground'>
								Внутренний{' '}
								<span className='font-mono text-lg text-foreground'>
									{round(innerRadius)}px
								</span>
							</span>
						</div>

						{showCircles && (
							<p className='text-sm text-muted-foreground'>
								<span
									className='mr-1 inline-block h-2 w-2 rounded-full align-middle'
									style={{ background: OUTER_GUIDE }}
								/>
								дуга внешнего радиуса,{' '}
								<span
									className='mx-1 inline-block h-2 w-2 rounded-full align-middle'
									style={{ background: INNER_GUIDE }}
								/>
								внутреннего. Когда расчёт верен, между дугами всюду один и тот
								же зазор — включите «крупно», чтобы рассмотреть угол.
							</p>
						)}

						{mode === 'same' && (
							<p className='text-sm text-muted-foreground'>
								Так делать не надо: у внутреннего элемента тот же радиус, что у
								внешнего, и в углу зазор зрительно шире, чем по сторонам.
								Переключитесь обратно и сравните.
							</p>
						)}

						{mode === 'inner' && computed.clamped && (
							<p className='text-sm text-muted-foreground'>
								Отступ больше внешнего радиуса, поэтому у внутреннего элемента
								прямой угол. Это не ошибка: скруглять там уже нечего.
							</p>
						)}

						<pre className='overflow-x-auto rounded-xl border bg-muted/40 p-4 font-mono text-xs'>
							{css}
						</pre>
					</div>
				</div>

				<div className={toolFooterBar}>
					<label className='flex flex-1 items-center gap-2 text-sm text-muted-foreground'>
						<span className='w-28 shrink-0'>
							{mode === 'outer' ? 'Радиус внутри' : 'Радиус'}
						</span>
						<Slider
							value={[radius]}
							onValueChange={([value]) => setRadius(value)}
							min={0}
							max={100}
							step={1}
							className='w-full max-w-xs cursor-pointer'
							aria-label='Радиус скругления'
						/>
						<span className='w-12 shrink-0 font-mono text-sm text-foreground tabular-nums'>
							{radius}px
						</span>
					</label>

					<label className='flex flex-1 items-center gap-2 text-sm text-muted-foreground'>
						<span className='w-28 shrink-0'>Отступ</span>
						<Slider
							value={[padding]}
							onValueChange={([value]) => setPadding(value)}
							min={0}
							max={80}
							step={1}
							className='w-full max-w-xs cursor-pointer'
							aria-label='Отступ между элементами'
						/>
						<span className='w-12 shrink-0 font-mono text-sm text-foreground tabular-nums'>
							{padding}px
						</span>
					</label>

					<label className='flex flex-1 items-center gap-2 text-sm text-muted-foreground'>
						<span className='w-28 shrink-0'>Рамка</span>
						<Slider
							value={[border]}
							onValueChange={([value]) => setBorder(value)}
							min={0}
							max={12}
							step={1}
							className='w-full max-w-xs cursor-pointer'
							aria-label='Толщина рамки'
						/>
						<span className='w-12 shrink-0 font-mono text-sm text-foreground tabular-nums'>
							{border}px
						</span>
					</label>
				</div>
			</Card>

			<NestedBorderRadiusSeo />
		</WidgetSEOWrapper>
	)
}
