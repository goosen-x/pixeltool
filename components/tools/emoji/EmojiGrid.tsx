'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmojiGridProps {
	emojis: string[]
	onCopyEmoji: (emoji: string) => void
	onDownloadEmoji: (emoji: string) => void
	copiedEmoji: string | null
	downloadingEmoji: string | null
}

export function EmojiGrid({
	emojis,
	onCopyEmoji,
	onDownloadEmoji,
	copiedEmoji,
	downloadingEmoji
}: EmojiGridProps) {
	if (emojis.length === 0) {
		return (
			<div className='text-center py-8'>
				<p className='text-muted-foreground'>No emojis to display</p>
			</div>
		)
	}

	return (
		<div className='grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 p-4'>
			{emojis.map((emoji, index) => (
				<div key={`${emoji}-${index}`} className='relative group'>
					<Button
						onClick={() => onCopyEmoji(emoji)}
						variant={copiedEmoji === emoji ? 'default' : 'ghost'}
						size='lg'
						className={cn(
							'h-12 w-12 p-0 text-2xl hover:scale-110 transition-transform',
							copiedEmoji === emoji && 'ring-2 ring-primary'
						)}
					>
						{emoji}
					</Button>

					{/* Copy feedback */}
					{copiedEmoji === emoji && (
						<div className='absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded z-10'>
							Copied!
						</div>
					)}

					{/* Download button */}
					<Button
						onClick={() => onDownloadEmoji(emoji)}
						size='icon'
						variant='secondary'
						className='absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
						disabled={downloadingEmoji === emoji}
					>
						<Download className='h-3 w-3' />
					</Button>
				</div>
			))}
		</div>
	)
}
