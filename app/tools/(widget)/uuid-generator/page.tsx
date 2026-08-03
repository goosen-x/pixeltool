'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Copy, RefreshCw, Download, Check, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { UuidGeneratorSeo } from './UuidGeneratorSeo'

type UUIDVersion = 'v4' | 'v7' | 'v1' | 'nil'
type UUIDFormat = 'standard' | 'uppercase' | 'no-hyphens' | 'braces'

const NIL_UUID = '00000000-0000-0000-0000-000000000000'

/* Метка времени v1 — 60 бит, это больше, чем помещается в Number без потери
   точности, поэтому считаем её в BigInt. Литералы вида 10000n здесь нельзя:
   target проекта — ES2017, а они требуют ES2020; поднимать target ради одного
   файла незачем, конструктор BigInt() работает и так. */
const UUID_EPOCH_OFFSET_MS = BigInt('12219292800000') // 1582-10-15 → 1970-01-01
const HUNDRED_NS = BigInt(10000) // интервалов по 100 нс в миллисекунде
const SHIFT_32 = BigInt(32)
const SHIFT_48 = BigInt(48)
const MASK_32 = BigInt(0xffffffff)
const MASK_16 = BigInt(0xffff)
const MASK_12 = BigInt(0x0fff)

const VERSIONS: { value: UUIDVersion; label: string; hint: string }[] = [
	{ value: 'v4', label: 'v4', hint: 'случайный' },
	{ value: 'v7', label: 'v7', hint: 'время + случайный' },
	{ value: 'v1', label: 'v1', hint: 'время + узел' },
	{ value: 'nil', label: 'nil', hint: 'нулевой' }
]

const FORMATS: { value: UUIDFormat; label: string }[] = [
	{ value: 'standard', label: 'Стандартный' },
	{ value: 'uppercase', label: 'Верхний регистр' },
	{ value: 'no-hyphens', label: 'Без дефисов' },
	{ value: 'braces', label: 'В фигурных скобках' }
]

const COUNTS = [1, 5, 10, 50, 100]

const randomBytes = (length: number): Uint8Array => {
	const bytes = new Uint8Array(length)
	crypto.getRandomValues(bytes)
	return bytes
}

const toHex = (bytes: Uint8Array): string =>
	Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')

/* Раньше здесь был самописный шаблон на Math.random(). Для UUID это прямая
   ошибка: v4 обязан строиться на криптостойком источнике, иначе значения
   предсказуемы. crypto.randomUUID() и делает ровно это. */
const generateV4 = (): string => crypto.randomUUID()

/* v7: первые 48 бит — Unix-время в миллисекундах, остальное случайно.
   Благодаря этому значения растут во времени и ложатся в конец индекса БД. */
const generateV7 = (): string => {
	const timestampHex = Date.now().toString(16).padStart(12, '0')
	const bytes = randomBytes(10)
	bytes[0] = (bytes[0] & 0x0f) | 0x70 // версия
	bytes[2] = (bytes[2] & 0x3f) | 0x80 // вариант RFC 4122
	const rest = toHex(bytes)

	return [
		timestampHex.slice(0, 8),
		timestampHex.slice(8, 12),
		rest.slice(0, 4),
		rest.slice(4, 8),
		rest.slice(8, 20)
	].join('-')
}

/* v1 по RFC 4122: 60-битная метка в интервалах по 100 нс от 1582 года,
   разложенная на three поля, плюс случайные clock_seq и node. Настоящий
   MAC-адрес браузеру недоступен, поэтому node случайный с выставленным
   multicast-битом — спецификация это прямо разрешает. */
const generateV1 = (): string => {
	const ticks = (BigInt(Date.now()) + UUID_EPOCH_OFFSET_MS) * HUNDRED_NS
	const timeLow = Number(ticks & MASK_32)
	const timeMid = Number((ticks >> SHIFT_32) & MASK_16)
	const timeHi = Number((ticks >> SHIFT_48) & MASK_12) | 0x1000

	const bytes = randomBytes(8)
	const clockSeq = (((bytes[0] << 8) | bytes[1]) & 0x3fff) | 0x8000
	const node = toHex(bytes.slice(2, 8))
	const nodeWithMulticast =
		(parseInt(node.slice(0, 2), 16) | 0x01).toString(16).padStart(2, '0') +
		node.slice(2)

	return [
		timeLow.toString(16).padStart(8, '0'),
		timeMid.toString(16).padStart(4, '0'),
		timeHi.toString(16).padStart(4, '0'),
		clockSeq.toString(16).padStart(4, '0'),
		nodeWithMulticast
	].join('-')
}

