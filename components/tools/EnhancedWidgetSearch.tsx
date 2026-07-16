'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Search } from 'lucide-react'
import { widgets, widgetCategories, type Widget } from '@/lib/constants/widgets'
import { filterWidgets } from '@/lib/utils/filter-widgets'
import { highlightText } from '@/lib/utils/highlightText'
import { ToolCard } from './ToolCard'

interface Props {
	/** Категорию задаёт страница; внутри компонента она не меняется. */
	category: string
	search: string
	viewMode: 'grid' | 'list'
}

/**
 * Список инструментов под шапкой каталога.
 *
 * Поиск, переключатель вида и выбор категории живут снаружи (CategoryHero и
 * адрес страницы) — сюда приходит уже готовое состояние. Раньше компонент тащил
 * в себе ещё и собственный заголовок, поиск и чипсы; после того как категории
 * стали отдельными страницами, всё это осталось мёртвым кодом и убрано.
 */
export function EnhancedWidgetSearch({ category, search, viewMode }: Props) {
	const filtered = useMemo(
		() => filterWidgets(widgets, search, category),
		[search, category]
	)

	// Группируем по категориям только в общем каталоге: на странице категории
	// группа была бы одна, и заголовок над ней дублировал бы h1.
	const groups = useMemo(() => {
		if (category !== '') return [{ key: category, items: filtered }]

		const byCategory: Record<string, Widget[]> = {}
		for (const widget of filtered) {
			byCategory[widget.category] ??= []
			byCategory[widget.category].push(widget)
		}
		return Object.entries(byCategory).map(([key, items]) => ({ key, items }))
	}, [filtered, category])

	if (filtered.length === 0) {
		return (
			<div className='py-16 text-center'>
				<Search
					aria-hidden
					className='mx-auto mb-4 h-10 w-10 text-muted-foreground/50'
				/>
				<p className='text-muted-foreground'>
					Ничего не нашлось. Попробуйте другое слово.
				</p>
			</div>
		)
	}

	return (
		<div className='space-y-10'>
			{groups.map(({ key, items }) => (
				<section key={key}>
					{category === '' && (
						<div className='mb-6 flex items-center gap-3'>
							<h2 className='text-2xl font-bold tracking-tight'>
								{widgetCategories[key as keyof typeof widgetCategories] ?? key}
							</h2>
							<Badge variant='secondary'>{items.length}</Badge>
						</div>
					)}

					{viewMode === 'grid' ? (
						<div className='grid gap-6 px-1 pt-3 pr-4 sm:grid-cols-2 lg:grid-cols-3'>
							{items.map(widget => (
								<ToolCard
									key={widget.id}
									widget={widget}
									searchQuery={search}
								/>
							))}
						</div>
					) : (
						<div className='space-y-3'>
							{items.map(widget => {
								const Icon = widget.icon
								const title = widget.title || widget.translationKey

								return (
									<Link
										key={widget.id}
										href={`/tools/${widget.path}`}
										className='block cursor-pointer'
									>
										<Card className='border-border/50 transition-colors hover:border-primary/40'>
											<CardContent className='flex items-center gap-4 p-5'>
												<div
													className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white ${widget.gradient}`}
												>
													<Icon className='h-7 w-7' />
												</div>
												<div className='min-w-0'>
													<h3 className='font-semibold'>
														{search ? highlightText(title, search) : title}
													</h3>
													<p className='mt-1 line-clamp-2 text-sm text-muted-foreground'>
														{widget.description}
													</p>
												</div>
											</CardContent>
										</Card>
									</Link>
								)
							})}
						</div>
					)}
				</section>
			))}
		</div>
	)
}
