'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, Send } from 'lucide-react'

export default function ContactForm() {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [error, setError] = useState('')

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsSubmitting(true)
		setError('')

		const formData = new FormData(e.currentTarget)
		const data = {
			name: formData.get('name'),
			email: formData.get('email'),
			subject: formData.get('subject'),
			message: formData.get('message')
		}

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			})

			if (!response.ok) {
				const responseData = await response.json().catch(() => ({}))
				throw new Error(
					responseData.error || 'Не удалось отправить. Попробуйте ещё раз.'
				)
			}

			setIsSubmitted(true)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Что-то пошло не так')
		} finally {
			setIsSubmitting(false)
		}
	}

	if (isSubmitted) {
		return (
			<div className='text-center py-12'>
				<div className='w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4'>
					<Mail className='w-8 h-8 text-green-600 dark:text-green-400' />
				</div>
				<h3 className='text-xl font-semibold text-foreground mb-2'>
					Спасибо за сообщение!
				</h3>
				<p className='text-muted-foreground'>
					Мы ответим вам как можно скорее.
				</p>
			</div>
		)
	}

	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
				<div className='space-y-2'>
					<Label htmlFor='name'>Имя</Label>
					<Input
						id='name'
						name='name'
						type='text'
						placeholder='Ваше имя'
						required
						className='w-full'
					/>
				</div>
				<div className='space-y-2'>
					<Label htmlFor='email'>Email</Label>
					<Input
						id='email'
						name='email'
						type='email'
						placeholder='your@email.com'
						required
						className='w-full'
					/>
				</div>
			</div>

			<div className='space-y-2'>
				<Label htmlFor='subject'>Тема</Label>
				<Input
					id='subject'
					name='subject'
					type='text'
					placeholder='О чём ваше сообщение?'
					required
					className='w-full'
				/>
			</div>

			<div className='space-y-2'>
				<Label htmlFor='message'>Сообщение</Label>
				<Textarea
					id='message'
					name='message'
					placeholder='Расскажите нам о вашем проекте...'
					required
					rows={6}
					className='w-full resize-none'
				/>
			</div>

			{error && <p className='text-sm text-destructive'>{error}</p>}

			<Button
				type='submit'
				className='w-full sm:w-auto cursor-pointer'
				disabled={isSubmitting}
			>
				{isSubmitting ? (
					<div className='flex items-center gap-2'>
						<div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
						Отправляем...
					</div>
				) : (
					<div className='flex items-center gap-2'>
						<Send className='w-4 h-4' />
						Отправить сообщение
					</div>
				)}
			</Button>
		</form>
	)
}
