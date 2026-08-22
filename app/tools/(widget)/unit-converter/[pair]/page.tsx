import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { unitPairs, getUnitPairBySlug } from '@/lib/constants/unit-pairs'
import { UnitConverterWidget } from '@/components/tools/UnitConverterWidget'
import { FaqAccordion } from '@/components/tools/FaqAccordion'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

type Params = {
	params: Promise<{ pair: string }>
}

export async function generateMetadata(props: Params): Promise<Metadata> {
	const { pair: slug } = await props.params
	const pair = getUnitPairBySlug(slug)

	if (!pair) {
		return { title: 'Пара единиц не найдена' }
	}

	const url = `${BASE_URL}/tools/unit-converter/${pair.slug}`

	return {
		title: pair.metaTitle,
		description: pair.metaDescription,
		alternates: { canonical: url },
		openGraph: {
			title: pair.metaTitle,
			description: pair.metaDescription,
			url,
			siteName: 'PixelTool',
			type: 'website',
			locale: 'ru_RU',
			images: [
				{
					url: `${BASE_URL}/api/og?title=${encodeURIComponent(pair.metaTitle)}&description=${encodeURIComponent(pair.metaDescription)}&locale=ru`,
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
	return unitPairs.map(pair => ({ pair: pair.slug }))
}

// Закрытый список слагов — только проверенные по Вордстату пары, не все 491
// кандидат из merged-tool-candidates.md. Без dynamicParams=false несуществующий слаг
// рендерился бы через notFound() внутри ISR-роута и кэшировался с кодом 200
// (тот же soft-404, что уже чинили для /blog/[slug] — см. blog-soft-404).
export const dynamicParams = false

export default async function UnitPairPage(props: Params) {
	const { pair: slug } = await props.params
	const pair = getUnitPairBySlug(slug)

	if (!pair) {
		return notFound()
	}

	const url = `${BASE_URL}/tools/unit-converter/${pair.slug}`

	// Другие пары той же категории — простая и всегда актуальная перелинковка,
	// без ручного списка «связанных» пар на каждую запись.
	const relatedPairs = unitPairs
		.filter(p => p.category === pair.category && p.slug !== pair.slug)
		.slice(0, 4)

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		'@id': url,
		name: pair.h1,
		description: pair.metaDescription,
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
					{ name: 'Конвертер единиц измерения', url: '/tools/unit-converter' },
					{ name: pair.h1, url: `/tools/unit-converter/${pair.slug}` }
				]}
				className='mb-6'
			/>
			<div className='mb-4'>
				<h1 className='text-balance text-2xl font-heading font-bold sm:text-3xl md:text-4xl'>
					{pair.h1}
				</h1>
				<p className='mt-2 text-base text-muted-foreground sm:text-lg'>
					{pair.metaDescription}
				</p>
			</div>

			<UnitConverterWidget
				initialCategory={pair.category}
				initialFrom={pair.from}
				initialTo={pair.to}
			/>

			<div className='mx-auto mt-16 max-w-3xl space-y-8'>
				<div className='space-y-4 text-muted-foreground'>
					{pair.intro.split('\n\n').map((paragraph, index) => (
						<p key={index}>{paragraph}</p>
					))}
				</div>

				<FaqAccordion items={pair.faqs} title='Частые вопросы' withSchema />

				{relatedPairs.length > 0 && (
					<div>
						<h2 className='text-lg font-semibold'>Похожие пары единиц</h2>
						<div className='mt-3 flex flex-wrap gap-2'>
							{relatedPairs.map(related => (
								<Link
									key={related.slug}
									href={`/tools/unit-converter/${related.slug}`}
									className='cursor-pointer rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground'
								>
									{related.h1}
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		</>
	)
}
