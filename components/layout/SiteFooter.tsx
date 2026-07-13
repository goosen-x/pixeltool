'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer/Footer'

/**
 * Общий футер сайта — везде, кроме страниц инструментов.
 *
 * У инструмента своя раскладка: фиксированная высота и внутренняя прокрутка.
 * Полноразмерный футер снаружи распирал её и ломал сайдбар, поэтому там
 * используется CompactFooter внутри области контента.
 *
 * Каталог /tools — обычная страница, ему общий футер нужен.
 */
export function SiteFooter() {
	const pathname = usePathname()

	const isWidgetPage = /^\/tools\/[^/]+/.test(pathname)
	if (isWidgetPage) return null

	return <Footer />
}
