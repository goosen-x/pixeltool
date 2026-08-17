'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
	href: string
	title: string
	Icon: React.ComponentType<{ className?: string }>
	active: boolean
	demo?: boolean
	onClick?: () => void
	transitionDelayMs?: number
}

export const ToolLink = ({
	href,
	title,
	Icon,
	active,
	demo,
	onClick,
	transitionDelayMs = 0
}: Props) => (
	<div
		className='transition-all duration-300 ease-out'
		style={{ transitionDelay: `${transitionDelayMs}ms` }}
	>
		<Link
			href={href}
			onClick={onClick}
			// Названия после SEO-переработки длинные и обрезаются многоточием.
			// Нативный тултип браузера показывает полное — без лишнего JS
			title={title}
			aria-current={active ? 'page' : undefined}
			className={cn(
				'relative isolate flex items-center gap-3 rounded-lg [corner-shape:squircle] px-3 py-2 text-sm transition-all duration-200 hover:translate-x-1 hover:bg-primary/10 hover:text-primary',
				active && 'bg-primary text-white'
			)}
		>
			<Icon className='w-4 h-4' />
			<span className='flex-1 truncate text-left'>{title}</span>
			{demo && (
				<span
					className={cn(
						'shrink-0 rounded-full px-1.5 py-0.5 text-[0.625rem] font-medium tracking-wide uppercase',
						active
							? 'bg-white/25 text-white'
							: 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
					)}
				>
					Демо
				</span>
			)}
			{active && <ChevronRight className='w-4 h-4' aria-hidden='true' />}
		</Link>
	</div>
)
