'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { toolBar, toolFooterBar, toolPill } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { FortuneWheelSeo } from './FortuneWheelSeo'

const MAX_SEGMENTS = 30
const WHEEL_SIZE = 320
const SPIN_DURATION_MS = 4200
const EXTRA_SPINS = 6

const DEFAULT_ITEMS = 'Пицца\nСуши\nБургеры\nПаста\nШаурма\nСалат'

// Категориальная палитра из dataviz-скилла (CVD-safe порядок), а не
// равномерная HSL-радуга: та при большом числе секторов упиралась в
// кислотные жёлто-зелёные и грязно-бурые тона. Секторов может быть до
// MAX_SEGMENTS = 30, палитра на 8 цветов, поэтому дальше идёт по кругу.
// Для колеса фортуны это уместный компромисс.
const CATEGORICAL_COLORS = [
	'#2a78d6', // синий
	'#eb6834', // оранжевый
	'#1baf7a', // бирюзовый
	'#eda100', // жёлтый
	'#e87ba4', // розовый
	'#008300', // зелёный
	'#4a3aa7', // фиолетовый
	'#e34948' // красный
]

function segmentColor(index: number): string {
	return CATEGORICAL_COLORS[index % CATEGORICAL_COLORS.length]
}

// crypto.getRandomValues, не Math.random — та же практика, что в
// dice-roller/coin-flip, для честности результата, который заявлен в FAQ.
function randomIndex(count: number): number {
	const buffer = new Uint32Array(1)
	crypto.getRandomValues(buffer)
	return buffer[0] % count
}

function drawWheel(canvas: HTMLCanvasElement, items: string[]) {
	const ctx = canvas.getContext('2d')
	if (!ctx) return
	const dpr = window.devicePixelRatio || 1
	canvas.width = WHEEL_SIZE * dpr
	canvas.height = WHEEL_SIZE * dpr
	ctx.scale(dpr, dpr)
	ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE)

	const center = WHEEL_SIZE / 2
	const radius = center - 4
	const segmentAngle = (2 * Math.PI) / items.length
	const fontSize = items.length > 16 ? 10 : items.length > 8 ? 12 : 14

	items.forEach((item, index) => {
		// Смещение -90° — сектор с индексом 0 начинается сверху, там же
		// стоит указатель; без смещения canvas считает 0° от 3 часов.
		const start = index * segmentAngle - Math.PI / 2
		const end = start + segmentAngle

		ctx.beginPath()
		ctx.moveTo(center, center)
		ctx.arc(center, center, radius, start, end)
		ctx.closePath()
		ctx.fillStyle = segmentColor(index)
		ctx.fill()
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'
		ctx.lineWidth = 1
		ctx.stroke()

		ctx.save()
		ctx.translate(center, center)
		ctx.rotate(start + segmentAngle / 2)
		ctx.textAlign = 'right'
		ctx.textBaseline = 'middle'
		ctx.fillStyle = '#ffffff'
		ctx.font = `600 ${fontSize}px sans-serif`
		ctx.shadowColor = 'rgba(0, 0, 0, 0.35)'
		ctx.shadowBlur = 3
		const maxLabelWidth = radius - 24
		let label = item
		while (ctx.measureText(label).width > maxLabelWidth && label.length > 1) {
			label = label.slice(0, -1)
		}
		if (label !== item) label = label.replace(/.$/, '…')
		ctx.fillText(label, radius - 12, 0)
		ctx.restore()
	})

	ctx.beginPath()
	ctx.arc(center, center, 20, 0, 2 * Math.PI)
	ctx.fillStyle = 'var(--background, #fff)'
	ctx.fill()
	ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'
	ctx.lineWidth = 2
	ctx.stroke()
}

