'use client'

// import { useTranslations } from 'next-intl' // Removed translations
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FavoriteButton } from './FavoriteButton'
import { highlightText } from '@/lib/utils/highlightText'
import { cn } from '@/lib/utils'
import type { Widget } from '@/lib/constants/widgets'

interface ToolCardProps {
	widget: Widget
	locale: string
	searchQuery?: string
	showFavoriteButton?: boolean
	className?: string
}

export function ToolCard({
	widget,
	locale,
	searchQuery = '',
	showFavoriteButton = true,
	className
}: ToolCardProps) {
	// const t = useTranslations('widgets') // Removed translations
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
			<Card
				className={cn(
					'h-full transition-all duration-300 border-border/50 bg-background/60 backdrop-blur-sm relative overflow-hidden transform-gpu',
					'hover:shadow-lg hover:-translate-y-1 hover:border-primary/30',
					className
				)}
				style={{
					transition: 'all 0.3s ease',
					cursor: 'pointer'
				}}
				onMouseEnter={e => {
					e.currentTarget.style.transform = 'translateY(-4px)'
					e.currentTarget.style.boxShadow =
						'0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
				}}
				onMouseLeave={e => {
					e.currentTarget.style.transform = 'translateY(0)'
					e.currentTarget.style.boxShadow = ''
				}}
			>
				<div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500' />

				{showFavoriteButton && (
					<FavoriteButton
						widgetId={widget.id}
						className='absolute top-2 right-2 z-10'
					/>
				)}

				<CardHeader className='relative z-10 p-4 sm:p-6'>
					<div
						className={cn(
							'w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-3 sm:mb-4 transition-all duration-300 shadow-lg',
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
							{widget.tags.slice(0, 2).map(tag => (
								<Badge
									key={tag}
									variant='secondary'
									className='text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors'
								>
									{searchQuery ? highlightText(tag, searchQuery) : tag}
								</Badge>
							))}
							{widget.tags.length > 2 && (
								<Badge
									variant='outline'
									className='text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 border-primary/30 text-primary/80 hover:border-primary/50 transition-colors'
								>
									+{widget.tags.length - 2}
								</Badge>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</Link>
	)
}
