'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const items = [
	{ href: '/', label: 'Главная', match: (p: string) => p === '/' },
	{
		href: '/tools',
		label: 'Инструменты',
		match: (p: string) => p.startsWith('/tools')
	},
	{ href: '/blog', label: 'Блог', match: (p: string) => p.startsWith('/blog') },
	{
		href: '/contact',
		label: 'Контакты',
		match: (p: string) => p === '/contact'
	}
]

export const Navigation = () => {
	const pathname = usePathname()
	return (
		<div className='flex items-center gap-2 sm:gap-4'>
			<nav className='hidden lg:flex items-center gap-1'>
				{items.map(({ href, label, match }) => {
					const active = match(pathname)
					return (
						<Link
							key={href}
							href={href}
							aria-current={active ? 'page' : undefined}
							className={cn(
								'cursor-pointer rounded-lg [corner-shape:squircle] px-4 py-2 text-sm font-medium transition-colors',
								active
									? 'bg-primary text-primary-foreground'
									: 'text-muted-foreground hover:bg-muted hover:text-foreground'
							)}
						>
							{label}
						</Link>
					)
				})}
			</nav>
		</div>
	)
}
