'use client'

import { SlidingNumber } from '@/components/motion-primitives/sliding-number'
import { cn } from '@/lib/utils'

interface SlidingTimerProps {
	hours: number
	minutes: number
	seconds: number
	milliseconds?: number
	showMilliseconds?: boolean
	className?: string
}

export function SlidingTimer({
	hours,
	minutes,
	seconds,
	milliseconds = 0,
	showMilliseconds = false,
	className
}: SlidingTimerProps) {
	return (
		<div
			className={cn(
				'flex items-center justify-center gap-4 font-mono text-8xl md:text-9xl font-black tracking-wider tabular-nums',
				className
			)}
			style={{
				fontFamily:
					'ui-monospace, "SF Mono", "Monaco", "Inconsolata", "Fira Code", "Source Code Pro", monospace'
			}}
		>
			{/* Hours */}
			<div className='flex items-center'>
				<SlidingNumber value={hours} padStart />
			</div>

			<span
				className='text-muted-foreground/40 font-black tabular-nums'
				style={{
					fontFamily:
						'ui-monospace, "SF Mono", "Monaco", "Inconsolata", "Fira Code", "Source Code Pro", monospace'
				}}
			>
				:
			</span>

			{/* Minutes */}
			<div className='flex items-center'>
				<SlidingNumber value={minutes} padStart />
			</div>

			<span
				className='text-muted-foreground/40 font-black tabular-nums'
				style={{
					fontFamily:
						'ui-monospace, "SF Mono", "Monaco", "Inconsolata", "Fira Code", "Source Code Pro", monospace'
				}}
			>
				:
			</span>

			{/* Seconds */}
			<div className='flex items-center'>
				<SlidingNumber value={seconds} padStart />
			</div>

			{/* Milliseconds */}
			{showMilliseconds && (
				<>
					<span
						className='text-5xl md:text-6xl text-muted-foreground/40 font-black tabular-nums'
						style={{
							fontFamily:
								'ui-monospace, "SF Mono", "Monaco", "Inconsolata", "Fira Code", "Source Code Pro", monospace'
						}}
					>
						.
					</span>
					<div className='flex items-center text-5xl md:text-6xl text-muted-foreground'>
						<SlidingNumber value={Math.floor(milliseconds / 10)} padStart />
					</div>
				</>
			)}
		</div>
	)
}
