import type { ReactNode } from 'react'
import { ProjectsLayoutWrapper } from '@/components/sidebars/ProjectsLayoutWrapper'
import { getAllToolStats, type ToolStats } from '@/lib/tool-stats/get-all-stats'

// БД недоступна из окружения сборки (см. CLAUDE.md — сеть pixeltool-net
// только на проде), поэтому этот layout не должен пытаться статически
// рендериться на билде.
export const dynamic = 'force-dynamic'

type Props = {
	children: ReactNode
}

export default async function WidgetsLayout({ children }: Props) {
	// Нужно для aggregateRating в JSON-LD (WidgetStructuredData) — рейтинг
	// должен попасть в SSR-HTML, а не подгружаться клиентом после гидратации.
	// Один сбой БД не должен ронять страницу тула — отдаём пустую статистику.
	let toolStats: Record<string, ToolStats> = {}
	try {
		toolStats = await getAllToolStats()
	} catch (error) {
		console.error('Не удалось получить статистику тулов для JSON-LD:', error)
	}

	return (
		<ProjectsLayoutWrapper toolStats={toolStats}>
			{children}
		</ProjectsLayoutWrapper>
	)
}