const applyFormat = (uuid: string, format: UUIDFormat): string => {
	switch (format) {
		case 'uppercase':
			return uuid.toUpperCase()
		case 'no-hyphens':
			return uuid.replace(/-/g, '')
		case 'braces':
			return `{${uuid}}`
		default:
			return uuid
	}
}

interface Analysis {
	valid: boolean
	version?: number
	variant?: string
	createdAt?: Date
	isNil?: boolean
}

/* Разбор того, что лежит в поле. Работает и на своих сгенерированных
   значениях, и на чужих, вставленных руками — в любом из четырёх форматов
   записи. Именно это и позволило убрать отдельный блок «Валидатор». */
const analyze = (raw: string): Analysis | null => {
	const cleaned = raw
		.trim()
		.replace(/[{}]/g, '')
		.replace(/-/g, '')
		.toLowerCase()
	if (!cleaned) return null
	if (!/^[0-9a-f]{32}$/.test(cleaned)) return { valid: false }

	if (cleaned === NIL_UUID.replace(/-/g, ''))
		return { valid: true, isNil: true }

	const version = parseInt(cleaned.charAt(12), 16)
	const variantNibble = parseInt(cleaned.charAt(16), 16)

	let variant = 'зарезервирован'
	if (variantNibble <= 7) variant = 'NCS (устаревший)'
	else if (variantNibble <= 11) variant = 'RFC 4122'
	else if (variantNibble <= 13) variant = 'Microsoft'

	let createdAt: Date | undefined
	if (version === 7) {
		createdAt = new Date(parseInt(cleaned.slice(0, 12), 16))
	} else if (version === 1) {
		const ticks =
			(BigInt(parseInt(cleaned.slice(12, 16), 16) & 0x0fff) << SHIFT_48) |
			(BigInt(parseInt(cleaned.slice(8, 12), 16)) << SHIFT_32) |
			BigInt(parseInt(cleaned.slice(0, 8), 16))
		createdAt = new Date(Number(ticks / HUNDRED_NS - UUID_EPOCH_OFFSET_MS))
	}

	return { valid: true, version, variant, createdAt }
}

