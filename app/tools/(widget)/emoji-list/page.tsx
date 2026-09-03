'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { toolBar, toolIconButton, toolPill } from '@/lib/ui/tool-pill'
import { useEmoji } from '@/lib/hooks/useEmoji'
import { emojiCategories, type CategoryId } from '@/lib/data/emoji-data'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { EmojiListSeo } from './EmojiListSeo'
import { EmojiGrid } from './EmojiGrid'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

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
	const widget = getWidgetById('emoji-list')!
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
		<WidgetSEOWrapper widget={widget}>
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
					<EmojiGrid
						emojis={filteredEmojis}
						copiedEmoji={copiedEmoji}
						downloadingEmoji={downloadingEmoji}
						onCopy={copyEmoji}
						onDownload={downloadEmojiAsImage}
					/>
				)}
			</Card>

			<ToolScreenshot slug='emoji-list' />
			<EmojiListSeo />
		</WidgetSEOWrapper>
	)
}
