'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		// Логирование критической ошибки
		console.error('Critical error:', error)
	}, [error])

	return (
		<html>
			<body>
				<div className='grid h-screen place-content-center bg-background px-4'>
					<div className='text-center max-w-lg'>
						<div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100'>
							<AlertTriangle className='h-10 w-10 text-red-600' />
						</div>

						<h1 className='mb-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
							Critical Error
						</h1>
						
						<p className='mb-4 text-gray-600'>
							A critical error occurred. Our team has been notified.
						</p>

						{/* Показываем digest для поддержки */}
						{error.digest && (
							<p className='mb-6 text-sm text-gray-500'>
								Error ID: <code className='font-mono'>{error.digest}</code>
							</p>
						)}

						<div className='flex gap-4 justify-center'>
							<Button onClick={reset} className='bg-blue-600 hover:bg-blue-700 text-white'>
								Try again
							</Button>
							<Button 
								className='bg-gray-200 hover:bg-gray-300 text-gray-900' 
								onClick={() => window.location.href = '/'}
							>
								Go home
							</Button>
						</div>
					</div>
				</div>
			</body>
		</html>
	)
}