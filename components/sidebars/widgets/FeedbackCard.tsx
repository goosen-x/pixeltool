'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Bug, Lightbulb, Send } from 'lucide-react'
import { FeedbackModal } from '@/components/feedback'

export function FeedbackCard() {
	return (
		<Card className='bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200/50 dark:border-blue-800/50'>
			<CardHeader className='pb-3'>
				<CardTitle className='text-sm flex items-center gap-2'>
					<MessageSquare className='w-4 h-4 text-blue-600 dark:text-blue-400' />
					Обратная связь
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-3'>
				<p className='text-xs text-muted-foreground'>
					Помогите улучшить сервис! Сообщите об ошибках, предложите идеи или
					задайте вопрос.
				</p>

				{/* Информация о типах обратной связи */}
				<div className='grid grid-cols-3 gap-2 text-center'>
					<div className='flex flex-col items-center gap-1 p-2 rounded-lg bg-red-50/50 dark:bg-red-950/10'>
						<Bug className='w-4 h-4 text-red-500' />
						<span className='text-[10px] text-muted-foreground'>
							Сообщить об ошибке
						</span>
					</div>

					<div className='flex flex-col items-center gap-1 p-2 rounded-lg bg-green-50/50 dark:bg-green-950/10'>
						<Lightbulb className='w-4 h-4 text-green-500' />
						<span className='text-[10px] text-muted-foreground'>
							Предложить идею
						</span>
					</div>

					<div className='flex flex-col items-center gap-1 p-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/10'>
						<MessageSquare className='w-4 h-4 text-blue-500' />
						<span className='text-[10px] text-muted-foreground'>
							Задать вопрос
						</span>
					</div>
				</div>

				{/* Основная кнопка - использует FeedbackModal внутри */}
				<div className='[&>button]:w-full [&>button]:bg-gradient-to-r [&>button]:from-blue-600 [&>button]:to-purple-600 [&>button]:hover:from-blue-700 [&>button]:hover:to-purple-700 [&>button]:text-white [&>button]:border-none'>
					<FeedbackModal variant='sidebar' />
				</div>
			</CardContent>
		</Card>
	)
}
