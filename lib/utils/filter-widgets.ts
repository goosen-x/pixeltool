import type { Widget } from '@/lib/constants/widgets'
import { devSubcategories } from '@/lib/constants/widgets'

/**
 * css/html/javascript больше не значения Widget['category'] (слиты в
 * 'development'), но их страницы остались живыми фильтрами — отсюда
 * сверяем widget.subcategory, а не widget.category.
 */
export function widgetMatchesCategory(
	widget: Widget,
	category: string
): boolean {
	if (category === '') return true
	if (category in devSubcategories) return widget.subcategory === category
	return widget.category === category
}

/**
 * Отбор инструментов по строке поиска и категории.
 *
 * Живёт отдельно, потому что считать его нужно в двух местах: счётчик «Найдено»
 * рисуется в шапке, а сами карточки — ниже. Если бы условие было продублировано,
 * оно бы однажды разъехалось.
 */
export function filterWidgets(
	widgets: Widget[],
	search: string,
	category: string
): Widget[] {
	const query = search.trim().toLowerCase()

	return widgets.filter(widget => {
		if (!widgetMatchesCategory(widget, category)) return false
		if (query === '') return true

		return (
			(widget.title ?? widget.translationKey).toLowerCase().includes(query) ||
			(widget.description ?? '').toLowerCase().includes(query) ||
			(widget.useCase ?? '').toLowerCase().includes(query) ||
			(widget.tags ?? []).some(tag => tag.toLowerCase().includes(query))
		)
	})
}
