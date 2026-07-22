'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { widgets } from '@/lib/constants/widgets'
import { filterWidgets } from '@/lib/utils/filter-widgets'
import { highlightText } from '@/lib/utils/highlightText'
import { CATEGORY_META, type CategoryKey } from '@/lib/constants/categories'
import { ToolCard } from './ToolCard'
import { CornerBadge } from './CornerBadge'
import { DifficultyBars } from './DifficultyBars'
import { DIFFICULTY_LABELS, type SortOption } from './ToolsFilterBar'

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
				(a.title ?? a.translationKey).localeCompare(
					b.title ?? b.translationKey,
					'ru'
				)
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
		<div className='space-y-2.5'>
			{filtered.map(widget => {
				const Icon = widget.icon
				const title = widget.title || widget.translationKey
				const categoryLabel =
					CATEGORY_META[widget.category as CategoryKey]?.title

				return (
					<Link
						key={widget.id}
						href={`/tools/${widget.path}`}
						className='group relative block cursor-pointer overflow-hidden rounded-3xl border border-border/50 bg-card transition-colors hover:border-primary/40'
					>
						<CornerBadge
							icon={Icon}
							gradient={widget.gradient}
							size={40}
							notchSize={14}
							iconClassName='h-4 w-4'
						/>

						<div className='flex flex-col gap-1 py-3.5 pl-4 pr-14 sm:pr-16'>
							{categoryLabel && (
								<span className='w-fit rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground'>
									{categoryLabel}
								</span>
							)}

							<div className='flex flex-wrap items-center gap-x-2 gap-y-0.5'>
								<h3 className='text-base font-semibold leading-snug'>
									{search ? highlightText(title, search) : title}
								</h3>
								{widget.difficulty && (
									<span title={DIFFICULTY_LABELS[widget.difficulty]}>
										<DifficultyBars
											level={widget.difficulty}
											className='h-3.5 w-3.5 text-muted-foreground'
										/>
									</span>
								)}
							</div>

							<p className='line-clamp-1 text-sm text-muted-foreground'>
								{widget.description}
							</p>
						</div>
					</Link>
				)
			})}
		</div>
	)
}
