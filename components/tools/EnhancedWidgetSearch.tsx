'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { publicWidgets, widgetCategories } from '@/lib/constants/widgets'
import { filterWidgets } from '@/lib/utils/filter-widgets'
import { highlightText } from '@/lib/utils/highlightText'
import { CATEGORY_META, type CategoryKey } from '@/lib/constants/categories'
import { useToolStatsContext } from '@/components/providers/ToolStatsProvider'
import { ToolCard } from './ToolCard'
import { CornerBadge } from './CornerBadge'
import { DifficultyBars } from './DifficultyBars'
import { DIFFICULTY_LABELS, type SortOption } from './ToolsFilterBar'

const DIFFICULTY_ORDER = { beginner: 0, intermediate: 1, advanced: 2 } as const

const CATEGORY_ORDER = Object.keys(widgetCategories)

interface Props {
	/** Категорию задаёт страница; внутри компонента она не меняется. */
	category: string
	search: string
	viewMode: 'grid' | 'list'
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
	sort
}: Props) {
	const { stats } = useToolStatsContext()

	const filtered = useMemo(() => {
		let result = filterWidgets(publicWidgets, search, category)

		// Стабильная база (Array.sort в JS стабилен): на общем каталоге разделы
		// идут в том же порядке, что в сайдбаре и футере, а не в порядке
		// объявления в lib/constants/widgets — там «Разработка» шла бы первой,
		// хотя в навигации её перенесли в конец. На странице одной категории
		// это no-op: там и так один widget.category на всех.
		result = [...result].sort(
			(a, b) =>
				CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
		)

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
		} else if (sort === 'views') {
			// Реальные просмотры с сайта (GET /api/tool-stats), не Вордстат-спрос —
			// та же логика «нет данных → в конец», что и у popularity.
			result = [...result].sort(
				(a, b) => (stats[b.id]?.views ?? -1) - (stats[a.id]?.views ?? -1)
			)
		} else if (sort === 'rating') {
			result = [...result].sort(
				(a, b) => (stats[b.id]?.rating ?? -1) - (stats[a.id]?.rating ?? -1)
			)
		}

		return result
	}, [search, category, sort, stats])

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
					CATEGORY_META[(widget.subcategory ?? widget.category) as CategoryKey]
						?.title

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
