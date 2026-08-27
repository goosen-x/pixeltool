'use client'

import { getWidgetById } from '@/lib/constants/widgets'
import { cn } from '@/lib/utils'
import { WidgetActions } from './WidgetActions'

interface WidgetHeaderProps {
	widgetId: string
}

export function WidgetHeader({ widgetId }: WidgetHeaderProps) {
	const widget = getWidgetById(widgetId)

	if (!widget) return null

	const Icon = widget.icon

	// Get title and description directly from widget data
	const title = widget.title || widget.id
	const description =
		widget.description || 'Онлайн-инструмент, работает прямо в браузере'

	return (
		<div className='mb-8'>
			{/* Grid вместо flex, чтобы раскладка отличалась по брейкпоинтам без
			    дублирования заголовка/описания в DOM (важно для одного <h1> на
			    странице). Мобильный шаблон: иконка+заголовок в первой строке,
			    описание — второй строкой во всю ширину. На sm+: иконка крупнее
			    и растянута на обе строки слева, описание — только справа. */}
			<div
				className={cn(
					'grid grid-cols-[auto_1fr] items-start gap-x-3 gap-y-2 sm:gap-x-4',
					"[grid-template-areas:'icon_title'_'desc_desc']",
					"sm:[grid-template-areas:'icon_title'_'icon_desc']"
				)}
			>
				<div
					className={cn(
						'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white [grid-area:icon] sm:h-18 sm:w-18',
						widget.gradient
					)}
				>
					<Icon className='h-4 w-4 sm:h-10 sm:w-10' />
				</div>
				<h1 className='min-w-0 text-balance text-lg font-heading font-bold [grid-area:title] sm:text-3xl md:text-4xl'>
					{title}
				</h1>
				<p className='min-w-0 text-sm text-muted-foreground [grid-area:desc] sm:text-lg md:text-xl'>
					{description}
				</p>
			</div>

			{/* Отдельной строкой: рядом с заголовком кнопки поджимали его и
			    заставляли длинные названия переноситься раньше времени */}
			<div className='mt-4'>
				<WidgetActions widgetId={widget.id} title={title} />
			</div>
		</div>
	)
}
