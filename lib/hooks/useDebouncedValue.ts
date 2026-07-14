import { useEffect, useState } from 'react'

/**
 * Отложенное значение: поле ввода должно откликаться мгновенно, а пересчёт
 * списка — нет, иначе он гоняется на каждое нажатие клавиши.
 *
 * Пока отложенное значение не догнало текущее, вызывающий код может показать
 * спиннер — для этого сравнивает их между собой.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
	const [debounced, setDebounced] = useState(value)

	useEffect(() => {
		const timer = setTimeout(() => setDebounced(value), delayMs)
		return () => clearTimeout(timer)
	}, [value, delayMs])

	return debounced
}
