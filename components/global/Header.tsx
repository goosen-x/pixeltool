'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/global/ThemeToggle'
import { LanguageSelect } from '@/components/global/LanguageSelect'
import { DownloadCV } from '@/components/global/DownloadCV'
import { Logo } from '@/components/global/Logo'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

const Header = () => {
	const locale = useLocale()
	const t = useTranslations('Header')
	const pathname = usePathname()

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

	// Check if we're on the main page
	const isMainPage = segments.length === 0

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
				'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50'
			)}
		>
			<div className='px-5'>
				<div className='flex items-center justify-between h-16'>
					{/* Logo/Brand with Breadcrumbs */}
					<div className='flex items-center'>
						<Link
							href={`/${locale}`}
							className='flex items-center gap-2 text-2xl font-bold text-foreground hover:text-foreground/80 transition-colors'
						>
							<Logo size={28} />
							PixelTool
						</Link>

						{/* Breadcrumb navigation */}
						{breadcrumbs.length > 0 && (
							<nav className='flex items-center ml-2' aria-label='Breadcrumb'>
								{breadcrumbs.map((crumb, index) => (
									<div key={crumb.path} className='flex items-center'>
										<span className='mx-2 text-muted-foreground'>/</span>
										{index === breadcrumbs.length - 1 ? (
											<span className='text-lg font-medium text-primary'>
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
					<div className='flex items-center gap-4'>
						<nav className='hidden md:flex items-center space-x-8'>
							<Link
								href={`/${locale}`}
								className={cn(
									'font-medium transition-colors relative',
									pathname === `/${locale}`
										? 'text-foreground'
										: 'text-muted-foreground hover:text-foreground'
								)}
							>
								{t('nav.main')}
								{pathname === `/${locale}` && (
									<span className='absolute -bottom-1 left-0 right-0 h-0.5 bg-accent' />
								)}
							</Link>

							<Link
								href={`/${locale}/tools`}
								className={cn(
									'font-medium transition-colors relative',
									pathname.startsWith(`/${locale}/tools`)
										? 'text-foreground'
										: 'text-muted-foreground hover:text-foreground'
								)}
							>
								{t('nav.tools')}
								{pathname.startsWith(`/${locale}/tools`) && (
									<span className='absolute -bottom-1 left-0 right-0 h-0.5 bg-accent' />
								)}
							</Link>
							<Link
								href={`/${locale}/blog`}
								className={cn(
									'font-medium transition-colors relative',
									pathname.startsWith(`/${locale}/blog`)
										? 'text-foreground'
										: 'text-muted-foreground hover:text-foreground'
								)}
							>
								{t('nav.blog')}
								{pathname.startsWith(`/${locale}/blog`) && (
									<span className='absolute -bottom-1 left-0 right-0 h-0.5 bg-accent' />
								)}
							</Link>
							<Link
								href={`/${locale}/contact`}
								className={cn(
									'font-medium transition-colors relative',
									pathname === `/${locale}/contact`
										? 'text-foreground'
										: 'text-muted-foreground hover:text-foreground'
								)}
							>
								{t('nav.contact')}
								{pathname === `/${locale}/contact` && (
									<span className='absolute -bottom-1 left-0 right-0 h-0.5 bg-accent' />
								)}
							</Link>
						</nav>
						<div className='hidden md:flex items-center gap-2'>
							{isMainPage && <DownloadCV />}
							<LanguageSelect className='shrink-0' locale={locale} />
							<ThemeToggle />
						</div>
					</div>

					{/* Mobile controls */}
					<div className='flex items-center gap-2 md:hidden'>
						{isMainPage && <DownloadCV />}
						<LanguageSelect className='shrink-0' locale={locale} />
						<ThemeToggle />
						<button className='text-muted-foreground hover:text-foreground'>
							<svg
								className='w-6 h-6'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M4 6h16M4 12h16M4 18h16'
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</header>
	)
}

export default Header
