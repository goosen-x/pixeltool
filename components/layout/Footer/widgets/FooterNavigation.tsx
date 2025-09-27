'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Home, FolderOpen, BookOpen, Mail, Heart, Coffee } from 'lucide-react'

export const FooterNavigation = () => {
	const locale = useLocale()
	const pathname = usePathname()

	const links = [
		{ title: 'Главная', href: '/', icon: Home },
		{ title: 'Инструменты', href: '/tools', icon: FolderOpen },
		{ title: 'Блог', href: '/blog', icon: BookOpen },
		{ title: 'Контакты', href: '/contact', icon: Mail }
	]

	return (
		<div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:flex lg:gap-16'>
			{/* Navigation Section */}
			<div className='flex flex-col gap-4'>
				<p className='text-sm font-semibold text-foreground uppercase tracking-wider'>
					Navigation
				</p>
				<div className='flex flex-col gap-2'>
					{links.map(link => {
						const Icon = link.icon
						const isActive =
							pathname === link.href ||
							(link.href !== '/' && pathname.startsWith(link.href))

						return (
							<Link
								key={link.title}
								href={link.href}
								scroll={!isActive}
								className='group flex items-center gap-2 relative'
							>
								<div className='relative'>
									<div
										className={`
										absolute inset-0 rounded-lg opacity-0 scale-110 
										bg-gradient-to-br from-accent/20 to-accent/5 
										group-hover:opacity-100 group-hover:scale-100 
										transition-all duration-300 blur-sm
									`}
									/>
									<div
										className={`
										relative p-1.5 rounded-lg border 
										${
											isActive
												? 'border-accent bg-accent/10 text-accent'
												: 'border-border/50 text-muted-foreground group-hover:border-accent/50 group-hover:text-accent'
										}
										transition-all duration-300
									`}
									>
										<Icon className='w-3.5 h-3.5' />
									</div>
								</div>
								<span
									className={`
									text-xs font-medium transition-all duration-300 whitespace-nowrap
									${
										isActive
											? 'text-foreground'
											: 'text-muted-foreground group-hover:text-foreground'
									}
								`}
								>
									{link.title}
								</span>
							</Link>
						)
					})}
				</div>
			</div>

			{/* Support Section */}
			<div className='flex flex-col gap-4'>
				<p className='text-sm font-semibold text-foreground uppercase tracking-wider'>
					Поддержка
				</p>
				<div className='flex flex-col gap-2'>
					<a
						href='https://www.buymeacoffee.com/yourname'
						target='_blank'
						rel='noopener noreferrer'
						className='group flex items-center gap-2 relative'
					>
						<div className='relative'>
							<div className='absolute inset-0 rounded-lg opacity-0 scale-110 bg-gradient-to-br from-accent/20 to-accent/5 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 blur-sm' />
							<div className='relative p-1.5 rounded-lg border border-border/50 text-muted-foreground group-hover:border-accent/50 group-hover:text-accent transition-all duration-300'>
								<Coffee className='w-3.5 h-3.5' />
							</div>
						</div>
						<span className='text-xs font-medium text-muted-foreground group-hover:text-foreground transition-all duration-300 whitespace-nowrap'>
							Купить мне кофе
						</span>
					</a>
				</div>
			</div>
		</div>
	)
}
