'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Code2, Share2 } from 'lucide-react'
import { FeedbackModal } from '@/components/feedback'
import { toast } from 'sonner'

export function ActionsAndFeedbackCard() {
	const locale = 'ru'
	// const tSidebar = useTranslations('widgets.rightSidebar')

	return (
		<Card>
			<CardHeader className='pb-3'>
				<CardTitle className='text-sm flex items-center gap-2'>
					<Code2 className='w-4 h-4' />
					Быстрые действия
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-2'>
				<Button
					variant='outline'
					size='sm'
					className='w-full justify-start text-xs lg:text-sm'
					onClick={() => {
						navigator.clipboard.writeText(window.location.href)
						toast.success(
							locale === 'ru' ? 'Ссылка скопирована' : 'Link copied'
						)
					}}
				>
					<Share2 className='w-3 h-3 lg:w-4 lg:h-4 mr-2 flex-shrink-0' />
					<span className='truncate'>Поделиться</span>
				</Button>
				<FeedbackModal variant='sidebar' />
				<p className='text-xs text-muted-foreground text-center pt-2'>
					Помогите нам стать лучше
				</p>
			</CardContent>
		</Card>
	)
}
