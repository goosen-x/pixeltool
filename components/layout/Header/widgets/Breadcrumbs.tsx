import { Logo } from '@/components/global/Logo'
import Link from 'next/link'

// Логотип в хедере. Хлебные крошки переехали в контент страницы
// (см. components/seo/Breadcrumbs.tsx).
export const Breadcrumbs = () => {
	return (
		<div className='flex items-center'>
			<Link
				href='/'
				className='group flex items-center gap-2 text-xl font-bold text-foreground hover:text-foreground/80 transition-all cursor-pointer'
			>
				<div className='relative'>
					<Logo
						size={28}
						className='group-hover:scale-110 transition-transform'
					/>
					<div className='absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity' />
				</div>
				<span className='font-heading font-bold'>PixelTool</span>
			</Link>
		</div>
	)
}
