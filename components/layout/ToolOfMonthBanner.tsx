import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
	currentYearMonth,
	getToolOfTheMonth
} from '@/lib/tool-stats/tool-of-month'
import { ToolOfMonthBannerDismiss } from './ToolOfMonthBannerDismiss'

export async function ToolOfMonthBanner() {
	const widget = await getToolOfTheMonth()
	if (!widget) return null

	const Icon = widget.icon
	const title = widget.title || widget.translationKey

	return (
		<ToolOfMonthBannerDismiss yearMonth={currentYearMonth()}>
			<Link
				href={`/tools/${widget.path}`}
				className='flex cursor-pointer items-center justify-center gap-2 px-10 py-2.5 text-center text-sm hover:opacity-90'
			>
				<Icon className='h-4 w-4 shrink-0' />
				<span className='font-medium'>Инструмент месяца:</span>
				<span className='truncate'>{title}</span>
				<ArrowRight className='h-4 w-4 shrink-0' />
			</Link>
		</ToolOfMonthBannerDismiss>
	)
}
