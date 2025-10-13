'use client'

import Link from 'next/link'

import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/global/ThemeToggle'
// import { LanguageSelect } from '@/components/global/LanguageSelect'
import { Logo } from '@/components/global/Logo'
import { OnlineUsers } from '@/components/global/OnlineUsers'
import { useEffect, useState } from 'react'
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
import { GlobalWidgetSearch } from '@/components/global/GlobalWidgetSearch'
import {
	DrawerTop as Drawer,
	DrawerTopClose as DrawerClose,
	DrawerTopContent as DrawerContent,
	DrawerTopDescription as DrawerDescription,
	DrawerTopFooter as DrawerFooter,
	DrawerTopHeader as DrawerHeader,
	DrawerTopTitle as DrawerTitle,
	DrawerTopTrigger as DrawerTrigger
} from '@/components/ui/drawer-top'

const Header = () => {
	const locale = 'ru'
	const pathname = usePathname()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const [isSearchOpen, setIsSearchOpen] = useState(false)

	// Clean up any theme transition artifacts on route change
	useEffect(() => {
		// Remove all transition-related state when route changes
		document.documentElement.classList.remove(
			'theme-fade-transition',
			'theme-circle-transition',
			'theme-slide-transition',
			'theme-flip-transition',
			'theme-blur-transition'
		)
		document.documentElement.style.removeProperty('--theme-circle-x')
		document.documentElement.style.removeProperty('--theme-circle-y')
		document.documentElement.style.removeProperty('--theme-circle-radius')
		document.documentElement.removeAttribute('data-theme-transitioning')
	}, [pathname])

	// Parse pathname to create breadcrumb items
	const pathSegments = pathname.split('/').filter(Boolean)
	// Use all segments since there's no locale to remove
	const segments = pathSegments

	// Create breadcrumb items
	const breadcrumbs = segments.map((segment, index) => {
		const path = `/${segments.slice(0, index + 1).join('/')}`
		// Capitalize first letter for display
		const label = segment.charAt(0).toUpperCase() + segment.slice(1)
		return { path, label, segment }
	})

	return (
		<header
			className={cn(
				'border-b border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 w-full'
			)}
		>
			<div className='w-full px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-20'>
					{/* Logo/Brand with Breadcrumbs */}
					<div className='flex items-center'>
						<Link
							href='/'
							className='group flex items-center gap-3 text-2xl font-bold text-foreground hover:text-foreground/80 transition-all'
						>
							<div className='relative'>
								<Logo
									size={36}
									className='group-hover:scale-110 transition-transform'
								/>
								<div className='absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity' />
							</div>
							<span className='font-heading font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
								PixelTool
							</span>
						</Link>

						{/* Breadcrumb navigation */}
						{breadcrumbs.length > 0 && (
							<nav
								className='hidden sm:flex items-center ml-4'
								aria-label='Breadcrumb'
							>
								{breadcrumbs.map((crumb, index) => (
									<div key={crumb.path} className='flex items-center'>
										<span className='mx-3 text-muted-foreground/50'>/</span>
										{index === breadcrumbs.length - 1 ? (
											<span className='text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
												{crumb.label}
											</span>
										) : (
											<Link
												href={crumb.path}
												className='text-lg font-medium text-muted-foreground hover:text-foreground transition-colors'
											>
												{crumb.label}
											</Link>
										)}
									</div>
								))}
							</nav>
						)}
					</div>

					{/* Navigation & Controls */}
					<div className='flex items-center gap-2 sm:gap-4'>
						<nav className='hidden lg:flex items-center gap-1'>
							<Link
								href='/'
								className={cn(
									'relative rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 overflow-hidden group',
									pathname === '/'
										? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
										: 'text-muted-foreground hover:text-foreground'
								)}
							>
								{pathname !== '/' && (
									<span className='absolute inset-0 bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl' />
								)}
								<span className='relative z-10'>Главная</span>
							</Link>

							<Link
								href='/tools'
								className={cn(
									'relative rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 overflow-hidden group',
									pathname.startsWith('/tools')
										? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
										: 'text-muted-foreground hover:text-foreground'
								)}
							>
								{!pathname.startsWith('/tools') && (
									<span className='absolute inset-0 bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl' />
								)}
								<span className='relative z-10'>Инструменты</span>
							</Link>

							<Link
								href='/blog'
								className={cn(
									'relative rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 overflow-hidden group',
									pathname.startsWith('/blog')
										? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
										: 'text-muted-foreground hover:text-foreground'
								)}
							>
								{!pathname.startsWith('/blog') && (
									<span className='absolute inset-0 bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl' />
								)}
								<span className='relative z-10'>Блог</span>
							</Link>

							<Link
								href='/contact'
								className={cn(
									'relative rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 overflow-hidden group',
									pathname === '/contact'
										? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
										: 'text-muted-foreground hover:text-foreground'
								)}
							>
								{pathname !== '/contact' && (
									<span className='absolute inset-0 bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl' />
								)}
								<span className='relative z-10'>Контакты</span>
							</Link>
						</nav>
						<div className='hidden md:flex items-center gap-2'>
							{/* Online Users Counter */}
							<OnlineUsers />
							<div className='h-8 w-px bg-border/50' />
							<Button
								variant='ghost'
								onClick={() => setIsSearchOpen(true)}
								className='h-10 px-4 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/80 hover:border-border transition-all duration-300 flex items-center gap-2'
								aria-label='Search tools'
							>
								<Search className='w-4 h-4 text-muted-foreground' />
								<span className='text-muted-foreground'>Поиск</span>
								<kbd className='hidden lg:inline-flex h-5 select-none items-center gap-1 rounded-lg border border-border/50 bg-muted/50 px-1.5 font-mono text-xs font-medium text-muted-foreground'>
									<span className='text-xs'>⌘</span>K
								</kbd>
							</Button>
							<div className='h-8 w-px bg-border/50' />
							{/* <LanguageSelect className='shrink-0' locale={locale} /> */}
							<ThemeToggle />
						</div>
					</div>

					{/* Mobile menu drawer */}
					<div className='flex items-center lg:hidden'>
						<Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
							<DrawerTrigger asChild>
								<Button
									variant='ghost'
									size='icon'
									className='h-10 w-10 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/80 hover:border-border transition-all duration-300 relative overflow-hidden group'
								>
									<span className='relative z-10'>
										<MenuIcon className='w-5 h-5 text-muted-foreground' />
									</span>
									<span className='absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
								</Button>
							</DrawerTrigger>
							<DrawerContent className='max-h-[85vh] max-w-full'>
								<DrawerHeader className='text-left'>
									<div className='flex items-center justify-between'>
										<DrawerTitle className='text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
											Меню
										</DrawerTitle>
										<DrawerClose asChild>
											<Button
												variant='ghost'
												size='icon'
												className='h-8 w-8 rounded-lg'
											>
												<X className='w-4 h-4' />
												<span className='sr-only'>Close</span>
											</Button>
										</DrawerClose>
									</div>
								</DrawerHeader>
								<div className='flex flex-col px-4 pb-4 space-y-1 overflow-y-auto'>
									{/* Search button */}
									<Button
										onClick={e => {
											e.preventDefault()
											e.stopPropagation()
											setIsSearchOpen(true)
											setTimeout(() => setIsMobileMenuOpen(false), 100)
										}}
										className='flex items-center gap-3 rounded-xl px-5 py-4 font-medium bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 hover:border-primary/40 text-foreground transition-all duration-300'
										variant='ghost'
									>
										<div className='relative'>
											<Search className='w-5 h-5' />
											<div className='absolute inset-0 bg-primary/20 blur-xl opacity-50' />
										</div>
										<span className='font-semibold'>Поиск</span>
										<kbd className='ml-auto text-xs px-2 py-1 rounded-lg border border-border/50 bg-muted/50 text-muted-foreground'>
											⌘K
										</kbd>
									</Button>

									<div className='h-px bg-gradient-to-r from-transparent via-border/50 to-transparent my-4' />

									{/* Navigation links */}
									<Link
										href='/'
										onClick={e => {
											e.stopPropagation()
											setTimeout(() => setIsMobileMenuOpen(false), 50)
										}}
										className={cn(
											'group flex items-center gap-3 rounded-xl px-5 py-4 font-medium transition-all duration-300 relative overflow-hidden',
											pathname === '/'
												? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
												: 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
										)}
									>
										<div className='relative z-10'>
											<Home className='w-5 h-5' />
										</div>
										<span className='relative z-10 font-semibold'>Главная</span>
										{pathname !== '/' && (
											<div className='absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
										)}
									</Link>

									<Link
										href='/tools'
										onClick={e => {
											e.stopPropagation()
											setTimeout(() => setIsMobileMenuOpen(false), 50)
										}}
										className={cn(
											'flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-300',
											pathname.startsWith('/tools')
												? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
												: 'hover:bg-muted/80 text-muted-foreground hover:text-foreground'
										)}
									>
										<div className='relative z-10'>
											<Wrench className='w-5 h-5' />
										</div>
										<span className='relative z-10 font-semibold'>
											Инструменты
										</span>
										{!pathname.startsWith('/tools') && (
											<div className='absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
										)}
									</Link>

									<Link
										href='/blog'
										onClick={e => {
											e.stopPropagation()
											setTimeout(() => setIsMobileMenuOpen(false), 50)
										}}
										className={cn(
											'flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-300',
											pathname.startsWith('/blog')
												? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
												: 'hover:bg-muted/80 text-muted-foreground hover:text-foreground'
										)}
									>
										<div className='relative z-10'>
											<BookOpen className='w-5 h-5' />
										</div>
										<span className='relative z-10 font-semibold'>Блог</span>
										{!pathname.startsWith('/blog') && (
											<div className='absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
										)}
									</Link>

									<Link
										href='/contact'
										onClick={e => {
											e.stopPropagation()
											setTimeout(() => setIsMobileMenuOpen(false), 50)
										}}
										className={cn(
											'flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-300',
											pathname === '/contact'
												? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
												: 'hover:bg-muted/80 text-muted-foreground hover:text-foreground'
										)}
									>
										<div className='relative z-10'>
											<Mail className='w-5 h-5' />
										</div>
										<span className='relative z-10 font-semibold'>
											Контакты
										</span>
										{pathname !== '/contact' && (
											<div className='absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
										)}
									</Link>

									<div className='h-px bg-gradient-to-r from-transparent via-border/50 to-transparent my-4' />

									{/* Language and Theme controls */}
									<div className='bg-muted/30 rounded-xl p-4 border border-border/30'>
										<div className='flex items-center justify-between mb-3'>
											<span className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
												<Sparkles className='w-4 h-4' />
												Настройки
											</span>
										</div>
										<div className='flex items-center gap-3'>
											{/* <div className='flex-1'>
												<LanguageSelect className='w-full' locale={locale} />
											</div> */}
											<ThemeToggle />
										</div>
									</div>
								</div>
							</DrawerContent>
						</Drawer>
					</div>
				</div>
			</div>

			{/* Global Widget Search */}
			<GlobalWidgetSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />
		</header>
	)
}

export default Header
