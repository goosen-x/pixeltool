'use client'

import { getWidgetFAQs } from '@/lib/constants/widgets'
import { FaqAccordion } from '@/components/tools/FaqAccordion'

interface WidgetFAQProps {
	widgetId: string
}

export function WidgetFAQ({ widgetId }: WidgetFAQProps) {
	const faqs = getWidgetFAQs(widgetId)

	if (faqs.length === 0) {
		return null
	}

	// withSchema: на странице инструмента FAQPage больше никто не объявляет
	// (см. комментарий в WidgetStructuredData), поэтому разметку даёт аккордеон.
	return (
		<div className='mt-16'>
			<FaqAccordion items={faqs} title='Часто задаваемые вопросы' withSchema />
		</div>
	)
}
