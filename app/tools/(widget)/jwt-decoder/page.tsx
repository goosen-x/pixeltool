'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
	Copy,
	RefreshCw,
	AlertCircle,
	Shield,
	Clock,
	User,
	Globe,
	Hash,
	Calendar,
	ClipboardPaste,
	Lock
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { JwtDecoderSeo } from './JwtDecoderSeo'

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
}

/* Цвета трёх частей токена — те же, к которым все привыкли по jwt.io.
   Это главный обучающий элемент инструмента: видно, где заканчивается
   заголовок и начинается payload, без чтения документации. Теми же цветами
   покрашены заголовки секций результата — так связь «кусок строки → эти
   данные» читается сразу, без кликов по вкладкам. */
const HEADER_COLOR = 'text-rose-600 dark:text-rose-400'
const PAYLOAD_COLOR = 'text-violet-600 dark:text-violet-400'
const SIGNATURE_COLOR = 'text-sky-600 dark:text-sky-400'
const SEGMENT_COLORS = [HEADER_COLOR, PAYLOAD_COLOR, SIGNATURE_COLOR]

export default function JWTDecoderPage() {
	const widget = getWidgetById('jwt-decoder')!
	const [jwt, setJwt] = useState('')
	const [decoded, setDecoded] = useState<DecodedJWT | null>(null)

	// «Простой» первым: с него начинают знакомство с инструментом, остальные —
	// когда нужен разбор конкретного провайдера или проверка крайнего случая.
	const JWT_EXAMPLES: JWTExample[] = [
		{
			name: 'Простой',
			token:
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
			description: 'Минимальный JWT с базовыми claims'
		},
		{
			name: 'Auth0',
			token:
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzAwMDAwMDAwLCJpc3MiOiJodHRwczovL2F1dGgwLmNvbSIsImF1ZCI6Imh0dHBzOi8vYXBpLmV4YW1wbGUuY29tIn0.W-cABe4b9voSYZhGoF4sqM3PlV00mP1rHsxvQHnKfkY',
			description: 'Стандартный токен от Auth0 с расширенными claims'
		},
		{
			name: 'Firebase',
			token:
				'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMzQ1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbXktcHJvamVjdCIsImF1ZCI6Im15LXByb2plY3QiLCJhdXRoX3RpbWUiOjE1MTYyMzkwMjIsInVzZXJfaWQiOiJ1c2VyMTIzIiwic3ViIjoidXNlcjEyMyIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzAwMDAwMDAwLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ1c2VyQGV4YW1wbGUuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.mock_signature',
			description: 'Токен аутентификации от Firebase с метаданными'
		},
		{
			name: 'AWS Cognito',
			token:
				'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImFiY2RlZiJ9.eyJzdWIiOiJhYWFhYWFhYS1iYmJiLWNjY2MtZGRkZC1lZWVlZWVlZWVlZWUiLCJkZXZpY2Vfa2V5IjoiYWFhYWFhYWEtYmJiYi1jY2NjLWRkZGQtZWVlZWVlZWVlZWVlIiwiY29nbml0bzpncm91cHMiOlsiYWRtaW4iXSwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTUxNjIzOTAyMiwiaXNzIjoiaHR0cHM6Ly9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbS91cy1lYXN0LTFfRXhhbXBsZSIsImV4cCI6MTcwMDAwMDAwMCwiaWF0IjoxNTE2MjM5MDIyLCJqdGkiOiJhYWFhYWFhYS1iYmJiLWNjY2MtZGRkZC1lZWVlZWVlZWVlZWUiLCJjbGllbnRfaWQiOiJhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYSIsInVzZXJuYW1lIjoiamFuZWRvZUBleGFtcGxlLmNvbSJ9.mock_signature',
			description: 'Access токен от AWS Cognito User Pool'
		},
		{
			name: 'Истёкший',
			token:
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkV4cGlyZWQgVXNlciIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjM5MDIzfQ.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ',
			description: 'Токен с истёкшим сроком действия'
		},
		{
			name: 'Невалидный',
			token: 'это.не.jwt.токен',
			description: 'Некорректный формат, не является JWT'
		}
	]

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
				errors.push('JWT должен состоять из 3 частей, разделённых точками')
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
					errors.push('Отсутствует алгоритм подписи (alg) в заголовке')
				}
				if (!header.typ || (header.typ !== 'JWT' && header.typ !== 'JWS')) {
					errors.push('Неверный тип токена, должен быть JWT или JWS')
				}
			} catch (e) {
				errors.push('Ошибка декодирования заголовка JWT')
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
						errors.push(`Токен истёк ${formatDate(payload.exp)}`)
					}
				}

				if (payload.nbf) {
					const now = Math.floor(Date.now() / 1000)
					if (payload.nbf > now) {
						errors.push(`Токен ещё не активен до ${formatDate(payload.nbf)}`)
					}
				}
			} catch (e) {
				errors.push('Ошибка декодирования полезной нагрузки JWT')
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
			errors.push('Неверный формат JWT токена')
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
		toast.success('Скопировано в буфер обмена')
	}

	// Главное действие инструмента — вставить токен, поэтому у него отдельная
	// кнопка: попадание в неё быстрее, чем клик в поле плюс Cmd+V.
	const pasteFromClipboard = async () => {
		try {
			const text = await navigator.clipboard.readText()
			if (!text.trim()) {
				toast.error('Буфер обмена пуст')
				return
			}
			setJwt(text.trim())
		} catch {
			toast.error('Браузер не дал доступ к буферу — вставьте вручную')
		}
	}

	const loadExample = (example: JWTExample) => {
		setJwt(example.token)
	}

	const reset = () => {
		setJwt('')
		setDecoded(null)
	}

	const getTimeLeft = (exp: number): string => {
		const now = Math.floor(Date.now() / 1000)
		const diff = exp - now

		if (diff <= 0) return 'Истёк'

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

		// Метка времени: дата обычным кеглем, unix-значение и остаток срока —
		// одной приглушённой строкой под ней. Раньше это были три строки.
		if (
			['exp', 'iat', 'nbf', 'auth_time'].includes(key) &&
			typeof value === 'number'
		) {
			return (
				<div>
					<div>{formatDate(value)}</div>
					<div className='text-xs text-muted-foreground'>
						{value}
						{key === 'exp' && ` · ${getTimeLeft(value)}`}
					</div>
				</div>
			)
		}

		if (Array.isArray(value)) {
			return (
				<div className='flex flex-wrap justify-end gap-1'>
					{value.map((item, index) => (
						<Badge key={index} variant='secondary'>
							{JSON.stringify(item)}
						</Badge>
					))}
				</div>
			)
		}

		if (typeof value === 'object') {
			return (
				<pre className='overflow-x-auto rounded bg-muted p-2 text-left text-xs'>
					{JSON.stringify(value, null, 2)}
				</pre>
			)
		}

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
		return Icon ? <Icon className='h-4 w-4' /> : null
	}

	const getClaimDescription = (key: string): string => {
		const descriptions: { [key: string]: string } = {
			iss: 'Issuer — кто выпустил токен',
			sub: 'Subject — идентификатор пользователя',
			aud: 'Audience — для кого предназначен токен',
			exp: 'Expiration Time — время истечения',
			nbf: 'Not Before — токен не действителен до',
			iat: 'Issued At — время выпуска',
			jti: 'JWT ID — уникальный идентификатор токена',
			email: 'Email адрес пользователя',
			name: 'Имя пользователя',
			role: 'Роль пользователя',
			roles: 'Роли пользователя',
			permissions: 'Разрешения',
			scope: 'Область действия токена'
		}

		return descriptions[key] || ''
	}

	const getHeaderDescription = (key: string, value: any): string => {
		if (key === 'alg') {
			const algorithms: { [key: string]: string } = {
				HS256: 'HMAC SHA-256',
				RS256: 'RSA SHA-256',
				ES256: 'ECDSA SHA-256'
			}
			return algorithms[String(value)] || 'Алгоритм подписи'
		}
		if (key === 'typ') return 'Тип токена'
		if (key === 'kid') return 'Идентификатор ключа'
		return ''
	}

	const segments = jwt.trim().split('.')
	const showSegments = segments.length === 3 && segments.every(Boolean)

	// Вкладок больше нет, выбирать формат нечего — кнопка одна и копирует весь
	// разобранный токен целиком.
	const copyAll = () => {
		if (!decoded) return
		copyToClipboard(
			JSON.stringify(
				{
					header: decoded.header,
					payload: decoded.payload,
					signature: decoded.signature
				},
				null,
				2
			)
		)
	}

	// Из «это.не.jwt.токен» разбирать нечего: показывать под ним три пустые
	// секции — значит делать вид, что результат есть. Достаточно ошибки.
	const hasContent =
		!!decoded &&
		(Object.keys(decoded.header).length > 0 ||
			Object.keys(decoded.payload).length > 0)

	const claimRow = (
		key: string,
		value: any,
		icon: React.ReactNode,
		hint: string
	) => (
		<div
			key={key}
			className='flex items-start justify-between gap-4 border-b border-border/60 py-2 last:border-0'
		>
			<div className='flex min-w-0 items-start gap-2'>
				{/* Слот под иконку держим всегда: без него ключи, для которых иконки
				    нет (auth_time, user_id), уезжали влево и ломали колонку. */}
				<span className='mt-0.5 w-4 shrink-0 text-muted-foreground'>
					{icon}
				</span>
				<div className='min-w-0'>
					<div className='font-mono text-sm font-medium'>{key}</div>
					{hint && <div className='text-xs text-muted-foreground'>{hint}</div>}
				</div>
			</div>
			<div className='min-w-0 text-right text-sm'>
				{renderValue(key, value)}
			</div>
		</div>
	)

	const sectionTitle = (label: string, color: string) => (
		<h3
			className={cn(
				'mb-1 text-xs font-semibold uppercase tracking-wide',
				color
			)}
		>
			{label}
		</h3>
	)

	return (
		<WidgetSEOWrapper widget={widget}>
			{/* Без карточки: рамка вокруг единственного поля ничего не отделяла —
			    инструмент на странице и так один. Ритм задают отступы между блоками. */}
			<div className='space-y-6'>
				{/* Одна строка управления: примеры слева, действия справа. Заголовка
				    «JWT токен» нет намеренно — ровно это написано в плейсхолдере. */}
				<div className='flex flex-wrap items-center justify-between gap-x-4 gap-y-3'>
					<div className='flex flex-wrap items-center gap-2'>
						<span className='text-sm text-muted-foreground'>Примеры:</span>
						{JWT_EXAMPLES.map(example => {
							// Подсветка «выбран» зависит от того, что в поле, а не от фокуса:
							// иначе чип остаётся залитым после клика и врёт про состояние.
							const isActive = jwt.trim() === example.token
							return (
								<button
									key={example.name}
									type='button'
									onClick={() => loadExample(example)}
									title={example.description}
									className={cn(
										'cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors',
										// bg-accent в этой теме — насыщенный синий (--accent 217 91% 60%),
										// на маленьком чипе он забивает текст. Нужен нейтральный фон.
										'hover:border-primary/50 hover:bg-muted',
										'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
										isActive && 'border-primary bg-primary/10 text-primary'
									)}
								>
									{example.name}
								</button>
							)
						})}
					</div>

					<div className='flex items-center gap-1'>
						<Button
							onClick={pasteFromClipboard}
							variant='outline'
							size='sm'
							className='cursor-pointer gap-1'
						>
							<ClipboardPaste className='h-3.5 w-3.5' />
							Вставить
						</Button>
						{jwt && (
							<Button
								onClick={reset}
								variant='ghost'
								size='sm'
								className='cursor-pointer gap-1'
							>
								<RefreshCw className='h-3.5 w-3.5' />
								Очистить
							</Button>
						)}
					</div>
				</div>

				<div className='space-y-3'>
					<Textarea
						value={jwt}
						onChange={e => setJwt(e.target.value)}
						placeholder='Вставьте JWT токен'
						className='min-h-[9rem] rounded-xl p-4 font-mono text-base leading-relaxed md:text-sm'
						spellCheck={false}
					/>

					{showSegments && (
						<div className='break-all rounded-xl bg-muted/50 p-4 font-mono text-xs leading-relaxed'>
							{segments.map((segment, index) => (
								<span key={index}>
									<span className={SEGMENT_COLORS[index]}>{segment}</span>
									{index < 2 && <span className='text-foreground'>.</span>}
								</span>
							))}
						</div>
					)}

					{decoded && !decoded.isValid && (
						<div className='space-y-1.5'>
							{decoded.errors.map((error, index) => (
								<div
									key={index}
									className='flex items-start gap-2 text-sm text-destructive'
								>
									<AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
									{error}
								</div>
							))}
						</div>
					)}
				</div>

				{hasContent && decoded && (
					// Всё три части сразу, без вкладок: их и так всего три, а
					// переключение прятало ровно то, ради чего сюда пришли.
					<div className='space-y-5 border-t pt-6'>
						<div className='flex flex-wrap items-center justify-between gap-2'>
							{decoded.header?.alg ? (
								<Badge variant='secondary' className='gap-1 font-mono'>
									<Lock className='h-3 w-3' />
									{decoded.header.alg}
								</Badge>
							) : (
								<span />
							)}
							<Button
								onClick={copyAll}
								variant='ghost'
								size='sm'
								className='cursor-pointer gap-1'
							>
								<Copy className='h-3.5 w-3.5' />
								Копировать JSON
							</Button>
						</div>

						{/* Payload первым: за ним приходят в 9 случаях из 10, а заголовок
						    смотрят только когда что-то сломалось. */}
						<div>
							{sectionTitle('Payload', PAYLOAD_COLOR)}
							{Object.keys(decoded.payload).length > 0 ? (
								Object.entries(decoded.payload).map(([key, value]) =>
									claimRow(
										key,
										value,
										getClaimIcon(key),
										getClaimDescription(key)
									)
								)
							) : (
								<p className='py-2 text-sm text-muted-foreground'>
									Полезная нагрузка не найдена
								</p>
							)}
						</div>

						<div>
							{sectionTitle('Заголовок', HEADER_COLOR)}
							{Object.keys(decoded.header).length > 0 ? (
								Object.entries(decoded.header).map(([key, value]) =>
									claimRow(
										key,
										value,
										<Lock className='h-4 w-4' />,
										getHeaderDescription(key, value)
									)
								)
							) : (
								<p className='py-2 text-sm text-muted-foreground'>
									Заголовок не найден
								</p>
							)}
						</div>

						<div>
							{sectionTitle('Подпись', SIGNATURE_COLOR)}
							<code className='block break-all rounded-lg bg-muted/50 p-3 font-mono text-xs'>
								{decoded.signature || 'Подпись отсутствует'}
							</code>
							{/* Раньше это был жёлтый блок в половину экрана. Смысл тот же,
							    но предупреждение не должно кричать громче данных. */}
							<p className='mt-2 text-xs text-muted-foreground'>
								Подпись здесь не проверяется — для этого нужен секретный или
								публичный ключ.
							</p>
						</div>
					</div>
				)}
			</div>
			<JwtDecoderSeo />
		</WidgetSEOWrapper>
	)
}
