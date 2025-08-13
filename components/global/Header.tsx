'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/global/ThemeToggle'
import { LanguageSelect } from '@/components/global/LanguageSelect'
import { Logo } from '@/components/global/Logo'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Home, Wrench, BookOpen, Mail, Sparkles, ArrowRight, Menu as MenuIcon, X, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GlobalWidgetSearch } from '@/components/global/GlobalWidgetSearch'

const Header = () => {
	const locale = useLocale()
	const t = useTranslations('Header')
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
	// Remove locale from segments
	const segments = pathSegments.slice(1)

	// Create breadcrumb items
	const breadcrumbs = segments.map((segment, index) => {
		const path = `/${locale}/${segments.slice(0, index + 1).join('/')}`
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
							href={`/${locale}`}
							className='group flex items-center gap-3 text-2xl font-bold text-foreground hover:text-foreground/80 transition-all'
						>
							<div className='relative'>
								<Logo size={36} className='group-hover:scale-110 transition-transform' />
								<div className='absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity' />
							</div>
							<span className='font-heading font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
								PixelTool
							</span>
						</Link>

						{/* Breadcrumb navigation */}
						{breadcrumbs.length > 0 && (
							<nav className='hidden sm:flex items-center ml-4' aria-label='Breadcrumb'>
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
								href={`/${locale}`}
								className={cn(
									'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300',
									pathname === `/${locale}` 
										? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25' 
										: 'hover:bg-muted/80 text-muted-foreground hover:text-foreground'
								)}
							>
								<Home className='w-4 h-4' />
								<span>{t('nav.main')}</span>
							</Link>

							<Link
								href={`/${locale}/tools`}
								className={cn(
									'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300',
									pathname.startsWith(`/${locale}/tools`) 
										? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25' 
										: 'hover:bg-muted/80 text-muted-foreground hover:text-foreground'
								)}
							>
								<Wrench className='w-4 h-4' />
								<span>{t('nav.tools')}</span>
							</Link>
							<Link
								href={`/${locale}/blog`}
								className={cn(
									'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300',
									pathname.startsWith(`/${locale}/blog`) 
										? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25' 
										: 'hover:bg-muted/80 text-muted-foreground hover:text-foreground'
								)}
							>
								<BookOpen className='w-4 h-4' />
								<span>{t('nav.blog')}</span>
							</Link>
							<Link
								href={`/${locale}/contact`}
								className={cn(
									'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300',
									pathname === `/${locale}/contact` 
										? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25' 
										: 'hover:bg-muted/80 text-muted-foreground hover:text-foreground'
								)}
							>
								<Mail className='w-4 h-4' />
								<span>{t('nav.contact')}</span>
							</Link>
						</nav>
						<div className='hidden md:flex items-center gap-2'>
							<Button
								variant="ghost"
								onClick={() => setIsSearchOpen(true)}
								className="h-10 px-4 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/80 hover:border-border transition-all duration-300 flex items-center gap-2"
								aria-label="Search tools"
							>
								<Search className='w-4 h-4 text-muted-foreground' />
								<span className='text-muted-foreground'>{t('search')}</span>
								<kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded-lg border border-border/50 bg-muted/50 px-1.5 font-mono text-xs font-medium text-muted-foreground">
									<span className="text-xs">⌘</span>K
								</kbd>
							</Button>
							<div className='h-8 w-px bg-border/50' />
							<LanguageSelect className='shrink-0' locale={locale} />
							<ThemeToggle />
						</div>
					</div>

					{/* Mobile controls */}
					<div className='flex items-center gap-2 lg:hidden'>
						<Button
							variant="ghost"
							onClick={() => setIsSearchOpen(true)}
							className="h-10 w-10 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/80 hover:border-border transition-all duration-300"
							aria-label="Search tools"
						>
							<Search className='w-5 h-5 text-muted-foreground' />
						</Button>
						<LanguageSelect className='shrink-0' locale={locale} />
						<ThemeToggle />
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="h-10 w-10 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/80 hover:border-border transition-all duration-300"
						>
							{isMobileMenuOpen ? <X className='w-5 h-5 text-muted-foreground' /> : <MenuIcon className='w-5 h-5 text-muted-foreground' />}
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile Navigation Menu */}
			{isMobileMenuOpen && (
				<div className='fixed inset-0 z-50 lg:hidden'>
					<div className='fixed inset-0 bg-black/50' onClick={() => setIsMobileMenuOpen(false)} />
					<nav className='fixed top-20 left-0 right-0 bg-background border-b shadow-xl'>
						<div className='flex flex-col p-4 space-y-2'>
							<Link
								href={`/${locale}`}
								onClick={() => setIsMobileMenuOpen(false)}
								className={cn(
									'flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-300',
									pathname === `/${locale}` 
										? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25' 
										: 'hover:bg-muted/80 text-muted-foreground hover:text-foreground'
								)}
							>
								<Home className='w-5 h-5' />
								<span>{t('nav.main')}</span>
							</Link>

							<Link
								href={`/${locale}/tools`}
								onClick={() => setIsMobileMenuOpen(false)}
								className={cn(
									'flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-300',
									pathname.startsWith(`/${locale}/tools`) 
										? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25' 
										: 'hover:bg-muted/80 text-muted-foreground hover:text-foreground'
								)}
							>
								<Wrench className='w-5 h-5' />
								<span>{t('nav.tools')}</span>
							</Link>

							<Link
								href={`/${locale}/blog`}
								onClick={() => setIsMobileMenuOpen(false)}
								className={cn(
									'flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-300',
									pathname.startsWith(`/${locale}/blog`) 
										? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25' 
										: 'hover:bg-muted/80 text-muted-foreground hover:text-foreground'
								)}
							>
								<BookOpen className='w-5 h-5' />
								<span>{t('nav.blog')}</span>
							</Link>

							<Link
								href={`/${locale}/contact`}
								onClick={() => setIsMobileMenuOpen(false)}
								className={cn(
									'flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-300',
									pathname === `/${locale}/contact` 
										? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25' 
										: 'hover:bg-muted/80 text-muted-foreground hover:text-foreground'
								)}
							>
								<Mail className='w-5 h-5' />
								<span>{t('nav.contact')}</span>
							</Link>
						</div>
					</nav>
				</div>
			)}
			
			{/* Global Widget Search */}
			<GlobalWidgetSearch 
				locale={locale} 
				open={isSearchOpen} 
				onOpenChange={setIsSearchOpen} 
			/>
		</header>
	)
}

export default Header
