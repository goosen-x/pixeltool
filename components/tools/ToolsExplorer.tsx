'use client'

import { useState } from 'react'
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue'
import { EnhancedWidgetSearch } from '@/components/tools/EnhancedWidgetSearch'
import { CategoryHero } from '@/components/tools/CategoryHero'

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

	// Поле откликается сразу, а список пересчитывается с задержкой — иначе он
	// перебирал бы полсотни виджетов на каждое нажатие клавиши.
	const debouncedSearch = useDebouncedValue(search, 250)
	const isSearching = search !== debouncedSearch

	return (
		<>
			<CategoryHero
				category={category}
				search={search}
				onSearchChange={setSearch}
				debouncedSearch={debouncedSearch}
				isSearching={isSearching}
				viewMode={viewMode}
				onViewModeChange={setViewMode}
			/>

			<section className='relative mb-12 mt-10 overflow-hidden' id='tools-list'>
				<EnhancedWidgetSearch
					category={category}
					search={debouncedSearch}
					viewMode={viewMode}
				/>
			</section>
		</>
	)
}
