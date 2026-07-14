import type { BreadcrumbItem } from '@/components/seo/Breadcrumbs'
import { CATEGORY_META, isCategoryKey } from '@/lib/constants/categories'

const HOME: BreadcrumbItem = { name: 'Главная', url: '/' }

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

	// Страница категории (/tools/css и подобные) живёт в другой группе роутов, у
	// неё нет шелла инструментов — крошки строим здесь.
	const categorySegment = path.startsWith('/tools/') ? path.slice(7) : ''
	if (isCategoryKey(categorySegment)) {
		return [
			HOME,
			{ name: 'Инструменты', url: '/tools' },
			{ name: CATEGORY_META[categorySegment].title, url: path }
		]
	}

	// Страница инструмента (/tools/{slug}) — крошки рендерит общий шелл
	// ProjectsLayoutWrapper (в контенте, рядом с сайдбаром), поэтому здесь
	// пропускаем, чтобы не было двойного BreadcrumbList.
	if (path.startsWith('/tools/')) return []

	// Известные статичные страницы
	const staticLabel = STATIC_LABELS[path]
	if (staticLabel) return [HOME, { name: staticLabel, url: path }]

	// Фолбэк: Главная › <последний сегмент>
	const segments = path.split('/').filter(Boolean)
	if (segments.length === 0) return []
	return [HOME, { name: humanize(segments[segments.length - 1]), url: path }]
}
