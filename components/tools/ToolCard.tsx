'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { highlightText } from '@/lib/utils/highlightText'
import { cn } from '@/lib/utils'
import type { Widget } from '@/lib/constants/widgets'

interface ToolCardProps {
	widget: Widget
	searchQuery?: string
	className?: string
}

export function ToolCard({
	widget,
	searchQuery = '',
	className
}: ToolCardProps) {
	const Icon = widget.icon

	const title = widget.title || widget.translationKey
	const description = widget.description || ''

	return (
		<Link
			href={`/tools/${widget.path}`}
			className='block group/card'
			style={{
				display: 'block',
				textDecoration: 'none'
			}}
		>
			{/* Ховер — только подсветка рамки. Раньше тут было четыре эффекта разом:
			    тень и подъём классами, они же продублированы инлайновым JS, плюс
			    градиентный оверлей поверх всего. Осталась одна рамка. */}
			<Card
				className={cn(
					'h-full cursor-pointer relative overflow-hidden border-border/50 transition-colors duration-200',
					'hover:border-primary/40',
					className
				)}
			>
				<CardHeader className='relative z-10 p-4 sm:p-6'>
					<div
						className={cn(
							'w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-3 sm:mb-4',
							widget.gradient
						)}
						style={{
							transition: 'transform 0.3s ease'
						}}
						onMouseEnter={e => {
							e.currentTarget.style.transform = 'scale(1.1)'
						}}
						onMouseLeave={e => {
							e.currentTarget.style.transform = 'scale(1)'
						}}
					>
						<Icon className='w-6 h-6 sm:w-8 sm:h-8' />
					</div>
					<CardTitle className='text-base sm:text-lg font-heading transition-all duration-300 group-hover/card:text-primary pr-8'>
						{searchQuery ? highlightText(title, searchQuery) : title}
					</CardTitle>
				</CardHeader>

				<CardContent className='relative z-10 p-4 pt-0 sm:p-6 sm:pt-0'>
					<p className='text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2'>
						{searchQuery
							? highlightText(description, searchQuery)
							: description}
					</p>

					{widget.tags && widget.tags.length > 0 && (
						<div className='flex flex-wrap gap-1.5'>
							{widget.tags.map(tag => (
								<Badge
									key={tag}
									variant='secondary'
									className='text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors'
								>
									{searchQuery ? highlightText(tag, searchQuery) : tag}
								</Badge>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</Link>
	)
}
