import { CAR_REGIONS } from '@/lib/data/car-region-codes'

/**
 * Проверка ИНН по контрольной сумме.
 *
 * Проверяется только математика номера, а не существование его владельца:
 * живого реестра ФНС здесь нет и быть не может. Контрольные цифры ловят
 * опечатку в договоре или платёжке — то есть ровно ту задачу, ради которой
 * ИНН и проверяют вручную. Номер, прошедший проверку, может не принадлежать
 * никому; номер, её не прошедший, точно набран с ошибкой.
 *
 * Алгоритм — из приказа МНС России от 03.03.2004 № БГ-3-09/178: контрольная
 * цифра равна остатку от деления взвешенной суммы на 11, а затем на 10.
 */

/** Веса для 10-значного ИНН организации. */
const LEGAL_WEIGHTS = [2, 4, 10, 3, 5, 9, 4, 6, 8]

/** Веса для одиннадцатой и двенадцатой цифр ИНН человека. */
const PERSON_WEIGHTS_11 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]
const PERSON_WEIGHTS_12 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]

export type InnKind = 'legal' | 'person'

export type InnCheck = {
	valid: boolean
	/** Кому принадлежит номер: организации (10 цифр) или человеку и ИП (12). */
	kind: InnKind | null
	/** Что именно не так, если номер не прошёл проверку. */
	problem: string | null
	/** Регион по первым двум цифрам — код налогового органа, выдавшего номер. */
	region: string | null
	/** Цифры без пробелов и разделителей. */
	digits: string
}

function controlDigit(digits: string, weights: number[]): number {
	const sum = weights.reduce(
		(acc, weight, index) => acc + weight * Number(digits[index]),
		0
	)
	return (sum % 11) % 10
}

/**
 * Регион по первым двум цифрам. Коды субъектов те же, что на автомобильных
 * номерах, поэтому берём готовый справочник, а не заводим второй такой же.
 * У Москвы и области кодов несколько (77, 97, 99 и 50, 90, 150) — для ИНН
 * значимы только основные, но поиск по всему списку кодов не мешает: лишние
 * коды принадлежат тем же субъектам.
 */
export function regionByInnCode(code: string): string | null {
	const region = CAR_REGIONS.find(item =>
		item.codes.some(value => value.padStart(2, '0') === code)
	)
	return region?.region ?? null
}

export function checkInn(raw: string): InnCheck {
	const digits = raw.replace(/\D/g, '')

	const base: InnCheck = {
		valid: false,
		kind: null,
		problem: null,
		region: null,
		digits
	}

	if (!digits) {
		return {
			...base,
			problem: 'Введите ИНН — 10 цифр у организации, 12 у человека.'
		}
	}

	if (digits.length !== 10 && digits.length !== 12) {
		return {
			...base,
			problem: `В ИНН должно быть 10 или 12 цифр, а здесь ${digits.length}.`
		}
	}

	const kind: InnKind = digits.length === 10 ? 'legal' : 'person'
	const region = regionByInnCode(digits.slice(0, 2))

	if (kind === 'legal') {
		const valid = controlDigit(digits, LEGAL_WEIGHTS) === Number(digits[9])
		return {
			...base,
			kind,
			region,
			valid,
			problem: valid
				? null
				: 'Контрольная цифра не сходится — в номере опечатка.'
		}
	}

	const okEleventh =
		controlDigit(digits, PERSON_WEIGHTS_11) === Number(digits[10])
	const okTwelfth =
		controlDigit(digits, PERSON_WEIGHTS_12) === Number(digits[11])
	const valid = okEleventh && okTwelfth

	return {
		...base,
		kind,
		region,
		valid,
		problem: valid ? null : 'Контрольные цифры не сходятся — в номере опечатка.'
	}
}
