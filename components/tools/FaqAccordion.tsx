'use client'

import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { CategoryFAQ } from '@/lib/constants/categories'

/**
 * Аккордеон FAQ.
 *
 * Раскрытие анимируется через grid-template-rows: 0fr → 1fr. Приём выбран
 * намеренно, вместо нативного <details> или библиотечного аккордеона:
 *
 * - <details> в закрытом состоянии прячет содержимое сам, и высоту не
 *   проанимируешь;
 * - готовые аккордеоны (Radix и подобные) размонтируют закрытый ответ, и текст
 *   исчезает из разметки;
 *
 * а нам текст ответов нужен в разметке всегда: страница объявляет разметку
 * FAQPage, и если ответов в документе нет, разметка расходится с содержимым.
 * Здесь ответ отрендерен в HTML при любом состоянии — просто схлопнут по высоте.
 */
export function FaqAccordion({ items }: { items: CategoryFAQ[] }) {
	const [openIndex, setOpenIndex] = useState<number | null>(null)
	const baseId = useId()

	return (
		<div className='divide-y rounded-2xl border'>
			{items.map((faq, index) => {
				const open = openIndex === index
				const panelId = `${baseId}-panel-${index}`
				const buttonId = `${baseId}-button-${index}`

				return (
					<div key={faq.question}>
						<h3>
							<button
								type='button'
								id={buttonId}
								aria-expanded={open}
								aria-controls={panelId}
								onClick={() => setOpenIndex(open ? null : index)}
								className='flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-medium'
							>
								{faq.question}
								<ChevronDown
									aria-hidden
									className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
										open ? 'rotate-180' : ''
									}`}
								/>
							</button>
						</h3>

						<div
							id={panelId}
							role='region'
							aria-labelledby={buttonId}
							className={`grid transition-[grid-template-rows] duration-200 ease-out ${
								open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
							}`}
						>
							<div className='overflow-hidden'>
								<p className='px-5 pb-4 leading-relaxed text-muted-foreground'>
									{faq.answer}
								</p>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}
