'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useSpecialSymbols } from '@/lib/hooks/useSpecialSymbols'
import {
	SymbolGrid,
	SymbolSearch,
	SymbolInfo
} from '@/components/tools/special-symbols'

export default function SpecialSymbolsPickerPage() {
	const [selectedCategory, setSelectedCategory] = useState<
		string | 'all' | 'recent'
	>('all')

	const {
		mounted,
		recentSymbols,
		copiedSymbol,
		copySymbol,
		getFilteredSymbols,
		clearRecentSymbols,
		getCategoryIcon,
		symbolCategories
	} = useSpecialSymbols()

	// Handle symbol copy with toast notification
	const handleCopySymbol = async (symbol: string) => {
		const success = await copySymbol(symbol)
		if (success) {
			toast.success(`Символ ${symbol} скопирован!`)
		} else {
			toast.error('Ошибка копирования')
		}
	}

	// Get filtered symbols based on category
	const filteredSymbols = getFilteredSymbols('', selectedCategory)

	// Don't render until mounted (to avoid hydration issues)
	if (!mounted) {
		return (
			<div className='min-h-screen bg-background'>
				<div className='container mx-auto px-4 py-8'>
					<div className='max-w-6xl mx-auto'>
						<Card className='animate-pulse h-96' />
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-background'>
			<div className='container mx-auto px-4 py-8'>
				<div className='max-w-6xl mx-auto space-y-6'>
					{/* Main Card */}
					<Card className='overflow-hidden'>
						<SymbolSearch
							selectedCategory={selectedCategory}
							onCategoryChange={setSelectedCategory}
							hasRecentSymbols={recentSymbols.length > 0}
							onClearRecentSymbols={clearRecentSymbols}
							symbolCategories={symbolCategories}
							getCategoryIcon={getCategoryIcon}
						/>

						{/* Results Count */}
						<div className='px-4 py-2 bg-muted/50 border-b'>
							<p className='text-sm text-muted-foreground'>
								{selectedCategory === 'recent'
									? `Недавние символы: ${filteredSymbols.length}`
									: `Всего символов: ${filteredSymbols.length}`}
							</p>
						</div>

						<SymbolGrid
							symbols={filteredSymbols}
							onCopySymbol={handleCopySymbol}
							copiedSymbol={copiedSymbol}
						/>
					</Card>

					{/* Info Section */}
					<SymbolInfo />
				</div>
			</div>
		</div>
	)
}
