'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Home, RefreshCw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ToolError({
	error,
	reset
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		// Log error to console for debugging
		console.error('Widget error:', error)
	}, [error])

	return (
		<div className='container max-w-4xl mx-auto px-4 py-16'>
			<Card className='border-destructive/50'>
				<CardHeader className='text-center pb-3'>
					<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10'>
						<AlertCircle className='h-8 w-8 text-destructive' />
					</div>
					<CardTitle className='text-2xl font-bold text-destructive'>
						Ошибка в инструменте
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-6'>
					<div className='text-center'>
						<p className='text-muted-foreground mb-2'>
							К сожалению, что-то пошло не так при загрузке инструмента.
						</p>
						{error.message && (
							<details className='mt-4'>
								<summary className='cursor-pointer text-sm text-muted-foreground hover:text-foreground'>
									Техническая информация
								</summary>
								<pre className='mt-2 rounded-md bg-muted p-4 text-left text-xs overflow-auto'>
									{error.message}
								</pre>
							</details>
						)}
					</div>

					<div className='flex flex-col sm:flex-row gap-3 justify-center'>
						<Button
							onClick={reset}
							variant='default'
							className='flex items-center gap-2'
						>
							<RefreshCw className='h-4 w-4' />
							Попробовать снова
						</Button>

						<Button
							asChild
							variant='outline'
							className='flex items-center gap-2'
						>
							<Link href='/tools'>
								<ArrowLeft className='h-4 w-4' />
								Все инструменты
							</Link>
						</Button>

						<Button
							asChild
							variant='outline'
							className='flex items-center gap-2'
						>
							<Link href='/'>
								<Home className='h-4 w-4' />
								Главная
							</Link>
						</Button>
					</div>

					<div className='text-center pt-4 border-t'>
						<p className='text-sm text-muted-foreground'>
							Если проблема повторяется, пожалуйста,{' '}
							<Link
								href='/contact'
								className='text-primary hover:underline font-medium'
							>
								свяжитесь с нами
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
