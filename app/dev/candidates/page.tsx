import { execFile } from 'child_process'
import { promisify } from 'util'
import { readFileSync } from 'fs'
import { join } from 'path'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { dev } from '@/lib/config/env'
import {
	CandidatesTable,
	type Candidate
} from '@/components/dev/CandidatesTable'

const execFileAsync = promisify(execFile)

/**
 * Страница внутренняя и на проде отдаёт 404 (флаг dev ниже), но робота
 * оповещаем и явно: если тул когда-нибудь окажется доступен по недосмотру —
 * например, dev-сборкой на публичном хосте — таблица со спросом, статусами и
 * позициями конкурентов не должна попасть ни в индекс, ни в обход ссылок.
 */
export const metadata: Metadata = {
	robots: {
		index: false,
		follow: false,
		nocache: true,
		googleBot: { index: false, follow: false }
	}
}

// Единственный источник истины — файл на сервере (/root/pixeltool/candidates.tsv,
// рядом с самим проектом, не в общей папке обмена /root/exchange/), доступный
// и с этой машины, и другим агентам по ssh. Локальная копия
// (docs/seo/candidates.tsv, в .gitignore) — только резервный вариант, если
// ssh недоступен: держит страницу живой, но может быть устаревшей.
const REMOTE_HOST = 'goosen'
const REMOTE_PATH = '/root/pixeltool/candidates.tsv'
const LOCAL_FALLBACK_PATH = join(process.cwd(), 'docs/seo/candidates.tsv')

function parseTsv(raw: string): Candidate[] {
	const lines = raw.split('\n').filter(line => line.trim().length > 0)
	const [, ...rows] = lines // первая строка — заголовок, пропускаем

	return rows.map(line => {
		const [
			name,
			volume,
			category,
			status,
			source,
			comment,
			yandex,
			google,
			serpPhrase
		] = line.split('\t')
		return {
			name: name ?? '',
			volume: Number(volume) || 0,
			category: category ?? '',
			status: status ?? '',
			source: source ?? '',
			comment: comment ?? '',
			yandex: (yandex ?? '').trim(),
			google: (google ?? '').trim(),
			serpPhrase: (serpPhrase ?? '').trim()
		}
	})
}

async function loadTsv(): Promise<{ raw: string; stale: boolean }> {
	try {
		const { stdout } = await execFileAsync(
			'ssh',
			[REMOTE_HOST, `cat ${REMOTE_PATH}`],
			{ timeout: 5000 }
		)
		return { raw: stdout, stale: false }
	} catch {
		// ssh недоступен (нет сети, машина не в этой сессии) — берём локальный
		// снимок, если он есть, и явно помечаем его как потенциально устаревший.
		return { raw: readFileSync(LOCAL_FALLBACK_PATH, 'utf-8'), stale: true }
	}
}

/**
 * Внутренняя страница-обзор кандидатов на новые тулы (спрос по Вордстату).
 * Только локальная разработка: доступна лишь на машинах, где запущен `pnpm
 * dev` — на проде флаг dev выключен, страница отдаёт 404.
 */
export default async function DevCandidatesPage() {
	if (!dev) notFound()

	let candidates: Candidate[]
	let stale = false
	try {
		const result = await loadTsv()
		candidates = parseTsv(result.raw)
		stale = result.stale
	} catch {
		notFound()
	}

	return (
		<main className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
			<Link
				href='/dev/serp'
				className='cursor-pointer text-sm text-muted-foreground underline-offset-2 hover:text-primary hover:underline'
			>
				Позиции в Яндексе →
			</Link>
			<h1 className='mt-2 text-2xl font-bold tracking-tight'>
				Кандидаты на новые тулы
			</h1>
			<p className='mt-1 text-sm text-muted-foreground'>
				{candidates.length} позиций, {REMOTE_HOST}:{REMOTE_PATH} — только
				локальная разработка, страницы нет в проде.
			</p>
			{stale && (
				<p className='mt-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400'>
					Не удалось подключиться по ssh к {REMOTE_HOST} — показан локальный
					снимок, он может быть устаревшим.
				</p>
			)}
			<CandidatesTable candidates={candidates} />
		</main>
	)
}
