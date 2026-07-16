import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
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
			// Отступы по бокам те же, что у контейнера страницы, — иначе крошки
			// висят левее контента, с которым должны быть на одной вертикали.
			className={cn(
				'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4 sm:pt-6 sm:pb-6',
				className
			)}
		>
			<ol className='flex items-center gap-1.5 overflow-x-auto text-sm text-muted-foreground [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
				{items.map((item, index) => {
					const isLast = index === items.length - 1

					return (
						<li key={item.url} className='flex shrink-0 items-center gap-1.5'>
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
									className='cursor-pointer hover:text-foreground transition-colors'
								>
									{item.name}
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
