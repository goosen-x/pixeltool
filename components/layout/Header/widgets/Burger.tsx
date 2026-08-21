'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { Menu as MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet'
import { CategoriesNavigation } from '@/components/sidebars/widgets/CategoriesNavigation'
import { widgetCategories } from '@/lib/constants/widgets'

const navItems = [
	{ href: '/', label: 'Главная', isActive: (p: string) => p === '/' },
	{
		href: '/tools',
		label: 'Инструменты',
		isActive: (p: string) => p.startsWith('/tools')
	},
	{
		href: '/blog',
		label: 'Блог',
		isActive: (p: string) => p.startsWith('/blog')
	},
	{
		href: '/contact',
		label: 'Контакты',
		isActive: (p: string) => p === '/contact'
	}
] as const

export const Burger = () => {
	const pathname = usePathname()
	const [open, setOpen] = useState(false)

	const handleNavClick = useCallback(() => {
		// закрыть после перехода
		setTimeout(() => setOpen(false), 50)
	}, [])

	const renderLink = useCallback(
		(href: string, label: string, active: boolean) => (
			<Link
				key={href}
				href={href}
				onClick={handleNavClick}
				className={cn(
					'self-start rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
					active
						? 'bg-primary text-primary-foreground'
						: 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
				)}
				aria-current={active ? 'page' : undefined}
			>
				{label}
			</Link>
		),
		[handleNavClick]
	)

	const items = useMemo(
		() =>
			navItems.map(({ href, label, isActive }) =>
				renderLink(href, label, isActive(pathname))
			),
		[pathname, renderLink]
	)

	// Все категории свёрнуты по умолчанию — если открыть их сразу, список тулов
	// (8 категорий × 3–24 инструмента) занимает весь экран шторки, и до ссылок
	// «Блог»/«Контакты» выше просто не долистать. Открывают вручную то, что
	// нужно, по клику на название категории.
	const [collapsed, setCollapsed] = useState<Set<string>>(
		() => new Set(Object.keys(widgetCategories))
	)

	const toggleCategory = (key: string): void => {
		const next = new Set(collapsed)
		if (next.has(key)) {
			next.delete(key)
		} else {
			next.add(key)
		}
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
					className={cn('z-[100] max-w-full h-full flex flex-col px-2 pt-2')}
				>
					{/* Заголовок скрыт визуально, но остаётся у Radix Dialog как
					    доступное имя шторки для скринридера */}
					<SheetTitle className='sr-only'>Меню</SheetTitle>

					<div className=' overflow-y-scroll flex flex-col space-y-1 '>
						<nav aria-label='Основная навигация' className='contents'>
							{items}
						</nav>

						<div className='h-px  my-3 bg-gradient-to-r from-transparent via-border/50 to-transparent' />
						<CategoriesNavigation
							className='p-0'
							collapsed={collapsed}
							toggleCategory={toggleCategory}
							onItemClick={handleNavClick}
						/>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	)
}
