import { notFound } from 'next/navigation'
import { getWidgetByPath } from '@/lib/constants/widgets'
import {
	loadWidgetComponent,
	hasWidgetLoader
} from '@/lib/widgets/widget-loaders'

/**
 * Динамическая страница виджета
 * Загружает соответствующий компонент на основе slug параметра
 */
export default async function WidgetSlugPage({
	params
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params

	// Проверяем, существует ли виджет с таким путем
	const widget = getWidgetByPath(slug)
	if (!widget) {
		return notFound()
	}

	// Проверяем, существует ли loader для этого виджета
	if (!hasWidgetLoader(slug)) {
		console.warn(`Widget loader not found for: ${slug}`)
		return notFound()
	}

	// Динамически загружаем компонент виджета
	const WidgetComponent = await loadWidgetComponent(slug)

	if (!WidgetComponent) {
		console.error(`Failed to load widget component: ${slug}`)
		return notFound()
	}

	// Рендерим загруженный компонент
	return <WidgetComponent />
}
