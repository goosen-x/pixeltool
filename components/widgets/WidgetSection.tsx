'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

interface WidgetSectionProps {
	icon?: ReactNode
	title: string
	description?: string
	children: ReactNode
	className?: string
}

export function WidgetSection({
	icon,
	title,
	description,
	children,
	className
}: WidgetSectionProps) {
	return (
		<Card className={cn('p-6', className)}>
			<CardHeader className='p-0 pb-4'>
				<CardTitle className='text-lg font-semibold flex items-center gap-2'>
					{icon}
					{title}
				</CardTitle>
				{description && (
					<CardDescription className='mt-1.5'>{description}</CardDescription>
				)}
			</CardHeader>
			<CardContent className='p-0'>{children}</CardContent>
		</Card>
	)
}
