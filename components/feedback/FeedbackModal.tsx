'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageSquare, Bug, Lightbulb, Check, Loader2 } from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FeedbackModalProps {
	variant?: 'default' | 'sidebar'
	/** Свой триггер вместо кнопки по умолчанию — например вся карточка целиком */
	trigger?: React.ReactNode
}

type FeedbackType = 'bug' | 'feature' | 'general'

const TYPES: {
	id: FeedbackType
	icon: typeof Bug
	label: string
	titlePlaceholder: string
	bodyPlaceholder: string
	submitLabel: string
}[] = [
	{
		id: 'bug',
		icon: Bug,
		label: 'Ошибка',
		titlePlaceholder: 'Что сломалось?',
		bodyPlaceholder:
			'Что вы делали, что ожидали увидеть и что увидели вместо этого.',
		submitLabel: 'Отправить отчёт'
	},
	{
		id: 'feature',
		icon: Lightbulb,
		label: 'Идея',
		titlePlaceholder: 'Чего не хватает?',
		bodyPlaceholder: 'Какую задачу это помогло бы решить.',
		submitLabel: 'Отправить идею'
	},
	{
		id: 'general',
		icon: MessageSquare,
		label: 'Вопрос',
		titlePlaceholder: 'О чём вопрос?',
		bodyPlaceholder: 'Опишите подробнее.',
		submitLabel: 'Отправить вопрос'
	}
]

export function FeedbackModal({
	variant = 'sidebar',
	trigger
}: FeedbackModalProps) {
	const [open, setOpen] = useState(false)
	const [type, setType] = useState<FeedbackType>('bug')
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [email, setEmail] = useState('')

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [sent, setSent] = useState(false)

	const active = TYPES.find(t => t.id === type)!
	const canSubmit = title.trim() !== '' && description.trim() !== '' && !loading

	const reset = () => {
		setType('bug')
		setTitle('')
		setDescription('')
		setEmail('')
		setError('')
		setSent(false)
	}

	const submit = async () => {
		if (!canSubmit) return

		setLoading(true)
		setError('')

		try {
			const response = await fetch('/api/feedback', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type,
					title,
					description,
					email,
					widget: window.location.pathname.split('/').pop()
				})
			})

			if (!response.ok) {
				const data = await response.json().catch(() => ({}))
				throw new Error(
					data.error || 'Не удалось отправить. Попробуйте ещё раз.'
				)
			}

			// Успех показываем внутри окна, а не тостом: тост исчезает, и человек
			// не понимает, дошло ли. Здесь же видно, что будет дальше
			setSent(true)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Что-то пошло не так')
		} finally {
			setLoading(false)
		}
	}

	// Ctrl/Cmd + Enter — привычное сочетание для отправки формы из textarea
	const handleKeyDown = (event: React.KeyboardEvent) => {
		if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') submit()
	}

	if (variant !== 'sidebar') return null

	return (
		<Dialog
			open={open}
			onOpenChange={next => {
				setOpen(next)
				if (!next) setTimeout(reset, 200)
			}}
		>
			<DialogTrigger asChild>
				{trigger ?? (
					<Button variant='outline' size='sm' className='w-full justify-start'>
						<MessageSquare className='mr-2 h-4 w-4' />
						Обратная связь
					</Button>
				)}
			</DialogTrigger>

			<DialogContent className='sm:max-w-[460px]'>
				{sent ? (
					<div className='flex flex-col items-center gap-3 py-6 text-center'>
						<div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950'>
							<Check className='h-6 w-6 text-green-600 dark:text-green-400' />
						</div>

						<DialogTitle className='text-lg'>Спасибо, получили</DialogTitle>
						<DialogDescription className='max-w-xs'>
							{email
								? 'Прочитаем и ответим на почту, если потребуется.'
								: 'Прочитаем каждое сообщение — они приходят нам напрямую.'}
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
							<DialogTitle>Обратная связь</DialogTitle>
							<DialogDescription>
								Пишет живой человек — читает тоже.
							</DialogDescription>
						</DialogHeader>

						{/* Тип отзыва — сегментированный переключатель вместо вкладок:
						    вкладки подразумевают разное содержимое, а форма здесь одна */}
						<div className='grid grid-cols-3 gap-2'>
							{TYPES.map(item => {
								const Icon = item.icon
								const selected = item.id === type

								return (
									<button
										key={item.id}
										type='button'
										onClick={() => setType(item.id)}
										aria-pressed={selected}
										className={cn(
											'flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border p-3 text-xs transition-colors',
											selected
												? 'border-primary bg-primary/5 text-foreground'
												: 'text-muted-foreground hover:border-border hover:bg-muted/50'
										)}
									>
										<Icon className='h-4 w-4' />
										{item.label}
									</button>
								)
							})}
						</div>

						<div className='space-y-3'>
							<div className='space-y-1.5'>
								<Label htmlFor='fb-title'>Коротко</Label>
								<Input
									id='fb-title'
									placeholder={active.titlePlaceholder}
									value={title}
									onChange={e => setTitle(e.target.value)}
									onKeyDown={handleKeyDown}
									autoFocus
								/>
							</div>

							<div className='space-y-1.5'>
								<Label htmlFor='fb-body'>Подробности</Label>
								<Textarea
									id='fb-body'
									placeholder={active.bodyPlaceholder}
									value={description}
									onChange={e => setDescription(e.target.value)}
									onKeyDown={handleKeyDown}
									rows={4}
									className='resize-none'
								/>
							</div>

							<div className='space-y-1.5'>
								<Label htmlFor='fb-email'>
									Email
									<span className='ml-1 font-normal text-muted-foreground'>
										— если нужен ответ
									</span>
								</Label>
								<Input
									id='fb-email'
									type='email'
									placeholder='you@example.com'
									value={email}
									onChange={e => setEmail(e.target.value)}
									onKeyDown={handleKeyDown}
								/>
							</div>
						</div>

						{error && (
							<p className='text-sm text-destructive' role='alert'>
								{error}
							</p>
						)}

						<Button
							onClick={submit}
							disabled={!canSubmit}
							className='w-full cursor-pointer'
						>
							{loading ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Отправляем…
								</>
							) : (
								active.submitLabel
							)}
						</Button>
					</>
				)}
			</DialogContent>
		</Dialog>
	)
}
