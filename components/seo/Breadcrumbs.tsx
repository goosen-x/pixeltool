import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
	name: string
	/** Относительный путь, например "/tools" или "/" для главной */
	url: string
}

interface BreadcrumbsProps {
	items: BreadcrumbItem[]
	className?: string
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

const toAbsolute = (url: string) =>
	url === '/' ? BASE_URL : `${BASE_URL}${url}`

/**
 * Видимые хлебные крошки в контенте страницы + BreadcrumbList (JSON-LD).
 * Серверный компонент: разметка попадает в SSR HTML — её видят Яндекс и Google.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
	if (!items || items.length === 0) return null

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: toAbsolute(item.url)
		}))
	}

	return (
		<nav
			aria-label='Хлебные крошки'
			className={cn(
				'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-4 sm:pb-6',
				className
			)}
		>
			<ol className='flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground'>
				{items.map((item, index) => {
					const isLast = index === items.length - 1

					return (
						<li key={item.url} className='flex items-center gap-1.5'>
							{index > 0 && (
								<ChevronRight className='h-3.5 w-3.5 shrink-0 opacity-40' />
							)}
							{isLast ? (
								<span
									className='font-medium text-foreground truncate max-w-[60vw] sm:max-w-none'
									aria-current='page'
								>
									{item.name}
								</span>
							) : (
								<Link
									href={item.url}
									className='flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors'
								>
									{index === 0 ? (
										<>
											<Home className='h-4 w-4' />
											<span className='sr-only sm:not-sr-only'>{item.name}</span>
										</>
									) : (
										item.name
									)}
								</Link>
							)}
						</li>
					)
				})}
			</ol>

			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
		</nav>
	)
}
