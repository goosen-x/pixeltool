import Link from 'next/link'

interface SubpageLink {
	slug: string
	label: string
}

interface SubpageLinksProps {
	/** `Widget['path']` хаба — первый сегмент адреса подстраниц. */
	parentPath: string
	items: SubpageLink[]
	/** Заголовок над списком. Без него список идёт без подписи. */
	title?: string
}

/**
 * Ссылки с хаба на его SEO-подстраницы.
 *
 * Хаб и его подстраницы — единственные настоящие тематические кластеры на
 * сайте, и правило кластера требует, чтобы pillar ссылался на каждую свою
 * страницу. Из шести семейств это делал только `unit-converter`; у остальных
 * пяти 24 страницы не имели ни одной входящей ссылки вообще — ни из статей,
 * ни от собственного хаба.
 *
 * Список приходит пропом, а не берётся из общего реестра семейств: тот
 * импортирует все пять файлов констант разом, включая `unit-pairs` на 243 КБ,
 * и каждый хаб утащил бы в свой бандл данные пяти чужих.
 */
export function SubpageLinks({ parentPath, items, title }: SubpageLinksProps) {
	if (items.length === 0) return null

	return (
		<section className='mt-6'>
			{title && (
				<h2 className='mb-3 text-sm font-medium text-muted-foreground'>
					{title}
				</h2>
			)}
			<div className='flex flex-wrap gap-2'>
				{items.map(item => (
					<Link
						key={item.slug}
						href={`/tools/${parentPath}/${item.slug}`}
						className='cursor-pointer rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground'
					>
						{item.label}
					</Link>
				))}
			</div>
		</section>
	)
}
