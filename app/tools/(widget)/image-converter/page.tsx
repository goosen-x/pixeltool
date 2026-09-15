'use client'

import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ImageConverterWidget } from '@/components/tools/ImageConverterWidget'
import { ImageConverterSeo } from './ImageConverterSeo'
import { SubpageLinks } from '@/components/tools/SubpageLinks'
import { IMAGE_PAIRS } from '@/lib/constants/image-pairs'

export default function ImageConverterPage() {
	const widget = getWidgetById('image-converter')!

	return (
		<WidgetSEOWrapper widget={widget}>
			<ImageConverterWidget />
			<SubpageLinks
				parentPath='image-converter'
				title='Готовые пары форматов'
				items={IMAGE_PAIRS.map(page => ({ slug: page.slug, label: page.h1 }))}
			/>

			<ImageConverterSeo />
		</WidgetSEOWrapper>
	)
}
