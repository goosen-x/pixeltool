import { Logo } from '@/components/global/Logo'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const Breadcrumbs = () => {
	const pathname = usePathname()

	// Parse pathname to create breadcrumb items
	const segments = pathname.split('/').filter(Boolean)

	// Create breadcrumb items
	const breadcrumbs = segments.map((segment, index) => {
		const path = `/${segments.slice(0, index + 1).join('/')}`
		// Capitalize first letter for display
		const label = segment.charAt(0).toUpperCase() + segment.slice(1)
		return { path, label, segment }
	})

	return (
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
	)
}
