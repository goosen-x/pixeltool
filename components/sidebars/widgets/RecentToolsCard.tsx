'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, Clock, Share2, Link2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getWidgetById, type Widget } from '@/lib/constants/widgets'
import { useToolHistory } from '@/lib/hooks/useToolHistory'

interface Props {
	widget: Widget
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

	return (
		<li className='flex items-center gap-1'>
			<Link
				href={`/tools/${widget.path}`}
				className='flex-1 cursor-pointer truncate rounded px-2 py-1.5 text-sm transition-colors hover:bg-muted'
			>
				{widget.title || widget.id}
			</Link>
			<Button
				variant='ghost'
				size='icon'
				className='h-7 w-7 shrink-0 cursor-pointer'
				onClick={() => onToggle(id)}
				aria-label={
					starred ? 'Убрать из избранного' : 'Добавить в избранное'
				}
				aria-pressed={starred}
			>
				<Star
					className={cn(
						'h-3.5 w-3.5',
						starred ? 'fill-current text-amber-500' : 'text-muted-foreground'
					)}
				/>
			</Button>
		</li>
	)
}

export function RecentToolsCard({ widget }: Props) {
	const { recent, favorites, ready, toggleFavorite, isFavorite } =
		useToolHistory(widget.id)

	const copyLink = () => {
		navigator.clipboard.writeText(window.location.href)
		toast.success('Ссылка скопирована')
	}

	const share = async () => {
		if (!navigator.share) return copyLink()

		try {
			await navigator.share({ title: document.title, url: window.location.href })
		} catch (error) {
			if ((error as Error).name !== 'AbortError') copyLink()
		}
	}

	// До монтирования localStorage недоступен — карточка появляется после него
	const hasContent = ready && (favorites.length > 0 || recent.length > 0)

	return (
		<Card>
			<CardHeader className='pb-3'>
				<CardTitle className='flex items-center gap-2 text-sm'>
					<Clock className='h-4 w-4' />
					Ваши инструменты
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				{!hasContent ? (
					<p className='text-xs text-muted-foreground'>
						Отметьте инструмент звёздочкой — он закрепится здесь. Недавно
						открытые появятся сами.
					</p>
				) : (
					<>
						{favorites.length > 0 && (
							<div className='space-y-1'>
								<p className='px-2 text-xs font-medium text-muted-foreground'>
									Избранное
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
								<p className='px-2 text-xs font-medium text-muted-foreground'>
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
					</>
				)}

				<div className='flex items-center gap-1 border-t pt-3'>
					<Button
						variant='ghost'
						size='sm'
						className='h-8 cursor-pointer gap-2 text-xs'
						onClick={() => toggleFavorite(widget.id)}
					>
						<Star
							className={cn(
								'h-3.5 w-3.5',
								isFavorite(widget.id)
									? 'fill-current text-amber-500'
									: 'text-muted-foreground'
							)}
						/>
						{isFavorite(widget.id) ? 'В избранном' : 'В избранное'}
					</Button>

					<div className='ml-auto flex gap-1'>
						<Button
							variant='ghost'
							size='icon'
							className='h-8 w-8 cursor-pointer'
							onClick={share}
							aria-label='Поделиться'
						>
							<Share2 className='h-3.5 w-3.5' />
						</Button>
						<Button
							variant='ghost'
							size='icon'
							className='h-8 w-8 cursor-pointer'
							onClick={copyLink}
							aria-label='Скопировать ссылку'
						>
							<Link2 className='h-3.5 w-3.5' />
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
