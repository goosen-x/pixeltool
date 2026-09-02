'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { ToolSelect } from '@/components/ui/tool-select'
import { toolBar, toolFooterBar } from '@/lib/ui/tool-pill'
import {
	daysInMonth,
	ELEMENT_NAMES,
	formatDay,
	formatRange,
	getSignByDate,
	isCuspDate,
	QUALITY_NAMES,
	type ZodiacId
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

interface ZodiacWidgetProps {
	/** Начальная дата — на странице знака подставляется его первый день,
	 *  чтобы человек сразу видел ответ, а не пустую форму. */
	initialMonth?: number
	initialDay?: number
	/** Подсветить, если получившийся знак не тот, ради которого пришли. */
	expectedSign?: ZodiacId
}

export function ZodiacWidget({
	initialMonth = 1,
	initialDay = 1,
	expectedSign
}: ZodiacWidgetProps) {
	const [month, setMonth] = useState(initialMonth)
	const [day, setDay] = useState(initialDay)

	// Если в выбранном месяце нет такого числа (31 апреля), подтягиваем к
	// последнему дню месяца, а не показываем пустой результат.
	const safeDay = Math.min(day, daysInMonth(month))
	const sign = getSignByDate(month, safeDay)
	const cusp = isCuspDate(month, safeDay)

	return (
		<Card className='overflow-hidden p-0'>
			<div className={toolBar}>
				<label className='flex items-center gap-2 text-sm text-muted-foreground'>
					Дата рождения
					<ToolSelect
						value={safeDay}
						onChange={event => setDay(Number(event.target.value))}
						aria-label='День рождения'
					>
						{Array.from({ length: daysInMonth(month) }, (_, index) => (
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
				</label>

				<span className='text-sm text-muted-foreground sm:ml-auto'>
					год не нужен: границы знаков от него не зависят
				</span>
			</div>

			<div className='flex flex-col items-center gap-2 px-5 py-10 sm:px-6'>
				<span className='text-6xl leading-none' aria-hidden='true'>
					{sign.symbol}
				</span>
				<span className='text-3xl font-bold tracking-tight'>{sign.name}</span>
				<span className='text-sm text-muted-foreground'>
					{formatDay(month, safeDay)} — это {sign.name.toLowerCase()},{' '}
					{formatRange(sign)}
				</span>

				{cusp && (
					<p className='mt-2 max-w-md text-center text-sm text-muted-foreground'>
						Дата пограничная. Солнце входит в знак не в полночь, и момент
						перехода смещается в пределах суток от года к году — на такой дате
						знак стоит уточнить по году и времени рождения.
					</p>
				)}

				{expectedSign && expectedSign !== sign.id && (
					<p className='mt-2 max-w-md text-center text-sm text-muted-foreground'>
						Эта дата уже за границей знака, на котором вы находитесь.
					</p>
				)}
			</div>

			<div className={toolFooterBar}>
				<span className='text-sm text-muted-foreground'>
					Стихия{' '}
					<span className='text-foreground'>{ELEMENT_NAMES[sign.element]}</span>
				</span>
				<span className='text-sm text-muted-foreground'>
					Качество{' '}
					<span className='text-foreground'>{QUALITY_NAMES[sign.quality]}</span>
				</span>
				<span className='text-sm text-muted-foreground'>
					Управитель <span className='text-foreground'>{sign.ruler}</span>
				</span>
			</div>
		</Card>
	)
}
