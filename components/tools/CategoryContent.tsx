import { CATEGORY_META } from '@/lib/constants/categories'
import { FaqAccordion } from '@/components/tools/FaqAccordion'

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
			{/* Каждый пункт — своя карточка: два абзаца подряд читаются как стена
			    текста, а разнесённые по карточкам — как два отдельных утверждения */}
			{/* div, а не section: у самой группы нет отдельного заголовка —
			    он есть у каждой карточки внутри (см. CategoryContent) */}
			<div className='mb-12 grid gap-6 md:grid-cols-2'>
				{meta.intro.map(item => (
					<article
						key={item.title}
						className='rounded-3xl border bg-muted p-6 dark:bg-card sm:p-8'
					>
						<h2 className='text-xl font-bold tracking-tight'>{item.title}</h2>
						<p className='mt-3 leading-relaxed text-muted-foreground'>
							{item.text}
						</p>
					</article>
				))}
			</div>

			<section className='mx-auto mb-12 max-w-3xl'>
				<h2 className='text-2xl font-bold tracking-tight'>Частые вопросы</h2>
				<div className='mt-6'>
					<FaqAccordion items={meta.faqs} />
				</div>
			</section>
		</>
	)
}
