'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toolBar, toolIconButton, toolPill } from '@/lib/ui/tool-pill'
import { useEmoji } from '@/lib/hooks/useEmoji'
import { EmojiInfo } from '@/components/tools/emoji'
import { emojiCategories, type CategoryId } from '@/lib/data/emoji-data'

/** Иконка категории — сама же эмодзи из неё, подпись рядом. */
const CATEGORY_ICONS: Record<string, string> = {
	all: '🌟',
	recent: '🕒',
	smileys: '😀',
	nature: '🌿',
	food: '🍎',
	activities: '⚽',
	travel: '🌍',
	objects: '📱',
	symbols: '❤️'
}

export default function EmojiListPage() {
	const [selectedCategory, setSelectedCategory] = useState<
		CategoryId | 'all' | 'recent'
	>('all')

	const {
		recentEmojis,
		copiedEmoji,
		downloadingEmoji,
		copyEmoji,
		downloadEmojiAsImage,
		getFilteredEmojis,
		clearRecentEmojis
	} = useEmoji()

	const filteredEmojis = getFilteredEmojis('', selectedCategory)

	const categories: { id: CategoryId | 'all' | 'recent'; name: string }[] = [
		{ id: 'all', name: 'Все' },
		...(recentEmojis.length > 0
			? [{ id: 'recent' as const, name: 'Недавние' }]
			: []),
		...emojiCategories.map(category => ({
			id: category.id as CategoryId,
			name: category.name
		}))
	]

	return (
		<>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: категории таблетками. Раньше это были вкладки
				    во всю ширину — девять штук, на телефоне они сжимались до
				    иконок без подписей. */}
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
								<span aria-hidden>{CATEGORY_ICONS[category.id]}</span>
								{category.name}
							</button>
						))}
					</div>

					<div className='flex items-center gap-3 sm:ml-auto'>
						<span className='text-sm text-muted-foreground'>
							{filteredEmojis.length} шт.
						</span>
						{selectedCategory === 'recent' && recentEmojis.length > 0 && (
							<Button
								size='icon'
								variant='ghost'
								onClick={clearRecentEmojis}
								title='Очистить недавние'
								className={toolIconButton}
							>
								<Trash2 className='h-4 w-4' />
							</Button>
						)}
					</div>
				</div>

				{filteredEmojis.length === 0 ? (
					<p className='py-16 text-center text-sm text-muted-foreground'>
						В этой категории пока пусто
					</p>
				) : (
					<div className='grid grid-cols-6 gap-1 px-5 py-6 sm:grid-cols-8 sm:px-6 md:grid-cols-10 lg:grid-cols-12'>
						{filteredEmojis.map((emoji, index) => (
							<div key={`${emoji}-${index}`} className='group relative'>
								<button
									type='button'
									onClick={() => copyEmoji(emoji)}
									title='Скопировать'
									className={cn(
										'flex h-12 w-full cursor-pointer items-center justify-center rounded-lg text-2xl transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
										copiedEmoji === emoji && 'bg-primary/10 ring-1 ring-primary'
									)}
								>
									{emoji}
								</button>

								{/* Скачать картинкой — редкое действие, поэтому оно
								    проявляется только на наведении. */}
								<Button
									size='icon'
									variant='ghost'
									onClick={() => downloadEmojiAsImage(emoji)}
									disabled={downloadingEmoji === emoji}
									title='Скачать картинкой'
									className={cn(
										toolIconButton,
										'absolute -top-1 -right-1 h-6 w-6 bg-background opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100'
									)}
								>
									<Download className='h-3 w-3' />
								</Button>
							</div>
						))}
					</div>
				)}
			</Card>

			<EmojiInfo />
		</>
	)
}
