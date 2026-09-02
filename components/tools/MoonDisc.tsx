/**
 * Диск Луны с текущей освещённостью.
 *
 * Терминатор — граница света и тени — рисуется эллипсом, ширина которого
 * меняется вместе с фазой. Это не украшение: по числу «освещено 62%» фазу
 * не представить, а по картинке видно сразу, и с какой стороны серп — тоже.
 */
interface MoonDiscProps {
	/** Освещённость 0…1. */
	illumination: number
	/** Растущая Луна — свет справа, убывающая — слева. */
	waxing: boolean
	size?: number
	className?: string
}

export function MoonDisc({
	illumination,
	waxing,
	size = 120,
	className
}: MoonDiscProps) {
	const r = 50
	// Полуось терминатора: в четверти он вырождается в прямую, в новолуние и
	// полнолуние совпадает с краем диска
	const k = Math.abs(1 - 2 * illumination)
	const rx = r * k
	const sweepOuter = waxing ? 1 : 0
	const sweepInner = illumination > 0.5 ? (waxing ? 1 : 0) : waxing ? 0 : 1

	return (
		<svg
			viewBox='0 0 100 100'
			width={size}
			height={size}
			role='img'
			aria-label={`Луна освещена на ${Math.round(illumination * 100)}%`}
			className={className}
		>
			<circle cx='50' cy='50' r={r} className='fill-muted' />
			{illumination > 0.001 && (
				<path
					d={`M 50 0 A ${r} ${r} 0 0 ${sweepOuter} 50 100 A ${rx} ${r} 0 0 ${sweepInner} 50 0 Z`}
					className='fill-amber-200 dark:fill-amber-100'
				/>
			)}
			<circle
				cx='50'
				cy='50'
				r={r}
				className='fill-none stroke-border'
				strokeWidth='1'
			/>
		</svg>
	)
}
