export interface WilsonInterval {
	rate: number
	lower: number
	upper: number
}

/**
 * Доверительный интервал Уилсона для доли (конверсии).
 *
 * В отличие от нормального приближения (Wald) не уходит за границы [0, 1]
 * на маленькой выборке или низкой/нулевой конверсии — типичный случай для
 * веба, где Wald даёт абсурдный отрицательный нижний край.
 */
export function wilsonInterval(
	conversions: number,
	visitors: number,
	confidenceLevel: number
): WilsonInterval {
	const rate = conversions / visitors
	const z = zCritical(confidenceLevel)
	const z2 = z * z

	const denominator = 1 + z2 / visitors
	const center = (rate + z2 / (2 * visitors)) / denominator
	const halfWidth =
		(z / denominator) *
		Math.sqrt((rate * (1 - rate)) / visitors + z2 / (4 * visitors * visitors))

	// На краях (0% или 100% конверсий) вычитание/сложение близких по величине
	// чисел оставляет микроскопический шум с плавающей точкой вместо честного
	// нуля/единицы — клампим с запасом, а не строго по границе.
	const EPSILON = 1e-9
	return {
		rate,
		lower: center - halfWidth < EPSILON ? 0 : center - halfWidth,
		upper: center + halfWidth > 1 - EPSILON ? 1 : center + halfWidth
	}
}

/**
 * Функция ошибок erf(x) — приближение Абрамовица-Стигана (7.1.26), точность
 * до 1.5e-7. Нужна как строительный блок для normalCdf: замкнутой формулы
 * для интеграла нормального распределения не существует.
 */
function erf(x: number): number {
	const sign = x < 0 ? -1 : 1
	const absX = Math.abs(x)

	const a1 = 0.254829592
	const a2 = -0.284496736
	const a3 = 1.421413741
	const a4 = -1.453152027
	const a5 = 1.061405429
	const p = 0.3275911

	const t = 1 / (1 + p * absX)
	const poly = ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t
	return sign * (1 - poly * Math.exp(-absX * absX))
}

/** Функция распределения стандартного нормального распределения Φ(z). */
export function normalCdf(z: number): number {
	return 0.5 * (1 + erf(z / Math.SQRT2))
}

/**
 * Критическое значение z для двустороннего интервала на произвольном уровне
 * доверия (не только табличных 90/95/99 — слайдер в UI даёт любой процент).
 * Обратная функция к normalCdf: замкнутой формулы для неё нет, поэтому ищем
 * бисекцией — normalCdf монотонна, 100 итераций дают точность на пределе
 * double задолго до того, как она понадобится.
 */
export function zCritical(confidenceLevel: number): number {
	const target = 0.5 + confidenceLevel / 200
	let lo = 0
	let hi = 10
	for (let i = 0; i < 100; i++) {
		const mid = (lo + hi) / 2
		if (normalCdf(mid) < target) lo = mid
		else hi = mid
	}
	return (lo + hi) / 2
}

export interface VariantInput {
	visitors: number
	conversions: number
}

export interface ComparisonResult {
	/** Насколько сильно отличаются конверсии в стандартных отклонениях. */
	zScore: number
	/** Вероятность увидеть такую или большую разницу при отсутствии реального эффекта. */
	pValue: number
	/** Относительный прирост варианта к контролю; Infinity, если в контроле не было конверсий. */
	uplift: number
	significant: boolean
}

/**
 * Двухвыборочный z-тест на разницу пропорций (конверсий) варианта и
 * контроля — эквивалентен хи-квадрат тесту для таблицы 2×2 (chi² = z² при
 * 1 степени свободы), тому же методу, что использует калькулятор Эвана
 * Миллера.
 */
export function compareToControl(
	control: VariantInput,
	variant: VariantInput,
	confidenceLevel: number
): ComparisonResult {
	const controlRate = control.conversions / control.visitors
	const variantRate = variant.conversions / variant.visitors

	const uplift =
		controlRate === 0
			? variantRate === 0
				? 0
				: Infinity
			: variantRate / controlRate - 1

	const pooledRate =
		(control.conversions + variant.conversions) /
		(control.visitors + variant.visitors)
	const standardError = Math.sqrt(
		pooledRate *
			(1 - pooledRate) *
			(1 / control.visitors + 1 / variant.visitors)
	)

	// standardError = 0 означает pooledRate 0 или 1 — обе группы дали
	// одинаковый (нулевой либо стопроцентный) результат, разницы нет.
	const zScore =
		standardError === 0 ? 0 : (variantRate - controlRate) / standardError
	const pValue = 2 * (1 - normalCdf(Math.abs(zScore)))

	return {
		zScore,
		pValue,
		uplift,
		significant: Math.abs(zScore) > zCritical(confidenceLevel)
	}
}

export interface LabeledVariant {
	label: string
	input: VariantInput | null
}

export interface VerdictLine {
	winnerLabel: string
	loserLabels: string[]
}

export type Verdict =
	| { kind: 'incomplete' }
	| { kind: 'no-difference' }
	| { kind: 'results'; lines: VerdictLine[] }

/**
 * Полный попарный тест между всеми заполненными вариантами (не только
 * относительно контроля A) с поправкой Бонферрони на число пар — иначе при
 * росте числа вариантов растёт и шанс ложного срабатывания просто от
 * количества сравнений. Раньше сравнение шло только с базовым вариантом,
 * из-за чего терялась информация: например, значимая победа B над A
 * пропадала из вывода, если C обгонял A ещё сильнее.
 *
 * Результат — для каждого «победителя» список вариантов, которых он значимо
 * обгоняет. Варианты без значимой разницы друг с другом просто не образуют
 * ребра — это не то же самое, что явное «не различаются» (Mindbox отдельно
 * подсвечивает такие пары; здесь это осознанно не сделано, см. обсуждение).
 */
export function pickVerdict(
	variants: LabeledVariant[],
	confidenceLevel: number
): Verdict {
	const valid = variants.filter(
		(v): v is { label: string; input: VariantInput } => v.input !== null
	)
	if (valid.length < 2) return { kind: 'incomplete' }

	const pairCount = (valid.length * (valid.length - 1)) / 2
	const alpha = 1 - confidenceLevel / 100
	const correctedConfidenceLevel = (1 - alpha / pairCount) * 100

	const beats = new Map<string, string[]>()

	for (let i = 0; i < valid.length; i++) {
		for (let j = i + 1; j < valid.length; j++) {
			const a = valid[i]
			const b = valid[j]
			const comparison = compareToControl(
				a.input,
				b.input,
				correctedConfidenceLevel
			)
			if (!comparison.significant) continue

			const winner = comparison.zScore > 0 ? b : a
			const loser = comparison.zScore > 0 ? a : b
			const losers = beats.get(winner.label) ?? []
			losers.push(loser.label)
			beats.set(winner.label, losers)
		}
	}

	if (beats.size === 0) return { kind: 'no-difference' }

	const lines: VerdictLine[] = Array.from(beats.entries())
		.map(([winnerLabel, loserLabels]) => ({
			winnerLabel,
			loserLabels: loserLabels.sort()
		}))
		.sort(
			(a, b) =>
				b.loserLabels.length - a.loserLabels.length ||
				a.winnerLabel.localeCompare(b.winnerLabel)
		)

	return { kind: 'results', lines }
}
