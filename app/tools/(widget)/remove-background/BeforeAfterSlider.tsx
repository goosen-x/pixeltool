'use client'

import { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

interface BeforeAfterSliderProps {
	beforeUrl: string
	afterUrl: string
}

const CHECKERBOARD_STYLE = {
	backgroundImage: `
		linear-gradient(45deg, #80808022 25%, transparent 25%),
		linear-gradient(-45deg, #80808022 25%, transparent 25%),
		linear-gradient(45deg, transparent 75%, #80808022 75%),
		linear-gradient(-45deg, transparent 75%, #80808022 75%)
	`,
	backgroundSize: '16px 16px',
	backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0'
} as const

/**
 * Слайдер «до/после» — тот же паттерн, что в components/ui/image-comparison.tsx
 * портфолио (goose-labs/portfolio): drag в любой точке кадра, а не только за
 * ручку, motion/react (уже зависимость проекта) для плавного пружинного
 * следования вместо мгновенного скачка значения.
 *
 * Контейнер держит aspect-ratio настоящего фото (снимается через onLoad,
 * обе картинки одного размера в пикселях — библиотека возвращает результат
 * с исходными width/height). Без этого при несовпадении пропорций фото не
 * доходило бы до боковых краёв контейнера, и проценты clip-path переставали
 * бы совпадать с реальными границами фото.
 */
export function BeforeAfterSlider({
	beforeUrl,
	afterUrl
}: BeforeAfterSliderProps) {
	const [isDragging, setIsDragging] = useState(false)
	const [aspectRatio, setAspectRatio] = useState<number | null>(null)
	const motionValue = useMotionValue(50)
	const position = useSpring(motionValue, { bounce: 0, duration: 0 })

	const beforeClipPath = useTransform(
		position,
		value => `inset(0 ${100 - value}% 0 0)`
	)
	const handleLeft = useTransform(position, value => `${value}%`)

	const updateFromPointer = (clientX: number, rect: DOMRect) => {
		const percentage = Math.min(
			Math.max(((clientX - rect.left) / rect.width) * 100, 0),
			100
		)
		motionValue.set(percentage)
	}

	const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
		if (!isDragging) return
		updateFromPointer(
			event.clientX,
			event.currentTarget.getBoundingClientRect()
		)
	}

	const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
		setIsDragging(true)
		event.currentTarget.setPointerCapture(event.pointerId)
		updateFromPointer(
			event.clientX,
			event.currentTarget.getBoundingClientRect()
		)
	}

	return (
		<div
			className='relative w-full cursor-ew-resize touch-none overflow-hidden select-none'
			style={{ aspectRatio: aspectRatio ?? 16 / 9 }}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={() => setIsDragging(false)}
			onPointerLeave={() => setIsDragging(false)}
		>
			{/* «После» — во всю ширину, снизу */}
			<div className='absolute inset-0' style={CHECKERBOARD_STYLE}>
				{/* eslint-disable-next-line @next/next/no-img-element -- object URL, не оптимизируем через next/image */}
				<img
					src={afterUrl}
					alt='Фото без фона'
					className='h-full w-full object-contain'
					draggable={false}
					onLoad={event => {
						const img = event.currentTarget
						if (img.naturalWidth && img.naturalHeight) {
							setAspectRatio(img.naturalWidth / img.naturalHeight)
						}
					}}
				/>
			</div>

			{/* «До» — обрезано по позиции ручки, поверх */}
			<motion.div
				className='absolute inset-0 overflow-hidden bg-muted'
				style={{ clipPath: beforeClipPath }}
			>
				{/* eslint-disable-next-line @next/next/no-img-element -- object URL, не оптимизируем через next/image */}
				<img
					src={beforeUrl}
					alt='Исходное фото'
					className='h-full w-full object-contain'
					draggable={false}
				/>
			</motion.div>

			{/* Разделитель: линия и круглая ручка позиционируются независимо друг
			    от друга и обе явно центрируются на handleLeft — раньше ручка была
			    просто вторым элементом внутри flex-обёртки с absolute без своих
			    left/top, поэтому падала в статичный поток сразу правее линии
			    вместо центра на ней. */}
			<motion.div
				className='pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]'
				style={{ left: handleLeft }}
			/>
			<motion.div
				className='pointer-events-none absolute top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md'
				style={{ left: handleLeft }}
			>
				<span className='text-xs text-foreground'>↔</span>
			</motion.div>

			<span className='pointer-events-none absolute top-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white'>
				До
			</span>
			<span className='pointer-events-none absolute top-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white'>
				После
			</span>
		</div>
	)
}
