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
							className={cn(
								'relative rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 overflow-hidden group',
								active
									? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
									: 'text-muted-foreground hover:text-foreground'
							)}
						>
							{!active && (
								<span className='absolute inset-0 bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl' />
							)}
							<span className='relative z-10'>{label}</span>
						</Link>
					)
				})}
			</nav>
		</div>
	)
}
