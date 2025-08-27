import { Card } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

export function EmojiInfo() {
	const t = useTranslations('widgets.emojiList')
	
	return (
		<Card className='p-6 bg-muted/50'>
			<h3 className='font-semibold mb-3'>{t('aboutTitle')}</h3>
			<div className='grid md:grid-cols-2 gap-4 text-sm text-muted-foreground'>
				<div>
					<h4 className='font-medium text-foreground mb-2'>{t('howToUse')}</h4>
					<ul className='space-y-1'>
						<li>• {t('howToUseList.copy')}</li>
						<li>• {t('howToUseList.download')}</li>
						<li>• {t('howToUseList.search')}</li>
						<li>• {t('howToUseList.browse')}</li>
						<li>• {t('howToUseList.recent')}</li>
					</ul>
				</div>
				<div>
					<h4 className='font-medium text-foreground mb-2'>{t('features')}</h4>
					<ul className='space-y-1'>
						<li>• {t('featuresList.count')}</li>
						<li>• {t('featuresList.instantCopy')}</li>
						<li>• {t('featuresList.downloadPng')}</li>
						<li>• {t('featuresList.recentHistory')}</li>
						<li>• {t('featuresList.compatibility')}</li>
					</ul>
				</div>
			</div>
			<p className='text-xs mt-4'>
				{t('compatibilityNote')}
			</p>
			<div className='mt-4 p-4 bg-background rounded-lg'>
				<h4 className='font-medium text-foreground mb-2 text-sm'>
					{t('usingSocialMedia')}
				</h4>
				<p className='text-xs'>
					{t('socialMediaDescription')}
				</p>
			</div>
		</Card>
	)
}
