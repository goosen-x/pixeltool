'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, Loader2 } from 'lucide-react'

export function LeadMagnetCard() {
	const pathname = usePathname()
	const [open, setOpen] = useState(false)
	const [email, setEmail] = useState('')
	const [company, setCompany] = useState('') // honeypot, должно оставаться пустым
	const [loading, setLoading] = useState(false)
	const [sent, setSent] = useState(false)
	const [error, setError] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (loading) return
		setLoading(true)
		setError('')

		try {
			const response = await fetch('/api/leads', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, company, source: pathname })
			})

			if (!response.ok) throw new Error('request failed')
			setSent(true)
		} catch {
			setError('Не получилось отправить. Попробуйте ещё раз')
		} finally {
			setLoading(false)
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={next => {
				setOpen(next)
				if (!next) {
					setTimeout(() => {
						setSent(false)
						setEmail('')
						setError('')
					}, 200)
				}
			}}
		>
			<DialogTrigger asChild>
				<button type='button' className='group block w-full cursor-pointer text-left'>
					<div className='overflow-hidden rounded-2xl border bg-card shadow-sm transition-colors hover:border-primary/40'>
						<div className='relative aspect-[4/5] w-full'>
							<Image
								src='/images/lead-magnet/card-banner.webp'
								alt=''
								fill
								priority
								sizes='320px'
								className='object-cover transition-opacity duration-500 group-hover:opacity-0'
							/>
							<Image
								src='/images/lead-magnet/card-banner-hover.webp'
								alt=''
								fill
								sizes='320px'
								className='object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100'
							/>
							<div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent' />
							<p className='pointer-events-none absolute inset-x-3 bottom-3 text-base font-semibold leading-tight text-white'>
								Шпаргалка горячих клавиш на почту →
							</p>
						</div>
					</div>
				</button>
			</DialogTrigger>

			<DialogContent className='sm:max-w-[420px]'>
				{sent ? (
					<div className='flex flex-col items-center gap-3 py-6 text-center'>
						<div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950'>
							<Check className='h-6 w-6 text-green-600 dark:text-green-400' />
						</div>
						<DialogTitle className='text-lg'>Проверьте почту</DialogTitle>
						<DialogDescription className='max-w-xs'>
							PDF со шпаргалкой горячих клавиш уже летит на {email}.
						</DialogDescription>
						<Button
							onClick={() => setOpen(false)}
							variant='outline'
							className='mt-2 cursor-pointer'
						>
							Закрыть
						</Button>
					</div>
				) : (
					<>
						<DialogHeader>
							<DialogTitle>Шпаргалка горячих клавиш</DialogTitle>
							<DialogDescription>
								PDF с горячими клавишами для Windows, macOS, браузера, Excel,
								видеозвонков и презентаций — на почту, бесплатно.
							</DialogDescription>
						</DialogHeader>

						<form onSubmit={handleSubmit} className='space-y-3'>
							<input
								type='text'
								name='company'
								value={company}
								onChange={e => setCompany(e.target.value)}
								tabIndex={-1}
								autoComplete='off'
								className='absolute h-0 w-0 opacity-0'
								aria-hidden='true'
							/>
							<Input
								type='email'
								required
								autoFocus
								placeholder='you@email.com'
								value={email}
								onChange={e => setEmail(e.target.value)}
							/>

							{error && (
								<p className='text-sm text-destructive' role='alert'>
									{error}
								</p>
							)}

							<Button
								type='submit'
								className='w-full cursor-pointer'
								disabled={loading}
							>
								{loading ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Отправляем…
									</>
								) : (
									'Получить PDF'
								)}
							</Button>

							<p className='text-[11px] text-muted-foreground'>
								Отправляя email, вы соглашаетесь с{' '}
								<Link href='/privacy' className='cursor-pointer underline'>
									политикой конфиденциальности
								</Link>
								. Без спама.
							</p>
						</form>
					</>
				)}
			</DialogContent>
		</Dialog>
	)
}
