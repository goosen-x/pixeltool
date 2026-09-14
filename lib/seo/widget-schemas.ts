// Схемы для страниц инструментов.
//
// Основную разметку (`WebApplication`, `WebPage`, `BreadcrumbList`) собирает
// components/seo/WidgetStructuredData.tsx, FAQ отдаёт WidgetFAQ — здесь только
// справочники значений для неё.
//
// 14.09.2026 отсюда убраны две дополнительные схемы, навешивавшиеся поверх
// `WebApplication`:
//
//   - `CreativeWork` «Content created with <тул>» — описывала сущность,
//     которой на странице нет: пользовательский результат никуда не
//     сохраняется. Выдуманная разметка, ровно та же причина, по которой
//     28.08.2026 сняли `DataCatalog` и `ImageObject`.
//   - `Service` c `areaServed: Worldwide` — семантический дубль
//     `WebApplication` для бесплатного браузерного инструмента.
//
// Обе срабатывали по условиям вроде `widget.category === 'business'`, а
// категории с таким именем в проекте нет, и обе были написаны по-английски на
// русскоязычном сайте.

/**
 * Значение `applicationCategory` из словаря schema.org — по нему поисковики и
 * ИИ-ассистенты понимают, что за приложение перед ними.
 *
 * До 14.09.2026 у всех 123 инструментов стояло `DeveloperApplication`: и у
 * калькулятора ИМТ, и у знака зодиака, и у расчёта бетона. Ключ был
 * захардкожен одной строкой.
 */
const SCHEMA_APPLICATION_CATEGORY: Record<string, string> = {
	development: 'DeveloperApplication',
	security: 'SecurityApplication',
	images: 'MultimediaApplication',
	health: 'HealthApplication',
	finance: 'FinanceApplication',
	marketing: 'BusinessApplication',
	entertainment: 'EntertainmentApplication',
	esoteric: 'LifestyleApplication',
	text: 'UtilitiesApplication',
	generators: 'UtilitiesApplication',
	datetime: 'UtilitiesApplication',
	math: 'UtilitiesApplication',
	construction: 'UtilitiesApplication',
	auto: 'UtilitiesApplication',
	utilities: 'UtilitiesApplication'
}

export function getApplicationCategory(category: string): string {
	return SCHEMA_APPLICATION_CATEGORY[category] || 'UtilitiesApplication'
}
