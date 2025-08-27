'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useEmoji } from '@/lib/hooks/useEmoji'
import { EmojiGrid, EmojiSearch, EmojiInfo } from '@/components/tools/emoji'
import { type CategoryId } from '@/lib/data/emoji-data'
import { useTranslations } from 'next-intl'

export default function EmojiListPage() {
	const t = useTranslations('widgets.emojiList')
	
	const [selectedCategory, setSelectedCategory] = useState<
		CategoryId | 'all' | 'recent'
	>('all')

	const {
		mounted,
		recentEmojis,
		copiedEmoji,
		downloadingEmoji,
		copyEmoji,
		downloadEmojiAsImage,
		getFilteredEmojis,
		clearRecentEmojis,
		emojiCategories
	} = useEmoji()

	// Handle emoji copy with toast notification
	const handleCopyEmoji = async (emoji: string) => {
		const success = await copyEmoji(emoji)
		if (success) {
			toast.success(t('copied', { emoji }))
		} else {
			toast.error(t('copyError'))
		}
	}

	// Handle emoji download with toast notification
	const handleDownloadEmoji = async (emoji: string) => {
		const success = await downloadEmojiAsImage(emoji)
		if (success) {
			toast.success(t('downloaded', { emoji }))
		} else {
			toast.error(t('downloadError'))
		}
	}

	// Get filtered emojis based on category
	const filteredEmojis = getFilteredEmojis('', selectedCategory)

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
						<EmojiSearch
							selectedCategory={selectedCategory}
							onCategoryChange={setSelectedCategory}
							hasRecentEmojis={recentEmojis.length > 0}
							onClearRecentEmojis={clearRecentEmojis}
						/>

						{/* Results Count */}
						<div className='px-4 py-2 bg-muted/50 border-b'>
							<p className='text-sm text-muted-foreground'>
								{selectedCategory === 'recent'
									? t('recentEmojis', { count: filteredEmojis.length })
									: t('totalEmojis', { count: filteredEmojis.length })}
							</p>
						</div>

						<EmojiGrid
							emojis={filteredEmojis}
							onCopyEmoji={handleCopyEmoji}
							onDownloadEmoji={handleDownloadEmoji}
							copiedEmoji={copiedEmoji}
							downloadingEmoji={downloadingEmoji}
						/>
					</Card>

					{/* Info Section */}
					<EmojiInfo />
				</div>
			</div>
		</div>
	)
}
