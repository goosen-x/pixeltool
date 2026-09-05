import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { IMAGE_PAIRS, getImagePair } from '@/lib/constants/image-pairs'
import { ImageConverterWidget } from '@/components/tools/ImageConverterWidget'
import { FaqAccordion } from '@/components/tools/FaqAccordion'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

type Params = { params: Promise<{ pair: string }> }

export async function generateMetadata(props: Params): Promise<Metadata> {
	const { pair } = await props.params
	const page = getImagePair(pair)
	if (!page) return { title: 'Пара форматов не найдена' }

	const url = `${BASE_URL}/tools/image-converter/${page.slug}`
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
	return IMAGE_PAIRS.map(p => ({ pair: p.slug }))
}

// Закрытый список слагов — иначе несуществующая пара кэшировалась бы с кодом
// 200 (тот же soft-404, что чинили для блога и пар единиц).
export const dynamicParams = false

export default async function ImagePairPage(props: Params) {
	const { pair } = await props.params
	const page = getImagePair(pair)
	if (!page) return notFound()

	const url = `${BASE_URL}/tools/image-converter/${page.slug}`
	const siblings = IMAGE_PAIRS.filter(p => p.slug !== page.slug)

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
					{ name: 'Конвертер изображений', url: '/tools/image-converter' },
					{ name: page.h1, url: `/tools/image-converter/${page.slug}` }
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

			<ImageConverterWidget initialTarget={page.target} />

			<div className='mx-auto mt-16 max-w-3xl space-y-8'>
				<div className='space-y-4 text-muted-foreground'>
					{page.intro.split('\n\n').map((paragraph, index) => (
						<p key={index}>{paragraph}</p>
					))}
				</div>

				<div>
					<h2 className='text-lg font-semibold'>Другие форматы</h2>
					<div className='mt-3 flex flex-wrap gap-2'>
						{siblings.map(item => (
							<Link
								key={item.slug}
								href={`/tools/image-converter/${item.slug}`}
								className='cursor-pointer rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground'
							>
								{item.h1}
							</Link>
						))}
						<Link
							href='/tools/image-converter'
							className='cursor-pointer rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground'
						>
							Любые форматы
						</Link>
					</div>
				</div>

				<FaqAccordion items={page.faqs} title='Частые вопросы' withSchema />
			</div>
		</>
	)
}
