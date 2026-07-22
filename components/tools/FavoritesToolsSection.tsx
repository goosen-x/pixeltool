'use client'

import Link from 'next/link'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getWidgetById } from '@/lib/constants/widgets'
import { useToolHistory } from '@/lib/hooks/useToolHistory'

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
		<li className='flex items-center gap-0.5'>
			<Link
				href={`/tools/${widget.path}`}
				title={widget.title || widget.id}
				className='min-w-0 flex-1 cursor-pointer truncate rounded px-1.5 py-1 text-xs leading-snug transition-colors hover:bg-background'
			>
				{widget.title || widget.id}
			</Link>
			<button
				type='button'
				onClick={() => onToggle(id)}
				aria-label={starred ? 'Убрать из избранного' : 'Добавить в избранное'}
				aria-pressed={starred}
				className='flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded'
			>
				<Star
					className={cn(
						'h-3 w-3',
						starred ? 'fill-current text-amber-500' : 'text-muted-foreground'
					)}
				/>
			</button>
		</li>
	)
}

/**
 * Избранное и недавние прямо в сайдбаре каталога — та же логика и данные
 * (useToolHistory/localStorage), что и на страницах инструментов
 * (components/sidebars/widgets/RecentToolsCard.tsx), но в компактной
 * вёрстке под узкий сайдбар фильтров, без Card-обвязки. currentWidgetId не
 * передаём: на /tools нет одного «текущего» инструмента, поэтому «недавние»
 * здесь только читаются, а не пополняются.
 */
export function FavoritesToolsSection() {
	const { recent, favorites, ready, toggleFavorite, isFavorite } =
		useToolHistory()

	const hasContent = ready && (favorites.length > 0 || recent.length > 0)
	const recentOnly = recent.filter(id => !isFavorite(id))

	return (
		<div>
			<p className='mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
				Ваши инструменты
			</p>

			{!hasContent ? (
				<p className='text-xs text-muted-foreground'>
					Отметьте инструмент звёздочкой на его странице — он закрепится здесь.
				</p>
			) : (
				// Избранное ничем не ограничено — держим потолок высоты, список
				// прокручивается внутри себя, а не выдавливает фильтры вниз.
				<div className='max-h-40 space-y-3 overflow-y-auto pr-1'>
					{favorites.length > 0 && (
						<div className='space-y-1'>
							<p className='px-1.5 text-[11px] font-medium tracking-wide text-muted-foreground/80 uppercase'>
								Избранное <span className='font-mono'>{favorites.length}</span>
							</p>
							<ul className='space-y-0.5'>
								{favorites.map(id => (
									<ToolRow key={id} id={id} starred onToggle={toggleFavorite} />
								))}
							</ul>
						</div>
					)}

					{recentOnly.length > 0 && (
						<div className='space-y-1'>
							<p className='px-1.5 text-[11px] font-medium tracking-wide text-muted-foreground/80 uppercase'>
								Недавние
							</p>
							<ul className='space-y-0.5'>
								{recentOnly.map(id => (
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
		</div>
	)
}
