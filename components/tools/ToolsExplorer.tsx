'use client'

import { useState } from 'react'
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue'
import { EnhancedWidgetSearch } from '@/components/tools/EnhancedWidgetSearch'
import { CategoryHero } from '@/components/tools/CategoryHero'
import {
	ToolsFilterBar,
	type SortOption
} from '@/components/tools/ToolsFilterBar'
import { widgets } from '@/lib/constants/widgets'
import { filterWidgets } from '@/lib/utils/filter-widgets'

interface Props {
	/** '' — общий каталог, иначе ключ категории. Задаётся страницей и не меняется. */
	category: string
}

/**
 * Клиентская часть каталога: поиск, переключатель вида, карточки.
 *
 * Категория сюда приходит сверху и внутри не меняется — её выбирают ссылкой на
 * отдельную страницу (/tools/css), а не фильтром на месте. Так у каждой
 * категории есть свой адрес, заголовок и текст, которые видит поисковик.
 */
export function ToolsExplorer({ category }: Props) {
	const [search, setSearch] = useState('')
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
	const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([])
	const [sort, setSort] = useState<SortOption>('default')

	// Поле откликается сразу, а список пересчитывается с задержкой — иначе он
	// перебирал бы полсотни виджетов на каждое нажатие клавиши.
	const debouncedSearch = useDebouncedValue(search, 250)
	const isSearching = search !== debouncedSearch
	const found = filterWidgets(widgets, debouncedSearch, category).length

	return (
		<>
			<CategoryHero
				category={category}
				search={search}
				onSearchChange={setSearch}
				debouncedSearch={debouncedSearch}
				isSearching={isSearching}
			/>

			<section className='relative mb-12 mt-10' id='tools-list'>
				<div className='flex flex-col gap-6 lg:flex-row lg:items-start'>
					<ToolsFilterBar
						found={found}
						search={search}
						onSearchChange={setSearch}
						viewMode={viewMode}
						onViewModeChange={setViewMode}
						selectedDifficulty={selectedDifficulty}
						onDifficultyChange={setSelectedDifficulty}
						sort={sort}
						onSortChange={setSort}
					/>
					<div className='min-w-0 flex-1 overflow-hidden'>
						<EnhancedWidgetSearch
							category={category}
							search={debouncedSearch}
							viewMode={viewMode}
							difficulty={selectedDifficulty}
							sort={sort}
						/>
					</div>
				</div>
			</section>
		</>
	)
}
