import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ZODIAC_PAGES, getZodiacPageById } from '@/lib/constants/zodiac-pages'
import { formatRange, getSignById, ZODIAC_SIGNS } from '@/lib/utils/zodiac'
import { ZodiacWidget } from '@/components/tools/ZodiacWidget'
import { ZodiacTable } from '@/components/tools/ZodiacTable'
import { FaqAccordion } from '@/components/tools/FaqAccordion'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

type Params = {
	params: Promise<{ sign: string }>
}

export async function generateMetadata(props: Params): Promise<Metadata> {
	const { sign: slug } = await props.params
	const page = getZodiacPageById(slug)

	if (!page) {
		return { title: 'Знак не найден' }
	}

	const url = `${BASE_URL}/tools/zodiac-sign/${page.id}`

	return {
		title: page.metaTitle,
		description: page.metaDescription,
		alternates: { canonical: url },
		openGraph: {
			title: page.metaTitle,
			description: page.metaDescription,
			url,
			siteName: 'PixelTool',
			type: 'website',
			locale: 'ru_RU',
			images: [
				{
					url: `${BASE_URL}/api/og?title=${encodeURIComponent(page.metaTitle)}&description=${encodeURIComponent(page.metaDescription)}&locale=ru`,
					width: 1200,
					height: 630
				}
			]
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-snippet': -1,
				'max-image-preview': 'large',
				'max-video-preview': -1
			}
		}
	}
}

export async function generateStaticParams() {
	return ZODIAC_PAGES.map(page => ({ sign: page.id }))
}

// Закрытый список слагов — ровно двенадцать знаков, больше взяться неоткуда.
// Без dynamicParams=false несуществующий слаг рендерился бы через notFound()
// внутри ISR-роута и кэшировался с кодом 200 (тот же soft-404, что чинили
// для /blog/[slug] и страниц пар единиц).
export const dynamicParams = false

export default async function ZodiacSignPage(props: Params) {
	const { sign: slug } = await props.params
	const page = getZodiacPageById(slug)
	const sign = page && getSignById(page.id)

	if (!page || !sign) {
		return notFound()
	}

	const url = `${BASE_URL}/tools/zodiac-sign/${sign.id}`
	const index = ZODIAC_SIGNS.findIndex(item => item.id === sign.id)
	// Соседи по кругу: их спрашивают чаще всего, потому что путаница
	// возникает именно на границе, а не в середине знака.
	const previous =
		ZODIAC_SIGNS[(index + ZODIAC_SIGNS.length - 1) % ZODIAC_SIGNS.length]
	const next = ZODIAC_SIGNS[(index + 1) % ZODIAC_SIGNS.length]

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		'@id': url,
		name: page.h1,
		description: page.metaDescription,
		url,
		applicationCategory: 'UtilityApplication',
		operatingSystem: 'Web Browser',
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
		isAccessibleForFree: true,
		inLanguage: 'ru'
	}

	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<Breadcrumbs
				items={[
					{ name: 'Главная', url: '/' },
					{ name: 'Инструменты', url: '/tools' },
					{ name: 'Знак зодиака по дате рождения', url: '/tools/zodiac-sign' },
					{ name: page.h1, url: `/tools/zodiac-sign/${sign.id}` }
				]}
				className='mb-6'
			/>
			<div className='mb-4'>
				<h1 className='text-balance font-heading text-2xl font-bold sm:text-3xl md:text-4xl'>
					{sign.symbol} {page.h1}
				</h1>
				<p className='mt-2 text-base text-muted-foreground sm:text-lg'>
					{formatRange(sign)}
				</p>
			</div>

			<ZodiacWidget
				initialMonth={sign.startMonth}
				initialDay={sign.startDay}
				expectedSign={sign.id}
			/>

			<div className='mx-auto mt-16 max-w-3xl space-y-8'>
				<div className='space-y-4 text-muted-foreground'>
					{page.intro.split('\n\n').map((paragraph, position) => (
						<p key={position}>{paragraph}</p>
					))}
				</div>

				<div>
					<h2 className='text-lg font-semibold'>Соседние знаки</h2>
					<div className='mt-3 flex flex-wrap gap-2'>
						{[previous, next].map(neighbour => (
							<Link
								key={neighbour.id}
								href={`/tools/zodiac-sign/${neighbour.id}`}
								className='cursor-pointer rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground'
							>
								{neighbour.symbol} {neighbour.name}, {formatRange(neighbour)}
							</Link>
						))}
					</div>
				</div>

				<div>
					<h2 className='text-lg font-semibold'>Все знаки по датам</h2>
					<div className='mt-3'>
						<ZodiacTable activeSign={sign.id} />
					</div>
				</div>

				<FaqAccordion items={page.faqs} title='Частые вопросы' withSchema />
			</div>
		</>
	)
}
