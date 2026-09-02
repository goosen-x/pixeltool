'use client'

import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { GeometryCalculator } from '@/components/tools/GeometryCalculator'
import { VolumeCalculatorSeo } from './VolumeCalculatorSeo'

export default function VolumeCalculatorPage() {
	const widget = getWidgetById('volume-calculator')!

	return (
		<WidgetSEOWrapper widget={widget}>
			<GeometryCalculator kind='volume' />
			<VolumeCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
