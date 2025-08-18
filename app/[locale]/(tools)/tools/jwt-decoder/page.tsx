'use client'

import { useState, useEffect } from 'react'
import { WidgetLayout } from '@/components/widgets/WidgetLayout'
import { WidgetSection } from '@/components/widgets/WidgetSection'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Key,
	Copy,
	RefreshCw,
	CheckCircle,
	XCircle,
	AlertCircle,
	FileJson,
	Shield,
	Clock,
	User,
	Globe,
	Hash,
	Calendar,
	Info,
	Sparkles,
	Lock,
	Unlock
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface JWTHeader {
	alg: string
	typ: string
	kid?: string
	[key: string]: any
}

interface JWTPayload {
	iss?: string
	sub?: string
	aud?: string | string[]
	exp?: number
	nbf?: number
	iat?: number
	jti?: string
	[key: string]: any
}

interface DecodedJWT {
	header: JWTHeader
	payload: JWTPayload
	signature: string
	isValid: boolean
	errors: string[]
}

interface JWTExample {
	name: string
	token: string
	description: string
	icon?: React.ElementType
	variant?: 'default' | 'success' | 'warning' | 'destructive'
}

const JWT_EXAMPLES: JWTExample[] = [
	{
		name: 'Auth0 Token',
		token:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzAwMDAwMDAwLCJpc3MiOiJodHRwczovL2F1dGgwLmNvbSIsImF1ZCI6Imh0dHBzOi8vYXBpLmV4YW1wbGUuY29tIn0.W-cABe4b9voSYZhGoF4sqM3PlV00mP1rHsxvQHnKfkY',
		description: 'Пример JWT от Auth0',
		icon: Shield,
		variant: 'default'
	},
	{
		name: 'Firebase Token',
		token:
			'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMzQ1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbXktcHJvamVjdCIsImF1ZCI6Im15LXByb2plY3QiLCJhdXRoX3RpbWUiOjE1MTYyMzkwMjIsInVzZXJfaWQiOiJ1c2VyMTIzIiwic3ViIjoidXNlcjEyMyIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzAwMDAwMDAwLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ1c2VyQGV4YW1wbGUuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.mock_signature',
		description: 'Firebase Authentication JWT',
		icon: Key,
		variant: 'default'
	},
	{
		name: 'AWS Cognito',
		token:
			'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImFiY2RlZiJ9.eyJzdWIiOiJhYWFhYWFhYS1iYmJiLWNjY2MtZGRkZC1lZWVlZWVlZWVlZWUiLCJkZXZpY2Vfa2V5IjoiYWFhYWFhYWEtYmJiYi1jY2NjLWRkZGQtZWVlZWVlZWVlZWVlIiwiY29nbml0bzpncm91cHMiOlsiYWRtaW4iXSwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTUxNjIzOTAyMiwiaXNzIjoiaHR0cHM6Ly9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbS91cy1lYXN0LTFfRXhhbXBsZSIsImV4cCI6MTcwMDAwMDAwMCwiaWF0IjoxNTE2MjM5MDIyLCJqdGkiOiJhYWFhYWFhYS1iYmJiLWNjY2MtZGRkZC1lZWVlZWVlZWVlZWUiLCJjbGllbnRfaWQiOiJhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYSIsInVzZXJuYW1lIjoiamFuZWRvZUBleGFtcGxlLmNvbSJ9.mock_signature',
		description: 'AWS Cognito Access Token',
		icon: Globe,
		variant: 'default'
	},
	{
		name: 'Простой токен',
		token:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
		description: 'Минимальный JWT',
		icon: FileJson,
		variant: 'success'
	},
	{
		name: 'Expired Token',
		token:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkV4cGlyZWQgVXNlciIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjM5MDIzfQ.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ',
		description: 'Истекший токен',
		icon: Clock,
		variant: 'warning'
	},
	{
		name: 'Невалидный JWT',
		token: 'это.не.jwt.токен',
		description: 'Пример невалидного токена',
		icon: XCircle,
		variant: 'destructive'
	}
]

