import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { widgets } from '@/lib/constants/widgets'
import { AnalyticsDashboard } from '@/components/tools/AnalyticsDashboard'

type Props = {
	params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'widgets' })

	return {
		title: `${t('analyticsDashboard.title')} | PixelTool`,
		description: t('analyticsDashboard.description'),
		openGraph: {
			title: `${t('analyticsDashboard.title')} | PixelTool`,
			description: t('analyticsDashboard.description')
		}
	}
}

export default async function AnalyticsDashboardPage({ params }: Props) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'widgets' })

	return (
		<div className='container mx-auto px-4 py-12 max-w-7xl'>
			<div className='max-w-6xl mx-auto text-center mb-8'>
				<h1 className='text-4xl font-bold mb-4'>
					{t('analyticsDashboard.title')}
				</h1>
				<p className='text-xl text-muted-foreground'>
					{t('analyticsDashboard.description')}
				</p>
			</div>

			<AnalyticsDashboard widgets={widgets} locale={locale} />
		</div>
	)
}
