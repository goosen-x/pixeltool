'use client'

import { Eye } from 'lucide-react'
import { useBlogStats } from '@/lib/hooks/useBlogStats'
import { RatingStars } from '@/components/shared/RatingStars'
import { SharePopover } from '@/components/share/SharePopover'

interface Props {
	postId: string
	title: string
}

/** Просмотры, оценка и «Поделиться» — рядом с датой и временем чтения в
 *  шапке поста. Раньше «Поделиться» жил в карточке правого сайдбара, но та
 *  ушла вместе с избранным/недавними в шапку сайта — кнопке нужен новый дом. */
export function BlogPostActions({ postId, title }: Props) {
	const { views, rating, ratingCount, hasVoted, vote } = useBlogStats(postId)

	return (
		<div className='flex items-center gap-3'>
			{views > 0 && (
				<span className='flex items-center gap-1 text-xs text-muted-foreground'>
					<Eye className='h-3.5 w-3.5' />
					{new Intl.NumberFormat('ru', {
						notation: 'compact',
						maximumFractionDigits: 1
					}).format(views)}
				</span>
			)}
			<RatingStars
				rating={rating}
				ratingCount={ratingCount}
				hasVoted={hasVoted}
				onVote={vote}
				label='Оценка статьи'
			/>
			<SharePopover title={title} />
		</div>
	)
}
