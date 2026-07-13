'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bug, Lightbulb, MessageSquare } from 'lucide-react'
import { FeedbackModal } from '@/components/feedback'

const TYPES = [
	{ icon: Bug, label: 'Ошибка' },
	{ icon: Lightbulb, label: 'Идея' },
	{ icon: MessageSquare, label: 'Вопрос' }
]

export function FeedbackCard() {
	// Кликабельна вся карточка: отдельная кнопка внизу дублировала то, что
	// человек и так пытается нажать, и занимала лишнюю строку
	const card = (
		<Card className='w-full cursor-pointer text-left transition-colors hover:border-primary/40'>
			<CardHeader className='pb-2'>
				<CardTitle className='text-sm'>Обратная связь</CardTitle>
			</CardHeader>
			<CardContent className='space-y-3'>
				<p className='text-xs text-muted-foreground'>
					Нашли ошибку или есть идея — напишите.
				</p>

				<div className='grid grid-cols-3 gap-2'>
					{TYPES.map(({ icon: Icon, label }) => (
						<div
							key={label}
							className='flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-2'
						>
							<Icon className='h-4 w-4 text-muted-foreground' />
							<span className='text-[10px] text-muted-foreground'>{label}</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)

	return (
		<FeedbackModal
			variant='sidebar'
			trigger={
				<button type='button' className='block w-full cursor-pointer text-left'>
					{card}
				</button>
			}
		/>
	)
}
