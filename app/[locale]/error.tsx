'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, Copy, Check } from 'lucide-react'
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
	const [copied, setCopied] = useState(false)

	useEffect(() => {
		// Логирование ошибки в консоль для отладки
		console.error('Server error:', error)
	}, [error])

	const copyErrorDetails = async () => {
		const errorText = `Error: ${error.message}${
			error.digest ? `\nDigest: ${error.digest}` : ''
		}\nStack: ${error.stack || 'No stack trace available'}`

		try {
			await navigator.clipboard.writeText(errorText)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error('Failed to copy error details:', err)
		}
	}

	const handleReset = () => {
		console.log('Try again button clicked')
		try {
			reset()
		} catch (err) {
			console.error('Reset failed:', err)
			// Fallback: перезагрузка страницы
			window.location.reload()
		}
	}

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
					<div className='mb-6 rounded-lg bg-muted p-4 text-left relative'>
						<div className='flex items-center justify-between mb-2'>
							<p className='text-sm font-semibold text-foreground'>
								{t('errorDetails')}
							</p>
							<Button
								variant='ghost'
								size='sm'
								onClick={copyErrorDetails}
								className='h-8 px-2'
							>
								{copied ? (
									<Check className='h-4 w-4 text-green-500' />
								) : (
									<Copy className='h-4 w-4' />
								)}
							</Button>
						</div>
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
					<div className='mb-6 flex items-center gap-2 justify-center'>
						<p className='text-sm text-muted-foreground'>
							{t('errorId')} <code className='font-mono'>{error.digest}</code>
						</p>
						<Button
							variant='ghost'
							size='sm'
							onClick={copyErrorDetails}
							className='h-8 px-2'
						>
							{copied ? (
								<Check className='h-4 w-4 text-green-500' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
					</div>
				)}

				<div className='flex gap-4 justify-center'>
					<Button onClick={handleReset} variant='default'>
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
