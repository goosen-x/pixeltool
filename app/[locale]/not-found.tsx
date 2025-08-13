import { NotFoundImage } from '@/components/svg/NotFoundImage'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function NotFound() {
	const t = await getTranslations('NotFound')
	
	return (
		<div className='grid h-screen place-content-center bg-background px-4'>
			<div className='text-center'>
				<NotFoundImage />

				<h1 className='mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-4xl'>
					{t('title')}
				</h1>
				<p className='mt-4 text-gray-500 mb-5'>{t('description')}</p>
				<Button asChild>
					<Link href='/'>{t('backToHome')}</Link>
				</Button>
			</div>
		</div>
	)
}
