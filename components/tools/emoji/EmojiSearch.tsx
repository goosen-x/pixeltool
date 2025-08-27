'use client'

import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trash2 } from 'lucide-react'
import { emojiCategories, type CategoryId } from '@/lib/data/emoji-data'

interface EmojiSearchProps {
	selectedCategory: CategoryId | 'all' | 'recent'
	onCategoryChange: (category: CategoryId | 'all' | 'recent') => void
	hasRecentEmojis: boolean
	onClearRecentEmojis: () => void
}

const categoryIcons = {
	all: '🌟',
	recent: '🕒',
	smileys: '😀',
	nature: '🌿',
	food: '🍎',
	activities: '⚽',
	travel: '🌍',
	objects: '📱',
	symbols: '❤️'
} as const

export function EmojiSearch({
	selectedCategory,
	onCategoryChange,
	hasRecentEmojis,
	onClearRecentEmojis
}: EmojiSearchProps) {
	return (
		<div className='space-y-4 p-4 border-b'>
			{/* Category Tabs */}
			<Tabs
				value={selectedCategory}
				onValueChange={onCategoryChange as (value: string) => void}
			>
				<div className='flex items-center justify-between'>
					<TabsList className='grid-cols-3 md:grid-cols-9 w-full overflow-x-auto'>
						<TabsTrigger
							value='all'
							className='flex items-center gap-1 text-xs'
						>
							<span>{categoryIcons.all}</span>
							<span className='hidden sm:inline'>All</span>
						</TabsTrigger>

						{hasRecentEmojis && (
							<TabsTrigger
								value='recent'
								className='flex items-center gap-1 text-xs'
							>
								<span>{categoryIcons.recent}</span>
								<span className='hidden sm:inline'>Recent</span>
							</TabsTrigger>
						)}

						{emojiCategories.map(category => (
							<TabsTrigger
								key={category.id}
								value={category.id}
								className='flex items-center gap-1 text-xs'
							>
								<span>
									{categoryIcons[category.id as keyof typeof categoryIcons]}
								</span>
								<span className='hidden lg:inline'>
									{category.name.split(' ')[0]}
								</span>
							</TabsTrigger>
						))}
					</TabsList>

					{/* Clear Recent Button */}
					{selectedCategory === 'recent' && hasRecentEmojis && (
						<Button
							onClick={onClearRecentEmojis}
							variant='outline'
							size='sm'
							className='ml-2 flex items-center gap-1'
						>
							<Trash2 className='w-3 h-3' />
							<span className='hidden sm:inline'>Clear</span>
						</Button>
					)}
				</div>
			</Tabs>
		</div>
	)
}
