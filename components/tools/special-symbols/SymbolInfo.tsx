'use client'

import { Card } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

export function SymbolInfo() {
	const t = useTranslations('widgets.specialSymbolsPicker')

	return (
		<Card className='p-6 bg-muted/50'>
			<h3 className='font-semibold mb-3'>{t('aboutTitle')}</h3>
			<p className='text-sm text-muted-foreground mb-4'>
				{t('aboutDescription')}
			</p>

			<div className='grid md:grid-cols-2 gap-4 mt-4'>
				<div>
					<h4 className='font-medium mb-2'>{t('features.title')}</h4>
					<ul className='space-y-1 text-sm text-muted-foreground'>
						<li>• {t('features.list.collection')}</li>
						<li>• {t('features.list.categories')}</li>
						<li>• {t('features.list.copy')}</li>
						<li>• {t('features.list.recent')}</li>
					</ul>
				</div>
				<div>
					<h4 className='font-medium mb-2'>{t('tips.title')}</h4>
					<ul className='space-y-1 text-sm text-muted-foreground'>
						<li>• {t('tips.list.click')}</li>
						<li>• {t('tips.list.categories')}</li>
						<li>• {t('tips.list.apps')}</li>
						<li>• {t('tips.list.unicode')}</li>
					</ul>
				</div>
			</div>
		</Card>
	)
}
