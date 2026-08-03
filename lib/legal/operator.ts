/**
 * Реквизиты оператора персональных данных — единственное место, где они
 * заданы. Отсюда их берут все четыре документа и генератор PDF, поэтому
 * заполнять нужно один раз здесь, а не в каждом файле.
 *
 * Незаполненные поля намеренно видны в готовом PDF как прочерки: документ с
 * прочерком сразу заметен, документ с выдуманным ИНН — нет.
 */

export const PLACEHOLDER = '__________'

export const OPERATOR = {
	/** Полное наименование: «Индивидуальный предприниматель Иванов Иван Иванович» */
	legalName: PLACEHOLDER,
	/** Короткое, для повторных упоминаний в тексте: «ИП Иванов И.И.» */
	shortName: PLACEHOLDER,
	inn: PLACEHOLDER,
	/** ОГРН для юрлица, ОГРНИП для предпринимателя */
	ogrn: PLACEHOLDER,
	address: PLACEHOLDER,
	/** Ящик для обращений субъектов ПД: отзыв согласия, удаление, уточнение */
	email: PLACEHOLDER,
	/** Почтовый сервис, через который уходят письма со шпаргалкой */
	mailProvider: PLACEHOLDER,

	site: 'https://pixeltool.pro',
	siteHost: 'pixeltool.pro'
} as const

/** Дата последней редакции документов — попадает в колонтитул PDF. */
export const LEGAL_VERSION_DATE = '2 августа 2026 г.'

export function unfilledFields(): string[] {
	return Object.entries(OPERATOR)
		.filter(([, value]) => value === PLACEHOLDER)
		.map(([key]) => key)
}
