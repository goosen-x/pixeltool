'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { ToolSelect } from '@/components/ui/tool-select'
import { toolBar, toolFooterBar } from '@/lib/ui/tool-pill'
import {
	daysInMonth,
	ELEMENT_NAMES,
	findIngress,
	formatDay,
	formatRange,
	getBirthDaySign,
	getCuspSigns,
	getSignAt,
	getSignByDate,
	isCuspDate,
	localToUtc,
	QUALITY_NAMES,
	russiaUtcOffset,
	type ZodiacId,
	type ZodiacSign
} from '@/lib/utils/zodiac'

const MONTHS = [
	'январь',
	'февраль',
	'март',
	'апрель',
	'май',
	'июнь',
	'июль',
	'август',
	'сентябрь',
	'октябрь',
	'ноябрь',
	'декабрь'
]

/** Пояса России «по зиме»; летнее время прошлых лет добавляется само. */
const ZONES = [
	{ offset: 2, label: 'Калининград, UTC+2' },
	{ offset: 3, label: 'Москва, UTC+3' },
	{ offset: 4, label: 'Самара, UTC+4' },
	{ offset: 5, label: 'Екатеринбург, UTC+5' },
	{ offset: 6, label: 'Омск, UTC+6' },
	{ offset: 7, label: 'Новосибирск, UTC+7' },
	{ offset: 8, label: 'Иркутск, UTC+8' },
	{ offset: 9, label: 'Якутск, UTC+9' },
	{ offset: 10, label: 'Владивосток, UTC+10' },
	{ offset: 11, label: 'Магадан, UTC+11' },
	{ offset: 12, label: 'Камчатка, UTC+12' }
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from(
	{ length: CURRENT_YEAR - 1900 + 1 },
	(_, index) => CURRENT_YEAR - index
)

/** Погрешность расчёта момента перехода — см. sunLongitude. */
const UNCERTAINTY_MINUTES = 20

const HOUR = 3600_000

function formatTime(utcMs: number, offsetHours: number): string {
	const local = new Date(utcMs + offsetHours * HOUR)
	const hours = String(local.getUTCHours()).padStart(2, '0')
	const minutes = String(local.getUTCMinutes()).padStart(2, '0')
	return `${hours}:${minutes}`
}

function formatDateTime(utcMs: number, offsetHours: number): string {
	const local = new Date(utcMs + offsetHours * HOUR)
	return `${formatDay(local.getUTCMonth() + 1, local.getUTCDate())} в ${formatTime(utcMs, offsetHours)}`
}

function parseTime(value: string): number | null {
	const match = /^(\d{2}):(\d{2})$/.exec(value)
	if (!match) return null
	return Number(match[1]) * 60 + Number(match[2])
}

interface ZodiacWidgetProps {
	/** Начальная дата — на странице знака подставляется его первый день,
	 *  чтобы человек сразу видел ответ, а не пустую форму. */
	initialMonth?: number
	initialDay?: number
	/** Подсветить, если получившийся знак не тот, ради которого пришли. */
	expectedSign?: ZodiacId
}

interface Verdict {
	/** Один знак или пара, если без времени рождения ответа нет. */
	signs: [ZodiacSign] | [ZodiacSign, ZodiacSign]
	note?: string
	warning?: string
}

export function ZodiacWidget({
	initialMonth = 1,
	initialDay = 1,
	expectedSign
}: ZodiacWidgetProps) {
	const [month, setMonth] = useState(initialMonth)
	const [day, setDay] = useState(initialDay)
	const [year, setYear] = useState<number | null>(null)
	const [time, setTime] = useState('')
	const [zone, setZone] = useState(3)

	// Если в выбранном месяце нет такого числа (31 апреля, 29 февраля
	// невисокосного года), подтягиваем к последнему дню месяца, а не
	// показываем пустой результат.
	const maxDay = daysInMonth(month, year ?? undefined)
	const safeDay = Math.min(day, maxDay)
	const cusp = isCuspDate(month, safeDay)
	const needsTime = cusp && year !== null

	const verdict = ((): Verdict => {
		const tableSign = getSignByDate(month, safeDay)

		if (year === null) {
			if (!cusp) return { signs: [tableSign] }
			const [first, second] = getCuspSigns(month, safeDay)
			return {
				signs: [tableSign],
				note: `Дата пограничная: в одни годы ${formatDay(month, safeDay)} это ${first.name}, в другие ${second.name}. Солнце переходит в следующий знак не в полночь, и момент перехода гуляет от года к году. Выберите год рождения, и знак посчитается точно.`
			}
		}

		const offset = russiaUtcOffset(zone, year, month, safeDay)
		const birthDay = getBirthDaySign(year, month, safeDay, offset)

		if (birthDay.ingressUtc === null) {
			const sign = birthDay.signAtStart
			if (!cusp) return { signs: [sign] }
			const dayStart = localToUtc(year, month, safeDay, 0, offset)
			const nearest =
				findIngress(dayStart - 3 * 24 * HOUR, dayStart) ??
				findIngress(dayStart + 24 * HOUR, dayStart + 4 * 24 * HOUR)
			const nearestText =
				nearest !== null
					? ` Ближайший переход, в знак ${getSignAt(nearest).nameGenitive}, был ${formatDateTime(nearest, offset)}.`
					: ''
			return {
				signs: [sign],
				note: `В ${year} году Солнце весь день ${formatDay(month, safeDay)} было в знаке ${sign.nameGenitive}.${nearestText}`
			}
		}

		const { signAtStart: before, signAtEnd: after, ingressUtc } = birthDay
		const ingressText = `В ${year} году Солнце перешло из знака ${before.nameGenitive} в знак ${after.nameGenitive} ${formatDay(month, safeDay)} в ${formatTime(ingressUtc, offset)}.`
		const minutes = parseTime(time)

		if (minutes === null) {
			return {
				signs: [before, after],
				note: `${ingressText} Если родились раньше, ваш знак ${before.name}, если позже, то ${after.name}. Укажите время рождения.`
			}
		}

		const birthUtc = localToUtc(year, month, safeDay, minutes, offset)
		const sign = birthUtc < ingressUtc ? before : after
		const gap = Math.abs(birthUtc - ingressUtc) / 60_000
		return {
			signs: [sign],
			note: `${ingressText} Вы родились ${birthUtc < ingressUtc ? 'раньше' : 'позже'}, значит, ваш знак ${sign.name}.`,
			warning:
				gap < UNCERTAINTY_MINUTES
					? `Между рождением и переходом меньше ${UNCERTAINTY_MINUTES} минут, а погрешность расчёта около четверти часа. Тут поможет только натальная карта с точными эфемеридами и местом рождения.`
					: undefined
		}
	})()

	const [mainSign] = verdict.signs
	const single = verdict.signs.length === 1

	return (
		<Card className='overflow-hidden p-0'>
			<div className={toolBar}>
				<div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
					<span>Дата рождения</span>
					<ToolSelect
						value={safeDay}
						onChange={event => setDay(Number(event.target.value))}
						aria-label='День рождения'
					>
						{Array.from({ length: maxDay }, (_, index) => (
							<option key={index + 1} value={index + 1}>
								{index + 1}
							</option>
						))}
					</ToolSelect>
					<ToolSelect
						value={month}
						onChange={event => setMonth(Number(event.target.value))}
						aria-label='Месяц рождения'
					>
						{MONTHS.map((name, index) => (
							<option key={name} value={index + 1}>
								{name}
							</option>
						))}
					</ToolSelect>
					<ToolSelect
						value={year ?? ''}
						onChange={event =>
							setYear(event.target.value ? Number(event.target.value) : null)
						}
						aria-label='Год рождения'
					>
						<option value=''>год не важен</option>
						{YEARS.map(value => (
							<option key={value} value={value}>
								{value}
							</option>
						))}
					</ToolSelect>
				</div>

				<span className='text-sm text-muted-foreground sm:ml-auto'>
					год и время нужны только на стыке знаков
				</span>
			</div>

			{needsTime && (
				<div className={toolBar}>
					<label className='flex items-center gap-2 text-sm text-muted-foreground'>
						Время рождения
						<input
							type='time'
							value={time}
							onChange={event => setTime(event.target.value)}
							className='cursor-pointer rounded-md border bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>
					<label className='flex min-w-0 max-w-full items-center gap-2 text-sm text-muted-foreground'>
						Где
						<ToolSelect
							className='min-w-0 max-w-full'
							value={zone}
							onChange={event => setZone(Number(event.target.value))}
							aria-label='Часовой пояс места рождения'
						>
							{ZONES.map(item => (
								<option key={item.offset} value={item.offset}>
									{item.label}
								</option>
							))}
						</ToolSelect>
					</label>
					<span className='w-full text-xs text-muted-foreground'>
						Летнее время 1981–2010 и 2011–2014 годов учтено по правилам России.
					</span>
				</div>
			)}

			<div
				className='flex flex-col items-center gap-2 px-5 py-10 sm:px-6'
				aria-live='polite'
			>
				<span className='text-6xl leading-none' aria-hidden='true'>
					{verdict.signs.map(sign => sign.symbol).join(' ')}
				</span>
				<span className='text-center text-3xl font-bold tracking-tight'>
					{verdict.signs.map(sign => sign.name).join(' или ')}
				</span>
				{single && (
					<span className='text-center text-sm text-muted-foreground'>
						{mainSign.name}: {formatRange(mainSign)}
					</span>
				)}

				{verdict.note && (
					<p className='mt-2 max-w-md text-center text-sm text-muted-foreground'>
						{verdict.note}
					</p>
				)}

				{verdict.warning && (
					<p className='mt-2 max-w-md text-center text-sm text-amber-600 dark:text-amber-400'>
						{verdict.warning}
					</p>
				)}

				{single && expectedSign && expectedSign !== mainSign.id && (
					<p className='mt-2 max-w-md text-center text-sm text-muted-foreground'>
						Эта дата уже за границей знака, на странице которого вы находитесь.
					</p>
				)}
			</div>

			{single && (
				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Стихия{' '}
						<span className='text-foreground'>
							{ELEMENT_NAMES[mainSign.element]}
						</span>
					</span>
					<span className='text-sm text-muted-foreground'>
						Качество{' '}
						<span className='text-foreground'>
							{QUALITY_NAMES[mainSign.quality]}
						</span>
					</span>
					<span className='text-sm text-muted-foreground'>
						Управитель{' '}
						<span className='text-foreground'>{mainSign.ruler}</span>
					</span>
				</div>
			)}
		</Card>
	)
}
