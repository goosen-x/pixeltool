import React from 'react'
import { cn } from '@/lib/utils'

interface DiceFaceProps {
	value: number
	className?: string
}

export function DiceFace({ value, className }: DiceFaceProps) {
	const getDotPositions = (val: number): string[] => {
		switch (val) {
			case 1:
				return ['center']
			case 2:
				return ['top-left', 'bottom-right']
			case 3:
				return ['top-left', 'center', 'bottom-right']
			case 4:
				return ['top-left', 'top-right', 'bottom-left', 'bottom-right']
			case 5:
				return [
					'top-left',
					'top-right',
					'center',
					'bottom-left',
					'bottom-right'
				]
			case 6:
				return [
					'top-left',
					'top-right',
					'middle-left',
					'middle-right',
					'bottom-left',
					'bottom-right'
				]
			default:
				return []
		}
	}

	const dotPositions = getDotPositions(value)

	return (
		<div className={cn('relative w-full h-full p-3', className)}>
			{/* Top row */}
			<div className='absolute top-3 left-3 w-[calc(100%-24px)] flex justify-between'>
				<div
					className={cn(
						'w-4 h-4 rounded-full bg-current',
						dotPositions.includes('top-left') ? 'opacity-100' : 'opacity-0'
					)}
				/>
				<div
					className={cn(
						'w-4 h-4 rounded-full bg-current',
						dotPositions.includes('top-right') ? 'opacity-100' : 'opacity-0'
					)}
				/>
			</div>

			{/* Middle row */}
			<div className='absolute top-1/2 left-3 -translate-y-1/2 w-[calc(100%-24px)] flex justify-between'>
				<div
					className={cn(
						'w-4 h-4 rounded-full bg-current',
						dotPositions.includes('middle-left') ? 'opacity-100' : 'opacity-0'
					)}
				/>
				<div
					className={cn(
						'w-4 h-4 rounded-full bg-current',
						dotPositions.includes('center') ? 'opacity-100' : 'opacity-0'
					)}
				/>
				<div
					className={cn(
						'w-4 h-4 rounded-full bg-current',
						dotPositions.includes('middle-right') ? 'opacity-100' : 'opacity-0'
					)}
				/>
			</div>

			{/* Bottom row */}
			<div className='absolute bottom-3 left-3 w-[calc(100%-24px)] flex justify-between'>
				<div
					className={cn(
						'w-4 h-4 rounded-full bg-current',
						dotPositions.includes('bottom-left') ? 'opacity-100' : 'opacity-0'
					)}
				/>
				<div
					className={cn(
						'w-4 h-4 rounded-full bg-current',
						dotPositions.includes('bottom-right') ? 'opacity-100' : 'opacity-0'
					)}
				/>
			</div>
		</div>
	)
}
