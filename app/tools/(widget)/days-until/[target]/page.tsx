import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
	DAYS_UNTIL_PAGES,
	getDaysUntilPage
} from '@/lib/constants/days-until-pages'
import { DaysUntilWidget } from '@/components/tools/DaysUntilWidget'
import { FaqAccordion } from '@/components/tools/FaqAccordion'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

type Params = { params: Promise<{ target: string }> }

export async function generateMetadata(props: Params): Promise<Metadata> {
	const { target } = await props.params
	const page = getDaysUntilPage(target)
	if (!page) return { title: 'Дата не найдена' }

	const url = `${BASE_URL}/tools/days-until/${page.slug}`
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
	return DAYS_UNTIL_PAGES.map(page => ({ target: page.slug }))
}

// Закрытый список слагов — иначе несуществующая дата кэшировалась бы с
// кодом 200 (тот же soft-404, что чинили для блога и пар единиц).
export const dynamicParams = false

export default async function DaysUntilTargetPage(props: Params) {
	const { target } = await props.params
	const page = getDaysUntilPage(target)
	if (!page) return notFound()

	const url = `${BASE_URL}/tools/days-until/${page.slug}`
	const siblings = DAYS_UNTIL_PAGES.filter(item => item.slug !== page.slug)

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
					{ name: 'Сколько дней до даты', url: '/tools/days-until' },
					{ name: page.h1, url: `/tools/days-until/${page.slug}` }
				]}
				className='mb-6'
			/>
			<div className='mb-4'>
				<h1 className='text-balance font-heading text-2xl font-bold sm:text-3xl md:text-4xl'>
					{page.h1}
				</h1>
			</div>

			<DaysUntilWidget initialSlug={page.slug} />

			<div className='mx-auto mt-16 max-w-3xl space-y-8'>
				<div className='space-y-4 text-muted-foreground'>
					{page.intro.split('\n\n').map((paragraph, index) => (
						<p key={index}>{paragraph}</p>
					))}
				</div>

				<div>
					<h2 className='text-lg font-semibold'>Другие даты</h2>
					<div className='mt-3 flex flex-wrap gap-2'>
						{siblings.map(item => (
							<Link
								key={item.slug}
								href={`/tools/days-until/${item.slug}`}
								className='cursor-pointer rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground'
							>
								{item.h1}
							</Link>
						))}
						<Link
							href='/tools/days-until'
							className='cursor-pointer rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground'
						>
							Любая своя дата
						</Link>
					</div>
				</div>

				<FaqAccordion items={page.faqs} title='Частые вопросы' withSchema />
			</div>
		</>
	)
}
