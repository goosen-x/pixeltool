'use client'

import Link from 'next/link'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { UnitConverterWidget } from '@/components/tools/UnitConverterWidget'
import { unitPairs } from '@/lib/constants/unit-pairs'
import { UnitConverterSeo } from './UnitConverterSeo'

export default function UnitConverterPage() {
	const widget = getWidgetById('unit-converter')!

	return (
		<WidgetSEOWrapper widget={widget}>
			<UnitConverterWidget />

			{/* Прямые ссылки на популярные пары — их SEO-вес несёт отдельная
			    страница /tools/unit-converter/[pair], здесь только навигация. */}
			<div className='mt-6 flex flex-wrap gap-2'>
				{unitPairs.map(pair => (
					<Link
						key={pair.slug}
						href={`/tools/unit-converter/${pair.slug}`}
						className='cursor-pointer rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground'
					>
						{pair.h1}
					</Link>
				))}
			</div>

			<UnitConverterSeo />
		</WidgetSEOWrapper>
	)
}
