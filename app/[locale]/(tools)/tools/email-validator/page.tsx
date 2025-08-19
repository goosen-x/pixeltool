'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import {
	Mail,
	CheckCircle,
	XCircle,
	AlertCircle,
	Shield,
	Loader2,
	Copy
} from 'lucide-react'

import { WidgetLayout } from '@/components/widgets/WidgetLayout'
import { WidgetSection } from '@/components/widgets/WidgetSection'
import { WidgetInput } from '@/components/widgets/WidgetInput'
import { WidgetOutput } from '@/components/widgets/WidgetOutput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAnalytics, useWidgetKeyboard } from '@/lib/hooks'

interface EmailValidationResult {
	email: string
	isValid: boolean
	syntax: {
		valid: boolean
		username: string
		domain: string
	}
	mx: {
		exists: boolean
		records: string[]
	}
	disposable: boolean
	role: boolean
	freeProvider: boolean
	score: number
	suggestion?: string
	checks: {
		name: string
		passed: boolean
		description: string
	}[]
}

const COMMON_TYPOS: Record<string, string> = {
	'gmial.com': 'gmail.com',
	'gmai.com': 'gmail.com',
	'yahooo.com': 'yahoo.com',
	'hotmial.com': 'hotmail.com',
	'outlok.com': 'outlook.com'
}

const DISPOSABLE_DOMAINS = [
	'tempmail.com',
	'guerrillamail.com',
	'10minutemail.com',
	'mailinator.com',
	'throwaway.email',
	'yopmail.com'
]

const ROLE_EMAILS = [
	'admin',
	'info',
	'support',
	'sales',
	'contact',
	'webmaster',
	'postmaster',
	'noreply',
	'no-reply'
]

const FREE_PROVIDERS = [
	'gmail.com',
	'yahoo.com',
	'outlook.com',
	'hotmail.com',
	'mail.ru',
	'yandex.ru',
	'protonmail.com',
	'icloud.com'
]

