'use client'

import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ZodiacWidget } from '@/components/tools/ZodiacWidget'
import { ZodiacTable } from '@/components/tools/ZodiacTable'
import { ZodiacSignSeo } from './ZodiacSignSeo'

export default function ZodiacSignPage() {
	const widget = getWidgetById('zodiac-sign')!

	return (
		<WidgetSEOWrapper widget={widget}>
			<ZodiacWidget />

			<div className='mx-auto mt-12 max-w-3xl'>
				<h2 className='text-2xl font-bold tracking-tight'>
					Знаки зодиака по датам рождения
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Полная таблица: даты, стихия, качество и управитель каждого знака.
					Название знака ведёт на его страницу с точными границами и соседями.
				</p>
				<div className='mt-6'>
					<ZodiacTable />
				</div>
			</div>

			<ZodiacSignSeo />
		</WidgetSEOWrapper>
	)
}
