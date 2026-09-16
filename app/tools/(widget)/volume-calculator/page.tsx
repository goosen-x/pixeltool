'use client'

import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { GeometryCalculator } from '@/components/tools/GeometryCalculator'
import { VolumeCalculatorSeo } from './VolumeCalculatorSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
import { SubpageLinks } from '@/components/tools/SubpageLinks'
import { GEOMETRY_PAGES } from '@/lib/constants/geometry-pages'

export default function VolumeCalculatorPage() {
	const widget = getWidgetById('volume-calculator')!

	return (
		<WidgetSEOWrapper widget={widget}>
			<GeometryCalculator kind='volume' />
			<SubpageLinks
				parentPath='volume-calculator'
				title='Объём отдельных фигур'
				items={GEOMETRY_PAGES.filter(page => page.kind === 'volume').map(
					page => ({
						slug: page.slug,
						label: page.h1
					})
				)}
			/>

			<ToolScreenshot slug='volume-calculator' />
			<VolumeCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
