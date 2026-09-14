import { readFileSync, statSync } from 'fs'
import { join } from 'path'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { dev } from '@/lib/config/env'
import {
	SerpPositionsTable,
	type SerpRow
} from '@/components/dev/SerpPositionsTable'

/**
 * Внутренняя, как /dev/candidates: 404 на проде (флаг dev ниже), noindex про
 * запас, если dev-сборка когда-нибудь окажется на публичном хосте.
 */
export const metadata: Metadata = {
	robots: {
		index: false,
		follow: false,
		nocache: true,
		googleBot: { index: false, follow: false }
	}
}

// Только локальный файл — в отличие от candidates.tsv тут нет процесса на
// сервере, который его пишет, синхронизировать по ssh нечего. Обновляется
// вручную: pnpm serp --built --tsv docs/seo/serp-positions.tsv (⚠️ платный
// Yandex Search API, спрашивать перед запуском — см. lib/seo/serp.ts).
const TSV_PATH = join(process.cwd(), 'docs/seo/serp-positions.tsv')

function parseTsv(raw: string): SerpRow[] {
	const lines = raw.split('\n').filter(line => line.trim().length > 0)
	const [, ...rows] = lines // первая строка — заголовок

	return rows.map(line => {
		const [name, slug, category, yandex, google, competitor, top3, source] =
			line.split('\t')
		return {
			name: name ?? '',
			slug: slug ?? '',
			category: category ?? '',
			yandex: (yandex ?? '').trim(),
			google: (google ?? '').trim(),
			competitor: competitor ?? '',
			top3: top3 ?? '',
			source: source?.trim() === 'wordstat' ? 'wordstat' : 'title'
		}
	})
}

export default async function DevSerpPage() {
	if (!dev) notFound()

	let rows: SerpRow[]
	let updatedAt: Date
	try {
		rows = parseTsv(readFileSync(TSV_PATH, 'utf-8'))
		updatedAt = statSync(TSV_PATH).mtime
	} catch {
		// Раньше здесь был notFound(). Пока на страницу заходили по прямому
		// адресу, это читалось как «страницы нет»; теперь на неё ведёт ссылка
		// из навигации, и 404 по клику выглядит поломкой. Объясняем причину.
		return (
			<main className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
				<h1 className='text-2xl font-bold tracking-tight'>Позиции в Яндексе</h1>
				<p className='mt-3 max-w-prose text-muted-foreground'>
					Выгрузка ещё не снята: нет файла{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 font-mono text-sm'>
						docs/seo/serp-positions.tsv
					</code>
					.
				</p>
				<p className='mt-3 max-w-prose text-muted-foreground'>
					Снять его командой{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 font-mono text-sm'>
						pnpm serp --built --tsv docs/seo/serp-positions.tsv
					</code>
					.{' '}
					<strong className='font-medium text-foreground'>
						Запрос платный:
					</strong>{' '}
					Yandex Search API списывает деньги за каждую фразу, полный прогон по
					реестру — около 285 запросов.
				</p>
			</main>
		)
	}

	return (
		<main className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
			<h1 className='text-2xl font-bold tracking-tight'>Позиции в Яндексе</h1>
			<p className='mt-1 text-sm text-muted-foreground'>
				{rows.length} фраз · снимок от{' '}
				{updatedAt.toLocaleDateString('ru-RU', {
					day: 'numeric',
					month: 'long',
					year: 'numeric'
				})}{' '}
				· только локальная разработка, страницы нет в проде.
			</p>
			<p className='mt-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400'>
				Обновить:{' '}
				<code className='font-mono'>
					pnpm serp --built --tsv docs/seo/serp-positions.tsv
				</code>{' '}
				— платный Yandex Search API, спрашивать перед запуском.
			</p>
			<SerpPositionsTable rows={rows} />
		</main>
	)
}
