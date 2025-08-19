'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function Error({
	error,
	reset
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	const t = useTranslations('Error')

	useEffect(() => {
		// Логирование ошибки в консоль для отладки
		console.error('Server error:', error)
	}, [error])

	return (
		<div className='grid h-screen place-content-center bg-background px-4'>
			<div className='text-center max-w-lg'>
				<div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10'>
					<AlertCircle className='h-10 w-10 text-destructive' />
				</div>

				<h1 className='mb-4 text-2xl font-bold tracking-tight text-foreground sm:text-4xl'>
					{t('title')}
				</h1>

				<p className='mb-4 text-muted-foreground'>{t('description')}</p>

				{/* Показываем детали ошибки только в development */}
				{process.env.NODE_ENV === 'development' && (
					<div className='mb-6 rounded-lg bg-muted p-4 text-left'>
						<p className='mb-2 text-sm font-semibold text-foreground'>
							{t('errorDetails')}
						</p>
						<pre className='overflow-auto text-xs text-muted-foreground'>
							{error.message}
							{error.digest && (
								<>
									{'\n'}
									Digest: {error.digest}
								</>
							)}
						</pre>
					</div>
				)}

				{/* В production показываем digest для поддержки */}
				{process.env.NODE_ENV === 'production' && error.digest && (
					<p className='mb-6 text-sm text-muted-foreground'>
						{t('errorId')} <code className='font-mono'>{error.digest}</code>
					</p>
				)}

				<div className='flex gap-4 justify-center'>
					<Button onClick={reset} variant='default'>
						{t('tryAgain')}
					</Button>
					<Button asChild variant='outline'>
						<Link href='/'>{t('goHome')}</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}
