'use client'

import { Dithering, type DitheringProps } from '@paper-design/shaders-react'
import { useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

// Минимальная обёртка: импортит ТОЛЬКО шейдер Dithering, а не все ~21 вариант
// из beui-компонента. Так бандлер выкидывает неиспользуемые шейдеры и вес JS
// падает в разы. speed=0 при prefers-reduced-motion — кадры не считаются.
export function DitherShader({
	className,
	...props
}: DitheringProps & { className?: string }) {
	const reducedMotion = useReducedMotion()
	return (
		<Dithering
			{...props}
			{...(reducedMotion ? { speed: 0 } : {})}
			className={cn('h-full w-full', className)}
		/>
	)
}
