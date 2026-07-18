'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { highlightText } from '@/lib/utils/highlightText'
import { cn } from '@/lib/utils'
import { CardPattern, patternIndexForCategory } from './CardPattern'
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
				'group relative flex h-full cursor-pointer flex-col rounded-3xl px-6 py-7',
				className
			)}
		>
			{/* Фон карточки отдельным слоем: маска выгрызает вырез под угловую
			    иконку, контурный паттерн клипуется по скруглению. Иконка и текст —
			    вне этого слоя, иначе маска обрезала бы и их */}
			<span className='tool-link-cutout pointer-events-none absolute inset-0 overflow-hidden rounded-3xl bg-muted dark:bg-card'>
				<span className='absolute inset-0 text-foreground opacity-[0.08] transition-opacity duration-500 group-hover:opacity-[0.14] dark:opacity-[0.12]'>
					<CardPattern variant={patternIndexForCategory(widget.category)} />
				</span>
			</span>

			{/* Иконка сидит в вырезе правого верхнего угла */}
			<div
				className={cn(
					'absolute -right-2 -top-2 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-lg sm:-right-3 sm:-top-3 sm:h-16 sm:w-16',
					widget.gradient
				)}
			>
				<Icon className='h-6 w-6 sm:h-7 sm:w-7' />
			</div>

			<div className='relative flex flex-1 flex-col'>
				<h3 className='pr-14 text-balance text-lg font-bold tracking-tight text-foreground'>
					{searchQuery ? highlightText(title, searchQuery) : title}
				</h3>
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
