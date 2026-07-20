'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Search } from 'lucide-react'
import { widgets } from '@/lib/constants/widgets'
import { filterWidgets } from '@/lib/utils/filter-widgets'
import { highlightText } from '@/lib/utils/highlightText'
import { ToolCard } from './ToolCard'
import type { SortOption } from './ToolsFilterBar'

const DIFFICULTY_ORDER = { beginner: 0, intermediate: 1, advanced: 2 } as const

interface Props {
	/** Категорию задаёт страница; внутри компонента она не меняется. */
	category: string
	search: string
	viewMode: 'grid' | 'list'
	/** Пусто = любая сложность. */
	difficulty: string[]
	sort: SortOption
}

/**
 * Список инструментов под шапкой каталога.
 *
 * Поиск, переключатель вида и выбор категории живут снаружи (CategoryHero и
 * адрес страницы) — сюда приходит уже готовое состояние. Раньше компонент тащил
 * в себе ещё и собственный заголовок, поиск и чипсы; после того как категории
 * стали отдельными страницами, всё это осталось мёртвым кодом и убрано.
 *
 * Сплошная выдача без деления на секции по категориям (раньше на общем
 * каталоге каждая категория рендерилась отдельным блоком со своим h2) —
 * категория теперь просто один из фильтров, а не структура страницы.
 */
export function EnhancedWidgetSearch({
	category,
	search,
	viewMode,
	difficulty,
	sort
}: Props) {
	const filtered = useMemo(() => {
		let result = filterWidgets(widgets, search, category)

		if (difficulty.length > 0) {
			result = result.filter(
				widget => widget.difficulty && difficulty.includes(widget.difficulty)
			)
		}

		if (sort === 'alpha') {
			result = [...result].sort((a, b) =>
				(a.title ?? a.translationKey).localeCompare(b.title ?? b.translationKey, 'ru')
			)
		} else if (sort === 'difficulty') {
			result = [...result].sort(
				(a, b) =>
					DIFFICULTY_ORDER[a.difficulty ?? 'beginner'] -
					DIFFICULTY_ORDER[b.difficulty ?? 'beginner']
			)
		} else if (sort === 'popularity') {
			// searchVolume проставлен не у всех (см. Widget['searchVolume']) —
			// без данных отправляем в конец, а не притворяемся нулевым спросом.
			result = [...result].sort(
				(a, b) => (b.searchVolume ?? -1) - (a.searchVolume ?? -1)
			)
		}

		return result
	}, [search, category, difficulty, sort])

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

	return viewMode === 'grid' ? (
		<div className='grid gap-6 px-1 pt-3 pr-4 sm:grid-cols-2 lg:grid-cols-3'>
			{filtered.map(widget => (
				<ToolCard key={widget.id} widget={widget} searchQuery={search} />
			))}
		</div>
	) : (
		<div className='space-y-3'>
			{filtered.map(widget => {
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
	)
}
