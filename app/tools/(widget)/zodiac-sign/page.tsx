'use client'

import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ZodiacWidget } from '@/components/tools/ZodiacWidget'
import { ZodiacTable } from '@/components/tools/ZodiacTable'
import { ZodiacSignSeo } from './ZodiacSignSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
import { SubpageLinks } from '@/components/tools/SubpageLinks'
import { ZODIAC_PAGES } from '@/lib/constants/zodiac-pages'

export default function ZodiacSignPage() {
	const widget = getWidgetById('zodiac-sign')!

	return (
		<WidgetSEOWrapper widget={widget}>
			{/* Таблица идёт первой, а не после калькулятора. По выгрузке запросов
			    за 02–15.09.2026 весь верх спроса — справочник во множественном
			    числе: «знаки зодиака по датам» 3215 показов, «по месяцам» 733,
			    «даты знаков зодиака» 520. Запрос «знак зодиака по дате рождения»,
			    под который страница была названа, даёт 86 — в тридцать семь раз
			    меньше головного. Человек искал таблицу и первым экраном получал
			    форму ввода. */}
			<div className='mx-auto max-w-3xl'>
				<p className='text-muted-foreground'>
					Даты, стихия, качество и управитель каждого знака. Название знака
					ведёт на его страницу с точными границами и соседями, а ниже можно
					определить знак по своей дате рождения.
				</p>
				<div className='mt-6'>
					<ZodiacTable />
				</div>
			</div>

			<div className='mx-auto mt-12 max-w-3xl'>
				<h2 className='text-2xl font-bold tracking-tight'>
					Определить знак по дате рождения
				</h2>
			</div>
			<ZodiacWidget />

			<SubpageLinks
				parentPath='zodiac-sign'
				title='Отдельная страница по каждому знаку'
				items={ZODIAC_PAGES.map(page => ({ slug: page.id, label: page.h1 }))}
			/>

			<ToolScreenshot slug='zodiac-sign' />
			<ZodiacSignSeo />
		</WidgetSEOWrapper>
	)
}
