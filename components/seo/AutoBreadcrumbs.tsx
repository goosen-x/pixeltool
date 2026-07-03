'use client'

import { usePathname } from 'next/navigation'
import { Breadcrumbs } from './Breadcrumbs'
import { getBreadcrumbItems } from '@/lib/seo/breadcrumb-trail'

/**
 * Единый источник хлебных крошек для всех страниц, кроме главной.
 * Берёт текущий путь и строит трейл; рендерит видимые крошки + BreadcrumbList
 * (JSON-LD) через серверный компонент Breadcrumbs. На главной и на страницах,
 * которые рендерят крошки сами (статья блога), возвращает пустой трейл → null.
 *
 * Клиентский компонент, но в App Router он пре-рендерится на сервере, поэтому
 * разметка и JSON-LD попадают в SSR-HTML — их видят Яндекс и Google.
 */
export function AutoBreadcrumbs() {
	const pathname = usePathname()
	const items = getBreadcrumbItems(pathname)
	if (items.length === 0) return null
	return <Breadcrumbs items={items} />
}
