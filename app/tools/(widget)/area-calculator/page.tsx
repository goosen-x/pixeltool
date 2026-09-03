'use client'

import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { GeometryCalculator } from '@/components/tools/GeometryCalculator'
import { AreaCalculatorSeo } from './AreaCalculatorSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

export default function AreaCalculatorPage() {
	const widget = getWidgetById('area-calculator')!

	return (
		<WidgetSEOWrapper widget={widget}>
			<GeometryCalculator kind='area' />
			<ToolScreenshot slug='area-calculator' />
			<AreaCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
