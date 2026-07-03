'use client'

import { Widget } from '@/lib/constants/widgets'
import { ReactNode } from 'react'

interface WidgetSEOWrapperProps {
	widget: Widget
	children: ReactNode
}

// Структурную JSON-LD разметку инструмента рендерит ProjectsLayoutWrapper
// (серверный WidgetStructuredData) — здесь оставляем только микроразметку
// itemScope/itemProp вокруг контента, без дублирующего JSON-LD.
export function WidgetSEOWrapper({ widget, children }: WidgetSEOWrapperProps) {
	// Get title and description directly from widget data
	const title = widget.title || widget.id
	const description = widget.description || 'Инструмент для веб-разработки'

	return (
		<>
			<article
				className='w-full h-full'
				itemScope
				itemType='https://schema.org/SoftwareApplication'
			>
				<header className='sr-only'>
					<h1 itemProp='name'>{title}</h1>
					<p itemProp='description'>{description}</p>
					<meta itemProp='applicationCategory' content='WebApplication' />
					<meta itemProp='operatingSystem' content='Web Browser' />
				</header>

				<div
					itemProp='offers'
					itemScope
					itemType='https://schema.org/Offer'
					className='hidden'
				>
					<meta itemProp='price' content='0' />
					<meta itemProp='priceCurrency' content='USD' />
				</div>

				<section
					className='h-full'
					itemProp='mainEntity'
					itemScope
					itemType='https://schema.org/WebApplication'
				>
					{children}
				</section>
			</article>
		</>
	)
}
