'use client'

import { useEffect, useRef, useState } from 'react'
import { DitherShader } from '@/components/motion/dither-shader'

// Обёртка над шейдером Dithering с оптимизациями стоимости:
// 1) maxPixelCount/minPixelRatio ограничивают разрешение рендера (на retina
//    канвас иначе считает вчетверо больше пикселей каждый кадр);
// 2) IntersectionObserver размонтирует канвас, когда герой ушёл за пределы
//    экрана — GPU не крутит шейдер впустую при скролле вниз.
export function DitherHeroBackground() {
	const ref = useRef<HTMLDivElement>(null)
	const [inView, setInView] = useState(true)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		const io = new IntersectionObserver(
			([entry]) => setInView(entry.isIntersecting),
			{ rootMargin: '120px' }
		)
		io.observe(el)
		return () => io.disconnect()
	}, [])

	return (
		<div ref={ref} className='absolute inset-0 bg-[#060912]' aria-hidden>
			{inView && (
				<DitherShader
					colorBack='#060912'
					colorFront='#4a90e2'
					shape='simplex'
					type='4x4'
					size={3}
					speed={0.6}
					scale={0.9}
					minPixelRatio={1}
					maxPixelCount={1920 * 1080}
					className='absolute inset-0 h-full w-full'
				/>
			)}
		</div>
	)
}
