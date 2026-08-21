import Link from 'next/link'
import {
	widgetCategories,
	devSubcategories,
	publicWidgets
} from '@/lib/constants/widgets'
import { CATEGORY_META } from '@/lib/constants/categories'
import { widgetMatchesCategory } from '@/lib/utils/filter-widgets'
import { cn } from '@/lib/utils'

/** Разработка + её подстраницы — где показываем дополнительный ряд чипсов. */
const DEV_CLUSTER = ['development', ...Object.keys(devSubcategories)]

/** Сколько инструментов в категории — показываем на чипсе. */
function countIn(category: string): number {
	return publicWidgets.filter(widget => widgetMatchesCategory(widget, category))
		.length
}

function hrefFor(category: string): string {
	return category === '' ? '/tools' : `/tools/${category}`
}

interface Props {
	/** '' — общий каталог. Внутри не меняется: категорию выбирают ссылкой. */
	category: string
	className?: string
}

/**
 * Ряд чипсов-категорий — настоящие ссылки на отдельные SEO-страницы, а не
 * JS-фильтр на месте (см. `CategoryHero`). Вынесено в отдельный компонент,
 * чтобы им могли пользоваться и десктопный `CategoryHero`, и мобильная
 * шторка-фильтр `MobileCatalogHeader` — в обоих случаях ссылки должны быть
 * настоящими <a>, доступными краулеру, а не появляться в DOM только после
 * клика.
 */
export function CategoryChipsNav({ category, className }: Props) {
	const chips: string[] = ['', ...Object.keys(widgetCategories)]

	return (
		<nav aria-label='Категории инструментов' className={className}>
			<ul className='flex flex-wrap gap-2'>
				{chips.map(key => {
					const active = key === category
					const chipMeta = CATEGORY_META[key as keyof typeof CATEGORY_META]

					return (
						<li key={key || 'all'}>
							<Link
								href={hrefFor(key)}
								aria-current={active ? 'page' : undefined}
								className={cn(
									'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
									active
										? 'border-primary bg-primary text-primary-foreground'
										: // accent — синий, и чипс на ховере превращался в синюю
											// плашку с тёмным текстом. Подсвечиваем только рамку.
											'border-border bg-background text-foreground hover:border-primary/50'
								)}
							>
								{chipMeta.title}
								<span className='opacity-60'>{countIn(key)}</span>
							</Link>
						</li>
					)
				})}
			</ul>

			{/* Раздел «Разработка» слил css/html/javascript в одну категорию,
			    но их страницы остались живыми — эта строка их не даёт
			    потерять: без неё до /tools/css и соседей можно дойти только
			    через sitemap. */}
			{DEV_CLUSTER.includes(category) && (
				<ul className='mt-3 flex flex-wrap gap-2'>
					{Object.entries(devSubcategories).map(([key, title]) => {
						const active = key === category
						return (
							<li key={key}>
								<Link
									href={`/tools/${key}`}
									aria-current={active ? 'page' : undefined}
									className={cn(
										'inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed px-2.5 py-1 text-xs font-medium transition-colors',
										active
											? 'border-primary text-primary'
											: 'border-border/70 text-muted-foreground hover:border-primary/50 hover:text-foreground'
									)}
								>
									{title}
									<span className='opacity-60'>{countIn(key)}</span>
								</Link>
							</li>
						)
					})}
				</ul>
			)}
		</nav>
	)
}
