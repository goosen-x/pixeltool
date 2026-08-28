'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toolBar, toolIconButton, toolPill } from '@/lib/ui/tool-pill'
import { useSpecialSymbols } from '@/lib/hooks/useSpecialSymbols'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { SpecialSymbolsPickerSeo } from './SpecialSymbolsPickerSeo'

export default function SpecialSymbolsPickerPage() {
	const widget = getWidgetById('special-symbols-picker')!
	const [selectedCategory, setSelectedCategory] = useState<
		string | 'all' | 'recent'
	>('all')

	const {
		recentSymbols,
		copiedSymbol,
		copySymbol,
		getFilteredSymbols,
		clearRecentSymbols,
		getCategoryIcon,
		symbolCategories
	} = useSpecialSymbols()

	const filteredSymbols = getFilteredSymbols('', selectedCategory)

	const categories: { id: string; name: string; icon: string }[] = [
		{ id: 'all', name: 'Все', icon: '★' },
		...(recentSymbols.length > 0
			? [{ id: 'recent', name: 'Недавние', icon: '↺' }]
			: []),
		...symbolCategories.map(category => ({
			id: category.id,
			name: category.name,
			icon: getCategoryIcon(category.id)
		}))
	]

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: категории таблетками вместо сетки из восьми
				    кнопок-плиток с тенями — плитки весили больше самих символов. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{categories.map(category => (
							<button
								key={category.id}
								type='button'
								onClick={() => setSelectedCategory(category.id)}
								aria-pressed={selectedCategory === category.id}
								className={toolPill(
									selectedCategory === category.id,
									'flex items-center gap-1.5'
								)}
							>
								<span aria-hidden>{category.icon}</span>
								{category.name}
							</button>
						))}
					</div>

					<div className='flex items-center gap-3 sm:ml-auto'>
						<span className='text-sm text-muted-foreground'>
							{filteredSymbols.length} шт.
						</span>
						{selectedCategory === 'recent' && recentSymbols.length > 0 && (
							<Button
								size='icon'
								variant='ghost'
								onClick={clearRecentSymbols}
								title='Очистить недавние'
								className={toolIconButton}
							>
								<Trash2 className='h-4 w-4' />
							</Button>
						)}
					</div>
				</div>

				{filteredSymbols.length === 0 ? (
					<p className='py-16 text-center text-sm text-muted-foreground'>
						В этой категории пока пусто
					</p>
				) : (
					// Клик ловится делегированием на сетке: символов больше тысячи,
					// и отдельный обработчик на каждом стоил заметной части
					// блокировки главного потока при гидратации.
					<div
						className='grid grid-cols-6 gap-1 px-5 py-6 sm:grid-cols-8 sm:px-6 md:grid-cols-10 lg:grid-cols-12'
						onClick={event => {
							if (!(event.target instanceof Element)) return
							const cell = event.target.closest<HTMLElement>('[data-symbol]')
							if (cell?.dataset.symbol) copySymbol(cell.dataset.symbol)
						}}
					>
						{filteredSymbols.map((symbol, index) => (
							<button
								key={`${symbol}-${index}`}
								type='button'
								data-symbol={symbol}
								title='Скопировать'
								className={cn(
									'glyph-cell flex h-12 cursor-pointer items-center justify-center rounded-lg text-2xl transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
									copiedSymbol === symbol && 'bg-primary/10 ring-1 ring-primary'
								)}
							>
								{symbol}
							</button>
						))}
					</div>
				)}
			</Card>

			<SpecialSymbolsPickerSeo />
		</WidgetSEOWrapper>
	)
}
