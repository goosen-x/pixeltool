import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
	geometryPagesByKind,
	getGeometryPage
} from '@/lib/constants/geometry-pages'
import { GeometryCalculator } from '@/components/tools/GeometryCalculator'
import { FaqAccordion } from '@/components/tools/FaqAccordion'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
const KIND = 'volume' as const
const HUB_PATH = 'volume-calculator'
const HUB_TITLE = 'Калькулятор объёма'

type Params = {
	params: Promise<{ shape: string }>
}

export async function generateMetadata(props: Params): Promise<Metadata> {
	const { shape } = await props.params
	const page = getGeometryPage(KIND, shape)

	if (!page) {
		return { title: 'Фигура не найдена' }
	}

	const url = `${BASE_URL}/tools/${HUB_PATH}/${page.slug}`

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
	return geometryPagesByKind(KIND).map(page => ({ shape: page.slug }))
}

// Закрытый список слагов — только проверенные Вордстатом фигуры. Без
// dynamicParams=false несуществующий слаг рендерился бы через notFound()
// внутри ISR-роута и кэшировался с кодом 200 (тот же soft-404, что чинили
// для /blog/[slug] и страниц пар единиц).
export const dynamicParams = false

export default async function GeometryShapePage(props: Params) {
	const { shape } = await props.params
	const page = getGeometryPage(KIND, shape)

	if (!page) {
		return notFound()
	}

	const url = `${BASE_URL}/tools/${HUB_PATH}/${page.slug}`
	const siblings = geometryPagesByKind(KIND).filter(
		item => item.slug !== page.slug
	)

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
					{ name: HUB_TITLE, url: `/tools/${HUB_PATH}` },
					{ name: page.h1, url: `/tools/${HUB_PATH}/${page.slug}` }
				]}
				className='mb-6'
			/>
			<div className='mb-4'>
				<h1 className='text-balance font-heading text-2xl font-bold sm:text-3xl md:text-4xl'>
					{page.h1}
				</h1>
				<p className='mt-2 text-base text-muted-foreground sm:text-lg'>
					{page.metaDescription}
				</p>
			</div>

			<GeometryCalculator kind={KIND} initialShapeId={page.shapeId} />

			<div className='mx-auto mt-16 max-w-3xl space-y-8'>
				<div className='space-y-4 text-muted-foreground'>
					{page.intro.split('\n\n').map((paragraph, index) => (
						<p key={index}>{paragraph}</p>
					))}
				</div>

				{siblings.length > 0 && (
					<div>
						<h2 className='text-lg font-semibold'>Другие фигуры</h2>
						<div className='mt-3 flex flex-wrap gap-2'>
							{siblings.map(item => (
								<Link
									key={item.slug}
									href={`/tools/${HUB_PATH}/${item.slug}`}
									className='cursor-pointer rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground'
								>
									{item.h1}
								</Link>
							))}
							<Link
								href={`/tools/${HUB_PATH}`}
								className='cursor-pointer rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground'
							>
								{HUB_TITLE}: все фигуры
							</Link>
						</div>
					</div>
				)}

				<FaqAccordion items={page.faqs} title='Частые вопросы' withSchema />
			</div>
		</>
	)
}
