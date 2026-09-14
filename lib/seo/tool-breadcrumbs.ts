import type { BreadcrumbItem } from '@/components/seo/Breadcrumbs'
import { getWidgetByPath, widgetCategories } from '@/lib/constants/widgets'

/**
 * Крошки для страницы инструмента и его SEO-подстраниц.
 *
 * Категория здесь не для красоты. Страницы `/tools/<категория>` — это
 * pillar-страницы кластеров: у них свои тексты, FAQ и индексация. До этого
 * на них не ссылался ни один инструмент: трейл шёл «Главная → Инструменты →
 * Тул», минуя категорию, и вес на pillar не возвращался ниоткуда.
 *
 * Намеренно импортирует только `widgetCategories` (15 строк), а не
 * `CATEGORY_META` с вводными текстами и FAQ: этим пользуется и клиентский
 * шелл инструментов, и тащить туда мегабайт SEO-текстов незачем.
 */
export function buildToolBreadcrumbs(
	toolPath: string,
	leaf?: BreadcrumbItem
): BreadcrumbItem[] {
	const widget = getWidgetByPath(toolPath)
	if (!widget) return []

	const items: BreadcrumbItem[] = [
		{ name: 'Главная', url: '/' },
		{ name: 'Инструменты', url: '/tools' }
	]

	const categoryTitle = widgetCategories[widget.category]
	if (categoryTitle) {
		items.push({ name: categoryTitle, url: `/tools/${widget.category}` })
	}

	items.push({
		name: widget.title || toolPath,
		url: `/tools/${widget.path}`
	})

	if (leaf) items.push(leaf)

	return items
}
