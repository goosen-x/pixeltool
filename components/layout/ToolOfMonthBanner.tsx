import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getToolOfTheMonth } from '@/lib/tool-stats/tool-of-month'
import { isDbUnavailableError } from '@/lib/db'
import type { Widget } from '@/lib/constants/widgets'
import { ToolOfMonthBannerDismiss } from './ToolOfMonthBannerDismiss'

export async function ToolOfMonthBanner() {
	// Компонент живёт в корневом layout'е, то есть рендерится на КАЖДОМ
	// маршруте, включая статически пререндеренные на билде — а в окружении
	// сборки БД недоступна (см. комментарий в app/tools/(widget)/layout.tsx).
	// Без try/catch падал бы весь билд, а на проде любой сбой БД ронял бы сайт
	// целиком вместо одного баннера.
	let widget: Widget | null = null
	try {
		widget = await getToolOfTheMonth()
	} catch (error) {
		// «БД не поднята» — ожидаемо на билде и в локальной разработке без
		// докера, не повод шуметь в консоли. Настоящие баги (кривой SQL,
		// неверный пароль) логируем как и раньше.
		if (!isDbUnavailableError(error)) {
			console.error('Не удалось выбрать инструмент месяца:', error)
		}
	}
	if (!widget) return null

	const Icon = widget.icon
	const title = widget.title || widget.translationKey

	return (
		<ToolOfMonthBannerDismiss>
			<Link
				href={`/tools/${widget.path}`}
				className='flex cursor-pointer items-center justify-center gap-2 px-8 py-2.5 text-center text-sm hover:opacity-90'
			>
				<Icon className='h-4 w-4 shrink-0' />
				{/* На узких экранах подпись съедает всю ширину — прячем её, название
				    тула информативнее. min-w-0 обязателен: без него truncate у
				    flex-ребёнка не работает (min-width:auto) и текст вылезает за
				    контейнер, давая горизонтальную прокрутку всему сайту. */}
				<span className='hidden font-medium sm:inline'>Инструмент месяца:</span>
				<span className='min-w-0 truncate'>{title}</span>
				<ArrowRight className='h-4 w-4 shrink-0' />
			</Link>
		</ToolOfMonthBannerDismiss>
	)
}
