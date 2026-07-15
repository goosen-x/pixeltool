'use client'

import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FaqItem {
	question: string
	answer: string
}

interface Props {
	items: FaqItem[]
	/** Если задан — рисуется заголовок h2 над списком. */
	title?: string
	/**
	 * Выдать разметку FAQPage. По умолчанию нет: на странице должен быть ровно
	 * один FAQPage, а на /tools его отдаёт CatalogStructuredData. На странице
	 * инструмента разметку никто больше не создаёт, поэтому там включаем.
	 */
	withSchema?: boolean
}

/**
 * Единый аккордеон FAQ — и в каталоге, и на страницах инструментов.
 *
 * Раскрытие анимируется через grid-template-rows: 0fr → 1fr. Приём выбран
 * намеренно, вместо нативного <details> или анимации height через framer-motion:
 *
 * - <details> в закрытом состоянии прячет содержимое сам, высоту не
 *   проанимируешь;
 * - framer-motion с height:0→auto и AnimatePresence размонтирует закрытый ответ,
 *   и текст исчезает из разметки;
 *
 * а нам текст ответов нужен в разметке всегда: страница объявляет FAQPage, и
 * если ответов в документе нет, разметка расходится с содержимым. Здесь ответ
 * отрендерен в HTML при любом состоянии — просто схлопнут по высоте.
 */
export function FaqAccordion({ items, title, withSchema = false }: Props) {
	const [openIndex, setOpenIndex] = useState<number | null>(null)
	const baseId = useId()

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: items.map(item => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: { '@type': 'Answer', text: item.answer }
		}))
	}

	return (
		<div>
			{withSchema && (
				<script
					type='application/ld+json'
					dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
				/>
			)}

			{title && (
				<h2 className='mb-6 text-2xl font-bold tracking-tight'>{title}</h2>
			)}

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
									className='flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-medium transition-colors hover:bg-muted/50'
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
		</div>
	)
}
