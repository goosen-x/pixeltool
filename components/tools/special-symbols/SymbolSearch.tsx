'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SymbolSearchProps {
	selectedCategory: string | 'all' | 'recent'
	onCategoryChange: (category: string | 'all' | 'recent') => void
	hasRecentSymbols: boolean
	onClearRecentSymbols: () => void
	symbolCategories: Array<{ id: string; name: string; symbols: string[] }>
	getCategoryIcon: (categoryId: string) => string
}

export function SymbolSearch({
	selectedCategory,
	onCategoryChange,
	hasRecentSymbols,
	onClearRecentSymbols,
	symbolCategories,
	getCategoryIcon
}: SymbolSearchProps) {
	return (
		<div className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='p-4 space-y-4'>
				<div className='flex justify-between items-center min-h-[36px]'>
					<h2 className='text-lg font-semibold'>Категории</h2>
					<Button
						variant='outline'
						size='sm'
						onClick={onClearRecentSymbols}
						className={cn(
							'whitespace-nowrap transition-opacity',
							hasRecentSymbols && selectedCategory === 'recent'
								? 'opacity-100'
								: 'opacity-0 pointer-events-none'
						)}
					>
						<X className='w-4 h-4 mr-2' />
						Очистить недавние
					</Button>
				</div>

				{/* Category Grid */}
				<div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2'>
					<Button
						variant={selectedCategory === 'all' ? 'default' : 'outline'}
						onClick={() => onCategoryChange('all')}
						className={cn(
							'h-auto py-2.5 px-2 flex flex-col items-center justify-center gap-1 transition-all',
							selectedCategory === 'all' && 'shadow-lg'
						)}
					>
						<span className='text-xl'>⭐</span>
						<span className='text-[11px] font-medium'>Все категории</span>
					</Button>

					{hasRecentSymbols && (
						<Button
							variant={selectedCategory === 'recent' ? 'default' : 'outline'}
							onClick={() => onCategoryChange('recent')}
							className={cn(
								'h-auto py-2.5 px-2 flex flex-col items-center justify-center gap-1 transition-all',
								selectedCategory === 'recent' && 'shadow-lg'
							)}
						>
							<Clock className='w-5 h-5' />
							<span className='text-[11px] font-medium'>Недавние</span>
						</Button>
					)}

					{symbolCategories.map(category => (
						<div key={category.id} className='relative'>
							<Button
								variant={
									selectedCategory === category.id ? 'default' : 'outline'
								}
								onClick={() => onCategoryChange(category.id)}
								className={cn(
									'h-auto py-2.5 px-2 flex flex-col items-center justify-center gap-1 transition-all w-full overflow-hidden',
									selectedCategory === category.id && 'shadow-lg'
								)}
							>
								<span className='text-xl'>{getCategoryIcon(category.id)}</span>
								<span className='text-[11px] font-medium text-center leading-tight line-clamp-2 break-words px-1'>
									{category.name}
								</span>
							</Button>
							<Badge
								variant='secondary'
								className='absolute -top-1 -right-1 text-[10px] px-1 py-0 h-4 min-w-[20px] flex items-center justify-center'
							>
								{category.symbols.length}
							</Badge>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
