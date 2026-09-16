'use client'

import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { GeometryCalculator } from '@/components/tools/GeometryCalculator'
import { AreaCalculatorSeo } from './AreaCalculatorSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
import { SubpageLinks } from '@/components/tools/SubpageLinks'
import { GEOMETRY_PAGES } from '@/lib/constants/geometry-pages'

export default function AreaCalculatorPage() {
	const widget = getWidgetById('area-calculator')!

	return (
		<WidgetSEOWrapper widget={widget}>
			<GeometryCalculator kind='area' />
			<SubpageLinks
				parentPath='area-calculator'
				title='Площадь отдельных фигур'
				items={GEOMETRY_PAGES.filter(page => page.kind === 'area').map(
					page => ({
						slug: page.slug,
						label: page.h1
					})
				)}
			/>

			<ToolScreenshot slug='area-calculator' />
			<AreaCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
