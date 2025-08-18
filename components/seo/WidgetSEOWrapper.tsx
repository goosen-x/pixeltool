'use client'

import { Widget } from '@/lib/constants/widgets'
import { useTranslations } from 'next-intl'
import { WidgetStructuredData } from './WidgetStructuredData'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface WidgetSEOWrapperProps {
	widget: Widget
	children: ReactNode
}

export function WidgetSEOWrapper({ widget, children }: WidgetSEOWrapperProps) {
	const t = useTranslations('widgets')
	const pathname = usePathname()
	const locale = pathname.split('/')[1]

	const title = t(`${widget.translationKey}.title`)
	const description = t(`${widget.translationKey}.description`)

	return (
		<>
			<WidgetStructuredData
				widget={widget}
				locale={locale}
				title={title}
				description={description}
			/>
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
