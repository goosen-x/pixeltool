'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import {
	Home,
	Wrench,
	BookOpen,
	Mail,
	Sparkles,
	Menu as MenuIcon,
	X,
	Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	DrawerTop as Drawer,
	DrawerTopClose as DrawerClose,
	DrawerTopContent as DrawerContent,
	DrawerTopHeader as DrawerHeader,
	DrawerTopTitle as DrawerTitle,
	DrawerTopTrigger as DrawerTrigger
} from '@/components/ui/drawer-top'
import ThemeToggle from '@/components/global/ThemeToggle'

type Props = {
	setIsSearchOpen: (v: boolean) => void
}

const navItems = [
	{
		href: '/',
		label: 'Главная',
		icon: Home,
		isActive: (p: string) => p === '/'
	},
	{
		href: '/tools',
		label: 'Инструменты',
		icon: Wrench,
		isActive: (p: string) => p.startsWith('/tools')
	},
	{
		href: '/blog',
		label: 'Блог',
		icon: BookOpen,
		isActive: (p: string) => p.startsWith('/blog')
	},
	{
		href: '/contact',
		label: 'Контакты',
		icon: Mail,
		isActive: (p: string) => p === '/contact'
	}
] as const

export const Burger = ({ setIsSearchOpen }: Props) => {
	const [open, setOpen] = useState(false)
	const pathname = usePathname()

	const handleNavClick = useCallback(() => {
		// закроем drawer после навигации
		setTimeout(() => setOpen(false), 50)
	}, [])

	const renderLink = useCallback(
		(
			href: string,
			label: string,
			Icon: React.ComponentType<any>,
			active: boolean
		) => (
			<Link
				key={href}
				href={href}
				onClick={handleNavClick}
				className={cn(
					'group flex items-center gap-3 rounded-xl px-5 py-4 font-medium transition-all duration-300 relative',
					active
						? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
						: 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
				)}
				aria-current={active ? 'page' : undefined}
			>
				<Icon className='w-5 h-5 relative z-10' />
				<span className='relative z-10 font-semibold'>{label}</span>
				{!active && (
					<span
						aria-hidden='true'
						className='absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl'
					/>
				)}
			</Link>
		),
		[handleNavClick]
	)

	const items = useMemo(
		() =>
			navItems.map(({ href, label, icon: Icon, isActive }) =>
				renderLink(href, label, Icon, isActive(pathname))
			),
		[pathname, renderLink]
	)

	return (
		<div className='flex items-center lg:hidden'>
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerTrigger asChild>
					<Button
						aria-label='Открыть меню'
						variant='ghost'
						size='icon'
						className='h-10 w-10 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/80 hover:border-border transition-all duration-300 relative overflow-hidden group'
					>
						<MenuIcon className='w-5 h-5 text-muted-foreground relative z-10' />
						<span
							aria-hidden='true'
							className='absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
						/>
					</Button>
				</DrawerTrigger>

				<DrawerContent
					className='max-h-[85vh] max-w-full'
					role='dialog'
					aria-label='Меню'
				>
					<DrawerHeader className='text-left'>
						<div className='flex items-center justify-between'>
							<DrawerTitle className='text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
								Меню
							</DrawerTitle>
							<DrawerClose asChild>
								<Button
									aria-label='Закрыть меню'
									variant='ghost'
									size='icon'
									className='h-8 w-8 rounded-lg'
								>
									<X className='w-4 h-4' />
								</Button>
							</DrawerClose>
						</div>
					</DrawerHeader>

					<div className='flex flex-col px-4 pb-4 space-y-1 overflow-y-auto'>
						<Button
							onClick={e => {
								e.preventDefault()
								e.stopPropagation()
								setIsSearchOpen(true)
								setTimeout(() => setOpen(false), 100)
							}}
							className='flex items-center gap-3 rounded-xl px-5 py-4 font-medium bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 hover:border-primary/40 text-foreground transition-all duration-300'
							variant='ghost'
							aria-label='Поиск'
						>
							<Search className='w-5 h-5' />
							<span className='font-semibold'>Поиск</span>
							<kbd className='ml-auto text-xs px-2 py-1 rounded-lg border border-border/50 bg-muted/50 text-muted-foreground'>
								⌘K
							</kbd>
						</Button>

						<div className='h-px bg-gradient-to-r from-transparent via-border/50 to-transparent my-4' />

						<nav aria-label='Основная навигация' className='contents'>
							{items}
						</nav>

						<div className='h-px bg-gradient-to-r from-transparent via-border/50 to-transparent my-4' />

						<section
							aria-label='Настройки'
							className='bg-muted/30 rounded-xl p-4 border border-border/30'
						>
							<div className='flex items-center justify-between mb-3'>
								<span className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
									<Sparkles className='w-4 h-4' />
									Настройки
								</span>
							</div>
							<div className='flex items-center gap-3'>
								<ThemeToggle />
							</div>
						</section>
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	)
}
