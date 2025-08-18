'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface WidgetOutputProps {
	children: ReactNode
	className?: string
	gradientFrom?: string
	gradientTo?: string
}

export function WidgetOutput({
	children,
	className,
	gradientFrom = 'from-primary/10',
	gradientTo = 'to-accent/10'
}: WidgetOutputProps) {
	return (
		<div
			className={cn(
				'relative rounded-xl border border-border/50 bg-background/60 backdrop-blur-sm overflow-hidden',
				className
			)}
		>
			<div
				className={cn(
					'absolute inset-0 bg-gradient-to-br opacity-30',
					gradientFrom,
					gradientTo
				)}
			/>
			<div className='relative p-6'>{children}</div>
		</div>
	)
}
