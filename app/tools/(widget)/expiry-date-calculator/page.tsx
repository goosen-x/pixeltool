'use client'

import { useEffect, useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { ToolSelect } from '@/components/ui/tool-select'
import { TextRoll } from '@/components/core/text-roll'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { addPeriod, type PeriodUnit } from '@/lib/utils/date-difference'
import { pluralizeRu } from '@/lib/utils/pluralize'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ExpiryDateCalculatorSeo } from './ExpiryDateCalculatorSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

type Unit = 'hours' | PeriodUnit

const UNITS: { value: Unit; label: string }[] = [
	{ value: 'hours', label: 'Часы' },
	{ value: 'days', label: 'Дни' },
	{ value: 'months', label: 'Месяцы' },
	{ value: 'years', label: 'Годы' }
]

/** Сроки, которые чаще всего печатают на упаковке: часы у молочки, мяса и
 *  кулинарии, сутки у охлаждённых продуктов, месяцы и годы у консервов,
 *  бакалеи, лекарств и косметики. */
const PRESETS: { amount: number; unit: Unit; label: string }[] = [
	{ amount: 24, unit: 'hours', label: '24 часа' },
	{ amount: 72, unit: 'hours', label: '72 часа' },
	{ amount: 5, unit: 'days', label: '5 суток' },
	{ amount: 10, unit: 'days', label: '10 суток' },
	{ amount: 1, unit: 'months', label: '1 месяц' },
	{ amount: 6, unit: 'months', label: '6 месяцев' },
	{ amount: 1, unit: 'years', label: '1 год' },
	{ amount: 2, unit: 'years', label: '2 года' }
]

const DAY_MS = 86_400_000
const HOUR_MS = 3_600_000

const DAYS: [string, string, string] = ['день', 'дня', 'дней']
const HOURS: [string, string, string] = ['час', 'часа', 'часов']

const inputClass =
	'w-full min-w-0 rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

function todayIso(): string {
	const now = new Date()
	const offset = now.getTimezoneOffset() * 60000
	return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

function parseIso(value: string): Date | null {
	if (!value) return null
	const [year, month, day] = value.split('-').map(Number)
	if (!year || !month || !day) return null
	return new Date(year, month - 1, day)
}

/** «1,5» и «1.5» — одно и то же: на русской раскладке десятичный
 *  разделитель запятая. */
function parseAmount(raw: string): number | null {
	const value = Number(raw.trim().replace(',', '.'))
	return raw.trim() !== '' && Number.isFinite(value) && value >= 0
		? value
		: null
}

/** Срок в целых единицах, которые умеет прибавлять addPeriod. Дробные годы
 *  переводим в месяцы («1,5 года» = 18 месяцев). Дробные месяцы и дни
 *  календарно не определены: раньше new Date() молча отбрасывал дробную
 *  часть, и «1,5 месяца» считались как один месяц. */
function normalizePeriod(
	amount: number,
	unit: Unit
): { amount: number; unit: Unit } | { error: string } {
	if (Number.isInteger(amount)) return { amount, unit }
	if (unit === 'years' && Number.isInteger(amount * 12)) {
		return { amount: amount * 12, unit: 'months' }
	}
	if (unit === 'years') return { error: 'Годы — целым числом или по полгода' }
	if (unit === 'months') {
		return { error: 'Месяцы — целым числом: 1,5 месяца переведите в дни' }
	}
	return { error: 'Укажите целое число' }
}

function formatDate(date: Date, withTime: boolean): string {
	const day = date.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	})
	if (!withTime) return day
	const time = date.toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit'
	})
	return `${day}, ${time}`
}

function plural(count: number, forms: [string, string, string]): string {
	return `${count} ${pluralizeRu(count, forms)}`
}

