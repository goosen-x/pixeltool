import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
	unitPairs,
	getUnitPairBySlug,
	type PopularValue
} from '@/lib/constants/unit-pairs'
import { convert } from '@/lib/constants/units'
import {
	formatUnitQuantity,
	unitPrepositional
} from '@/lib/constants/unit-value-labels'
import { UnitConverterWidget } from '@/components/tools/UnitConverterWidget'
import { FaqAccordion } from '@/components/tools/FaqAccordion'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

type Params = {
	params: Promise<{ pair: string; value: string }>
}

/**
 * Находит конкретное значение в pair.popularValues по строке из URL.
 * Слаг всегда генерируется как String(value) в generateStaticParams, так
 * что точное совпадение строк, а не парсинг с допуском на погрешность.
 */
function findPopularValue(
	popularValues: PopularValue[] | undefined,
	valueSlug: string
): PopularValue | undefined {
	return popularValues?.find(pv => String(pv.value) === valueSlug)
}

/** source/target по направлению, в котором реально искали число. */
function resolveDirection(
	pair: { from: string; to: string },
	pv: PopularValue
) {
	return pv.unit === 'from'
		? { sourceId: pair.from, targetId: pair.to }
		: { sourceId: pair.to, targetId: pair.from }
}

export async function generateStaticParams() {
	return unitPairs.flatMap(pair =>
		(pair.popularValues ?? []).map(pv => ({
			pair: pair.slug,
			value: String(pv.value)
		}))
	)
}

// Тот же приём, что и у родительской /[pair]: закрытый список значений,
// без dynamicParams=false несуществующее число рендерилось бы через
// notFound() внутри ISR и кэшировалось бы с кодом 200 (soft-404).
export const dynamicParams = false

export async function generateMetadata(props: Params): Promise<Metadata> {
	const { pair: pairSlug, value: valueSlug } = await props.params
	const pair = getUnitPairBySlug(pairSlug)
	const pv = findPopularValue(pair?.popularValues, valueSlug)

	if (!pair || !pv) {
		return { title: 'Значение не найдено' }
	}

	const { sourceId, targetId } = resolveDirection(pair, pv)
	const result = convert(pair.category, sourceId, targetId, pv.value)
	const sourceQty = formatUnitQuantity(pv.value, sourceId, pv.label)
	const title = `${sourceQty} ${unitPrepositional(targetId)} — сколько это`
	const description =
		result === null
			? pair.metaDescription
			: `${sourceQty} ${unitPrepositional(targetId)} — это ${formatUnitQuantity(result, targetId)}. Расчёт с той же точностью, что и в конвертере ${pair.h1.toLowerCase()}.`
	const url = `${BASE_URL}/tools/unit-converter/${pair.slug}/${valueSlug}`

	return {
		title,
		description,
		alternates: { canonical: url },
		openGraph: {
			title,
			description,
			url,
			siteName: 'PixelTool',
			type: 'website',
			locale: 'ru_RU',
			images: [
				{
					url: `${BASE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&locale=ru`,
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

export default async function UnitPairValuePage(props: Params) {
	const { pair: pairSlug, value: valueSlug } = await props.params
	const pair = getUnitPairBySlug(pairSlug)
	const pv = findPopularValue(pair?.popularValues, valueSlug)

	if (!pair || !pv) {
		return notFound()
	}

	const { sourceId, targetId } = resolveDirection(pair, pv)
	const result = convert(pair.category, sourceId, targetId, pv.value)

	if (result === null) {
		return notFound()
	}

	const sourceQty = formatUnitQuantity(pv.value, sourceId, pv.label)
	const resultQty = formatUnitQuantity(result, targetId)
	const pairUrl = `/tools/unit-converter/${pair.slug}`
	const url = `${BASE_URL}${pairUrl}/${valueSlug}`
	const h1 = `${sourceQty} ${unitPrepositional(targetId)}`

	// Остальные популярные значения той же пары — вместо «похожих пар»,
	// как на родительской странице: здесь релевантнее соседние числа той
	// же самой конвертации, а не другие единицы измерения.
	const otherValues = (pair.popularValues ?? []).filter(
		other => String(other.value) !== valueSlug
	)

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		'@id': url,
		name: h1,
		description: `${sourceQty} ${unitPrepositional(targetId)} — это ${resultQty}`,
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
					{ name: pair.h1, url: pairUrl },
					{ name: sourceQty, url: `${pairUrl}/${valueSlug}` }
				]}
				className='mb-6'
			/>
			<div className='mb-4'>
				<h1 className='text-balance text-2xl font-heading font-bold sm:text-3xl md:text-4xl'>
					{h1}
				</h1>
				<p className='mt-2 text-lg text-foreground sm:text-xl'>
					{sourceQty} {unitPrepositional(targetId)} — это{' '}
					<span className='font-semibold'>{resultQty}</span>.
				</p>
			</div>

			<UnitConverterWidget
				initialCategory={pair.category}
				initialFrom={sourceId}
				initialTo={targetId}
				initialValue={String(pv.value)}
			/>

			<div className='mx-auto mt-16 max-w-3xl space-y-8'>
				<div className='space-y-4 text-muted-foreground'>
					{pair.intro.split('\n\n').map((paragraph, index) => (
						<p key={index}>{paragraph}</p>
					))}
				</div>

				{otherValues.length > 0 && (
					<div>
						<h2 className='text-lg font-semibold'>
							Другие популярные значения
						</h2>
						<div className='mt-3 flex flex-wrap gap-2'>
							{otherValues.map(other => {
								const otherDirection = resolveDirection(pair, other)
								const otherQty = formatUnitQuantity(
									other.value,
									otherDirection.sourceId,
									other.label
								)
								return (
									<Link
										key={String(other.value)}
										href={`${pairUrl}/${String(other.value)}`}
										className='cursor-pointer rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground'
									>
										{otherQty}
									</Link>
								)
							})}
						</div>
					</div>
				)}

				<div>
					<Link
						href={pairUrl}
						className='cursor-pointer text-sm font-medium text-primary hover:underline'
					>
						← Полный конвертер {pair.h1.toLowerCase()} с любым значением
					</Link>
				</div>

				<FaqAccordion items={pair.faqs} title='Частые вопросы' withSchema />
			</div>
		</>
	)
}
