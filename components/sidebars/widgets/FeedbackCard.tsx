'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FeedbackModal } from '@/components/feedback'

export function FeedbackCard() {
	return (
		<Card>
			<CardHeader className='pb-2'>
				<CardTitle className='text-sm'>Обратная связь</CardTitle>
			</CardHeader>
			<CardContent className='space-y-3'>
				{/* Три плашки с типами отзыва убраны: они дублировали то, что человек
				    и так увидит в самой форме, и занимали половину карточки */}
				<p className='text-xs text-muted-foreground'>
					Нашли ошибку или есть идея — напишите.
				</p>

				<div className='[&>button]:w-full'>
					<FeedbackModal variant='sidebar' />
				</div>
			</CardContent>
		</Card>
	)
}
