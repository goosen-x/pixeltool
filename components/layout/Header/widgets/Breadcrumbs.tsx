import { Logo } from '@/components/global/Logo'
import Link from 'next/link'

// На локальной разработке (next dev) прячем графическую эмблему — так вкладка
// с localhost сразу отличается от продакшена. В продакшене логотип на месте.
const isDev = process.env.NODE_ENV === 'development'

// Логотип в хедере. Хлебные крошки переехали в контент страницы
// (см. components/seo/Breadcrumbs.tsx).
export const Breadcrumbs = () => {
	return (
		<div className='flex items-center'>
			<Link
				href='/'
				className='group flex items-center gap-3 text-2xl font-bold text-foreground hover:text-foreground/80 transition-all cursor-pointer'
			>
				{!isDev && (
					<>
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
					</>
				)}
			</Link>
		</div>
	)
}
