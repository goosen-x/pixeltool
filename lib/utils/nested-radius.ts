/**
 * Радиус скругления вложенного элемента.
 *
 * Правило одно и простое: радиус внутреннего равен радиусу внешнего минус
 * расстояние между ними. Тогда дуги идут «эквидистантно» — на одинаковом
 * расстоянии друг от друга по всей длине, и вложенная карточка выглядит
 * вписанной, а не подложенной. Если внутреннему оставить тот же радиус, что
 * у внешнего, угол получается слишком круглым и зазор в углу зрительно
 * шире, чем по сторонам; если оставить нулевой — угол торчит.
 *
 * Строго говоря, центры дуг при этом не совпадают, и математически линии
 * эквидистантными не становятся. Но расхождение меньше, чем разница, которую
 * замечает глаз, и это давно принятый в интерфейсной вёрстке приём.
 */

/** Что именно отделяет внутренний элемент от внешнего. */
export interface Gap {
	/** padding внешнего элемента. */
	padding: number
	/** Толщина рамки внешнего элемента — она тоже раздвигает элементы. */
	border: number
}

export interface NestedRadiusInput {
	outerRadius: number
	gap: Gap
}

export interface NestedRadiusResult {
	/** Суммарное расстояние между внешним и внутренним контурами. */
	distance: number
	/** Радиус внутреннего элемента, уже не отрицательный. */
	innerRadius: number
	/**
	 * Формула ушла в минус: расстояние больше внешнего радиуса. Само по себе
	 * это не ошибка — у внутреннего элемента просто прямой угол, — но сказать
	 * об этом стоит, иначе человек будет искать, почему скругление пропало.
	 */
	clamped: boolean
}

export function totalGap(gap: Gap): number {
	return gap.padding + gap.border
}

export function computeNestedRadius({
	outerRadius,
	gap
}: NestedRadiusInput): NestedRadiusResult {
	const distance = totalGap(gap)
	const raw = outerRadius - distance

	return {
		distance,
		innerRadius: Math.max(0, raw),
		clamped: raw < 0
	}
}

/** Обратная задача: знаем радиус внутреннего, ищем внешний. */
export function computeOuterRadius(innerRadius: number, gap: Gap): number {
	return innerRadius + totalGap(gap)
}

function px(value: number): string {
	// Дробные пиксели оставляем, но без хвоста из нулей: 12.5px, а не 12.50px.
	return `${Math.round(value * 100) / 100}px`
}

/**
 * CSS через переменные, а не два готовых числа.
 *
 * Так связь между радиусами остаётся в самом коде: поменяли padding —
 * внутренний радиус пересчитался сам. Если выписать оба числа вручную, при
 * первой же правке отступа углы разъедутся, и никто не вспомнит почему.
 * `max()` защищает от отрицательного значения, которое браузер отбросил бы
 * вместе со всем свойством.
 */
export function buildCss(
	outerRadius: number,
	gap: Gap,
	selectors: { outer: string; inner: string } = {
		outer: '.card',
		inner: '.card__inner'
	}
): string {
	const parts = [`var(--radius)`, `var(--padding)`]
	if (gap.border > 0) parts.push(`var(--border)`)

	const lines = [
		`${selectors.outer} {`,
		`\t--radius: ${px(outerRadius)};`,
		`\t--padding: ${px(gap.padding)};`
	]

	if (gap.border > 0) {
		lines.push(`\t--border: ${px(gap.border)};`)
		lines.push(`\tborder: var(--border) solid;`)
	}

	lines.push(
		`\tborder-radius: var(--radius);`,
		`\tpadding: var(--padding);`,
		`}`,
		``,
		`${selectors.inner} {`,
		`\tborder-radius: max(0px, ${parts.join(' - ')});`,
		`}`
	)

	return lines.join('\n')
}
