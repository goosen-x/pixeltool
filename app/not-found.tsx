import { NotFoundImage } from '@/components/svg/NotFoundImage'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: '404 - Страница не найдена | PixelTool',
	description:
		'К сожалению, запрашиваемая страница не существует. Вернитесь на главную страницу PixelTool.'
}

// Force dynamic rendering to avoid build-time errors
export const dynamic = 'force-dynamic'

export default async function NotFound() {
	return (
		<div className='grid h-screen place-content-center bg-background px-4'>
			<div className='text-center'>
				<NotFoundImage />

				<h1 className='mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-4xl'>
					Страница не найдена
				</h1>
				<p className='mt-4 text-gray-500 mb-5'>
					К сожалению, запрашиваемая страница не существует.
				</p>
				<Button asChild>
					<Link href='/'>Вернуться на главную</Link>
				</Button>
			</div>
		</div>
	)
}
