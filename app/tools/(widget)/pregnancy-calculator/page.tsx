'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import { calculatePregnancy } from '@/lib/utils/pregnancy'
import { pluralizeRu } from '@/lib/utils/pluralize'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { PregnancyCalculatorSeo } from './PregnancyCalculatorSeo'

const CYCLES = [21, 24, 26, 28, 30, 32, 35]

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

function formatDate(date: Date): string {
	return date.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	})
}

export default function PregnancyCalculatorPage() {
	const widget = getWidgetById('pregnancy-calculator')!

	const [lastPeriod, setLastPeriod] = useState(() => {
		const date = new Date()
		date.setDate(date.getDate() - 70)
		const offset = date.getTimezoneOffset() * 60000
		return new Date(date.getTime() - offset).toISOString().slice(0, 10)
	})
	const [cycle, setCycle] = useState(28)
	const [multiple, setMultiple] = useState(false)

	const result = useMemo(() => {
		const start = parseIso(lastPeriod)
		if (!start) return null
		return calculatePregnancy(start, parseIso(todayIso())!, cycle, multiple)
	}, [lastPeriod, cycle, multiple])

	const outOfRange = result !== null && result.trimester === null

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						Первый день последней менструации
					</span>

					<div className={cn(toolToggleTrack, 'sm:ml-auto')}>
						{(
							[
								[false, 'Один ребёнок'],
								[true, 'Двойня и больше']
							] as [boolean, string][]
						).map(([value, label]) => (
							<button
								key={label}
								type='button'
								onClick={() => setMultiple(value)}
								aria-pressed={multiple === value}
								className={toolToggleOption(multiple === value)}
							>
								{label}
							</button>
						))}
					</div>
				</div>

				<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-2 sm:px-6'>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Первый день последней менструации
						</span>
						<input
							type='date'
							value={lastPeriod}
							max={todayIso()}
							onChange={event => setLastPeriod(event.target.value)}
							aria-label='Первый день последней менструации'
							className='w-full cursor-pointer rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>

					<div>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Длина цикла, дней
						</span>
						<div className='flex flex-wrap gap-1.5'>
							{CYCLES.map(option => (
								<button
									key={option}
									type='button'
									onClick={() => setCycle(option)}
									aria-pressed={cycle === option}
									className={cn(
										'cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors',
										'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
										cycle === option
											? 'border-primary bg-primary/10 text-primary'
											: 'border-transparent text-muted-foreground hover:border-primary/50'
									)}
								>
									{option}
								</button>
							))}
						</div>
					</div>
				</div>

				{result && !outOfRange ? (
					<>
						<div className='px-5 py-8 text-center sm:px-6'>
							<span className='block font-mono text-4xl font-bold tracking-tight text-foreground sm:text-5xl'>
								{formatDate(result.dueDate)}
							</span>
							<span className='mt-2 block text-base font-medium text-muted-foreground'>
								предполагаемая дата родов
							</span>
							<span className='mt-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary'>
								{result.daysUntilDue >= 0
									? `осталось ${result.daysUntilDue} ${pluralizeRu(result.daysUntilDue, ['день', 'дня', 'дней'])}`
									: `срок прошёл ${Math.abs(result.daysUntilDue)} ${pluralizeRu(Math.abs(result.daysUntilDue), ['день', 'дня', 'дней'])} назад`}
							</span>
						</div>

						<div className='grid grid-cols-2 gap-4 border-t px-5 py-6 text-center sm:grid-cols-3 sm:px-6'>
							<div>
								<span className='block font-mono text-xl font-semibold text-foreground'>
									{result.weeks} нед. {result.days} дн.
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									акушерский срок
								</span>
							</div>
							<div>
								<span className='block font-mono text-xl font-semibold text-foreground'>
									{result.trimester}
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									триместр
								</span>
							</div>
							<div className='col-span-2 sm:col-span-1'>
								<span className='block font-mono text-xl font-semibold text-foreground'>
									{formatDate(result.maternityLeaveDate)}
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									декретный отпуск с {multiple ? '28' : '30'} недели
								</span>
							</div>
						</div>
					</>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						{outOfRange
							? 'Дата вне срока беременности — проверьте первый день последней менструации'
							: 'Укажите первый день последней менструации'}
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Это арифметика по дате, а не медицинское заключение. Срок уточняет
						только УЗИ, а роды с 37-й по 42-ю неделю считаются доношенными
					</span>
				</div>
			</Card>

			<PregnancyCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
