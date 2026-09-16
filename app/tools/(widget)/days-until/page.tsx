'use client'

import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { DaysUntilWidget } from '@/components/tools/DaysUntilWidget'
import { DaysUntilSeo } from './DaysUntilSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
import { SubpageLinks } from '@/components/tools/SubpageLinks'
import { DAYS_UNTIL_PAGES } from '@/lib/constants/days-until-pages'

export default function DaysUntilPage() {
	const widget = getWidgetById('days-until')!

	return (
		<WidgetSEOWrapper widget={widget}>
			<DaysUntilWidget />
			<SubpageLinks
				parentPath='days-until'
				title='Готовые счётчики до популярных дат'
				items={DAYS_UNTIL_PAGES.map(page => ({
					slug: page.slug,
					label: page.h1
				}))}
			/>

			<ToolScreenshot slug='days-until' />
			<DaysUntilSeo />
		</WidgetSEOWrapper>
	)
}
