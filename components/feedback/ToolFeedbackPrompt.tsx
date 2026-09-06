'use client'

import { MessageSquarePlus } from 'lucide-react'
import { FeedbackModal } from './FeedbackModal'

/**
 * Приглашение написать — под самим инструментом, до lg.
 *
 * Форма обратной связи жила только в правом сайдбаре, а он скрыт до 1024px:
 * на телефоне и планшете написать было физически нечем. За три недели это
 * дало ноль идей от людей при 115 поставленных оценок — звёзды видны везде,
 * и их ставят охотно, значит дело не в нежелании, а в отсутствии кнопки.
 *
 * Спрашиваем не «обратную связь», а конкретную вещь: чего не хватило именно
 * здесь. На такой вопрос есть что ответить, в отличие от приглашения
 * «поделиться мнением о сервисе».
 */
export function ToolFeedbackPrompt() {
	return (
		<FeedbackModal
			defaultType='feature'
			trigger={
				<button
					type='button'
					className='mt-10 flex w-full cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-3.5 text-left transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden'
				>
					<MessageSquarePlus className='h-5 w-5 shrink-0 text-muted-foreground' />
					<span className='flex flex-col'>
						<span className='text-sm font-medium'>
							Чего не хватило в этом инструменте?
						</span>
						<span className='text-xs text-muted-foreground'>
							Напишите, что стоит исправить или добавить — читает живой человек
						</span>
					</span>
				</button>
			}
		/>
	)
}
