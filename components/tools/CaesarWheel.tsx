'use client'

import { useCallback, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Шифровальный диск Цезаря.
 *
 * Два кольца букв: внешнее — открытый алфавит, внутреннее — тот же алфавит,
 * провёрнутый на величину ключа. Пара букв, стоящих на одном радиусе, и есть
 * правило замены, а ключ перестаёт быть абстрактным числом: его видно как
 * угол поворота. Диск не иллюстрация — его можно крутить мышью, пальцем и
 * стрелками, и текст пересчитывается вместе с ним.
 *
 * Именно так выглядели настоящие шифровальные устройства — от диска Альберти
 * (1467) до американского M-94: два соосных кольца с алфавитами.
 */

const SIZE = 340
const CENTER = SIZE / 2
const R_OUTER_EDGE = 158
const R_RING_SPLIT = 124
const R_INNER_EDGE = 120
const R_HUB = 79
const R_OUTER_TEXT = 141
const R_INNER_TEXT = 100

interface CaesarWheelProps {
	/** Буквы открытого алфавита по порядку. */
	letters: string[]
	/** Ключ: на сколько позиций провёрнуто внутреннее кольцо. */
	shift: number
	onShiftChange: (shift: number) => void
	/**
	 * Буква, которую человек только что набрал, — подсвечивается вместе со
	 * своей заменой, чтобы связь текста и диска была видна во время набора.
	 */
	highlight?: string | null
	className?: string
}

/**
 * Координаты округляются до трёх знаков намеренно. Math.cos и Math.sin не
 * обязаны давать бит в бит одинаковый результат в разных движках, и без
 * округления React ругался на несовпадение серверной и клиентской разметки:
 * y=83.57152047389148 против y=83.57152047389145. На глаз тысячные доли
 * пользовательской единицы не видны, зато гидрация проходит чисто.
 */
const round = (value: number) => Math.round(value * 1000) / 1000

const pointOnCircle = (radius: number, angleDeg: number) => {
	const rad = ((angleDeg - 90) * Math.PI) / 180
	return {
		x: round(CENTER + radius * Math.cos(rad)),
		y: round(CENTER + radius * Math.sin(rad))
	}
}

export function CaesarWheel({
	letters,
	shift,
	onShiftChange,
	highlight,
	className
}: CaesarWheelProps) {
	const size = letters.length
	const step = 360 / size
	const svgRef = useRef<SVGSVGElement>(null)
	const dragRef = useRef<{
		lastAngle: number
		travelled: number
		startShift: number
	} | null>(null)
	const [dragging, setDragging] = useState(false)

	// Буква из текста ищется в обоих регистрах: подсветка не должна зависеть
	// от того, набрано «а» или «А»
	const highlightIndex = highlight
		? letters.findIndex(
				letter => letter.toLowerCase() === highlight.toLowerCase()
			)
		: -1

	const angleAt = useCallback((clientX: number, clientY: number) => {
		const rect = svgRef.current?.getBoundingClientRect()
		if (!rect) return 0
		const dx = clientX - (rect.left + rect.width / 2)
		const dy = clientY - (rect.top + rect.height / 2)
		return (Math.atan2(dy, dx) * 180) / Math.PI
	}, [])

	const handlePointerDown = (event: React.PointerEvent<SVGGElement>) => {
		event.currentTarget.setPointerCapture(event.pointerId)
		dragRef.current = {
			lastAngle: angleAt(event.clientX, event.clientY),
			travelled: 0,
			startShift: shift
		}
		setDragging(true)
	}

	const handlePointerMove = (event: React.PointerEvent<SVGGElement>) => {
		const drag = dragRef.current
		if (!drag) return

		// Угол приходит из atan2 и прыгает через ±180°, поэтому копится
		// приращение, а не разница с начальным углом: так диск можно
		// проворачивать на несколько оборотов подряд
		const angle = angleAt(event.clientX, event.clientY)
		let delta = angle - drag.lastAngle
		if (delta > 180) delta -= 360
		if (delta < -180) delta += 360
		drag.lastAngle = angle
		drag.travelled += delta

		const steps = Math.round(drag.travelled / step)
		const next = (((drag.startShift - steps) % size) + size) % size
		if (next !== shift) onShiftChange(next)
	}

	const endDrag = (event: React.PointerEvent<SVGGElement>) => {
		if (!dragRef.current) return
		event.currentTarget.releasePointerCapture(event.pointerId)
		dragRef.current = null
		setDragging(false)
	}

	const handleKeyDown = (event: React.KeyboardEvent<SVGGElement>) => {
		const by = (delta: number) => {
			event.preventDefault()
			onShiftChange((((shift + delta) % size) + size) % size)
		}
		if (event.key === 'ArrowRight' || event.key === 'ArrowUp') by(1)
		else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') by(-1)
		else if (event.key === 'Home') by(-shift)
		else if (event.key === 'PageUp') by(5)
		else if (event.key === 'PageDown') by(-5)
	}

	// Внутреннее кольцо провёрнуто целиком, а каждая буква на нём отвёрнута
	// назад вокруг собственной точки — иначе внизу диска они встали бы вверх
	// ногами и читать пары стало бы нельзя
	const ringAngle = round(-shift * step)

	return (
		<svg
			ref={svgRef}
			viewBox={`0 0 ${SIZE} ${SIZE}`}
			className={cn('h-auto w-full max-w-[340px] touch-none', className)}
		>
			{/* Кольца */}
			<circle
				cx={CENTER}
				cy={CENTER}
				r={R_OUTER_EDGE}
				className='fill-muted/30 stroke-border'
				strokeWidth={1}
			/>
			<circle
				cx={CENTER}
				cy={CENTER}
				r={R_RING_SPLIT}
				className='fill-background stroke-border'
				strokeWidth={1}
			/>

			{/* Внешнее кольцо: открытый алфавит, неподвижен */}
			{letters.map((letter, index) => {
				const { x, y } = pointOnCircle(R_OUTER_TEXT, index * step)
				const active = index === highlightIndex || index === 0
				return (
					<text
						key={`plain-${letter}`}
						x={x}
						y={y}
						textAnchor='middle'
						dominantBaseline='central'
						fontSize={size > 26 ? 13 : 15}
						className={cn(
							'font-mono select-none',
							index === highlightIndex
								? 'fill-primary font-bold'
								: active
									? 'fill-foreground font-bold'
									: 'fill-muted-foreground'
						)}
					>
						{letter}
					</text>
				)
			})}

			{/* Внутреннее кольцо: шифралфавит, его и крутят */}
			<g
				tabIndex={0}
				role='slider'
				aria-label='Шифровальный диск: сдвиг внутреннего кольца'
				aria-valuemin={0}
				aria-valuemax={size - 1}
				aria-valuenow={shift}
				aria-valuetext={`сдвиг ${shift}, ${letters[0]} становится ${letters[shift]}`}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={endDrag}
				onPointerCancel={endDrag}
				onKeyDown={handleKeyDown}
				className={cn(
					'outline-none [&:focus-visible_.wheel-disc]:stroke-ring',
					dragging ? 'cursor-grabbing' : 'cursor-grab'
				)}
			>
				<circle
					cx={CENTER}
					cy={CENTER}
					r={R_INNER_EDGE}
					className='wheel-disc fill-primary/5 stroke-primary/30'
					strokeWidth={1}
				/>

				<g transform={`rotate(${ringAngle} ${CENTER} ${CENTER})`}>
					{letters.map((letter, index) => {
						const { x, y } = pointOnCircle(R_INNER_TEXT, index * step)
						const slot = (((index - shift) % size) + size) % size
						const active =
							slot === 0 || (highlightIndex !== -1 && slot === highlightIndex)
						return (
							<text
								key={`cipher-${letter}`}
								x={x}
								y={y}
								transform={`rotate(${-ringAngle} ${x} ${y})`}
								textAnchor='middle'
								dominantBaseline='central'
								fontSize={size > 26 ? 13 : 15}
								className={cn(
									'font-mono select-none',
									slot === highlightIndex && highlightIndex !== -1
										? 'fill-primary font-bold'
										: active
											? 'fill-foreground font-bold'
											: 'fill-primary/70'
								)}
							>
								{letter}
							</text>
						)
					})}
				</g>

				{/* Ступица: ключ числом и парой букв */}
				<circle
					cx={CENTER}
					cy={CENTER}
					r={R_HUB}
					className='fill-background stroke-border'
					strokeWidth={1}
				/>
				<text
					x={CENTER}
					y={CENTER - 20}
					textAnchor='middle'
					dominantBaseline='central'
					fontSize={11}
					className='fill-muted-foreground tracking-widest uppercase select-none'
				>
					сдвиг
				</text>
				<text
					x={CENTER}
					y={CENTER + 8}
					textAnchor='middle'
					dominantBaseline='central'
					fontSize={40}
					className='fill-foreground font-mono font-bold select-none'
				>
					{shift}
				</text>
				<text
					x={CENTER}
					y={CENTER + 42}
					textAnchor='middle'
					dominantBaseline='central'
					fontSize={15}
					className='fill-primary font-mono select-none'
				>
					{letters[0]} → {letters[shift]}
				</text>
			</g>

			{/* Окно ключа на двенадцати часах: пара букв на этом радиусе и есть
			    правило замены. Рисуется последним, чтобы луч лежал поверх колец */}
			<g className='pointer-events-none'>
				<line
					x1={CENTER}
					y1={CENTER - R_OUTER_EDGE}
					x2={CENTER}
					y2={CENTER - R_HUB}
					className='stroke-primary/40'
					strokeWidth={1}
					strokeDasharray='3 4'
				/>
				<path
					d={`M ${CENTER} ${CENTER - R_OUTER_EDGE - 2} l 7 -10 h -14 Z`}
					className='fill-primary'
				/>
			</g>
		</svg>
	)
}
