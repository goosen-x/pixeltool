'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { publicWidgets } from '@/lib/constants/widgets'

interface Props {
	className?: string
}

// Кнопка «Случайный инструмент» вместо статичной ссылки на конкретный тул:
// путь неизвестен на момент рендера (выбирается в момент клика), поэтому
// это <button> с программной навигацией, а не <Link href>.
export function RandomToolButton({ className }: Props) {
	const router = useRouter()

	const goToRandomTool = useCallback(() => {
		const widget =
			publicWidgets[Math.floor(Math.random() * publicWidgets.length)]
		router.push(`/tools/${widget.path}`)
	}, [router])

	return (
		<button type='button' onClick={goToRandomTool} className={className}>
			Случайный инструмент
		</button>
	)
}
