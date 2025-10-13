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

				{/* Индикация Telegram */}
				<div className='flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground pt-1'>
					<svg
						viewBox='0 0 24 24'
						className='w-3 h-3 fill-current text-blue-500'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z' />
					</svg>
					<span>Ответ придёт в Telegram</span>
				</div>
			</CardContent>
		</Card>
	)
}
