'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from '@/components/ui/drawer'
import { cn } from '@/lib/utils'
import { getWidgetById, getWidgetByPath } from '@/lib/constants/widgets'
import { useToolHistory } from '@/lib/hooks/useToolHistory'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'

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
				className='min-w-0 flex-1 cursor-pointer truncate rounded px-2 py-1.5 text-sm transition-colors hover:bg-muted'
			>
				{widget.title || widget.id}
			</Link>
			<Button
				variant='ghost'
				size='icon'
				className='group h-7 w-7 shrink-0 cursor-pointer'
				onClick={() => onToggle(id)}
				aria-label={starred ? 'Убрать из избранного' : 'Добавить в избранное'}
				aria-pressed={starred}
			>
				<Star
					className={cn(
						'h-3.5 w-3.5',
						starred
							? 'fill-current text-amber-500'
							: 'text-muted-foreground group-hover:text-accent-foreground'
					)}
				/>
			</Button>
		</li>
	)
}

/** Избранное и недавние инструменты — доступны из любой страницы сайта, а не
 *  только со страницы конкретного тула, поэтому живут в хедере, а не в
 *  сайдбаре каталога (тот на мобильном вообще не отображается). */
export function ToolHistoryMenu() {
	const pathname = usePathname()
	const widgetPath = pathname.split('/').pop()
	const currentWidget = widgetPath ? getWidgetByPath(widgetPath) : undefined

	// lg — тот же брейкпоинт, на котором хедер вообще переключается между
	// десктопным и мобильным блоком (см. Header.tsx): Popover у самого края
	// экрана на мобильном обрезался и его было неудобно листать пальцем,
	// шторка снизу занимает всю ширину и не имеет этой проблемы.
	const isDesktop = useMediaQuery('(min-width: 1024px)')

	const { recent, favorites, ready, toggleFavorite, isFavorite } =
		useToolHistory(currentWidget?.id)

	const recentOnly = recent.filter(id => !isFavorite(id))
	const hasContent = ready && (favorites.length > 0 || recentOnly.length > 0)

	const trigger = (
		<Button
			variant='ghost'
			size='icon'
			aria-label='Избранные и недавние инструменты'
			className='relative h-10 w-10 cursor-pointer rounded-xl border border-border/50 bg-background/50 hover:bg-muted/80 hover:border-border transition-all duration-300'
		>
			<Star className='h-4 w-4 text-muted-foreground' />
			{ready && favorites.length > 0 && (
				<span className='absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-mono text-[10px] text-primary-foreground'>
					{favorites.length}
				</span>
			)}
		</Button>
	)

	const content = !hasContent ? (
		<p className='text-xs text-muted-foreground'>
			Отметьте инструмент звёздочкой на его странице — он закрепится здесь.
			Недавно открытые появятся сами.
		</p>
	) : (
		<div className='max-h-96 space-y-3 overflow-y-auto pr-1'>
			{favorites.length > 0 && (
				<div className='space-y-1'>
					<p className='px-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase'>
						Избранное
						<span className='ml-1 font-mono'>{favorites.length}</span>
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
					<p className='px-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase'>
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
	)

	if (isDesktop) {
		return (
			<Popover>
				<PopoverTrigger asChild>{trigger}</PopoverTrigger>
				<PopoverContent align='end' className='w-72'>
					{content}
				</PopoverContent>
			</Popover>
		)
	}

	return (
		<Drawer>
			<DrawerTrigger asChild>{trigger}</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Избранное и недавние</DrawerTitle>
				</DrawerHeader>
				<div className='px-4 pb-6'>{content}</div>
			</DrawerContent>
		</Drawer>
	)
}
