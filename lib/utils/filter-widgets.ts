import type { Widget } from '@/lib/constants/widgets'

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
		const matchesCategory = category === '' || widget.category === category

		if (!matchesCategory) return false
		if (query === '') return true

		return (
			(widget.title ?? widget.translationKey).toLowerCase().includes(query) ||
			(widget.description ?? '').toLowerCase().includes(query) ||
			(widget.useCase ?? '').toLowerCase().includes(query) ||
			(widget.tags ?? []).some(tag => tag.toLowerCase().includes(query))
		)
	})
}
