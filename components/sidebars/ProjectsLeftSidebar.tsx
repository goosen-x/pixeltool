'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { widgetCategories, getWidgetByPath } from '@/lib/constants/widgets'
import { CategoriesNavigation } from './widgets/CategoriesNavigation'

type Props = { onLinkClick?: () => void }

/** Категория открытого тула — та единственная, что должна быть раскрыта. */
function getActiveCategory(pathname: string): string | null {
	const widgetPath = pathname.split('/').pop()
	const widget = widgetPath ? getWidgetByPath(widgetPath) : undefined
	return widget?.category ?? null
}

function collapseAllExcept(activeCategory: string | null): Set<string> {
	const keys = Object.keys(widgetCategories)
	return new Set(
		activeCategory ? keys.filter(key => key !== activeCategory) : keys
	)
}

export const ProjectsLeftSidebar = ({ onLinkClick }: Props = {}) => {
	const pathname = usePathname()
	const activeCategory = getActiveCategory(pathname)

	// Нет localStorage и нет чтения на клиенте после монтирования: и сервер, и
	// клиент выводят набор свёрнутых категорий из одного и того же pathname,
	// поэтому первый рендер совпадает с гидрацией — картинка не скачет.
	const [collapsed, setCollapsed] = useState<Set<string>>(() =>
		collapseAllExcept(activeCategory)
	)

	// Пересчитываем только при смене категории (переход на тул из другого
	// раздела), а не при каждой навигации: иначе ручное раскрытие соседней
	// категории сбрасывалось бы при переходе между тулами одного раздела.
	useEffect(() => {
		setCollapsed(collapseAllExcept(activeCategory))
	}, [activeCategory])

	const toggleCategory = (key: string) => {
		const next = new Set(collapsed)
		if (next.has(key)) {
			next.delete(key)
		} else {
			next.add(key)
		}
		setCollapsed(next)
	}

	return (
		<aside className='w-64 h-[calc(100dvh-var(--chrome-h,5rem))] xl:h-full shadow-[1px_0_8px_rgba(0,0,0,0.04)] bg-background xl:bg-muted/30 backdrop-blur-sm flex-shrink-0'>
			<div className='flex h-full flex-col'>
				<CategoriesNavigation
					collapsed={collapsed}
					toggleCategory={toggleCategory}
					onItemClick={onLinkClick}
				/>
			</div>
		</aside>
	)
}
