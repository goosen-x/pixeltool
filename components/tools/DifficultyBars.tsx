import { cn } from '@/lib/utils'
import type { Widget } from '@/lib/constants/widgets'

const LEVEL_COUNT: Record<NonNullable<Widget['difficulty']>, number> = {
	beginner: 1,
	intermediate: 2,
	advanced: 3
}

const BARS = [
	{ x: 1, width: 4, height: 6 },
	{ x: 8, width: 4, height: 11 },
	{ x: 15, width: 4, height: 16 }
]

interface DifficultyBarsProps {
	level: NonNullable<Widget['difficulty']>
	className?: string
}

/**
 * Три столбика возрастающей высоты вместо lucide Signal — те на маленьком
 * размере читались как случайные точки, а не шкала. Незалитые столбики
 * остаются видимыми (тусклее), чтобы силуэт сразу читался как «N из 3»,
 * а не как отдельные чёрточки.
 */
export function DifficultyBars({ level, className }: DifficultyBarsProps) {
	const filled = LEVEL_COUNT[level]

	return (
		<svg
			viewBox='0 0 20 20'
			fill='none'
			className={cn('shrink-0', className)}
			aria-hidden
		>
			{BARS.map((bar, index) => (
				<rect
					key={bar.x}
					x={bar.x}
					y={20 - bar.height}
					width={bar.width}
					height={bar.height}
					rx={1}
					fill='currentColor'
					opacity={index < filled ? 1 : 0.25}
				/>
			))}
		</svg>
	)
}
