'use client'

import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { DaysUntilWidget } from '@/components/tools/DaysUntilWidget'
import { DaysUntilSeo } from './DaysUntilSeo'

export default function DaysUntilPage() {
	const widget = getWidgetById('days-until')!

	return (
		<WidgetSEOWrapper widget={widget}>
			<DaysUntilWidget />
			<DaysUntilSeo />
		</WidgetSEOWrapper>
	)
}
