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
 * Слайдер «до/после»: обе картинки — одного размера в пикселях (библиотека
 * возвращает результат с теми же исходными width/height, см. её исходники),
 * поэтому object-contain в одинаковых по размеру слоях выравнивает их
 * пиксель в пиксель без доп. расчётов.
 *
 * Ручка — обычный <input type="range"> поверх, растянутый на всю картинку и
 * визуально прозрачный: даром достаются клавиатура, тач и aria без лишнего
 * кода на pointer-событиях.
 */
export function BeforeAfterSlider({
	beforeUrl,
	afterUrl
}: BeforeAfterSliderProps) {
	const [position, setPosition] = useState(50)

	return (
		<div className='relative mx-auto h-80 w-full max-w-xl overflow-hidden rounded-xl border select-none'>
			{/* «После» — во всю ширину, снизу */}
			<div className='absolute inset-0' style={CHECKERBOARD_STYLE}>
				{/* eslint-disable-next-line @next/next/no-img-element -- object URL, не оптимизируем через next/image */}
				<img
					src={afterUrl}
					alt='Фото без фона'
					className='h-full w-full object-contain'
					draggable={false}
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
