import { getWidgetByPath } from '@/lib/constants/widgets'
import type { BreadcrumbItem } from '@/components/seo/Breadcrumbs'

const HOME: BreadcrumbItem = { name: 'Главная', url: '/' }
const TOOLS: BreadcrumbItem = { name: 'Инструменты', url: '/tools' }

// Человекочитаемые названия известных статичных разделов
const STATIC_LABELS: Record<string, string> = {
	'/tools': 'Инструменты',
	'/blog': 'Блог',
	'/contact': 'Контакты',
	'/settings': 'Настройки'
}

const humanize = (segment: string) =>
	segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

/**
 * Строит трейл хлебных крошек из pathname.
 * Возвращает [] там, где крошки не нужны (главная) или где их
 * рендерит сама страница (статья блога — там есть заголовок поста).
 */
export function getBreadcrumbItems(pathname: string): BreadcrumbItem[] {
	if (!pathname || pathname === '/') return []

	const path =
		pathname.length > 1 && pathname.endsWith('/')
			? pathname.slice(0, -1)
			: pathname

	// Статья блога — крошки со заголовком статьи рендерит страница
	if (path.startsWith('/blog/')) return []

	// Страница инструмента: /tools/{slug}
	if (path.startsWith('/tools/')) {
		const slug = path.split('/')[2]
		if (!slug) return [HOME, TOOLS]
		const widget = getWidgetByPath(slug)
		return [HOME, TOOLS, { name: widget?.title || humanize(slug), url: `/tools/${slug}` }]
	}

	// Известные статичные страницы
	const staticLabel = STATIC_LABELS[path]
	if (staticLabel) return [HOME, { name: staticLabel, url: path }]

	// Фолбэк: Главная › <последний сегмент>
	const segments = path.split('/').filter(Boolean)
	if (segments.length === 0) return []
	return [HOME, { name: humanize(segments[segments.length - 1]), url: path }]
}