const ALGORITHMS: { [key: string]: string } = {
	HS256: 'HMAC с SHA-256',
	HS384: 'HMAC с SHA-384',
	HS512: 'HMAC с SHA-512',
	RS256: 'RSA с SHA-256',
	RS384: 'RSA с SHA-384',
	RS512: 'RSA с SHA-512',
	ES256: 'ECDSA с SHA-256',
	ES384: 'ECDSA с SHA-384',
	ES512: 'ECDSA с SHA-512',
	PS256: 'RSA-PSS с SHA-256',
	PS384: 'RSA-PSS с SHA-384',
	PS512: 'RSA-PSS с SHA-512',
	none: 'Без подписи'
}

export default function JWTDecoderPage() {
	const t = useTranslations('widgets.jwtDecoder')
	const [jwt, setJwt] = useState('')
	const [decoded, setDecoded] = useState<DecodedJWT | null>(null)
	const [activeTab, setActiveTab] = useState('header')
	const [showRaw, setShowRaw] = useState(false)

	useEffect(() => {
		if (jwt) {
			decodeJWT()
		} else {
			setDecoded(null)
		}
	}, [jwt])

	const decodeJWT = () => {
		const errors: string[] = []

		try {
			const parts = jwt.trim().split('.')

			if (parts.length !== 3) {
				errors.push('JWT должен состоять из 3 частей, разделенных точками')
				setDecoded({
					header: {} as JWTHeader,
					payload: {} as JWTPayload,
					signature: '',
					isValid: false,
					errors
				})
				return
			}

			const [headerBase64, payloadBase64, signatureBase64] = parts

			// Decode header
			let header: JWTHeader
			try {
				const headerJson = base64UrlDecode(headerBase64)
				header = JSON.parse(headerJson)

				if (!header.alg) {
					errors.push('Отсутствует обязательное поле "alg" в заголовке')
				}
				if (!header.typ || (header.typ !== 'JWT' && header.typ !== 'JWS')) {
					errors.push('Поле "typ" должно быть "JWT" или "JWS"')
				}
			} catch (e) {
				errors.push('Ошибка декодирования заголовка')
				header = {} as JWTHeader
			}

			// Decode payload
			let payload: JWTPayload
			try {
				const payloadJson = base64UrlDecode(payloadBase64)
				payload = JSON.parse(payloadJson)

				// Validate standard claims
				if (payload.exp) {
					const now = Math.floor(Date.now() / 1000)
					if (payload.exp < now) {
						errors.push(`Токен истек ${formatDate(payload.exp)}`)
					}
				}

				if (payload.nbf) {
					const now = Math.floor(Date.now() / 1000)
					if (payload.nbf > now) {
						errors.push(
							`Токен еще не активен. Активен с ${formatDate(payload.nbf)}`
						)
					}
				}
			} catch (e) {
				errors.push('Ошибка декодирования payload')
				payload = {} as JWTPayload
			}

			setDecoded({
				header,
				payload,
				signature: signatureBase64,
				isValid: errors.length === 0,
				errors
			})
		} catch (error) {
			errors.push('Невалидный JWT формат')
			setDecoded({
				header: {} as JWTHeader,
				payload: {} as JWTPayload,
				signature: '',
				isValid: false,
				errors
			})
		}
	}

	const base64UrlDecode = (str: string): string => {
		// Replace URL-safe characters
		str = str.replace(/-/g, '+').replace(/_/g, '/')

		// Add padding if needed
		const padding = str.length % 4
		if (padding) {
			str += '='.repeat(4 - padding)
		}

		// Decode base64
		const decoded = atob(str)

		// Handle UTF-8
		return decodeURIComponent(escape(decoded))
	}

	const formatDate = (timestamp: number): string => {
		return new Date(timestamp * 1000).toLocaleString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		})
	}

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text)
		toast.success('Скопировано в буфер обмена!')
	}

	const loadExample = (example: JWTExample) => {
		setJwt(example.token)
		setActiveTab('header')
		toast.success(`Загружен пример: ${example.name}`)
	}

	const reset = () => {
		setJwt('')
		setDecoded(null)
		setActiveTab('header')
		toast.success('Декодер сброшен')
	}

	const getTimeLeft = (exp: number): string => {
		const now = Math.floor(Date.now() / 1000)
		const diff = exp - now

		if (diff <= 0) return 'Истек'

		const days = Math.floor(diff / 86400)
		const hours = Math.floor((diff % 86400) / 3600)
		const minutes = Math.floor((diff % 3600) / 60)

		if (days > 0) return `${days}д ${hours}ч`
		if (hours > 0) return `${hours}ч ${minutes}м`
		return `${minutes}м`
	}

	const renderValue = (key: string, value: any): React.ReactNode => {
		if (value === null || value === undefined)
			return <span className='text-muted-foreground'>null</span>

		// Format timestamps
		if (
			['exp', 'iat', 'nbf', 'auth_time'].includes(key) &&
			typeof value === 'number'
		) {
			return (
				<div>
					<div>{formatDate(value)}</div>
					<div className='text-xs text-muted-foreground'>
						Timestamp: {value}
					</div>
				</div>
			)
		}

		// Format arrays
		if (Array.isArray(value)) {
			return (
				<div className='space-y-1'>
					{value.map((item, index) => (
						<Badge key={index} variant='secondary' className='mr-1'>
							{JSON.stringify(item)}
						</Badge>
					))}
				</div>
			)
		}

		// Format objects
		if (typeof value === 'object') {
			return (
				<pre className='text-xs bg-muted p-2 rounded overflow-x-auto'>
					{JSON.stringify(value, null, 2)}
				</pre>
			)
		}

		// Format booleans
		if (typeof value === 'boolean') {
			return (
				<Badge variant={value ? 'default' : 'secondary'}>
					{value ? 'true' : 'false'}
				</Badge>
			)
		}

		return String(value)
	}

	const getClaimIcon = (key: string) => {
		const icons: { [key: string]: any } = {
			iss: Globe,
			sub: User,
			aud: User,
			exp: Clock,
			nbf: Clock,
			iat: Calendar,
			jti: Hash,
			email: User,
			name: User,
			role: Shield,
			roles: Shield,
			permissions: Shield,
			scope: Shield
		}

		const Icon = icons[key]
		return Icon ? <Icon className='w-4 h-4' /> : null
	}

	const getClaimDescription = (key: string): string => {
		const descriptions: { [key: string]: string } = {
			iss: 'Issuer - кто выпустил токен',
			sub: 'Subject - идентификатор пользователя',
			aud: 'Audience - для кого предназначен токен',
			exp: 'Expiration Time - время истечения',
			nbf: 'Not Before - токен не действителен до',
			iat: 'Issued At - время выпуска',
			jti: 'JWT ID - уникальный идентификатор токена',
			email: 'Email адрес пользователя',
			name: 'Имя пользователя',
			role: 'Роль пользователя',
			roles: 'Роли пользователя',
			permissions: 'Разрешения',
			scope: 'Область действия токена'
		}

		return descriptions[key] || ''
	}

	return (
		<WidgetLayout>
			{/* Examples - Full Width at Top */}
			<WidgetSection
				icon={<Sparkles className='h-5 w-5' />}
				title='Примеры JWT токенов'
				className='mb-8'
			>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
					{JWT_EXAMPLES.map((example, index) => {
						const Icon = example.icon || Key
						return (
							<div
								key={index}
								onClick={() => loadExample(example)}
								className={cn(
									'relative group cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-lg',
									'bg-card hover:-translate-y-0.5',
									example.variant === 'success' &&
										'border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600',
									example.variant === 'warning' &&
										'border-yellow-200 dark:border-yellow-800 hover:border-yellow-400 dark:hover:border-yellow-600',
									example.variant === 'destructive' &&
										'border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-600',
									(!example.variant || example.variant === 'default') &&
										'border-border hover:border-primary/50'
								)}
							>
								<div className='flex items-start gap-3'>
									<div
										className={cn(
											'w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110',
											example.variant === 'success' &&
												'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
											example.variant === 'warning' &&
												'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
											example.variant === 'destructive' &&
												'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
											(!example.variant || example.variant === 'default') &&
												'bg-primary/10 text-primary'
										)}
									>
										<Icon className='w-5 h-5' />
									</div>
									<div className='flex-1 space-y-1'>
										<div className='font-semibold text-foreground'>
											{example.name}
										</div>
										<div className='text-sm text-muted-foreground'>
											{example.description}
										</div>
									</div>
								</div>
								{/* Hover effect overlay */}
								<div
									className={cn(
										'absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity',
										example.variant === 'success' &&
											'bg-gradient-to-br from-green-500/5 to-green-500/10',
										example.variant === 'warning' &&
											'bg-gradient-to-br from-yellow-500/5 to-yellow-500/10',
										example.variant === 'destructive' &&
											'bg-gradient-to-br from-red-500/5 to-red-500/10',
										(!example.variant || example.variant === 'default') &&
											'bg-gradient-to-br from-primary/5 to-primary/10'
									)}
								/>
							</div>
						)
					})}
				</div>
			</WidgetSection>

			<div className='grid lg:grid-cols-2 gap-6'>
				{/* Input */}
				<div className='space-y-4'>
					<Card className='p-6'>
						<div className='flex items-center justify-between mb-4'>
							<Label className='text-base'>JWT Token</Label>
							<div className='flex items-center gap-2'>
								{jwt && (
									<Button
										onClick={reset}
										variant='ghost'
										size='sm'
										className='gap-1'
									>
										<RefreshCw className='w-3 h-3' />
										Очистить
									</Button>
								)}
								{decoded && (
									<Badge
										variant={decoded.isValid ? 'default' : 'destructive'}
										className='gap-1'
									>
										{decoded.isValid ? (
											<>
												<CheckCircle className='w-3 h-3' /> Валидный формат
											</>
										) : (
											<>
												<XCircle className='w-3 h-3' /> Ошибки
											</>
										)}
									</Badge>
								)}
							</div>
						</div>

						<Textarea
							value={jwt}
							onChange={e => setJwt(e.target.value)}
							placeholder='Вставьте JWT токен для декодирования...'
							className='font-mono text-sm min-h-[300px]'
							spellCheck={false}
						/>

						{decoded && !decoded.isValid && (
							<div className='mt-4 space-y-2'>
								{decoded.errors.map((error, index) => (
									<div
										key={index}
										className='flex items-start gap-2 text-sm text-red-600 dark:text-red-400'
									>
										<AlertCircle className='w-4 h-4 mt-0.5' />
										{error}
									</div>
								))}
							</div>
						)}
					</Card>
				</div>

				{/* Output */}
				<div className='space-y-4'>
					{decoded ? (
						<>
							<Card className='p-6'>
								<div className='flex items-center justify-between mb-4'>
									<h3 className='font-semibold'>Декодированные данные</h3>
									<div className='flex items-center gap-2'>
										<Button
											onClick={() =>
												copyToClipboard(JSON.stringify(decoded, null, 2))
											}
											variant='ghost'
											size='sm'
											className='gap-1'
										>
											<Copy className='w-3 h-3' />
											JSON
										</Button>
										<Button
											onClick={() =>
												copyToClipboard(
													JSON.stringify(decoded.payload, null, 2)
												)
											}
											variant='ghost'
											size='sm'
											className='gap-1'
										>
											<FileJson className='w-3 h-3' />
											Payload
										</Button>
									</div>
								</div>
								<Tabs value={activeTab} onValueChange={setActiveTab}>
									<TabsList className='grid w-full grid-cols-3'>
										<TabsTrigger value='header'>Header</TabsTrigger>
										<TabsTrigger value='payload'>Payload</TabsTrigger>
										<TabsTrigger value='signature'>Signature</TabsTrigger>
									</TabsList>

									<TabsContent value='header' className='mt-4 space-y-3'>
										{Object.keys(decoded.header).length > 0 ? (
											Object.entries(decoded.header).map(([key, value]) => (
												<div
													key={key}
													className='flex items-start justify-between p-3 rounded-lg bg-muted/50'
												>
													<div className='flex items-start gap-2'>
														<Lock className='w-4 h-4 text-muted-foreground mt-0.5' />
														<div>
															<div className='font-medium'>{key}</div>
															{key === 'alg' && ALGORITHMS[value] && (
																<div className='text-xs text-muted-foreground'>
																	{ALGORITHMS[value]}
																</div>
															)}
														</div>
													</div>
													<div className='text-right'>
														{renderValue(key, value)}
													</div>
												</div>
											))
										) : (
											<div className='text-center text-muted-foreground py-8'>
												Нет данных в заголовке
											</div>
										)}
									</TabsContent>

									<TabsContent value='payload' className='mt-4 space-y-3'>
										{Object.keys(decoded.payload).length > 0 ? (
											Object.entries(decoded.payload).map(([key, value]) => (
												<div
													key={key}
													className='flex items-start justify-between p-3 rounded-lg bg-muted/50'
												>
													<div className='flex items-start gap-2'>
														{getClaimIcon(key)}
														<div>
															<div className='font-medium'>{key}</div>
															{getClaimDescription(key) && (
																<div className='text-xs text-muted-foreground'>
																	{getClaimDescription(key)}
																</div>
															)}
														</div>
													</div>
													<div className='text-right'>
														{renderValue(key, value)}
														{key === 'exp' && typeof value === 'number' && (
															<div className='text-xs text-muted-foreground mt-1'>
																{getTimeLeft(value)}
															</div>
														)}
													</div>
												</div>
											))
										) : (
											<div className='text-center text-muted-foreground py-8'>
												Нет данных в payload
											</div>
										)}
									</TabsContent>

									<TabsContent value='signature' className='mt-4'>
										<div className='space-y-4'>
											<div className='p-4 rounded-lg bg-muted/50'>
												<Label className='text-sm mb-2 block'>
													Подпись (Base64)
												</Label>
												<code className='text-xs block break-all'>
													{decoded.signature || 'Отсутствует'}
												</code>
											</div>

											<div className='p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800'>
												<div className='flex items-start gap-2'>
													<AlertCircle className='w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5' />
													<div className='text-sm'>
														<p className='font-medium text-yellow-800 dark:text-yellow-200'>
															Проверка подписи
														</p>
														<p className='text-yellow-700 dark:text-yellow-300 mt-1'>
															Для проверки подписи требуется секретный ключ или
															публичный ключ. Этот инструмент только декодирует
															токен без проверки подписи.
														</p>
													</div>
												</div>
											</div>
										</div>
									</TabsContent>
								</Tabs>
							</Card>
						</>
					) : (
						<Card className='p-12'>
							<div className='text-center text-muted-foreground'>
								<Key className='w-12 h-12 mx-auto mb-4 opacity-20' />
								<p>Вставьте JWT токен для декодирования</p>
							</div>
						</Card>
					)}
				</div>
			</div>

			{/* Info */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-4 flex items-center gap-2'>
					<Info className='w-4 h-4' />О JWT
				</h3>
				<div className='grid md:grid-cols-2 gap-6 text-sm text-muted-foreground'>
					<div>
						<h4 className='font-medium text-foreground mb-2'>Что такое JWT?</h4>
						<p>
							JSON Web Token (JWT) — это открытый стандарт (RFC 7519) для
							безопасной передачи информации между сторонами в виде JSON
							объекта.
						</p>
					</div>
					<div>
						<h4 className='font-medium text-foreground mb-2'>Структура JWT</h4>
						<p>
							JWT состоит из трех частей: Header (заголовок), Payload (полезная
							нагрузка) и Signature (подпись), разделенных точками.
						</p>
					</div>
					<div>
						<h4 className='font-medium text-foreground mb-2'>Безопасность</h4>
						<p>
							JWT подписан, но не зашифрован. Любой может декодировать и
							прочитать содержимое. Не храните конфиденциальные данные в JWT.
						</p>
					</div>
					<div>
						<h4 className='font-medium text-foreground mb-2'>Использование</h4>
						<p>
							JWT часто используется для аутентификации и авторизации в
							веб-приложениях, API и микросервисах.
						</p>
					</div>
				</div>
			</Card>
		</WidgetLayout>
	)
}
