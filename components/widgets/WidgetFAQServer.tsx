import { FAQ } from '@/components/seo/FAQ'
import { getWidgetFAQs } from '@/lib/widgets'

interface WidgetFAQServerProps {
  widgetId: string
  locale: 'en' | 'ru'
}

export async function WidgetFAQServer({ widgetId, locale }: WidgetFAQServerProps) {
  const faqs = await getWidgetFAQs(widgetId, locale)
  
  if (faqs.length === 0) {
    return null
  }
  
  const title = locale === 'ru' ? 'Часто задаваемые вопросы' : 'Frequently Asked Questions'
  
  return <FAQ items={faqs} title={title} />
}