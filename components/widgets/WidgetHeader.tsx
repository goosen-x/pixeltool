'use client'

import { useTranslations } from 'next-intl'
import { getWidgetById } from '@/lib/constants/widgets'
import { cn } from '@/lib/utils'

interface WidgetHeaderProps {
	widgetId: string
}

export function WidgetHeader({ widgetId }: WidgetHeaderProps) {
	const t = useTranslations('widgets')
	const widget = getWidgetById(widgetId)

	if (!widget) return null

	const Icon = widget.icon

	return (
		<div className='mb-8'>
			<div className='flex flex-col sm:flex-row gap-4'>
				<div
					className={cn(
						`w-16 h-16 sm:w-18 sm:h-18 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shrink-0`,
						widget.gradient
					)}
				>
					<Icon className='w-8 h-8 sm:w-10 sm:h-10' />
				</div>
				<div className='flex flex-col gap-2'>
					<h1 className='text-2xl sm:text-3xl md:text-4xl font-heading font-bold'>
						{t(`${widget.translationKey}.title`)}
					</h1>
					<p className='text-base sm:text-lg md:text-xl text-muted-foreground'>
						{t(`${widget.translationKey}.description`)}
					</p>
				</div>
			</div>
		</div>
	)
}
