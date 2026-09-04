'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, RotateCcw } from 'lucide-react'
import { toolIconButton } from '@/lib/ui/tool-pill'
import Image from 'next/image'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { CoinFlipSeo } from './CoinFlipSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

interface FlipResult {
	id: string
	result: 'heads' | 'tails'
	timestamp: Date
	coinType: string
}

interface CoinType {
	id: string
	name: string
	headsText: string
	tailsText: string
	headsIcon: string
	tailsIcon: string
	color: string
}

const coinTypes: CoinType[] = [
	{
		id: 'ruble',
		name: 'Рубль',
		headsText: 'Орёл',
		tailsText: 'Решка',
		headsIcon: '🦅',
		tailsIcon: '₽',
		color: 'from-red-400 to-red-600'
	}
]

// Монета как физический цилиндр: две грани разведены по оси Z на половину
// толщины, ребро набрано из плоских сегментов по кругу (одним свойством
// цилиндр в CSS не сделать).
const COIN_SIZE = 224
const COIN_THICKNESS = 14
const EDGE_FACETS = 40
const EDGE_FACET_HEIGHT = Math.ceil((Math.PI * COIN_SIZE) / EDGE_FACETS) + 1
// Ребро чуть заходит под кромку диска, чтобы прикрыть волосяной стык.
const EDGE_RADIUS = COIN_SIZE / 2 - 2
// У рубля образца 1997 года на гурте 110 рифлений. Шаг рифления по дуге:
const EDGE_REED_STEP = (Math.PI * COIN_SIZE) / 110
// Гурт темнее чеканного поля (не полируется), плюс насечки поперёк ребра.
const EDGE_TEXTURE = [
	`repeating-linear-gradient(to bottom,`,
	`rgba(0,0,0,0.45) 0 ${EDGE_REED_STEP * 0.22}px,`,
	`rgba(0,0,0,0) ${EDGE_REED_STEP * 0.22}px ${EDGE_REED_STEP * 0.5}px,`,
	`rgba(255,255,255,0.18) ${EDGE_REED_STEP * 0.5}px ${EDGE_REED_STEP * 0.7}px,`,
	`rgba(0,0,0,0) ${EDGE_REED_STEP * 0.7}px ${EDGE_REED_STEP}px),`,
	`linear-gradient(to right, #18181b, #6b7280 50%, #18181b)`
].join(' ')

// Полукруг диаграммы: дуга радиуса 90 от левого края к правому через верх.
// Длину нормируем pathLength=100, долю показываем через strokeDashoffset.
const GAUGE_ARC = 'M 10 100 A 90 90 0 0 1 190 100'

