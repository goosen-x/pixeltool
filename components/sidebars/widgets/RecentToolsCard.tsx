'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/components/ui/tooltip'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SharePopover } from '@/components/share/SharePopover'
import { getWidgetById, type Widget } from '@/lib/constants/widgets'
import { useToolHistory } from '@/lib/hooks/useToolHistory'

interface Props {
	/** Текущий инструмент. На страницах блога его нет — карточка работает и так */
	widget?: Widget
}

function ToolRow({
	id,
	starred,
	onToggle
}: {
	id: string
	starred: boolean
	onToggle: (id: string) => void
}) {
	const widget = getWidgetById(id)
	if (!widget) return null

	const title = widget.title || widget.id

	return (
		<li className='flex items-center gap-0.5'>
			{/* Названия длинные и обрезаются — показываем полное при наведении */}
			<Tooltip>
				<TooltipTrigger asChild>
					<Link
						href={`/tools/${widget.path}`}
						className='min-w-0 flex-1 cursor-pointer truncate rounded px-2 py-1 text-[13px] leading-snug transition-colors hover:bg-muted'
					>
						{title}
					</Link>
				</TooltipTrigger>
				<TooltipContent side='left' className='max-w-xs'>
					{title}
				</TooltipContent>
			</Tooltip>
			<Button
				variant='ghost'
				size='icon'
				className='h-6 w-6 shrink-0 cursor-pointer'
				onClick={() => onToggle(id)}
				aria-label={starred ? 'Убрать из избранного' : 'Добавить в избранное'}
				aria-pressed={starred}
			>
				<Star
					className={cn(
						'h-3 w-3',
						starred ? 'fill-current text-amber-500' : 'text-muted-foreground'
					)}
				/>
			</Button>
		</li>
	)
}

export function RecentToolsCard({ widget }: Props) {
	const { recent, favorites, ready, toggleFavorite, isFavorite } =
		useToolHistory(widget?.id)

	// До монтирования localStorage недоступен — карточка появляется после него
	const hasContent = ready && (favorites.length > 0 || recent.length > 0)

	return (
		<Card>
			<CardHeader className='pb-2'>
				<CardTitle className='text-sm'>Ваши инструменты</CardTitle>
			</CardHeader>
			<CardContent className='space-y-3'>
				{!hasContent ? (
					<p className='text-xs text-muted-foreground'>
						Отметьте инструмент звёздочкой — он закрепится здесь. Недавно
						открытые появятся сами.
					</p>
				) : (
					/* Избранное ничем не ограничено, и карточка росла бы бесконечно,
					   выдавливая всё, что под ней в сайдбаре. Держим фиксированный
					   потолок: список прокручивается внутри себя */
					<div className='max-h-40 space-y-3 overflow-y-auto pr-1'>
						{favorites.length > 0 && (
							<div className='space-y-1'>
								<p className='px-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase'>
									Избранное
									<span className='ml-1 font-mono'>{favorites.length}</span>
								</p>
								<ul className='space-y-0.5'>
									{favorites.map(id => (
										<ToolRow
											key={id}
											id={id}
											starred
											onToggle={toggleFavorite}
										/>
									))}
								</ul>
							</div>
						)}

						{recent.filter(id => !isFavorite(id)).length > 0 && (
							<div className='space-y-1'>
								<p className='px-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase'>
									Недавние
								</p>
								<ul className='space-y-0.5'>
									{recent
										.filter(id => !isFavorite(id))
										.map(id => (
											<ToolRow
												key={id}
												id={id}
												starred={false}
												onToggle={toggleFavorite}
											/>
										))}
								</ul>
							</div>
						)}
					</div>
				)}

				{/* На странице инструмента «Поделиться» живёт рядом с его заголовком,
				    а в блоге такого заголовка нет — там кнопка нужна здесь */}
				{!widget && (
					<div className='border-t pt-2'>
						<SharePopover />
					</div>
				)}
			</CardContent>
		</Card>
	)
}
