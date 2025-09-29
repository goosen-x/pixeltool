'use client'

import { useMemo } from 'react'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, X, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { widgets } from '@/lib/constants/widgets'
import { useFavorites } from '@/lib/hooks/useFavorites'
import { cn } from '@/lib/utils'

interface FavoriteWidgetsProps {
	locale: string
	className?: string
}

export function FavoriteWidgets({ locale, className }: FavoriteWidgetsProps) {
	const { favorites, removeFavorite, clearFavorites, isLoading } =
		useFavorites()

	// const favT = useTranslations('widgets.favorites') // Removed translations

	const favoriteWidgets = useMemo(() => {
		return favorites.map(id => widgets.find(w => w.id === id)).filter(Boolean)
	}, [favorites])

	if (isLoading) {
		return (
			<div className={cn('animate-pulse', className)}>
				<div className='h-8 bg-muted rounded-lg w-48 mb-4' />
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{[1, 2, 3].map(i => (
						<div key={i} className='h-32 bg-muted rounded-lg' />
					))}
				</div>
			</div>
		)
	}

	if (favorites.length === 0) {
		return null
	}

	return (
		<div className={cn('space-y-4', className)}>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Heart className='w-5 h-5 text-red-500 fill-current' />
					<h2 className='text-xl font-heading font-bold'>
						Избранные инструменты
					</h2>
					<Badge variant='outline' className='ml-2'>
						{favorites.length}
					</Badge>
				</div>

				{favorites.length > 0 && (
					<Button
						variant='ghost'
						size='sm'
						onClick={clearFavorites}
						className='text-muted-foreground hover:text-foreground'
					>
						<X className='w-4 h-4 mr-1' />
						Очистить всё
					</Button>
				)}
			</div>

			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{favoriteWidgets.map(widget => {
					if (!widget) return null
					const Icon = widget.icon

					return (
						<Link
							key={widget.id}
							href={`/tools/${widget.path}`}
							className='block group'
						>
							<Card className='h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 bg-gradient-to-br from-background to-muted/10 relative'>
								<Button
									variant='ghost'
									size='icon'
									onClick={e => {
										e.preventDefault()
										e.stopPropagation()
										removeFavorite(widget.id)
									}}
									className='absolute top-2 right-2 w-8 h-8 text-muted-foreground hover:text-red-500'
								>
									<X className='w-4 h-4' />
								</Button>

								<CardHeader className='pb-3'>
									<div
										className={`w-12 h-12 rounded-lg bg-gradient-to-br ${widget.gradient} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-all duration-300 shadow-md`}
									>
										<Icon className='w-6 h-6' />
									</div>
									<CardTitle className='text-base font-heading line-clamp-1 transition-all duration-300 group-hover:text-primary'>
										{widget.title || widget.translationKey}
									</CardTitle>
								</CardHeader>
								<CardContent className='pt-0'>
									<p className='text-xs text-muted-foreground line-clamp-2'>
										{widget.description}
									</p>
								</CardContent>
							</Card>
						</Link>
					)
				})}
			</div>
		</div>
	)
}
