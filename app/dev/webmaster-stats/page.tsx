import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { dev } from '@/lib/config/env'
import { getAllWebmasterStats } from '@/lib/webmaster-stats/store'
import { isDbUnavailableError } from '@/lib/db'
import { WebmasterStatsTable } from '@/components/dev/WebmasterStatsTable'
import { WebmasterStatsImportForm } from '@/components/dev/WebmasterStatsImportForm'

/**
 * Внутренняя, как /dev/candidates и /dev/serp: 404 на проде (флаг dev
 * ниже). Читает боевую БД напрямую — локально доступна через SSH-туннель
 * (см. комментарий у DATABASE_URL в .env.local), отдельной прод-версии
 * страницы не нужно.
 */
export const metadata: Metadata = {
	robots: {
		index: false,
		follow: false,
		nocache: true,
		googleBot: { index: false, follow: false }
	}
}

export default async function DevWebmasterStatsPage() {
	if (!dev) notFound()

	let rows: Awaited<ReturnType<typeof getAllWebmasterStats>> = []
	let dbUnavailable = false
	try {
		rows = await getAllWebmasterStats()
	} catch (error) {
		if (!isDbUnavailableError(error)) throw error
		dbUnavailable = true
	}

	return (
		<main className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
			<h1 className='text-2xl font-bold tracking-tight'>
				Яндекс.Вебмастер — статистика по URL
			</h1>
			<p className='mt-1 text-sm text-muted-foreground'>
				{rows.length} строк в базе. Данные — из инструмента «Расширенная
				аналитика поисковых запросов по URL» (β), см.{' '}
				<code className='font-mono'>
					docs/seo/webmaster-url-report-2026-09.md
				</code>
				.
			</p>
			{dbUnavailable && (
				<p className='mt-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400'>
					БД сейчас недоступна.
				</p>
			)}
			<WebmasterStatsImportForm />
			<WebmasterStatsTable rows={rows} />
		</main>
	)
}
