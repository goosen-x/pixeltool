'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { toast } from 'sonner'

export function LeadMagnetCard() {
	const pathname = usePathname()
	const [email, setEmail] = useState('')
	const [company, setCompany] = useState('') // honeypot, должно оставаться пустым
	const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (status === 'loading') return
		setStatus('loading')

		try {
			const response = await fetch('/api/leads', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, company, source: pathname })
			})

			if (!response.ok) throw new Error('request failed')

			setStatus('sent')
			toast.success('Проверьте почту — отправили PDF')
		} catch {
			setStatus('idle')
			toast.error('Не получилось отправить. Попробуйте ещё раз')
		}
	}

	if (status === 'sent') {
		return (
			<Card className='w-full'>
				<CardContent className='pt-6 text-center'>
					<Download className='mx-auto mb-2 h-6 w-6 text-muted-foreground' />
					<p className='text-sm text-muted-foreground'>
						PDF с подборкой инструментов уже летит к вам на почту.
					</p>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className='w-full'>
			<CardHeader className='pb-2'>
				<CardTitle className='text-sm'>10 полезных инструментов</CardTitle>
			</CardHeader>
			<CardContent className='space-y-3'>
				<p className='text-xs text-muted-foreground'>
					Короткая подборка PDF на почту — какие инструменты экономят
					больше всего времени.
				</p>
				<form onSubmit={handleSubmit} className='space-y-2'>
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
						placeholder='you@email.com'
						value={email}
						onChange={e => setEmail(e.target.value)}
						className='h-9 text-sm'
					/>
					<Button
						type='submit'
						size='sm'
						className='w-full cursor-pointer'
						disabled={status === 'loading'}
					>
						{status === 'loading' ? 'Отправляем...' : 'Получить PDF'}
					</Button>
				</form>
				<p className='text-[10px] text-muted-foreground'>
					Отправляя email, вы соглашаетесь с{' '}
					<Link href='/privacy' className='cursor-pointer underline'>
						политикой конфиденциальности
					</Link>
					. Без спама.
				</p>
			</CardContent>
		</Card>
	)
}
