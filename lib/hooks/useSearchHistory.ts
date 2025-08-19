'use client'

import { useState, useEffect } from 'react'

const SEARCH_HISTORY_KEY = 'pixeltool_search_history'
const MAX_HISTORY_ITEMS = 10

export function useSearchHistory() {
	const [history, setHistory] = useState<string[]>([])

	useEffect(() => {
		const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
		if (stored) {
			try {
				setHistory(JSON.parse(stored))
			} catch (e) {
				console.error('Failed to parse search history', e)
			}
		}
	}, [])

	const addToHistory = (query: string) => {
		if (!query.trim()) return

		const newHistory = [query, ...history.filter(item => item !== query)].slice(
			0,
			MAX_HISTORY_ITEMS
		)

		setHistory(newHistory)
		localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
	}

	const clearHistory = () => {
		setHistory([])
		localStorage.removeItem(SEARCH_HISTORY_KEY)
	}

	const removeFromHistory = (query: string) => {
		const newHistory = history.filter(item => item !== query)
		setHistory(newHistory)
		localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
	}

	return {
		history,
		addToHistory,
		clearHistory,
		removeFromHistory
	}
}