export default function UUIDGeneratorPage() {
	const widget = getWidgetById('uuid-generator')!
	const [version, setVersion] = useState<UUIDVersion>('v4')
	const [format, setFormat] = useState<UUIDFormat>('standard')
	const [count, setCount] = useState(1)
	const [value, setValue] = useState('')
	const [copied, setCopied] = useState(false)

	const generate = useCallback(() => {
		const make = () => {
			switch (version) {
				case 'v7':
					return generateV7()
				case 'v1':
					return generateV1()
				case 'nil':
					return NIL_UUID
				default:
					return generateV4()
			}
		}

		setValue(
			Array.from({ length: count }, () => applyFormat(make(), format)).join(
				'\n'
			)
		)
	}, [version, format, count])

	// Первый UUID при открытии страницы и перегенерация при смене настроек.
	// Раньше здесь же значение молча уезжало в буфер обмена — страница
	// подменяла пользователю буфер без единого клика с его стороны.
	useEffect(() => {
		generate()
	}, [generate])

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(value)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
			toast.success(count === 1 ? 'Скопировано' : `Скопировано ${count} UUID`)
		} catch {
			toast.error('Браузер не дал доступ к буферу обмена')
		}
	}

	const download = () => {
		const blob = new Blob([value], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = `uuid-${version}-${count}.txt`
		link.click()
		URL.revokeObjectURL(url)
	}

	// Разбираем только одиночное значение: в списке из ста строк разбирать
	// нечего, там нужны другие действия — скопировать всё и скачать файлом.
	const isSingle = !value.includes('\n')
	const analysis = isSingle ? analyze(value) : null

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='space-y-5 p-5 sm:p-6'>
				<div className='flex flex-wrap items-center gap-2'>
					<span className='text-sm text-muted-foreground'>Версия:</span>
					{VERSIONS.map(item => (
						<button
							key={item.value}
							type='button'
							onClick={() => setVersion(item.value)}
							className={cn(
								'cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors',
								'hover:border-primary/50 hover:bg-muted',
								'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
								version === item.value &&
									'border-primary bg-primary/10 text-primary'
							)}
						>
							<span className='font-mono'>{item.label}</span>
							<span className='ml-1.5 text-xs opacity-70'>{item.hint}</span>
						</button>
					))}
				</div>

				{/* Поле одно и то же на генерацию и на разбор — оно редактируемое,
				    поэтому вставленный чужой UUID разбирается там же, где появился
				    свой. Отдельный блок «Валидатор» с кнопкой «Проверить» из-за
				    этого стал не нужен. */}
				<div className='relative'>
					{isSingle ? (
						<Input
							value={value}
							onChange={event => setValue(event.target.value)}
							spellCheck={false}
							placeholder='UUID появится здесь — или вставьте свой для разбора'
							className='h-14 rounded-xl pr-12 font-mono text-base sm:text-lg'
						/>
					) : (
						<textarea
							value={value}
							onChange={event => setValue(event.target.value)}
							spellCheck={false}
							className='h-56 w-full resize-none rounded-xl border border-input bg-background p-4 pr-12 font-mono text-base leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm'
						/>
					)}

					<div className='absolute right-2 top-2 flex gap-1'>
						{!isSingle && (
							<Button
								size='icon'
								variant='ghost'
								onClick={download}
								title='Скачать файлом'
								className='cursor-pointer'
							>
								<Download className='h-4 w-4' />
							</Button>
						)}
						<Button
							size='icon'
							variant='ghost'
							onClick={copy}
							title='Скопировать'
							className={cn('cursor-pointer', isSingle && 'top-1/2')}
						>
							{copied ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
					</div>
				</div>

				{analysis && (
					<div className='flex items-start gap-2 text-sm'>
						{analysis.valid ? (
							<>
								<Check className='mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400' />
								<span className='text-muted-foreground'>
									{analysis.isNil ? (
										'Нулевой UUID (nil) — все биты равны нулю'
									) : (
										<>
											Версия {analysis.version} · вариант {analysis.variant}
											{analysis.createdAt && (
												<>
													{' '}
													· создан {analysis.createdAt.toLocaleString('ru-RU')}
												</>
											)}
										</>
									)}
								</span>
							</>
						) : (
							<>
								<AlertCircle className='mt-0.5 h-4 w-4 shrink-0 text-destructive' />
								<span className='text-destructive'>
									Это не похоже на UUID — нужно 32 шестнадцатеричных символа
								</span>
							</>
						)}
					</div>
				)}

				<div className='flex flex-wrap items-center gap-x-4 gap-y-3 border-t pt-5'>
					<Button onClick={generate} className='cursor-pointer gap-2'>
						<RefreshCw className='h-4 w-4' />
						Новый
					</Button>

					<div className='flex flex-wrap items-center gap-1'>
						<span className='mr-1 text-sm text-muted-foreground'>Сколько:</span>
						{COUNTS.map(item => (
							<button
								key={item}
								type='button'
								onClick={() => setCount(item)}
								className={cn(
									'min-w-9 cursor-pointer rounded-md border px-2 py-1 text-sm transition-colors',
									'hover:border-primary/50 hover:bg-muted',
									'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
									count === item && 'border-primary bg-primary/10 text-primary'
								)}
							>
								{item}
							</button>
						))}
					</div>

					<Select
						value={format}
						onValueChange={(next: UUIDFormat) => setFormat(next)}
					>
						<SelectTrigger className='w-[13rem] cursor-pointer sm:ml-auto'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{FORMATS.map(item => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</Card>
			<UuidGeneratorSeo />
		</WidgetSEOWrapper>
	)
}
