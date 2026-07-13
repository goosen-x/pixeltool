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
	const description = widget.description || 'Инструмент для веб-разработки'

	return (
		<div className='mb-8'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-start'>
				<div
					className={cn(
						`w-16 h-16 sm:w-18 sm:h-18 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shrink-0`,
						widget.gradient
					)}
				>
					<Icon className='w-8 h-8 sm:w-10 sm:h-10' />
				</div>
				<div className='flex min-w-0 flex-col gap-2'>
					<h1 className='text-2xl sm:text-3xl md:text-4xl font-heading font-bold'>
						{title}
					</h1>
					<p className='text-base sm:text-lg md:text-xl text-muted-foreground'>
						{description}
					</p>
				</div>

				<div className='shrink-0 sm:ml-auto'>
					<WidgetActions widgetId={widget.id} title={title} />
				</div>
			</div>
		</div>
	)
}
