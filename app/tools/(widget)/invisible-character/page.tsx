'use client'

import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { InvisiblePlatformGrid } from '@/components/tools/InvisiblePlatformGrid'
import { InvisibleCharacterCatalog } from '@/components/tools/InvisibleCharacterCatalog'
import { InvisibleCharacterSeo } from './InvisibleCharacterSeo'

export default function InvisibleCharacterPage() {
	const widget = getWidgetById('invisible-character')!

	return (
		<WidgetSEOWrapper widget={widget}>
			<InvisiblePlatformGrid />

			<InvisibleCharacterCatalog />

			<InvisibleCharacterSeo />
		</WidgetSEOWrapper>
	)
}
