import { unitPairs } from '@/lib/constants/unit-pairs'
import { GEOMETRY_PAGES } from '@/lib/constants/geometry-pages'
import { ZODIAC_PAGES } from '@/lib/constants/zodiac-pages'
import { DAYS_UNTIL_PAGES } from '@/lib/constants/days-until-pages'
import { IMAGE_PAIRS } from '@/lib/constants/image-pairs'

/**
 * Реестр SEO-подстраниц — страниц вида `/tools/<тул>/<слаг>`, которые живут
 * под динамическими сегментами тулов (`unit-converter/[pair]`,
 * `zodiac-sign/[sign]` и т.д.) и потому не значатся в реестре виджетов.
 *
 * Заведён после того, как check:internal-links выдал 59 ложных ошибок: он
 * знал только про тулы, а ссылку из статьи на `/tools/unit-converter/shagi-v-km`
 * считал ссылкой на несуществующий тул. Всё, что обходит страницы сайта,
 * должно спрашивать состав подстраниц здесь, а не собирать свой список.
 */
export interface ToolSubpage {
	/** Слаг внутри родительского тула: `/tools/<parentPath>/<slug>`. */
	slug: string
	/** H1 страницы — для карт и отчётов, где нужно человеческое имя. */
	label: string
	/** Показы/мес по головной фразе, Вордстат. */
	searchVolume?: number
}

export interface ToolSubpageFamily {
	/** `Widget['path']` тула-родителя, он же первый сегмент URL. */
	parentPath: string
	items: ToolSubpage[]
}

export const TOOL_SUBPAGE_FAMILIES: ToolSubpageFamily[] = [
	{
		parentPath: 'unit-converter',
		items: unitPairs.map(p => ({
			slug: p.slug,
			label: p.h1,
			searchVolume: p.searchVolume
		}))
	},
	{
		parentPath: 'area-calculator',
		items: GEOMETRY_PAGES.filter(p => p.kind === 'area').map(p => ({
			slug: p.slug,
			label: p.h1,
			searchVolume: p.searchVolume
		}))
	},
	{
		parentPath: 'volume-calculator',
		items: GEOMETRY_PAGES.filter(p => p.kind === 'volume').map(p => ({
			slug: p.slug,
			label: p.h1,
			searchVolume: p.searchVolume
		}))
	},
	{
		parentPath: 'zodiac-sign',
		items: ZODIAC_PAGES.map(p => ({
			slug: p.id,
			label: p.h1,
			searchVolume: p.searchVolume
		}))
	},
	{
		parentPath: 'days-until',
		items: DAYS_UNTIL_PAGES.map(p => ({
			slug: p.slug,
			label: p.h1,
			searchVolume: p.searchVolume
		}))
	},
	{
		parentPath: 'image-converter',
		items: IMAGE_PAIRS.map(p => ({
			slug: p.slug,
			label: p.h1,
			searchVolume: p.searchVolume
		}))
	}
]

/**
 * Пути подстраниц без ведущего `/tools/` — в том же виде, в каком парсер
 * ссылок отдаёт слаг: `unit-converter/shagi-v-km`.
 */
export function toolSubpagePaths(): string[] {
	return TOOL_SUBPAGE_FAMILIES.flatMap(family =>
		family.items.map(item => `${family.parentPath}/${item.slug}`)
	)
}
