'use client'

import { useCallback, useState } from 'react'
import type { FigureDim } from '@/components/tools/HairlineFigure'

/**
 * Связка полей ввода со схемой Hairline: поле в фокусе подсвечивает свой
 * размер на схеме, клик по размеру ставит курсор в поле.
 *
 *   const figure = useFigureFocus('concrete')
 *   <Field {...figure.bind('length')} />
 *   <HairlineFigure focusKey={figure.focusKey} onPick={figure.onPick} />
 */
export function useFigureFocus(prefix: string) {
	const [focusKey, setFocusKey] = useState<string | null>(null)

	const bind = (key: string) => ({
		id: `${prefix}-${key}`,
		onFocus: () => setFocusKey(key),
		onBlur: () => setFocusKey(current => (current === key ? null : current))
	})

	const onPick = useCallback(
		(key: string) => document.getElementById(`${prefix}-${key}`)?.focus(),
		[prefix]
	)

	return { focusKey, bind, onPick }
}

/**
 * Размер для схемы. Подпись схема строит сама из настоящих чисел, поэтому
 * буква и текст пустые. null — поле пустое: схема держит прошлое значение.
 */
export function figureDim(key: string, value: number | null): FigureDim {
	return {
		key,
		letter: '',
		meters:
			value !== null && Number.isFinite(value) && value > 0 ? value : null,
		text: ''
	}
}

/**
 * Ноль, который схема должна увидеть как ноль, а не как пустое поле
 * (HairlineFigure считает пустыми значения ≤ 0): «внутренних стен нет»,
 * «шов 0 мм».
 */
export const FIGURE_ZERO = 1e-9
