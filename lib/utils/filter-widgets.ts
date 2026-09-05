import type { Widget } from '@/lib/constants/widgets'
import { devSubcategories } from '@/lib/constants/widgets'
import { widgetMatchesQuery } from '@/lib/utils/widget-search'

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
	// Совпадение считает та же утилита, что и глобальный поиск в шапке: иначе
	// один и тот же запрос находит в каталоге и в шапке разное. Порядок выдачи
	// остаётся исходным — сортировкой занимается вызывающий код.
	return widgets.filter(
		widget =>
			widgetMatchesCategory(widget, category) &&
			widgetMatchesQuery(widget, search)
	)
}
