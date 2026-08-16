/**
 * Склонение существительного после числительного по правилам русского
 * языка: 1 инструмент, 2 инструмента, 5 инструментов, 11 инструментов,
 * 21 инструмент. Число, оканчивающееся на 1 (кроме 11), — исключение,
 * которое легко забыть при простом склонении по last-digit.
 */
export function pluralizeRu(
	count: number,
	[one, few, many]: [string, string, string]
): string {
	const mod10 = count % 10
	const mod100 = count % 100

	if (mod100 >= 11 && mod100 <= 14) return many
	if (mod10 === 1) return one
	if (mod10 >= 2 && mod10 <= 4) return few
	return many
}

export function toolsCountLabel(count: number): string {
	return `${count} ${pluralizeRu(count, ['инструмент', 'инструмента', 'инструментов'])}`
}

/** «47 онлайн-инструментов» — тот же корень с приставкой, отдельная форма нужна в мете и на главной. */
export function onlineToolsCountLabel(count: number): string {
	return `${count} онлайн-${pluralizeRu(count, ['инструмент', 'инструмента', 'инструментов'])}`
}
