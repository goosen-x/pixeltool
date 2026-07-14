import { ChevronDown } from 'lucide-react'
import { CATEGORY_META } from '@/lib/constants/categories'

interface Props {
	category: string
}

/**
 * Текст под каталогом: вводная часть и FAQ.
 *
 * Ради него страница и индексируется — из одного списка карточек поисковику
 * нечего взять. Тексты у каждой категории свои: одинаковые на восьми страницах
 * считались бы дублями.
 *
 * FAQ собран на <details>, а не на JS-аккордеоне: раскрытие работает без
 * скриптов, клавиатура и скринридеры поддерживаются браузером из коробки, а
 * содержимое ответов остаётся в разметке — его видит поисковик.
 */
export function CategoryContent({ category }: Props) {
	const meta =
		CATEGORY_META[category as keyof typeof CATEGORY_META] ?? CATEGORY_META['']

	return (
		<>
			{/* Вводный текст — своей карточкой, в том же ключе, что шапка и блок
			    «Предложить инструмент» */}
			<section className='mb-12 rounded-3xl border bg-muted px-6 py-10 dark:bg-card sm:px-10 sm:py-12'>
				<div className='mx-auto max-w-3xl space-y-4'>
					{meta.intro.map(paragraph => (
						<p key={paragraph.slice(0, 40)} className='leading-relaxed'>
							{paragraph}
						</p>
					))}
				</div>
			</section>

			<section className='mx-auto mb-12 max-w-3xl'>
				<h2 className='text-2xl font-bold tracking-tight'>Частые вопросы</h2>

				<div className='mt-6 divide-y rounded-2xl border'>
					{meta.faqs.map(faq => (
						<details key={faq.question} className='group px-5'>
							<summary className='flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium marker:hidden [&::-webkit-details-marker]:hidden'>
								{faq.question}
								<ChevronDown
									aria-hidden
									className='h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180'
								/>
							</summary>
							<p className='pb-4 leading-relaxed text-muted-foreground'>
								{faq.answer}
							</p>
						</details>
					))}
				</div>
			</section>
		</>
	)
}