export default function FortuneWheelPage() {
	const widget = getWidgetById('fortune-wheel')!
	const canvasRef = useRef<HTMLCanvasElement>(null)

	const [inputText, setInputText] = useState(DEFAULT_ITEMS)
	const [rotation, setRotation] = useState(0)
	const [spinning, setSpinning] = useState(false)
	const [winner, setWinner] = useState<string | null>(null)
	const [history, setHistory] = useState<string[]>([])
	const [removeWinner, setRemoveWinner] = useState(false)

	const items = inputText
		.split('\n')
		.map(line => line.trim())
		.filter(line => line !== '')
		.slice(0, MAX_SEGMENTS)

	const tooMany =
		inputText.split('\n').filter(line => line.trim() !== '').length >
		MAX_SEGMENTS

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas || items.length === 0) return
		drawWheel(canvas, items)
		// items — производное от inputText, пересчитывается на каждый рендер;
		// сравнивать имеет смысл только содержимое, JSON.stringify дешевле,
		// чем тянуть отдельное состояние только ради стабильной ссылки.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(items)])

	const spin = useCallback(() => {
		if (spinning || items.length < 2) return
		setWinner(null)
		setSpinning(true)

		const targetIndex = randomIndex(items.length)
		const segmentAngle = 360 / items.length
		// Небольшой отступ от края сектора, чтобы указатель не останавливался
		// точно на границе — визуально нечестно выглядит, даже если результат
		// уже определён.
		const jitter = (Math.random() - 0.5) * segmentAngle * 0.6
		const targetAngle =
			(targetIndex * segmentAngle + segmentAngle / 2 + jitter + 360) % 360

		const currentNormalized = ((rotation % 360) + 360) % 360
		const desiredNormalized = (360 - targetAngle) % 360
		let delta = desiredNormalized - currentNormalized
		if (delta <= 0) delta += 360

		const newRotation = rotation + 360 * EXTRA_SPINS + delta
		setRotation(newRotation)

		window.setTimeout(() => {
			setSpinning(false)
			const result = items[targetIndex]
			setWinner(result)
			setHistory(prev => [result, ...prev].slice(0, 10))
			if (removeWinner) {
				setInputText(prev =>
					prev
						.split('\n')
						.filter(line => line.trim() !== result)
						.join('\n')
				)
			}
		}, SPIN_DURATION_MS)
	}, [spinning, items, rotation, removeWinner])

	const previewNames = items

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span
						className={cn(
							'text-sm',
							tooMany ? 'font-medium text-destructive' : 'text-muted-foreground'
						)}
					>
						{tooMany
							? `Максимум ${MAX_SEGMENTS} вариантов — лишние не попадут на колесо`
							: `${items.length} из ${MAX_SEGMENTS} вариантов · один на строку`}
					</span>

					<button
						type='button'
						onClick={() => setInputText(DEFAULT_ITEMS)}
						disabled={inputText === DEFAULT_ITEMS}
						className={cn(
							toolPill(false, 'ml-auto inline-flex items-center gap-1.5'),
							inputText === DEFAULT_ITEMS && 'invisible'
						)}
					>
						<RotateCcw className='h-3.5 w-3.5' />
						Вернуть пример
					</button>
				</div>

				<div className='grid gap-6 px-5 py-6 sm:grid-cols-[1fr_auto] sm:px-6'>
					<div className='flex flex-col gap-3'>
						<Textarea
							value={inputText}
							onChange={event => setInputText(event.target.value)}
							placeholder={'Вариант 1\nВариант 2\nВариант 3'}
							spellCheck={false}
							aria-label='Варианты для колеса'
							className='max-h-80 min-h-[10rem] resize-none font-mono text-sm'
						/>

						<div className='flex flex-wrap gap-1.5'>
							{previewNames.length > 0 ? (
								previewNames.map((name, index) => (
									<span
										key={`${name}-${index}`}
										className='max-w-full truncate rounded-full border bg-background px-3 py-1 text-xs'
									>
										{name}
									</span>
								))
							) : (
								<p className='text-sm text-muted-foreground'>
									Впишите хотя бы два варианта, каждый на своей строке
								</p>
							)}
						</div>

						<label className='mt-1 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground'>
							<Switch
								checked={removeWinner}
								onCheckedChange={checked => setRemoveWinner(checked)}
							/>
							Убирать победителя из колеса после раунда
						</label>
					</div>

					<div className='flex flex-col items-center gap-4'>
						<div
							className='relative'
							style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
						>
							{/* Указатель — неподвижный треугольник сверху, крутится только
							    сама тарелка с секторами под ним. */}
							<div
								className='absolute top-[-6px] left-1/2 z-10 h-0 w-0 -translate-x-1/2 border-x-[10px] border-t-[16px] border-x-transparent border-t-foreground'
								aria-hidden
							/>
							<canvas
								ref={canvasRef}
								style={{
									width: WHEEL_SIZE,
									height: WHEEL_SIZE,
									transform: `rotate(${rotation}deg)`,
									transition: spinning
										? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.17, 0.67, 0.1, 0.99)`
										: 'none'
								}}
								className='rounded-full border shadow-sm'
							/>
						</div>

						<Button
							onClick={spin}
							disabled={items.length < 2 || spinning}
							className='w-full cursor-pointer sm:w-auto'
						>
							{spinning ? 'Крутится…' : 'Крутить колесо'}
						</Button>

						{winner && !spinning && (
							<p className='text-center'>
								<span className='block text-sm text-muted-foreground'>
									Выпало
								</span>
								<span className='text-xl font-bold'>{winner}</span>
							</p>
						)}
					</div>
				</div>

				{history.length > 0 && (
					<div className={toolFooterBar}>
						<span className='text-sm text-muted-foreground'>История</span>
						{history.map((entry, index) => (
							<span
								key={`${entry}-${index}`}
								className='rounded-full border bg-background px-2.5 py-0.5 text-xs'
							>
								{entry}
							</span>
						))}
					</div>
				)}
			</Card>

			<FortuneWheelSeo />
		</WidgetSEOWrapper>
	)
}
