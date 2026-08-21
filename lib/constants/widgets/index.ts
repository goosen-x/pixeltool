export interface WidgetFAQ {
	question: string
	answer: string
}

export interface Widget {
	id: string
	icon: React.ComponentType<{ className?: string }>
	iconName?: string
	category:
		| 'development'
		| 'text'
		| 'generators'
		| 'security'
		| 'utilities'
		| 'images'
		| 'health'
	/**
	 * Только у тулов category: 'development' — какой из бывших разделов
	 * (css/html/javascript) до слияния в «Разработку». Двигает страницы
	 * /tools/css, /tools/html, /tools/javascript, которые остались живыми
	 * SEO-подстраницами (см. DEV_SUBCATEGORIES в lib/constants/categories.ts).
	 */
	subcategory?: 'css' | 'html' | 'javascript'
	translationKey: string
	path: string
	gradient: string
	title?: string
	metaTitle?: string
	description?: string
	useCase?: string
	recommendedTools?: string[]
	faqs?: WidgetFAQ[]
	tags?: string[]
	difficulty?: 'beginner' | 'intermediate' | 'advanced'
	metaDescription?: string
	/**
	 * Дата последнего значимого изменения инструмента (YYYY-MM-DD) для sitemap
	 * lastmod. Указывай только при реальной правке контента/логики тула — иначе
	 * используется общая дата CONTENT_LAST_UPDATED из app/sitemap.ts.
	 */
	updatedAt?: string
	/**
	 * Тул ещё не утверждён финально — не публикуется на прод-поверхностях
	 * (каталог /tools, sitemap, JSON-LD, «Похожие инструменты», случайный
	 * тул, счётчики на главной), но доступен по прямой ссылке и виден в
	 * левом сайдбаре с плашкой «Демо» — так его можно проверить перед тем,
	 * как снять флаг. См. `publicWidgets` в этом файле.
	 */
	demo?: boolean
	/**
	 * Показов/мес в Вордстате по головной фразе тула (см. lib/seo/phrases.txt,
	 * lib/seo/demand-report.md) — сырая частота, без очистки от чужого интента.
	 * У части тулов (qr-generator, emoji-list и т.п.) реальный релевантный спрос
	 * заметно меньше: см. demand-report.md, разделы B/C. Используется только для
	 * сортировки «по популярности» в каталоге — не для SEO-текстов.
	 * Проставлено не у всех: где цифры не снимались, поле отсутствует.
	 */
	searchVolume?: number
}

export { cssWidgets } from './css'
export { htmlWidgets } from './html'
export { javascriptWidgets } from './javascript'
export { textWidgets } from './text'
export { generatorWidgets } from './generators'
export { securityWidgets } from './security'
export { toolWidgets } from './tools'
export { healthWidgets } from './health'

import { cssWidgets } from './css'
import { htmlWidgets } from './html'
import { javascriptWidgets } from './javascript'
import { textWidgets } from './text'
import { generatorWidgets } from './generators'
import { securityWidgets } from './security'
import { toolWidgets } from './tools'
import { healthWidgets } from './health'

export const widgets: Widget[] = [
	...cssWidgets,
	...htmlWidgets,
	...javascriptWidgets,
	...textWidgets,
	...generatorWidgets,
	...securityWidgets,
	...toolWidgets,
	...healthWidgets
]

/**
 * Тулы без демо-флага — источник для всех прод-поверхностей (каталог,
 * sitemap, структурные данные, «Похожие инструменты», счётчики). `widgets`
 * (полный список) остаётся источником для getWidgetById и сайдбара — там
 * демо-тулы обязаны резолвиться и быть видны.
 */
export const publicWidgets: Widget[] = widgets.filter(w => !w.demo)

export const getWidgetById = (id: string): Widget | undefined => {
	return widgets.find(w => w.id === id)
}

export const getWidgetsByCategory = (
	category: Widget['category']
): Widget[] => {
	return widgets.filter(w => w.category === category)
}

export const getWidgetByPath = (path: string): Widget | undefined => {
	return widgets.find(widget => widget.path === path)
}

export const getRecommendedWidgets = (widgetId: string): Widget[] => {
	const widget = getWidgetById(widgetId)
	if (!widget?.recommendedTools) return []

	return widget.recommendedTools
		.map(id => getWidgetById(id))
		.filter((w): w is Widget => w !== undefined && !w.demo)
}

/**
 * Бывшие категории css/html/javascript — теперь под category: 'development',
 * но их страницы /tools/css, /tools/html, /tools/javascript остались живыми
 * SEO-подстраницами-фильтрами. Ключ карты — значение Widget['subcategory'].
 */
export const devSubcategories = {
	css: 'CSS',
	html: 'HTML',
	javascript: 'JavaScript'
} as const

export const widgetCategories = {
	generators: 'Рандомайзер',
	text: 'Текст',
	images: 'Изображения',
	health: 'Здоровье',
	security: 'Безопасность',
	utilities: 'Утилиты',
	development: 'Разработка'
} as const

export const getWidgetFAQs = (widgetId: string): any[] => {
	const widget = getWidgetById(widgetId)
	const faqs = widget?.faqs || []
	return faqs
}
