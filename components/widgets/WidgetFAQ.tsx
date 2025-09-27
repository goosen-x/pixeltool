'use client'

// import { useLocale } from 'next-intl'
import { getWidgetFAQs } from '@/lib/constants/widgets'
import { FAQ } from '@/components/seo/FAQ'

interface WidgetFAQProps {
	widgetId: string
}

export function WidgetFAQ({ widgetId }: WidgetFAQProps) {
	// const locale = useLocale() as 'en' | 'ru'
	const locale = 'ru' as 'en' | 'ru'
	const faqs = getWidgetFAQs(widgetId, locale)

	if (faqs.length === 0) {
		return null
	}

	const title =
		locale === 'ru' ? 'Часто задаваемые вопросы' : 'Frequently Asked Questions'

	return <FAQ items={faqs} title={title} />
}
