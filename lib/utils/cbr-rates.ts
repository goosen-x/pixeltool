/**
 * Курсы валют Центробанка и перевод между ними.
 *
 * Отдельный файл, а не дополнение к lib/utils/currency.ts: тот про
 * форматирование сумм под локаль и с курсами не связан. Складывать в один
 * модуль две разные темы только потому, что в названии обеих есть слово
 * currency, — верный способ однажды снести одно другим.
 */

export interface Rate {
	code: string
	name: string
	nominal: number
	value: number
}

/** Рубль в списке валют ЦБ отсутствует — он там точка отсчёта. */
export const RUB: Rate = {
	code: 'RUB',
	name: 'Российский рубль',
	nominal: 1,
	value: 1
}

/**
 * Сколько рублей стоит одна единица валюты.
 *
 * У ЦБ курс указан за номинал, а не за единицу: у японской иены и корейской
 * воны это 100, у некоторых — 1000. Делить на номинал обязательно, иначе
 * иена окажется дороже доллара в сто раз.
 */
export function rubPerUnit(rate: Rate): number {
	return rate.value / rate.nominal
}

/**
 * Перевод между двумя валютами через рубль.
 *
 * ЦБ публикует курсы только к рублю, поэтому пара «доллар — евро» считается
 * кросс-курсом: сначала в рубли, потом из рублей. Такой курс может слегка
 * отличаться от биржевого для этой пары — это не ошибка, а следствие того,
 * что оба курса установлены к третьей валюте.
 */
export function convert(amount: number, from: Rate, to: Rate): number {
	if (!Number.isFinite(amount)) return 0
	return (amount * rubPerUnit(from)) / rubPerUnit(to)
}

/** Курс пары: сколько единиц `to` дают за одну единицу `from`. */
export function pairRate(from: Rate, to: Rate): number {
	return rubPerUnit(from) / rubPerUnit(to)
}

/** Наиболее ходовые валюты — их поднимаем в начало списка. */
export const POPULAR_CODES = ['USD', 'EUR', 'CNY', 'GBP', 'KZT', 'TRY', 'AED']

export function sortRates(rates: Rate[]): Rate[] {
	return [...rates].sort((a, b) => {
		const ai = POPULAR_CODES.indexOf(a.code)
		const bi = POPULAR_CODES.indexOf(b.code)
		if (ai !== -1 && bi !== -1) return ai - bi
		if (ai !== -1) return -1
		if (bi !== -1) return 1
		return a.name.localeCompare(b.name, 'ru')
	})
}
