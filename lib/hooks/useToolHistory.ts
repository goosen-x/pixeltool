'use client'

import { useState, useEffect, useCallback } from 'react'

const RECENT_KEY = 'pixeltool:recent'
const FAVORITES_KEY = 'pixeltool:favorites'
const RECENT_LIMIT = 6

// Разные компоненты (шапка, сайдбар, кнопка на странице тула) держат каждый
// свой independent-стейт поверх одного localStorage — без этого события
// избранное в шапке не увидело бы звёздочку, поставленную на странице тула,
// пока не перезагрузишь вкладку. 'storage' тут не подходит: он не долетает
// до той же вкладки, где произошла запись, только до других.
const FAVORITES_CHANGED_EVENT = 'pixeltool:favorites-changed'

const read = (key: string): string[] => {
	try {
		const raw = localStorage.getItem(key)
		const parsed = raw ? JSON.parse(raw) : []
		return Array.isArray(parsed)
			? parsed.filter(x => typeof x === 'string')
			: []
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

	useEffect(() => {
		const handleExternalChange = () => setFavorites(read(FAVORITES_KEY))
		window.addEventListener(FAVORITES_CHANGED_EVENT, handleExternalChange)
		return () =>
			window.removeEventListener(FAVORITES_CHANGED_EVENT, handleExternalChange)
	}, [])

	const toggleFavorite = useCallback((id: string) => {
		setFavorites(prev => {
			const next = prev.includes(id)
				? prev.filter(x => x !== id)
				: [...prev, id]
			write(FAVORITES_KEY, next)
			return next
		})
		// Не диспатчим синхронно внутри апдейтера: он может выполниться во время
		// рендера другого компонента (React ругается на setState чужого
		// компонента посреди чужого рендера) — откладываем на микротаску, после
		// того как этот update уже закоммитился.
		queueMicrotask(() =>
			window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT))
		)
	}, [])

	const isFavorite = useCallback(
		(id: string) => favorites.includes(id),
		[favorites]
	)

	return { recent, favorites, ready, toggleFavorite, isFavorite }
}
