'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Info, Tag } from 'lucide-react'
import type { Widget } from '@/lib/constants/widgets'

interface WidgetInfoCardProps {
	widget: Widget
}

export function WidgetInfoCard({ widget }: WidgetInfoCardProps) {
	// const tSidebar = useTranslations('widgets.rightSidebar')

	const difficultyColors = {
		beginner: 'bg-green-100 text-green-800',
		intermediate: 'bg-yellow-100 text-yellow-800',
		advanced: 'bg-red-100 text-red-800'
	}

	return (
		<Card>
			<CardHeader className='pb-3'>
				<CardTitle className='text-sm flex items-center gap-2'>
					<Info className='w-4 h-4' />
					Информация о виджете
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-3'>
				{widget.difficulty && (
					<div className='flex items-center justify-between gap-2'>
						<span className='text-xs lg:text-sm text-muted-foreground whitespace-nowrap'>
							Сложность
						</span>
						<Badge
							className={cn(difficultyColors[widget.difficulty], 'text-xs')}
						>
							{widget.difficulty === 'beginner'
								? 'Начинающий'
								: widget.difficulty === 'intermediate'
									? 'Средний'
									: 'Продвинутый'}
						</Badge>
					</div>
				)}

				<div className='flex items-center justify-between gap-2'>
					<span className='text-xs lg:text-sm text-muted-foreground whitespace-nowrap'>
						Категория
					</span>
					<Badge variant='outline' className='text-xs'>
						{widget.category === 'webdev'
							? 'Веб-разработка'
							: widget.category === 'multimedia'
								? 'Мультимедиа'
								: widget.category === 'content'
									? 'Контент'
									: widget.category === 'security'
										? 'Безопасность'
										: widget.category === 'lifestyle'
											? 'Стиль жизни'
											: widget.category === 'business'
												? 'Бизнес'
												: widget.category}
					</Badge>
				</div>

				{widget.tags && widget.tags.length > 0 && (
					<div className='space-y-2'>
						<span className='text-xs lg:text-sm text-muted-foreground flex items-center gap-1'>
							<Tag className='w-3 h-3 flex-shrink-0' />
							Теги
						</span>
						<div className='flex flex-wrap gap-1'>
							{widget.tags.map(tag => (
								<Badge key={tag} variant='secondary' className='text-xs'>
									{tag}
								</Badge>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