export default function EmailValidatorPage() {
	const t = useTranslations('widgets.emailValidator')
	const { trackEvent } = useAnalytics('email-validator')

	const [email, setEmail] = useState('')
	const [results, setResults] = useState<EmailValidationResult[]>([])
	const [isValidating, setIsValidating] = useState(false)
	const [bulkEmails, setBulkEmails] = useState('')
	const [activeTab, setActiveTab] = useState('single')

	const validateEmailSyntax = (email: string) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		const parts = email.match(/^([^\s@]+)@([^\s@]+)$/)

		return {
			valid: regex.test(email),
			username: parts?.[1] || '',
			domain: parts?.[2] || ''
		}
	}

	const checkMXRecords = async (domain: string) => {
		// In real implementation, this would call an API
		// For demo, we'll simulate MX record checking
		const commonDomains = [
			'gmail.com',
			'yahoo.com',
			'outlook.com',
			'hotmail.com'
		]
		const exists = commonDomains.includes(domain) || Math.random() > 0.2

		return {
			exists,
			records: exists ? [`mx1.${domain}`, `mx2.${domain}`] : []
		}
	}

	const getSuggestion = (email: string): string | undefined => {
		const domain = email.split('@')[1]
		return COMMON_TYPOS[domain]
	}

	const validateEmail = useCallback(
		async (emailAddress: string): Promise<EmailValidationResult> => {
			const syntax = validateEmailSyntax(emailAddress)
			const domain = syntax.domain.toLowerCase()
			const username = syntax.username.toLowerCase()

			// Check MX records (simulated)
			const mx = await checkMXRecords(domain)

			// Check if disposable
			const disposable = DISPOSABLE_DOMAINS.includes(domain)

			// Check if role-based
			const role = ROLE_EMAILS.includes(username)

			// Check if free provider
			const freeProvider = FREE_PROVIDERS.includes(domain)

			// Get suggestion for typos
			const suggestion = getSuggestion(emailAddress)

			// Calculate score
			let score = 100
			if (!syntax.valid) score -= 50
			if (!mx.exists) score -= 30
			if (disposable) score -= 20
			if (role) score -= 10

			const checks = [
				{
					name: t('checks.syntax'),
					passed: syntax.valid,
					description: t('checks.syntaxDesc')
				},
				{
					name: t('checks.domain'),
					passed: mx.exists,
					description: t('checks.domainDesc')
				},
				{
					name: t('checks.disposable'),
					passed: !disposable,
					description: t('checks.disposableDesc')
				},
				{
					name: t('checks.roleEmail'),
					passed: !role,
					description: t('checks.roleEmailDesc')
				}
			]

			return {
				email: emailAddress,
				isValid: syntax.valid && mx.exists && !disposable,
				syntax,
				mx,
				disposable,
				role,
				freeProvider,
				score: Math.max(0, score),
				suggestion,
				checks
			}
		},
		[t]
	)

	const handleValidate = useCallback(async () => {
		if (!email.trim()) {
			toast.error(t('errors.emptyEmail'))
			return
		}

		setIsValidating(true)
		trackEvent('action', { action: 'email_validated', type: 'single' })

		try {
			const result = await validateEmail(email.trim())
			setResults([result])

			if (result.isValid) {
				toast.success(t('success.valid'))
			} else {
				toast.error(t('errors.invalid'))
			}
		} catch (error) {
			toast.error(t('errors.validationFailed'))
		} finally {
			setIsValidating(false)
		}
	}, [email, t, trackEvent, validateEmail])

	const handleBulkValidate = useCallback(async () => {
		const emails = bulkEmails.split('\n').filter(e => e.trim())

		if (emails.length === 0) {
			toast.error(t('errors.emptyBulk'))
			return
		}

		if (emails.length > 100) {
			toast.error(t('errors.tooMany'))
			return
		}

		setIsValidating(true)
		trackEvent('action', {
			action: 'email_validated',
			type: 'bulk',
			count: emails.length
		})

		try {
			const validationResults = await Promise.all(
				emails.map(email => validateEmail(email.trim()))
			)
			setResults(validationResults)

			const validCount = validationResults.filter(r => r.isValid).length
			toast.success(
				t('success.bulk', { valid: validCount, total: emails.length })
			)
		} catch (error) {
			toast.error(t('errors.validationFailed'))
		} finally {
			setIsValidating(false)
		}
	}, [bulkEmails, t, trackEvent, validateEmail])

	const copyToClipboard = useCallback(
		(text: string) => {
			navigator.clipboard.writeText(text)
			toast.success(t('copied'))
		},
		[t]
	)

	const exportResults = useCallback(() => {
		const csv = [
			'Email,Valid,Score,Disposable,Role,Free Provider,Suggestion',
			...results.map(
				r =>
					`${r.email},${r.isValid},${r.score},${r.disposable},${r.role},${r.freeProvider},${r.suggestion || ''}`
			)
		].join('\n')

		const blob = new Blob([csv], { type: 'text/csv' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'email-validation-results.csv'
		a.click()

		toast.success(t('exported'))
		trackEvent('export', { format: 'csv', count: results.length })
	}, [results, t, trackEvent])

	useWidgetKeyboard({
		shortcuts: [
			{
				key: 'Enter',
				description: 'Validate email',
				action: handleValidate
			},
			{
				key: 'Escape',
				description: 'Clear inputs',
				action: () => {
					setEmail('')
					setBulkEmails('')
					setResults([])
				}
			}
		],
		widgetId: 'email-validator'
	})

	const getScoreColor = (score: number) => {
		if (score >= 80) return 'text-green-600 dark:text-green-400'
		if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
		return 'text-red-600 dark:text-red-400'
	}

	const getScoreBadge = (score: number) => {
		if (score >= 80) return 'success'
		if (score >= 60) return 'warning'
		return 'destructive'
	}

	return (
		<WidgetLayout>
			<WidgetSection title={t('sections.input')}>
				<div className='text-center space-y-2 mb-6'>
					<div className='flex items-center justify-center gap-2 text-primary'>
						<Mail className='h-8 w-8' />
						<h1 className='text-3xl font-bold'>{t('title')}</h1>
					</div>
					<p className='text-muted-foreground'>{t('description')}</p>
				</div>

				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='single'>{t('tabs.single')}</TabsTrigger>
						<TabsTrigger value='bulk'>{t('tabs.bulk')}</TabsTrigger>
					</TabsList>

					<TabsContent value='single' className='space-y-4'>
						<WidgetInput
							label={t('single.label')}
							description={t('single.description')}
						>
							<div className='flex gap-2'>
								<Input
									type='email'
									value={email}
									onChange={e => setEmail(e.target.value)}
									placeholder={t('placeholder')}
									className='flex-1'
									disabled={isValidating}
									aria-label={t('placeholder')}
								/>
								<Button
									onClick={handleValidate}
									disabled={!email.trim() || isValidating}
								>
									{isValidating ? (
										<Loader2 className='h-4 w-4 animate-spin' />
									) : (
										<Shield className='h-4 w-4' />
									)}
									<span className='ml-2'>{t('validate')}</span>
								</Button>
							</div>
						</WidgetInput>
					</TabsContent>

					<TabsContent value='bulk' className='space-y-4'>
						<WidgetInput
							label={t('bulk.label')}
							description={t('bulk.description')}
						>
							<div className='space-y-2'>
								<textarea
									value={bulkEmails}
									onChange={e => setBulkEmails(e.target.value)}
									placeholder={t('bulkPlaceholder')}
									className='w-full min-h-[150px] p-3 rounded-md border bg-background resize-y'
									disabled={isValidating}
									aria-label={t('bulkPlaceholder')}
								/>
								<div className='flex justify-between items-center'>
									<span className='text-sm text-muted-foreground'>
										{t('emailCount', {
											count: bulkEmails.split('\n').filter(e => e.trim()).length
										})}
									</span>
									<Button
										onClick={handleBulkValidate}
										disabled={!bulkEmails.trim() || isValidating}
									>
										{isValidating ? (
											<Loader2 className='h-4 w-4 animate-spin' />
										) : (
											<Shield className='h-4 w-4' />
										)}
										<span className='ml-2'>{t('validateAll')}</span>
									</Button>
								</div>
							</div>
						</WidgetInput>
					</TabsContent>
				</Tabs>
			</WidgetSection>

			{results.length > 0 && (
				<WidgetSection title={t('sections.results')}>
					<WidgetOutput>
						<div className='space-y-4'>
							<div className='flex justify-between items-center'>
								<h3 className='text-lg font-semibold'>{t('results')}</h3>
								{results.length > 1 && (
									<Button onClick={exportResults} variant='outline' size='sm'>
										{t('export')}
									</Button>
								)}
							</div>

							{results.map((result, index) => (
								<Card key={index} className='p-4 space-y-4'>
									<div className='flex items-start justify-between'>
										<div className='space-y-1'>
											<div className='flex items-center gap-2'>
												{result.isValid ? (
													<CheckCircle className='h-5 w-5 text-green-600' />
												) : (
													<XCircle className='h-5 w-5 text-red-600' />
												)}
												<span className='font-mono text-sm'>
													{result.email}
												</span>
												<Button
													variant='ghost'
													size='sm'
													onClick={() => copyToClipboard(result.email)}
												>
													<Copy className='h-3 w-3' />
												</Button>
											</div>

											{result.suggestion && (
												<div className='flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400'>
													<AlertCircle className='h-4 w-4' />
													<span>
														{t('suggestion')}: {result.suggestion}
													</span>
												</div>
											)}
										</div>

										<div className='flex items-center gap-2'>
											<span
												className={`text-2xl font-bold ${getScoreColor(result.score)}`}
											>
												{result.score}
											</span>
											<Badge variant={getScoreBadge(result.score) as any}>
												{result.score >= 80
													? t('quality.high')
													: result.score >= 60
														? t('quality.medium')
														: t('quality.low')}
											</Badge>
										</div>
									</div>

									<div className='space-y-2'>
										<Progress value={result.score} className='h-2' />

										<div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
											{result.checks.map((check, i) => (
												<div
													key={i}
													className='flex items-center gap-1 text-sm'
												>
													{check.passed ? (
														<CheckCircle className='h-4 w-4 text-green-600' />
													) : (
														<XCircle className='h-4 w-4 text-red-600' />
													)}
													<span
														className={
															check.passed ? '' : 'text-muted-foreground'
														}
													>
														{check.name}
													</span>
												</div>
											))}
										</div>

										<div className='flex flex-wrap gap-2 text-xs'>
											{result.disposable && (
												<Badge variant='destructive'>
													{t('flags.disposable')}
												</Badge>
											)}
											{result.role && (
												<Badge variant='secondary'>{t('flags.role')}</Badge>
											)}
											{result.freeProvider && (
												<Badge variant='outline'>{t('flags.free')}</Badge>
											)}
										</div>
									</div>
								</Card>
							))}

							{results.length > 1 && (
								<Card className='p-4 bg-muted/50'>
									<div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
										<div>
											<div className='text-2xl font-bold text-green-600'>
												{results.filter(r => r.isValid).length}
											</div>
											<div className='text-sm text-muted-foreground'>
												{t('stats.valid')}
											</div>
										</div>
										<div>
											<div className='text-2xl font-bold text-red-600'>
												{results.filter(r => !r.isValid).length}
											</div>
											<div className='text-sm text-muted-foreground'>
												{t('stats.invalid')}
											</div>
										</div>
										<div>
											<div className='text-2xl font-bold text-yellow-600'>
												{results.filter(r => r.disposable).length}
											</div>
											<div className='text-sm text-muted-foreground'>
												{t('stats.disposable')}
											</div>
										</div>
										<div>
											<div className='text-2xl font-bold'>
												{Math.round(
													results.reduce((acc, r) => acc + r.score, 0) /
														results.length
												)}
											</div>
											<div className='text-sm text-muted-foreground'>
												{t('stats.avgScore')}
											</div>
										</div>
									</div>
								</Card>
							)}
						</div>
					</WidgetOutput>
				</WidgetSection>
			)}
		</WidgetLayout>
	)
}
