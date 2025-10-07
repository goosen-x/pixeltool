'use client'

import { getWidgetFAQs } from '@/lib/constants/widgets'
import { FAQ } from '@/components/seo/FAQ'

interface WidgetFAQProps {
	widgetId: string
}

export function WidgetFAQ({ widgetId }: WidgetFAQProps) {
	const faqs = getWidgetFAQs(widgetId)

	if (faqs.length === 0) {
		return null
	}

	const title = 'Часто задаваемые вопросы'

	return <FAQ items={faqs} title={title} />
}
