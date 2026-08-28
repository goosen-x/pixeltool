import type { ReactNode } from 'react'
import { ProjectsLayoutWrapper } from '@/components/sidebars/ProjectsLayoutWrapper'
import { getAllToolStats, type ToolStats } from '@/lib/tool-stats/get-all-stats'
import { isDbUnavailableError } from '@/lib/db'

// ISR вместо force-dynamic. Прежний флаг стоял из-за того, что БД недоступна
// из окружения сборки (см. CLAUDE.md — сеть pixeltool-net только на проде), но
// цена оказалась несоразмерной: под ним ни одна из 70 страниц тулов не
// пререндерилась, каждый заход шёл через SSR с запросом в БД, и PageSpeed
// показывал TTFB около 600 мс на всех тулах одинаково, независимо от начинки.
// Недоступность БД на билде закрывает try/catch ниже: в статику запекается
// пустая статистика, а через час ISR подставит настоящую. Тот же интервал и та
// же логика, что у app/layout.tsx с «инструментом месяца».
export const revalidate = 3600

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
		if (!isDbUnavailableError(error)) {
			console.error('Не удалось получить статистику тулов для JSON-LD:', error)
		}
	}

	return (
		<ProjectsLayoutWrapper toolStats={toolStats}>
			{children}
		</ProjectsLayoutWrapper>
	)
}
