'use client'

import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ImageConverterWidget } from '@/components/tools/ImageConverterWidget'
import { ImageConverterSeo } from './ImageConverterSeo'

export default function ImageConverterPage() {
	const widget = getWidgetById('image-converter')!

	return (
		<WidgetSEOWrapper widget={widget}>
			<ImageConverterWidget />
			<ImageConverterSeo />
		</WidgetSEOWrapper>
	)
}
