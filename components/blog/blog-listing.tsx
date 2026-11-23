'use client'

import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { widgetCategories } from '@/lib/constants/widgets'
import DateFormatter from './date-formatter'
import { PostCover } from './post-cover'

export type BlogListItem = {
	slug: string
	title: string
	excerpt: string
	date: string
	coverImage: string
	category?: string
}

type CategoryKey = keyof typeof widgetCategories

const categoryLabel = (key?: string) =>
	key && key in widgetCategories
		? widgetCategories[key as CategoryKey]
		: undefined

/** Рубрика в сайдбаре и над заголовком карточки. */
const pill = (active: boolean) =>
	cn(
		'cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors whitespace-nowrap',
		'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
		active
			? 'border-primary bg-primary text-primary-foreground'
			: 'border-border bg-card text-foreground hover:border-primary/50'
	)

function CategoryBadge({ category }: { category?: string }) {
	const label = categoryLabel(category)
	if (!label) return null
	return (
		<span className='inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
			{label}
		</span>
	)
}

/** Карточка в сетке: картинка сверху, текст снизу. */
export function PostCard({ post }: { post: BlogListItem }) {
	return (
		<Link
			href={`/blog/${post.slug}`}
			className='group flex h-full cursor-pointer flex-col rounded-3xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/40 sm:p-5'
		>
			<PostCover
				title={post.title}
				slug={post.slug}
				coverImage={post.coverImage}
				className='aspect-[16/9] rounded-2xl'
			/>
			<div className='mt-5 flex flex-1 flex-col'>
				<div>
					<CategoryBadge category={post.category} />
				</div>
				<h2 className='mt-3 text-xl font-bold leading-snug text-balance transition-colors group-hover:text-primary sm:text-2xl'>
					{post.title}
				</h2>
				<p className='mt-3 line-clamp-3 text-muted-foreground'>
					{post.excerpt}
				</p>
				<div className='mt-auto pt-5 text-right text-sm text-muted-foreground'>
					<DateFormatter dateString={post.date} />
				</div>
			</div>
		</Link>
	)
}

/** Широкая карточка: картинка слева, текст справа. Первая статья и каждая третья. */
function PostCardWide({ post }: { post: BlogListItem }) {
	return (
		<Link
			href={`/blog/${post.slug}`}
			className='group grid cursor-pointer gap-5 rounded-3xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/40 sm:p-5 md:grid-cols-2 md:gap-8'
		>
			<PostCover
				title={post.title}
				slug={post.slug}
				coverImage={post.coverImage}
				className='aspect-[16/9] rounded-2xl'
			/>
			<div className='flex flex-col md:py-2'>
				<div>
					<CategoryBadge category={post.category} />
				</div>
				<h2 className='mt-3 text-2xl font-bold leading-tight text-balance transition-colors group-hover:text-primary lg:text-3xl'>
					{post.title}
				</h2>
				<p className='mt-4 line-clamp-4 text-muted-foreground'>
					{post.excerpt}
				</p>
				<div className='mt-auto pt-5 text-right text-sm text-muted-foreground'>
					<DateFormatter dateString={post.date} />
				</div>
			</div>
		</Link>
	)
}

export function BlogListing({ posts }: { posts: BlogListItem[] }) {
	const [category, setCategory] = useState<string | null>(null)
	const [query, setQuery] = useState('')

	// Рубрика живёт в ?category=, чтобы отфильтрованный список можно было
	// отправить ссылкой. Читаем после монтирования: страница статическая (ISR),
	// и сервер всегда отдаёт полный список, который видят поисковики.
	useEffect(() => {
		const initial = new URLSearchParams(window.location.search).get('category')
		if (initial && initial in widgetCategories) setCategory(initial)
	}, [])

	const selectCategory = (next: string | null) => {
		setCategory(next)
		const url = new URL(window.location.href)
		if (next) url.searchParams.set('category', next)
		else url.searchParams.delete('category')
		window.history.replaceState(null, '', url)
	}

	// Рубрики в порядке widgetCategories, только те, где есть статьи.
	const categories = useMemo(() => {
		const counts = new Map<string, number>()
		for (const p of posts) {
			if (p.category) counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
		}
		return (Object.keys(widgetCategories) as CategoryKey[])
			.filter(key => counts.has(key))
			.map(key => ({
				key,
				label: widgetCategories[key],
				count: counts.get(key)!
			}))
	}, [posts])

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase()
		return posts.filter(
			p =>
				(!category || p.category === category) &&
				(!q ||
					p.title.toLowerCase().includes(q) ||
					p.excerpt.toLowerCase().includes(q))
		)
	}, [posts, category, query])

	// Раскладка как в журнале: первая статья широкая, дальше по кругу
	// две карточки в ряд и одна широкая.
	const [first, ...rest] = filtered
	const groups: BlogListItem[][] = []
	for (let i = 0; i < rest.length; i += 3) groups.push(rest.slice(i, i + 3))

	return (
		// grid-cols-1 (minmax(0, 1fr)) и min-w-0: без них на телефоне колонка
		// растягивалась по ширине ленты рубрик, и вся страница уезжала вбок
		<div className='grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12'>
			<aside className='min-w-0 lg:sticky lg:top-24 lg:self-start'>
				<nav aria-label='Рубрики блога'>
					<ul className='-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:items-start lg:overflow-visible lg:px-0 lg:pb-0'>
						<li>
							<button
								type='button'
								onClick={() => selectCategory(null)}
								className={pill(category === null)}
							>
								Все статьи
							</button>
						</li>
						{categories.map(c => (
							<li key={c.key}>
								<button
									type='button'
									onClick={() => selectCategory(c.key)}
									className={pill(category === c.key)}
								>
									{c.label}
									<span
										className={cn(
											'ml-1.5 text-xs',
											category === c.key
												? 'text-primary-foreground/70'
												: 'text-muted-foreground'
										)}
									>
										{c.count}
									</span>
								</button>
							</li>
						))}
					</ul>
				</nav>
			</aside>

			<div className='min-w-0'>
				<div className='relative'>
					<Search className='pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
					<input
						type='search'
						value={query}
						onChange={e => setQuery(e.target.value)}
						placeholder='Поиск по статьям'
						aria-label='Поиск по статьям'
						className='h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-11 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 [&::-webkit-search-cancel-button]:hidden'
					/>
					{query && (
						<button
							type='button'
							onClick={() => setQuery('')}
							aria-label='Очистить поиск'
							className='absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground'
						>
							<X className='h-4 w-4' />
						</button>
					)}
				</div>

				{filtered.length === 0 ? (
					<div className='py-20 text-center'>
						<p className='text-lg text-muted-foreground'>Ничего не нашлось.</p>
						<button
							type='button'
							onClick={() => {
								setQuery('')
								selectCategory(null)
							}}
							className='mt-4 cursor-pointer text-primary hover:underline'
						>
							Сбросить фильтры
						</button>
					</div>
				) : (
					<div className='mt-8 flex flex-col gap-6 md:gap-8'>
						<PostCardWide post={first} />
						{groups.map((group, i) => (
							<div key={i} className='flex flex-col gap-6 md:gap-8'>
								<div className='grid gap-6 md:grid-cols-2 md:gap-8'>
									{group.slice(0, 2).map(post => (
										<PostCard key={post.slug} post={post} />
									))}
								</div>
								{group[2] && <PostCardWide post={group[2]} />}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
