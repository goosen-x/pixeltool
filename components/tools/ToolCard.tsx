'use client'

import Link from 'next/link'
import { ArrowRight, Eye, Star } from 'lucide-react'
import { highlightText } from '@/lib/utils/highlightText'
import { cn } from '@/lib/utils'
import { CardPattern, patternIndexForCategory } from './CardPattern'
import { CornerBadge } from './CornerBadge'
import { useToolStats } from '@/lib/hooks/useToolStats'
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
	const { views, rating, ratingCount } = useToolStats(widget.id)
	const hasStats = ratingCount > 0 || views > 0

	return (
		<Link
			href={`/tools/${widget.path}`}
			// Карточек в кадре бывает много: девять в карусели похожих и все
			// семьдесят в каталоге. Префетч каждой съедал полосу на старте, см.
			// комментарий в ToolLink.
			prefetch={false}
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
				{/* Намеренно не заголовок. Карточка целиком обёрнута в <Link>, поэтому
				    название и так уходит в анкор-текст ссылки. Как <h2> оно только
				    ломало структуру страницы тула: девять чужих названий из блока
				    «Похожие инструменты» вставали в один уровень с содержательными
				    разделами. Переводить их в <h3> смысла нет — это навигация, а не
				    рубрикация контента. */}
				<span className='block pr-14 text-balance text-lg font-bold tracking-tight text-foreground'>
					{searchQuery ? highlightText(title, searchQuery) : title}
				</span>
				<p className='mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground'>
					{searchQuery ? highlightText(description, searchQuery) : description}
				</p>
				{/* Контейнер зарезервирован всегда (min-h под реальную высоту строки
				    text-xs), чтобы появление статистики после общего fetch не
				    сдвигало кнопку «Попробовать» — это CLS на ~49 карточках каталога.
				    Условно только содержимое внутри. */}
				<span className='mt-3 flex min-h-4 items-center gap-3 text-xs text-muted-foreground'>
					{hasStats && (
						<>
							{ratingCount > 0 && (
								<span className='flex items-center gap-1'>
									<Star className='h-3.5 w-3.5 fill-amber-500 text-amber-500' />
									{rating.toFixed(1)} · {ratingCount}
								</span>
							)}
							{views > 0 && (
								<span className='flex items-center gap-1'>
									<Eye className='h-3.5 w-3.5' />
									{new Intl.NumberFormat('ru', {
										notation: 'compact',
										maximumFractionDigits: 1
									}).format(views)}
								</span>
							)}
						</>
					)}
				</span>
				<span className='mt-5 inline-flex w-fit items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors group-hover:bg-primary/90'>
					Попробовать
					<ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
				</span>
			</div>
		</Link>
	)
}
