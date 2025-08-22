'use client'

import { cn } from '@/lib/utils'

interface AnimatedProgressBarProps {
	value: number
	className?: string
}

export function AnimatedProgressBar({
	value,
	className
}: AnimatedProgressBarProps) {
	const progressValue = Math.max(0, Math.min(100, value || 0))

	return (
		<div
			className={cn(
				'w-full bg-muted/30 rounded-full overflow-hidden',
				className
			)}
		>
			<div
				className='h-full bg-gradient-to-r from-primary via-primary to-accent rounded-full shadow-sm'
				style={{
					width: `${progressValue}%`,
					transition: 'width 1000ms linear',
					transformOrigin: 'left center'
				}}
			/>
		</div>
	)
}
