'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

/**
 * Переход между служебными страницами. Раньше каждая была тупиком: попасть на
 * соседнюю можно было только набрав адрес руками.
 *
 * Список ведётся здесь, а не собирается из файловой системы: под /dev лежат и
 * вложенные роуты вроде link-graph/raw, которые открывать незачем.
 */
const DEV_PAGES = [
	{ href: '/dev/link-graph', label: 'Карта перелинковки' },
	{ href: '/dev/webmaster-stats', label: 'Вебмастер по URL' },
	{ href: '/dev/serp', label: 'Позиции' },
	{ href: '/dev/candidates', label: 'Кандидаты' }
]

export function DevNav() {
	const pathname = usePathname()

	return (
		<nav
			aria-label='Служебные страницы'
			className='border-b border-border bg-muted/40'
		>
			<div className='mx-auto flex max-w-7xl flex-wrap items-center gap-x-1 gap-y-2 px-4 py-2.5 sm:px-6'>
				<span className='mr-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground'>
					dev
				</span>
				{DEV_PAGES.map(page => {
					const active = pathname === page.href
					return (
						<Link
							key={page.href}
							href={page.href}
							aria-current={active ? 'page' : undefined}
							className={cn(
								'rounded-md px-2.5 py-1.5 text-sm transition-colors',
								active
									? 'bg-background font-medium text-foreground shadow-sm'
									: 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
							)}
						>
							{page.label}
						</Link>
					)
				})}
			</div>
		</nav>
	)
}
