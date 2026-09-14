import { access } from 'fs/promises'
import { join } from 'path'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { dev } from '@/lib/config/env'

/**
 * Карта перелинковки. Внутренняя, как /dev/candidates и /dev/serp: на проде
 * 404 по флагу dev.
 *
 * Сама карта — самодостаточный HTML, собранный `pnpm link-graph`; страница
 * только показывает его в iframe, чтобы не держать вторую копию разметки.
 */
export const metadata: Metadata = {
	robots: {
		index: false,
		follow: false,
		nocache: true,
		googleBot: { index: false, follow: false }
	}
}

const GRAPH_PATH = 'docs/seo/link-graph.html'

export default async function DevLinkGraphPage() {
	if (!dev) notFound()

	let built = true
	try {
		await access(join(process.cwd(), GRAPH_PATH))
	} catch {
		built = false
	}

	if (!built) {
		return (
			<main className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
				<h1 className='text-2xl font-bold tracking-tight'>
					Карта перелинковки
				</h1>
				<p className='mt-3 max-w-prose text-muted-foreground'>
					Карта ещё не собрана. Она лежит в{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 font-mono text-sm'>
						{GRAPH_PATH}
					</code>
					, а этот каталог в{' '}
					<code className='font-mono text-sm'>.gitignore</code>— после свежего
					клона файла нет.
				</p>
				<p className='mt-3 max-w-prose text-muted-foreground'>
					Соберите его командой{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 font-mono text-sm'>
						pnpm link-graph
					</code>{' '}
					и обновите страницу. Просмотры и оценки подмешаются, если рядом лежат
					выгрузки боевой БД в{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 font-mono text-sm'>
						docs/stats/
					</code>
					.
				</p>
			</main>
		)
	}

	return (
		// Карта сама себе страница со своей шапкой и прокруткой, поэтому занимает
		// всю высоту под навигацией, а не живёт в общем контейнере с отступами.
		<iframe
			src='/dev/link-graph/raw'
			title='Карта перелинковки PixelTool'
			className='block h-[calc(100vh-3.25rem)] w-full border-0'
		/>
	)
}
