'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer/Footer'
import { isCategoryKey } from '@/lib/constants/categories'

/**
 * Общий футер сайта — везде, кроме страниц инструментов.
 *
 * У инструмента своя раскладка: фиксированная высота и внутренняя прокрутка.
 * Полноразмерный футер снаружи распирал её и ломал сайдбар, поэтому там
 * используется CompactFooter внутри области контента.
 *
 * Каталог /tools и страницы категорий (/tools/css и подобные) — обычные
 * страницы, им общий футер нужен. Отличить их от инструмента по одному только
 * виду адреса нельзя: и там, и там это /tools/<один сегмент>, поэтому сегмент
 * сверяется со списком категорий.
 */
export function SiteFooter() {
	const pathname = usePathname()

	const match = pathname.match(/^\/tools\/([^/]+)/)
	const isWidgetPage = match !== null && !isCategoryKey(match[1])
	if (isWidgetPage) return null

	return <Footer />
}
