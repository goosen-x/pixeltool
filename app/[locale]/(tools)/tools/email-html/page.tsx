'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Eye, Code, Link, Mail, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function EmailHtmlPage() {
	const [email, setEmail] = useState('example@gmail.com')
	const [linkText, setLinkText] = useState('свяжитесь с нами')
	const [linkTitle, setLinkTitle] = useState('')

	const baseUrl =
		typeof window !== 'undefined'
			? window.location.origin
			: 'https://your-domain.com'
	const encodedEmail = encodeURIComponent(email)
	const generatedUrl = `${baseUrl}/email-html/show/?text=${encodedEmail}`

	const htmlCode = `<a href="${generatedUrl}" target="_blank"${linkTitle ? ` title="${linkTitle}"` : ''}>${linkText}</a>`

	const copyToClipboard = (text: string, type: string) => {
		navigator.clipboard.writeText(text)
		toast.success(`${type} скопирован в буфер обмена!`)
	}

	const isValidEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return emailRegex.test(email)
	}

	return (
		<div className='max-w-6xl mx-auto space-y-8'>
			{/* Problem Description */}
			<Card className='p-6 bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800'>
				<div className='flex items-start gap-3'>
					<Mail className='w-5 h-5 text-yellow-600 mt-0.5' />
					<div className='space-y-2'>
						<h3 className='font-semibold text-yellow-800 dark:text-yellow-200'>
							Проблема с mailto: ссылками
						</h3>
						<p className='text-sm text-yellow-700 dark:text-yellow-300'>
							Вы еще используете старый «mailto:» формат HTML? Это бесполезно,
							потому что большинство посетителей не имеют локального почтового
							клиентского программного обеспечения.
						</p>
						<p className='text-sm text-yellow-700 dark:text-yellow-300'>
							<strong>Решение:</strong> Используйте современные ссылки с
							функцией автоматического копирования email-адреса.
						</p>
					</div>
				</div>
			</Card>

			{/* Input Form */}
			<Card className='p-6'>
				<div className='space-y-6'>
					<div className='grid md:grid-cols-2 gap-6'>
						<div className='space-y-2'>
							<Label htmlFor='email'>Отправить по электронной почте:</Label>
							<div className='relative'>
								<Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
								<Input
									id='email'
									value={email}
									onChange={e => setEmail(e.target.value)}
									placeholder='example@gmail.com'
									className={cn(
										'pl-10',
										!isValidEmail(email) && email && 'border-red-500'
									)}
								/>
							</div>
							{email && !isValidEmail(email) && (
								<p className='text-sm text-red-500'>
									Введите корректный email-адрес
								</p>
							)}
						</div>

						<div className='space-y-2'>
							<Label htmlFor='linkText'>Название ссылки:</Label>
							<Input
								id='linkText'
								value={linkText}
								onChange={e => setLinkText(e.target.value)}
								placeholder='свяжитесь с нами'
							/>
						</div>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='linkTitle'>
							Название ссылки в электронной почте: (Необязательно)
						</Label>
						<Input
							id='linkTitle'
							value={linkTitle}
							onChange={e => setLinkTitle(e.target.value)}
							placeholder='Кликните для копирования email-адреса'
						/>
					</div>
				</div>
			</Card>

			{/* Generated Results */}
			{isValidEmail(email) && (
				<Card className='p-6'>
					<h3 className='font-semibold mb-4'>Результат:</h3>

					<Tabs defaultValue='html' className='space-y-4'>
						<TabsList>
							<TabsTrigger value='html'>
								<Code className='w-4 h-4 mr-2' />
								HTML код
							</TabsTrigger>
							<TabsTrigger value='link'>
								<Link className='w-4 h-4 mr-2' />
								Только ссылка
							</TabsTrigger>
							<TabsTrigger value='preview'>
								<Eye className='w-4 h-4 mr-2' />
								Предварительный просмотр
							</TabsTrigger>
						</TabsList>

						<TabsContent value='html' className='space-y-4'>
							<div>
								<div className='flex items-center justify-between mb-2'>
									<Label>HTML</Label>
									<Button
										onClick={() => copyToClipboard(htmlCode, 'HTML код')}
										size='sm'
										variant='outline'
									>
										<Copy className='w-4 h-4 mr-2' />
										Копировать
									</Button>
								</div>
								<Textarea
									value={htmlCode}
									readOnly
									className='font-mono text-sm'
									rows={3}
								/>
							</div>
						</TabsContent>

						<TabsContent value='link' className='space-y-4'>
							<div>
								<div className='flex items-center justify-between mb-2'>
									<Label>только ссылку</Label>
									<Button
										onClick={() => copyToClipboard(generatedUrl, 'Ссылка')}
										size='sm'
										variant='outline'
									>
										<Copy className='w-4 h-4 mr-2' />
										Копировать
									</Button>
								</div>
								<Textarea
									value={generatedUrl}
									readOnly
									className='font-mono text-sm'
									rows={2}
								/>
							</div>
						</TabsContent>

						<TabsContent value='preview' className='space-y-4'>
							<div>
								<Label>Предварительный просмотр</Label>
								<div className='border rounded-lg p-4 bg-muted/30 mt-2'>
									<p className='text-sm text-muted-foreground mb-2'>ссылка:</p>
									<a
										href={generatedUrl}
										target='_blank'
										rel='noopener noreferrer'
										className='text-primary hover:underline inline-flex items-center gap-1'
										title={linkTitle || `Email: ${email}`}
									>
										{linkText}
										<ExternalLink className='w-3 h-3' />
									</a>
									<p className='text-sm text-muted-foreground mt-2'>
										ссылка на: <Badge variant='outline'>{email}</Badge>
									</p>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</Card>
			)}

			{/* How it Works */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-3'>Как это работает</h3>
				<div className='space-y-3 text-sm text-muted-foreground'>
					<div className='grid md:grid-cols-2 gap-4'>
						<div>
							<h4 className='font-medium text-foreground mb-2'>
								Проблемы с mailto:
							</h4>
							<ul className='space-y-1 text-xs'>
								<li>• Не работает без email-клиента</li>
								<li>• Плохой UX на мобильных устройствах</li>
								<li>• Может открыть неправильное приложение</li>
								<li>• Не работает в веб-приложениях</li>
							</ul>
						</div>

						<div>
							<h4 className='font-medium text-foreground mb-2'>
								Преимущества нового подхода:
							</h4>
							<ul className='space-y-1 text-xs'>
								<li>• Автоматическое копирование email-адреса</li>
								<li>• Работает на всех устройствах</li>
								<li>• Показывает email перед копированием</li>
								<li>• Современный и удобный UX</li>
							</ul>
						</div>
					</div>

					<div className='mt-4 p-3 bg-background rounded border'>
						<h4 className='font-medium text-foreground mb-2'>
							Пример использования:
						</h4>
						<div className='space-y-2'>
							<div className='flex items-center gap-2 text-xs'>
								<Badge variant='secondary'>Старый способ</Badge>
								<code className='text-red-600'>
									&lt;a href=&quot;mailto:example@gmail.com&quot;&gt;Контакты&lt;/a&gt;
								</code>
							</div>
							<div className='flex items-center gap-2 text-xs'>
								<Badge variant='default'>Новый способ</Badge>
								<code className='text-green-600'>
									&lt;a
									href=&quot;/email-html/show/?text=example%40gmail.com&quot;&gt;Контакты&lt;/a&gt;
								</code>
							</div>
						</div>
					</div>
				</div>
			</Card>

			{/* Implementation Note */}
			<Card className='p-4 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'>
				<div className='flex items-start gap-3'>
					<ExternalLink className='w-5 h-5 text-blue-600 mt-0.5' />
					<div>
						<h4 className='font-medium text-blue-800 dark:text-blue-200 mb-1'>
							Требуется реализация страницы показа
						</h4>
						<p className='text-sm text-blue-700 dark:text-blue-300'>
							Для полной работы необходимо создать страницу{' '}
							<code>/email-html/show/</code>, которая будет показывать
							email-адрес и автоматически копировать его в буфер обмена при
							клике.
						</p>
					</div>
				</div>
			</Card>
		</div>
	)
}
