'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { highlightText } from '@/lib/utils/highlightText'
import { cn } from '@/lib/utils'
import { CardPattern, patternIndexForCategory } from './CardPattern'
import { CornerBadge } from './CornerBadge'
import type { Widget } from '@/lib/constants/widgets'

interface ToolCardProps {
	widget: Widget
	searchQuery?: string
	className?: string
}

export function ToolCard({
	widget,
	searchQuery = '',
	className
}: ToolCardProps) {
	const Icon = widget.icon

	const title = widget.title || widget.translationKey
	const description = widget.description || ''

	return (
		<Link
			href={`/tools/${widget.path}`}
			className={cn(
				'group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl px-6 py-7',
				className
			)}
		>
			{/* Фон карточки: контурный паттерн клипуется по скруглению. Квадратный
			    бейдж иконки сидит вплотную в углу поверх него — вырезать под него
			    дыру не нужно, он и так закрывает всё под собой */}
			<span className='pointer-events-none absolute inset-0 overflow-hidden rounded-3xl bg-muted dark:bg-card'>
				<span className='absolute inset-0 text-foreground opacity-[0.02] transition-opacity duration-500 group-hover:opacity-[0.04] dark:opacity-[0.03]'>
					<CardPattern
						variant={patternIndexForCategory(widget.category)}
						uid={widget.path}
					/>
				</span>
			</span>

			<CornerBadge icon={Icon} gradient={widget.gradient} />

			<div className='relative flex flex-1 flex-col'>
				<h2 className='pr-14 text-balance text-lg font-bold tracking-tight text-foreground'>
					{searchQuery ? highlightText(title, searchQuery) : title}
				</h2>
				<p className='mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground'>
					{searchQuery ? highlightText(description, searchQuery) : description}
				</p>
				<span className='mt-5 inline-flex w-fit items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors group-hover:bg-primary/90'>
					Попробовать
					<ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
				</span>
			</div>
		</Link>
	)
}
