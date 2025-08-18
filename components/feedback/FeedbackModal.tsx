'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { MessageSquare, Bug, Lightbulb, Send } from 'lucide-react'
import { toast } from 'sonner'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

interface FeedbackModalProps {
	variant?: 'default' | 'sidebar'
}

type FeedbackType = 'bug' | 'feature' | 'general'

interface FeedbackData {
	type: FeedbackType
	title: string
	description: string
	email?: string
	widget?: string
}

export function FeedbackModal({ variant = 'sidebar' }: FeedbackModalProps) {
	const t = useTranslations('Feedback')
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const [formData, setFormData] = useState<FeedbackData>({
		type: 'bug',
		title: '',
		description: '',
		email: '',
		widget: ''
	})

	const handleSubmit = async (type: FeedbackType) => {
		if (!formData.title.trim() || !formData.description.trim()) {
			toast.error(t('validation.required'))
			return
		}

		setLoading(true)

		try {
			const response = await fetch('/api/feedback', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					...formData,
					type,
					widget: window.location.pathname.split('/').pop() // Get current widget name
				})
			})

			if (!response.ok) {
				throw new Error('Failed to submit feedback')
			}

			const result = await response.json()
			console.log('Feedback submitted successfully:', result)

			toast.success(t('success.submitted'))
			setFormData({
				type: 'bug',
				title: '',
				description: '',
				email: '',
				widget: ''
			})
			setOpen(false)
		} catch (error) {
			console.error('Error submitting feedback:', error)
			toast.error(t('error.failed'))
		} finally {
			setLoading(false)
		}
	}

	const updateFormData = (field: keyof FeedbackData, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	const renderForm = (type: FeedbackType) => (
		<div className='space-y-4'>
			<Input
				placeholder={t(`placeholders.${type}.title`)}
				value={formData.title}
				onChange={e => updateFormData('title', e.target.value)}
			/>

			<Textarea
				placeholder={t(`placeholders.${type}.description`)}
				value={formData.description}
				onChange={e => updateFormData('description', e.target.value)}
				rows={4}
			/>

			<Input
				type='email'
				placeholder={t('placeholders.email')}
				value={formData.email}
				onChange={e => updateFormData('email', e.target.value)}
			/>

			<Button
				onClick={() => handleSubmit(type)}
				disabled={
					loading || !formData.title.trim() || !formData.description.trim()
				}
				className='w-full'
			>
				{loading ? (
					<div className='flex items-center gap-2'>
						<div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
						{t('states.sending')}
					</div>
				) : (
					<div className='flex items-center gap-2'>
						<Send className='w-4 h-4' />
						{t('actions.submit')}
					</div>
				)}
			</Button>
		</div>
	)

	if (variant === 'sidebar') {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant='outline' size='sm' className='w-full justify-start'>
						<MessageSquare className='w-4 h-4 mr-2' />
						{t('title')}
					</Button>
				</DialogTrigger>
				<DialogContent className='sm:max-w-[500px]'>
					<DialogHeader>
						<DialogTitle>{t('title')}</DialogTitle>
						<DialogDescription>{t('description')}</DialogDescription>
					</DialogHeader>

					<Tabs defaultValue='bug' className='w-full'>
						<TabsList className='grid w-full grid-cols-3'>
							<TabsTrigger value='bug' className='flex items-center gap-1'>
								<Bug className='w-3 h-3' />
								<span className='hidden sm:inline'>{t('tabs.bug')}</span>
							</TabsTrigger>
							<TabsTrigger value='feature' className='flex items-center gap-1'>
								<Lightbulb className='w-3 h-3' />
								<span className='hidden sm:inline'>{t('tabs.feature')}</span>
							</TabsTrigger>
							<TabsTrigger value='general' className='flex items-center gap-1'>
								<MessageSquare className='w-3 h-3' />
								<span className='hidden sm:inline'>{t('tabs.general')}</span>
							</TabsTrigger>
						</TabsList>

						<TabsContent value='bug' className='space-y-4'>
							<div className='text-sm text-muted-foreground'>
								{t('descriptions.bug')}
							</div>
							{renderForm('bug')}
						</TabsContent>

						<TabsContent value='feature' className='space-y-4'>
							<div className='text-sm text-muted-foreground'>
								{t('descriptions.feature')}
							</div>
							{renderForm('feature')}
						</TabsContent>

						<TabsContent value='general' className='space-y-4'>
							<div className='text-sm text-muted-foreground'>
								{t('descriptions.general')}
							</div>
							{renderForm('general')}
						</TabsContent>
					</Tabs>
				</DialogContent>
			</Dialog>
		)
	}

	return null
}
