'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { widgets } from '@/lib/constants/widgets'

interface Props {
	className?: string
}

// Кнопка «Случайный инструмент» вместо статичной ссылки на конкретный тул:
// путь неизвестен на момент рендера (выбирается в момент клика), поэтому
// это <button> с программной навигацией, а не <Link href>.
export function RandomToolButton({ className }: Props) {
	const router = useRouter()

	const goToRandomTool = useCallback(() => {
		const widget = widgets[Math.floor(Math.random() * widgets.length)]
		router.push(`/tools/${widget.path}`)
	}, [router])

	return (
		<button type='button' onClick={goToRandomTool} className={className}>
			Случайный инструмент
		</button>
	)
}