export default function CoinFlipPage() {
	const widget = getWidgetById('coin-flip')!
	const [isFlipping, setIsFlipping] = useState(false)
	const [currentResult, setCurrentResult] = useState<'heads' | 'tails' | null>(
		null
	)
	const [flipHistory, setFlipHistory] = useState<FlipResult[]>([])
	// Монета одна — рубль; состояние здесь ни к чему.
	const selectedCoin = coinTypes[0]
	const [rotation, setRotation] = useState(0)
	const flipLayerRef = useRef<HTMLDivElement>(null)
	const [headsCount, setHeadsCount] = useState(0)
	const [tailsCount, setTailsCount] = useState(0)

	const updateCounts = useCallback((history: FlipResult[]) => {
		const heads = history.filter(h => h.result === 'heads').length
		const tails = history.filter(h => h.result === 'tails').length
		setHeadsCount(heads)
		setTailsCount(tails)
	}, [])

	useEffect(() => {
		// Load history from localStorage
		const savedHistory = localStorage.getItem('coinFlipHistory')
		if (savedHistory) {
			const parsed = JSON.parse(savedHistory).map((item: any) => ({
				...item,
				timestamp: new Date(item.timestamp)
			}))
			setFlipHistory(parsed)
			updateCounts(parsed)
		}
	}, [updateCounts])

	const flipCoin = useCallback(() => {
		if (isFlipping) return
		const layer = flipLayerRef.current
		if (!layer) return

		setIsFlipping(true)
		setCurrentResult(null)

		// Сторона — из системного ГПСЧ, не из Math.random().
		const randomArray = new Uint8Array(1)
		crypto.getRandomValues(randomArray)
		const result: 'heads' | 'tails' = randomArray[0] < 128 ? 'heads' : 'tails'

		// Целые обороты не меняют видимую сторону, доворот на 180° — меняет.
		const currentPosition = ((rotation % 360) + 360) % 360
		const isCurrentlyHeads = currentPosition < 90 || currentPosition > 270
		const wholeTurns = 3 + Math.floor(Math.random() * 4) // 3..6
		let delta = wholeTurns * 360
		if (result === 'heads' && !isCurrentlyHeads) delta += 180
		else if (result === 'tails' && isCurrentlyHeads) delta += 180
		const finalRotation = rotation + delta
		setRotation(finalRotation)

		const finish = () => {
			setCurrentResult(result)
			setIsFlipping(false)

			const newResult: FlipResult = {
				id: crypto.randomUUID(),
				result,
				timestamp: new Date(),
				coinType: selectedCoin.name
			}
			const newHistory = [newResult, ...flipHistory].slice(0, 100)
			setFlipHistory(newHistory)
			updateCounts(newHistory)
			localStorage.setItem('coinFlipHistory', JSON.stringify(newHistory))
		}

		const reduceMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches

		if (reduceMotion || typeof layer.animate !== 'function') {
			window.setTimeout(finish, 320)
			return
		}

		// Параметры полёта, разные на каждый бросок.
		const peak = 64 + Math.random() * 26 // высота подскока, px
		const drift = (Math.random() * 2 - 1) * 12 // снос вбок, px
		const wobble = 4 + Math.random() * 4 // качание оси (прецессия), deg
		const tilt = 10 + Math.random() * 8 // наклон монеты в полёте, deg
		const dur = 1450 + Math.random() * 320

		// Изинг живёт в вертикали: вверх монета тормозит, вниз разгоняется.
		// Спин при этом равномерный (в полёте угловая скорость постоянна).
		const easeUp = 'cubic-bezier(0.4, 0.85, 0.9, 1)'
		const easeDown = 'cubic-bezier(0.1, 0, 0.55, 0.2)'
		const easeSettle = 'cubic-bezier(0.3, 1, 0.5, 1)'

		const mid = rotation + delta * 0.5
		const near = finalRotation

		layer
			.animate(
				[
					{
						offset: 0,
						transform: `translate3d(0,0,0) rotateY(${rotation}deg) rotateX(0deg) rotateZ(0deg)`,
						easing: easeUp
					},
					{
						offset: 0.44,
						transform: `translate3d(${drift * 0.4}px,${-peak}px,0) rotateY(${mid}deg) rotateX(${tilt}deg) rotateZ(${wobble}deg)`,
						easing: easeDown
					},
					{
						offset: 0.82,
						transform: `translate3d(${drift * 0.3}px,0,0) rotateY(${near}deg) rotateX(0deg) rotateZ(${-wobble * 0.5}deg)`,
						easing: easeSettle
					},
					{
						offset: 0.9,
						transform: `translate3d(0,3px,0) rotateY(${finalRotation + 7}deg) rotateX(0deg) rotateZ(0deg)`
					},
					{
						offset: 0.95,
						transform: `translate3d(0,0,0) rotateY(${finalRotation - 3}deg) rotateX(0deg) rotateZ(0deg)`
					},
					{
						offset: 1,
						transform: `translate3d(0,0,0) rotateY(${finalRotation}deg) rotateX(0deg) rotateZ(0deg)`
					}
				],
				{ duration: dur, easing: 'linear', fill: 'none' }
			)
			.finished.then(finish, finish)
	}, [isFlipping, rotation, selectedCoin, flipHistory, updateCounts])

	const clearHistory = useCallback(() => {
		setFlipHistory([])
		setHeadsCount(0)
		setTailsCount(0)
		localStorage.removeItem('coinFlipHistory')
	}, [])

	const headsPercentage =
		flipHistory.length > 0
			? Math.round((headsCount / flipHistory.length) * 100)
			: 50
	const tailsPercentage =
		flipHistory.length > 0
			? Math.round((tailsCount / flipHistory.length) * 100)
			: 50

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className='flex flex-col items-center gap-8 px-5 pb-8 pt-8 sm:px-6 md:min-h-[26rem] md:flex-row md:items-stretch'>
					<div className='flex flex-1 flex-col items-center gap-6 pt-14 md:pt-16'>
						<div
							className='relative h-56 w-56'
							style={{ perspective: '1000px' }}
						>
							<div
								ref={flipLayerRef}
								className='relative h-full w-full'
								style={{
									transformStyle: 'preserve-3d',
									transform: `rotateY(${rotation}deg)`
								}}
							>
								<div
									className='absolute inset-0 overflow-hidden rounded-full'
									style={{
										backfaceVisibility: 'hidden',
										transform: `translateZ(${COIN_THICKNESS / 2}px)`
									}}
								>
									<Image
										src='/images/coins/ruble-heads-v2.png'
										alt={`${selectedCoin.name}, орёл`}
										fill
										sizes='224px'
										className='object-cover'
									/>
								</div>

								<div
									className='absolute inset-0 overflow-hidden rounded-full'
									style={{
										backfaceVisibility: 'hidden',
										transform: `rotateY(180deg) translateZ(${COIN_THICKNESS / 2}px)`
									}}
								>
									<Image
										src='/images/coins/ruble-tails-v2.png'
										alt={`${selectedCoin.name}, решка`}
										fill
										sizes='224px'
										className='object-cover'
									/>
								</div>

								<div
									className='absolute inset-0'
									style={{ transformStyle: 'preserve-3d' }}
									aria-hidden
								>
									{Array.from({ length: EDGE_FACETS }).map((_, i) => (
										<div
											key={i}
											className='absolute left-1/2 top-1/2'
											style={{
												width: COIN_THICKNESS,
												height: EDGE_FACET_HEIGHT,
												marginLeft: -COIN_THICKNESS / 2,
												marginTop: -EDGE_FACET_HEIGHT / 2,
												backgroundImage: EDGE_TEXTURE,
												transform: `rotateZ(${(360 / EDGE_FACETS) * i}deg) translateX(${EDGE_RADIUS}px) rotateY(90deg)`
											}}
										/>
									))}
								</div>
							</div>
						</div>

						<p className='h-8 text-2xl font-semibold'>
							{currentResult && !isFlipping
								? currentResult === 'heads'
									? 'Орёл'
									: 'Решка'
								: ''}
						</p>

						<Button
							onClick={flipCoin}
							disabled={isFlipping}
							className='mt-auto h-auto w-full max-w-xs cursor-pointer rounded-xl py-6 text-xl font-semibold'
						>
							{isFlipping ? (
								<>
									<Loader2 className='mr-2 h-5 w-5 animate-spin' />
									Подбрасываем
								</>
							) : (
								'Подбросить'
							)}
						</Button>
					</div>

					<div
						className={`w-full md:w-56 md:shrink-0${
							flipHistory.length === 0 ? ' hidden md:block' : ''
						}`}
					>
						{flipHistory.length > 0 && (
							<>
								<svg viewBox='0 0 200 112' className='w-full'>
									<path
										d={GAUGE_ARC}
										fill='none'
										strokeWidth={16}
										strokeLinecap='round'
										className='stroke-muted-foreground/45'
									/>
									<path
										d={GAUGE_ARC}
										fill='none'
										strokeWidth={16}
										strokeLinecap='round'
										pathLength={100}
										strokeDasharray='100 100'
										strokeDashoffset={100 - headsPercentage}
										className='stroke-primary'
										style={{
											transition:
												'stroke-dashoffset 0.6s cubic-bezier(0.33, 1, 0.68, 1)'
										}}
									/>
									<text
										x='100'
										y='82'
										textAnchor='middle'
										className='fill-current text-primary [font-size:13px] [font-weight:600]'
									>
										Орёл {headsCount} · {headsPercentage}%
									</text>
									<text
										x='100'
										y='100'
										textAnchor='middle'
										className='fill-current text-muted-foreground [font-size:11px]'
									>
										Решка {tailsCount} · {tailsPercentage}%
									</text>
								</svg>

								<div className='mt-3 flex items-center justify-between'>
									<span className='text-xs uppercase tracking-wide text-muted-foreground'>
										История
									</span>
									<Button
										size='icon'
										variant='ghost'
										onClick={clearHistory}
										title='Очистить историю бросков'
										className={toolIconButton}
									>
										<RotateCcw className='h-4 w-4' />
									</Button>
								</div>

								<div className='mt-1 max-h-72 overflow-y-auto rounded-lg border'>
									<table className='w-full text-sm'>
										<thead className='sticky top-0 bg-card'>
											<tr className='border-b text-xs uppercase tracking-wide text-muted-foreground'>
												<th className='w-1/2 py-2 font-medium'>Орёл</th>
												<th className='w-1/2 border-l py-2 font-medium'>
													Решка
												</th>
											</tr>
										</thead>
										<tbody>
											{flipHistory.map(flip => (
												<tr
													key={flip.id}
													className='border-b border-border/50 last:border-0'
												>
													<td className='h-8 text-center'>
														{flip.result === 'heads' && (
															<span className='inline-block h-2.5 w-2.5 rounded-full bg-primary align-middle' />
														)}
													</td>
													<td className='h-8 border-l text-center'>
														{flip.result === 'tails' && (
															<span className='inline-block h-2.5 w-2.5 rounded-full bg-foreground align-middle' />
														)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</>
						)}
					</div>
				</div>
			</Card>

			<ToolScreenshot slug='coin-flip' />
			<CoinFlipSeo />
		</WidgetSEOWrapper>
	)
}
