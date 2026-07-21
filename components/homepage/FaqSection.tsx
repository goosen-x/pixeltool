import { CATEGORY_META } from '@/lib/constants/categories'
import { FaqAccordion } from '@/components/tools/FaqAccordion'

/**
 * Те же вопросы, что и в общем каталоге (CATEGORY_META['']) — они уже
 * покрывают то, что реально спрашивают о сайте в целом (регистрация,
 * бесплатность, телефон, ограничения), дублировать текст под главную незачем.
 * withSchema=true: на главной FAQPage-разметки ещё нет.
 */
export function FaqSection() {
	const { faqs } = CATEGORY_META['']

	return (
		<section className='relative px-4 py-12 sm:px-6 sm:py-16 lg:px-8'>
			<div className='mx-auto max-w-3xl'>
				<div className='mb-8 text-center sm:mb-12'>
					<h2 className='mb-4 font-heading text-3xl font-bold text-balance sm:text-4xl lg:text-5xl'>
						Частые вопросы
					</h2>
				</div>

				<FaqAccordion items={faqs} withSchema />
			</div>
		</section>
	)
}
