'use client'

import { useId, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

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
				<h2 className='mb-6 font-heading text-2xl font-bold'>{title}</h2>
			)}

			<div className='space-y-3'>
				{items.map((faq, index) => {
					const open = openIndex === index
					const panelId = `${baseId}-panel-${index}`
					const buttonId = `${baseId}-button-${index}`

					return (
						<div
							key={faq.question}
							className={cn(
								// Акцент открытого пункта несут иконка и вес шрифта, а не
								// цветной фон: primary-рамка с muted-подложкой давали блёклый
								// голубой блок. Здесь оттенки строго нейтральные.
								'group overflow-hidden rounded-2xl border transition-colors',
								open
									? 'border-border bg-muted/50 dark:bg-muted/25'
									: 'border-border bg-card hover:bg-muted/40'
							)}
						>
							{/* h3 несёт глобальные стили заголовка (крупный размер) — гасим
							    их на кнопке явным text-base, чтобы вопрос был обычного
							    размера */}
							<h3 className='m-0'>
								<button
									type='button'
									id={buttonId}
									aria-expanded={open}
									aria-controls={panelId}
									onClick={() => setOpenIndex(open ? null : index)}
									className='flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left'
								>
									<span
										className={cn(
											'text-base text-foreground transition-all',
											open ? 'font-semibold' : 'font-medium'
										)}
									>
										{faq.question}
									</span>

									{/* Иконка в круглой «таблетке»: на раскрытии заливается
									    цветом и поворачивается — это и есть акцент состояния.
									    Стрелка линейная, как у кнопок карусели */}
									<span
										aria-hidden
										className={cn(
											'ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-xl border transition-all duration-300 [corner-shape:squircle]',
											open
												? 'rotate-180 border-primary bg-primary text-primary-foreground'
												: 'border-border text-muted-foreground group-hover:border-primary/40 group-hover:text-foreground'
										)}
									>
										<ArrowDown className='h-4 w-4' />
									</span>
								</button>
							</h3>

							<div
								id={panelId}
								role='region'
								aria-labelledby={buttonId}
								className={cn(
									'grid transition-[grid-template-rows] duration-300 ease-out',
									open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
								)}
							>
								<div className='overflow-hidden'>
									<p className='px-5 pb-5 leading-relaxed text-muted-foreground'>
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
