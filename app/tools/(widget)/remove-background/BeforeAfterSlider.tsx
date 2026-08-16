'use client'

import { useState } from 'react'

interface BeforeAfterSliderProps {
	beforeUrl: string
	afterUrl: string
}

const CHECKERBOARD_STYLE = {
	// Тот же бесшовный чекер, что и раньше — четыре линейных градиента,
	// не repeating-conic-gradient (та версия давала видимый шов на стыке тайлов).
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
 * Слайдер «до/после» во всю ширину карточки.
 *
 * Контейнер держит aspect-ratio настоящего фото (снимается один раз через
 * onLoad, обе картинки гарантированно одного размера в пикселях — библиотека
 * возвращает результат с исходными width/height). Без этого при
 * object-contain в контейнере фиксированной высоты фото могло не доходить
 * до боковых краёв (леттербоксинг), и проценты clip-path переставали
 * совпадать с реальными границами фото — ручка визуально «ехала» мимо
 * картинки. С подогнанным контейнером object-contain всегда заполняет его
 * ровно, без пустых полей.
 */
export function BeforeAfterSlider({
	beforeUrl,
	afterUrl
}: BeforeAfterSliderProps) {
	const [position, setPosition] = useState(50)
	const [aspectRatio, setAspectRatio] = useState<number | null>(null)

	return (
		<div
			className='relative w-full overflow-hidden select-none'
			style={{ aspectRatio: aspectRatio ?? 16 / 9 }}
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
			<div
				className='absolute inset-0 overflow-hidden bg-muted'
				style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
			>
				{/* eslint-disable-next-line @next/next/no-img-element -- object URL, не оптимизируем через next/image */}
				<img
					src={beforeUrl}
					alt='Исходное фото'
					className='h-full w-full object-contain'
					draggable={false}
				/>
			</div>

			{/* Разделитель — чисто визуальный, поверх настоящего range-инпута */}
			<div
				className='pointer-events-none absolute inset-y-0 flex -translate-x-1/2 items-center'
				style={{ left: `${position}%` }}
			>
				<div className='h-full w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]' />
				<div className='absolute flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md'>
					<span className='text-xs text-foreground'>↔</span>
				</div>
			</div>

			<input
				type='range'
				min={0}
				max={100}
				value={position}
				onChange={event => setPosition(Number(event.target.value))}
				aria-label='Сравнить фото до и после'
				className='absolute inset-0 h-full w-full cursor-ew-resize opacity-0'
			/>

			<span className='pointer-events-none absolute top-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white'>
				До
			</span>
			<span className='pointer-events-none absolute top-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white'>
				После
			</span>
		</div>
	)
}
