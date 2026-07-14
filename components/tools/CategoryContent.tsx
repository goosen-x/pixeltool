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
 */
export function CategoryContent({ category }: Props) {
	const meta =
		CATEGORY_META[category as keyof typeof CATEGORY_META] ?? CATEGORY_META['']

	return (
		<section className='mx-auto mb-12 max-w-3xl'>
			<div className='space-y-4'>
				{meta.intro.map(paragraph => (
					<p key={paragraph.slice(0, 40)} className='leading-relaxed'>
						{paragraph}
					</p>
				))}
			</div>

			<h2 className='mt-12 text-2xl font-bold tracking-tight'>
				Частые вопросы
			</h2>
			<dl className='mt-6 space-y-6'>
				{meta.faqs.map(faq => (
					<div key={faq.question}>
						<dt className='font-semibold'>{faq.question}</dt>
						<dd className='mt-2 leading-relaxed text-muted-foreground'>
							{faq.answer}
						</dd>
					</div>
				))}
			</dl>
		</section>
	)
}