export default function ExpiryDateCalculatorPage() {
	const widget = getWidgetById('expiry-date-calculator')!

	const [productionDate, setProductionDate] = useState(todayIso())
	const [productionTime, setProductionTime] = useState('08:00')
	const [amount, setAmount] = useState('6')
	const [unit, setUnit] = useState<Unit>('months')

	// «Сейчас» берём на клиенте и обновляем раз в минуту: для сроков в часах
	// остаток меняется прямо на глазах.
	const [now, setNow] = useState<Date | null>(null)
	useEffect(() => {
		setNow(new Date())
		const id = setInterval(() => setNow(new Date()), 60_000)
		return () => clearInterval(id)
	}, [])

	const isHours = unit === 'hours'

	const result = useMemo(() => {
		const day = parseIso(productionDate)
		const parsed = parseAmount(amount)
		if (!day || parsed === null) return null

		const period = normalizePeriod(parsed, unit)
		if ('error' in period) return period

		let producedAt = day
		let expiresAt: Date
		if (period.unit === 'hours') {
			const [h, m] = productionTime.split(':').map(Number)
			producedAt = new Date(day)
			producedAt.setHours(h || 0, m || 0, 0, 0)
			expiresAt = new Date(producedAt.getTime() + period.amount * HOUR_MS)
		} else {
			expiresAt = addPeriod(day, period.amount, period.unit)
		}
		return { producedAt, expiresAt }
	}, [productionDate, productionTime, amount, unit])

	const applyPreset = (preset: (typeof PRESETS)[number]) => {
		setAmount(String(preset.amount))
		setUnit(preset.unit)
	}

	const reset = () => {
		setProductionDate(todayIso())
		setProductionTime('08:00')
		setAmount('6')
		setUnit('months')
	}

	const parsedAmount = parseAmount(amount)

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						Дата производства и срок хранения
					</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={reset}
							title='Сбросить'
							className={toolIconButton}
						>
							<RotateCcw className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<div className='grid gap-4 px-5 py-6 sm:grid-cols-2 sm:px-6'>
					<div>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							{isHours ? 'Дата и время изготовления' : 'Дата производства'}
						</span>
						<div className='flex gap-2'>
							<DatePicker
								value={productionDate}
								onChange={setProductionDate}
								ariaLabel='Дата производства'
								className={cn(inputClass, 'cursor-pointer')}
							/>
							{isHours && (
								<input
									type='time'
									value={productionTime}
									onChange={event => setProductionTime(event.target.value)}
									aria-label='Время изготовления'
									className={cn(inputClass, 'w-28 flex-shrink-0')}
								/>
							)}
						</div>
					</div>

					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Срок хранения
						</span>
						<div className='flex gap-2'>
							<input
								type='text'
								inputMode='decimal'
								value={amount}
								onChange={event =>
									setAmount(event.target.value.replace(/[^\d.,]/g, ''))
								}
								aria-label='Срок хранения, число'
								className={inputClass}
							/>
							<ToolSelect
								value={unit}
								onChange={event => setUnit(event.target.value as Unit)}
								aria-label='Единица срока хранения'
								className='w-32 flex-shrink-0 py-2'
							>
								{UNITS.map(item => (
									<option key={item.value} value={item.value}>
										{item.label}
									</option>
								))}
							</ToolSelect>
						</div>
					</label>
				</div>

				<div className='flex flex-wrap items-center gap-2 border-y bg-muted/30 px-5 py-3 sm:px-6'>
					<span className='mr-1 text-sm text-muted-foreground'>
						Частые сроки:
					</span>
					{PRESETS.map(preset => (
						<button
							key={preset.label}
							type='button'
							onClick={() => applyPreset(preset)}
							className={toolPill(
								unit === preset.unit && parsedAmount === preset.amount
							)}
						>
							{preset.label}
						</button>
					))}
				</div>

				{result && 'error' in result ? (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						{result.error}
					</p>
				) : result ? (
					<ExpiryResult
						producedAt={result.producedAt}
						expiresAt={result.expiresAt}
						now={now}
						withTime={isHours}
					/>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Укажите дату производства и срок хранения
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Месяцы и годы прибавляются календарно: 31 января плюс месяц даёт 28
						или 29 февраля, а не переезжает в март. Часы считаются от времени
						изготовления на упаковке.
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='expiry-date-calculator' />
			<ExpiryDateCalculatorSeo />
		</WidgetSEOWrapper>
	)
}

const STATUS_STYLES = {
	valid:
		'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400',
	soon: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
	expired: 'border-destructive/30 bg-destructive/10 text-destructive'
}

const BAR_STYLES = {
	valid: 'bg-green-500',
	soon: 'bg-amber-500',
	expired: 'bg-destructive'
}

function ExpiryResult({
	producedAt,
	expiresAt,
	now,
	withTime
}: {
	producedAt: Date
	expiresAt: Date
	now: Date | null
	withTime: boolean
}) {
	const dateLabel = formatDate(expiresAt, withTime)

	return (
		<div className='px-5 py-8 text-center sm:px-6'>
			<TextRoll
				key={dateLabel}
				className='inline-block font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl'
				duration={0.4}
				getEnterDelay={i => i * 0.02}
				getExitDelay={i => i * 0.02}
			>
				{dateLabel}
			</TextRoll>
			<span className='mt-1 block text-sm text-muted-foreground'>
				дата истечения срока годности
			</span>

			{/* До гидратации «сейчас» неизвестно: резервируем место под статус и
			    шкалу, чтобы они не сдвигали подвал карточки, когда появятся. */}
			<div className='mx-auto mt-6 min-h-[88px] max-w-md'>
				{now && (
					<ExpiryStatus
						producedAt={producedAt}
						expiresAt={expiresAt}
						now={now}
						withTime={withTime}
					/>
				)}
			</div>
		</div>
	)
}

function ExpiryStatus({
	producedAt,
	expiresAt,
	now,
	withTime
}: {
	producedAt: Date
	expiresAt: Date
	now: Date
	withTime: boolean
}) {
	const totalMs = expiresAt.getTime() - producedAt.getTime()

	// Для сроков в днях/месяцах/годах продукт годен весь последний день,
	// поэтому сравниваем календарные даты, а не миллисекунды.
	const leftMs = withTime
		? expiresAt.getTime() - now.getTime()
		: expiresAt.getTime() - startOfDay(now).getTime()
	const daysLeft = Math.round(leftMs / DAY_MS)
	const hoursLeft = Math.floor(leftMs / HOUR_MS)

	const status =
		leftMs < 0
			? ('expired' as const)
			: withTime
				? hoursLeft < 24
					? ('soon' as const)
					: ('valid' as const)
				: daysLeft <= 7
					? ('soon' as const)
					: ('valid' as const)

	let label: string
	if (status === 'expired') {
		const ago = Math.abs(withTime ? Math.ceil(leftMs / HOUR_MS) : daysLeft)
		label =
			withTime && ago < 48
				? `Просрочен ${plural(ago, HOURS)} назад`
				: `Просрочен ${plural(withTime ? Math.ceil(ago / 24) : ago, DAYS)} назад`
	} else if (withTime && hoursLeft < 48) {
		label =
			hoursLeft === 0
				? 'Истекает в течение часа'
				: `Осталось ${plural(hoursLeft, HOURS)}`
	} else if (!withTime && daysLeft === 0) {
		label = 'Последний день срока'
	} else {
		const days = withTime ? Math.floor(leftMs / DAY_MS) : daysLeft
		label = `Осталось ${plural(days, DAYS)}`
	}

	// Доля прошедшего срока: показываем, только если продукт уже произведён
	// и срок ненулевой.
	const elapsedMs = now.getTime() - producedAt.getTime()
	const showShare = totalMs > 0 && elapsedMs >= 0
	const leftShare = showShare
		? Math.max(0, Math.min(100, Math.round(100 - (elapsedMs / totalMs) * 100)))
		: null

	return (
		<>
			<div
				className={cn(
					'inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium',
					STATUS_STYLES[status]
				)}
			>
				{label}
			</div>

			{leftShare !== null && (
				<div className='mt-5 text-left'>
					<div className='h-2 overflow-hidden rounded-full bg-muted'>
						<div
							className={cn(
								'h-full rounded-full transition-all',
								BAR_STYLES[status]
							)}
							style={{ width: `${leftShare}%` }}
						/>
					</div>
					<p className='mt-2 text-center text-sm text-muted-foreground'>
						Остаточный срок годности: {leftShare}%
					</p>
				</div>
			)}
		</>
	)
}

function startOfDay(date: Date): Date {
	const result = new Date(date)
	result.setHours(0, 0, 0, 0)
	return result
}
