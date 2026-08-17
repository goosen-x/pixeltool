'use client'

import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode
} from 'react'

export interface ToolStatsEntry {
	views: number
	rating: number
	ratingCount: number
}

export type ToolStatsMap = Record<string, ToolStatsEntry>

interface ToolStatsContextValue {
	stats: ToolStatsMap
	loaded: boolean
	applyView: (toolId: string, views: number) => void
	applyRating: (toolId: string, rating: number, ratingCount: number) => void
}

const ToolStatsContext = createContext<ToolStatsContextValue | null>(null)

export function ToolStatsProvider({ children }: { children: ReactNode }) {
	const [stats, setStats] = useState<ToolStatsMap>({})
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		let cancelled = false

		fetch('/api/tool-stats')
			.then(response => (response.ok ? response.json() : {}))
			.then((data: ToolStatsMap) => {
				if (!cancelled) setStats(data)
			})
			.catch(() => {
				// Сеть недоступна — виджеты остаются в состоянии «без данных».
			})
			.finally(() => {
				if (!cancelled) setLoaded(true)
			})

		return () => {
			cancelled = true
		}
	}, [])

	function applyView(toolId: string, views: number) {
		setStats(prev => ({
			...prev,
			[toolId]: {
				views,
				rating: prev[toolId]?.rating ?? 0,
				ratingCount: prev[toolId]?.ratingCount ?? 0
			}
		}))
	}

	function applyRating(toolId: string, rating: number, ratingCount: number) {
		setStats(prev => ({
			...prev,
			[toolId]: {
				views: prev[toolId]?.views ?? 0,
				rating,
				ratingCount
			}
		}))
	}

	return (
		<ToolStatsContext.Provider
			value={{ stats, loaded, applyView, applyRating }}
		>
			{children}
		</ToolStatsContext.Provider>
	)
}

export function useToolStatsContext(): ToolStatsContextValue {
	const context = useContext(ToolStatsContext)
	if (!context) {
		throw new Error(
			'useToolStatsContext должен вызываться внутри ToolStatsProvider'
		)
	}
	return context
}
