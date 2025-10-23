'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { Home, Wrench, BookOpen, Mail, Menu as MenuIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetClose
} from '@/components/ui/sheet'
import ThemeToggle from '@/components/global/ThemeToggle'
import { CategoriesNavigation } from '@/components/sidebars/widgets/CategoriesNavigation'

type Props = { setIsSearchOpen: (v: boolean) => void }

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
	const pathname = usePathname()
	const [open, setOpen] = useState(false)

	const handleNavClick = useCallback(() => {
		// закрыть после перехода
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
					'group flex items-center gap-3 rounded-xl px-4 py-4 font-medium transition-all duration-300 relative',
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
						className='absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100'
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

	const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

	const toggleCategory = (key: string): void => {
		const next = new Set(collapsed)
		next.has(key) ? next.delete(key) : next.add(key)
		setCollapsed(next)
	}

	return (
		<div className='flex items-center lg:hidden'>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
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
				</SheetTrigger>

				{/* Выберите сторону и ширину по желанию */}
				<SheetContent
					side='right'
					className={cn('z-[100] max-w-full h-full flex flex-col px-2')}
				>
					<SheetHeader>
						<div className='flex items-center justify-between'>
							<SheetTitle className='text-xl font-bold pl-2'>Меню</SheetTitle>
						</div>
					</SheetHeader>

					<div className=' overflow-y-scroll flex flex-col space-y-1 '>
						<div className='h-px my-4 bg-gradient-to-r from-transparent via-border/50 to-transparent' />

						<nav aria-label='Основная навигация' className='contents'>
							{items}
						</nav>

						<div className='h-px  my-4 bg-gradient-to-r from-transparent via-border/50 to-transparent' />
						<CategoriesNavigation
							className='p-0'
							collapsed={collapsed}
							toggleCategory={toggleCategory}
							onItemClick={handleNavClick}
						/>
					</div>
					<div
						aria-label='Настройки'
						className='bg-muted/30 rounded-xl p-4 border border-border/30 mt-auto'
					>
						<div className='flex items-center gap-3'>
							<ThemeToggle />
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	)
}
