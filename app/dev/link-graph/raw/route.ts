import { readFile } from 'fs/promises'
import { join } from 'path'
import { dev } from '@/lib/config/env'

/**
 * Отдаёт собранную карту перелинковки как есть, чтобы страница показала её в
 * iframe.
 *
 * Карта — самодостаточный HTML со своими стилями, скриптом и вшитыми данными;
 * встроить его в React-дерево нельзя (`dangerouslySetInnerHTML` не выполняет
 * скрипты), а держать вторую копию разметки в компоненте значит обречь их
 * разъезжаться. Поэтому один источник — файл, который собирает
 * `pnpm link-graph`.
 *
 * Файл лежит в `docs/`, а он целиком в `.gitignore`: в задеплоенной сборке его
 * не будет. Это не проблема — маршрут, как и весь `/dev`, живёт только локально.
 */
const GRAPH_PATH = 'docs/seo/link-graph.html'

export async function GET() {
	if (!dev) {
		return new Response('Not found', { status: 404 })
	}

	try {
		const html = await readFile(join(process.cwd(), GRAPH_PATH), 'utf-8')
		return new Response(html, {
			headers: {
				'Content-Type': 'text/html; charset=utf-8',
				// Карта пересобирается командой, а не запросом: закэшированная
				// версия показывала бы вчерашний граф до перезапуска сервера.
				'Cache-Control': 'no-store'
			}
		})
	} catch {
		return new Response('not-built', { status: 404 })
	}
}
