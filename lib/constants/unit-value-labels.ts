import { pluralizeRu } from '@/lib/utils/pluralize'

/**
 * Формы существительного после числительного (1/2-4/5+) только для единиц,
 * которые реально используются в popularValues по unit-pairs.ts. Единицы
 * вроде psi, °C, °F не склоняются — обрабатываются отдельно в
 * formatUnitQuantity.
 */
const UNIT_FORMS: Record<string, [string, string, string]> = {
	mm: ['миллиметр', 'миллиметра', 'миллиметров'],
	in: ['дюйм', 'дюйма', 'дюймов'],
	cm: ['сантиметр', 'сантиметра', 'сантиметров'],
	ft: ['фут', 'фута', 'футов'],
	m: ['метр', 'метра', 'метров'],
	lb: ['фунт', 'фунта', 'фунтов'],
	kg: ['килограмм', 'килограмма', 'килограммов'],
	g: ['грамм', 'грамма', 'граммов'],
	step: ['шаг', 'шага', 'шагов'],
	km: ['километр', 'километра', 'километров'],
	bar: ['бар', 'бара', 'баров']
}

/**
 * Готовая пара «число + слово в нужной форме», например «32 дюйма» или
 * «0,5 метра». Дробные числа (displayOverride с дробью вроде «1/2») всегда
 * берут форму родительного падежа единственного числа — так же, как и
 * обычная десятичная дробь («0,5 метра», не «0,5 метров»).
 */
export function formatUnitQuantity(
	value: number,
	unitId: string,
	displayOverride?: string
): string {
	const display =
		displayOverride ??
		value.toLocaleString('ru-RU', { maximumFractionDigits: 6 })

	if (unitId === 'psi') return `${display} psi`
	if (unitId === 'c') return `${display}°C`
	if (unitId === 'f') return `${display}°F`

	const forms = UNIT_FORMS[unitId]
	if (!forms) return `${display} ${unitId}`

	const isFraction = Boolean(displayOverride) || !Number.isInteger(value)
	const word = isFraction ? forms[1] : pluralizeRu(value, forms)
	return `${display} ${word}`
}

/**
 * Предложный падеж множественного числа для заголовка вида «32 дюйма в
 * сантиметрах». Форма фиксированная и не зависит от числа, поэтому это
 * просто таблица, а не склонение.
 */
const UNIT_PREPOSITIONAL: Record<string, string> = {
	mm: 'в миллиметрах',
	in: 'в дюймах',
	cm: 'в сантиметрах',
	ft: 'в футах',
	m: 'в метрах',
	lb: 'в фунтах',
	kg: 'в килограммах',
	g: 'в граммах',
	step: 'в шагах',
	km: 'в километрах',
	bar: 'в барах',
	psi: 'в psi',
	c: 'по Цельсию',
	f: 'по Фаренгейту'
}

export function unitPrepositional(unitId: string): string {
	return UNIT_PREPOSITIONAL[unitId] ?? `в ${unitId}`
}
