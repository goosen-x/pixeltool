'use client'

import { useState, useEffect, useCallback } from 'react'

const RECENT_KEY = 'pixeltool:recent'
const FAVORITES_KEY = 'pixeltool:favorites'
const RECENT_LIMIT = 6

const read = (key: string): string[] => {
	try {
		const raw = localStorage.getItem(key)
		const parsed = raw ? JSON.parse(raw) : []
		return Array.isArray(parsed) ? parsed.filter(x => typeof x === 'string') : []
	} catch {
		// повреждённый JSON или заблокированное хранилище — не роняем страницу
		return []
	}
}

const write = (key: string, value: string[]) => {
	try {
		localStorage.setItem(key, JSON.stringify(value))
	} catch {
		// приватный режим: запись может быть запрещена
	}
}

/**
 * История и избранное инструментов в localStorage.
 *
 * Читать хранилище можно только после монтирования: на сервере его нет, и
 * попытка отрисовать список сразу разъехалась бы с гидратацией. Поэтому до
 * первого эффекта списки пустые, а `ready` говорит, можно ли уже рисовать.
 */
export function useToolHistory(currentWidgetId?: string) {
	const [recent, setRecent] = useState<string[]>([])
	const [favorites, setFavorites] = useState<string[]>([])
	const [ready, setReady] = useState(false)

	useEffect(() => {
		setFavorites(read(FAVORITES_KEY))

		const stored = read(RECENT_KEY)

		if (currentWidgetId) {
			const next = [
				currentWidgetId,
				...stored.filter(id => id !== currentWidgetId)
			].slice(0, RECENT_LIMIT)

			write(RECENT_KEY, next)
			// Текущий инструмент в списке «недавних» не показываем: человек и так
			// на нём, строка была бы ссылкой на саму себя
			setRecent(next.filter(id => id !== currentWidgetId))
		} else {
			setRecent(stored)
		}

		setReady(true)
	}, [currentWidgetId])

	const toggleFavorite = useCallback((id: string) => {
		setFavorites(prev => {
			const next = prev.includes(id)
				? prev.filter(x => x !== id)
				: [...prev, id]
			write(FAVORITES_KEY, next)
			return next
		})
	}, [])

	const isFavorite = useCallback(
		(id: string) => favorites.includes(id),
		[favorites]
	)

	return { recent, favorites, ready, toggleFavorite, isFavorite }
}
