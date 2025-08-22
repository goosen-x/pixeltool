'use client'

import { SlidingNumber } from '@/components/motion-primitives/sliding-number'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface SlidingCountdownProps {
	hours: number
	minutes: number
	seconds: number
	onTimeChange?: (
		field: 'hours' | 'minutes' | 'seconds',
		increment: boolean
	) => void
	isEditable?: boolean
	className?: string
}

export function SlidingCountdown({
	hours,
	minutes,
	seconds,
	onTimeChange,
	isEditable = false,
	className
}: SlidingCountdownProps) {
	return (
		<div
			className={cn('flex items-center justify-center gap-4', className)}
			style={{
				fontFamily:
					'ui-monospace, "SF Mono", "Monaco", "Inconsolata", "Fira Code", "Source Code Pro", monospace'
			}}
		>
			{/* Hours */}
			{isEditable ? (
				<div className='flex flex-col items-center'>
					<Button
						variant='ghost'
						size='icon'
						className='h-6 w-6'
						onClick={() => onTimeChange?.('hours', true)}
					>
						<ChevronUp className='h-4 w-4' />
					</Button>
					<div className='text-8xl md:text-9xl font-black tracking-wider tabular-nums'>
						<SlidingNumber value={hours} padStart />
					</div>
					<Button
						variant='ghost'
						size='icon'
						className='h-6 w-6'
						onClick={() => onTimeChange?.('hours', false)}
					>
						<ChevronDown className='h-4 w-4' />
					</Button>
				</div>
			) : (
				<div className='text-8xl md:text-9xl font-black tracking-wider tabular-nums'>
					<SlidingNumber value={hours} padStart />
				</div>
			)}

			<span
				className='text-8xl md:text-9xl font-black tracking-wider tabular-nums text-muted-foreground/40'
				style={{
					fontFamily:
						'ui-monospace, "SF Mono", "Monaco", "Inconsolata", "Fira Code", "Source Code Pro", monospace'
				}}
			>
				:
			</span>

			{/* Minutes */}
			{isEditable ? (
				<div className='flex flex-col items-center'>
					<Button
						variant='ghost'
						size='icon'
						className='h-6 w-6'
						onClick={() => onTimeChange?.('minutes', true)}
					>
						<ChevronUp className='h-4 w-4' />
					</Button>
					<div className='text-8xl md:text-9xl font-black tracking-wider tabular-nums'>
						<SlidingNumber value={minutes} padStart />
					</div>
					<Button
						variant='ghost'
						size='icon'
						className='h-6 w-6'
						onClick={() => onTimeChange?.('minutes', false)}
					>
						<ChevronDown className='h-4 w-4' />
					</Button>
				</div>
			) : (
				<div className='text-8xl md:text-9xl font-black tracking-wider tabular-nums'>
					<SlidingNumber value={minutes} padStart />
				</div>
			)}

			<span
				className='text-8xl md:text-9xl font-black tracking-wider tabular-nums text-muted-foreground/40'
				style={{
					fontFamily:
						'ui-monospace, "SF Mono", "Monaco", "Inconsolata", "Fira Code", "Source Code Pro", monospace'
				}}
			>
				:
			</span>

			{/* Seconds */}
			{isEditable ? (
				<div className='flex flex-col items-center'>
					<Button
						variant='ghost'
						size='icon'
						className='h-6 w-6'
						onClick={() => onTimeChange?.('seconds', true)}
					>
						<ChevronUp className='h-4 w-4' />
					</Button>
					<div className='text-8xl md:text-9xl font-black tracking-wider tabular-nums'>
						<SlidingNumber value={seconds} padStart />
					</div>
					<Button
						variant='ghost'
						size='icon'
						className='h-6 w-6'
						onClick={() => onTimeChange?.('seconds', false)}
					>
						<ChevronDown className='h-4 w-4' />
					</Button>
				</div>
			) : (
				<div className='text-8xl md:text-9xl font-black tracking-wider tabular-nums'>
					<SlidingNumber value={seconds} padStart />
				</div>
			)}
		</div>
	)
}
