'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { ru } from 'date-fns/locale'

import { cn } from '@/lib/utils'
import { formatIsoToRu, parseRuDateToIso } from '@/lib/utils/date-input'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'

function isoToDate(iso: string | undefined): Date | undefined {
	if (!iso) return undefined
	const [year, month, day] = iso.split('-').map(Number)
	if (!year || !month || !day) return undefined
	return new Date(year, month - 1, day)
}

function dateToIso(date: Date): string {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

export interface DatePickerProps {
	value: string
	onChange: (value: string) => void
	min?: string
	max?: string
	ariaLabel?: string
	placeholder?: string
	className?: string
}

/**
 * Drop-in замена <input type='date'> — тот же контракт (ISO-строка
 * YYYY-MM-DD в value/onChange), но с вводом текстом ДД.ММ.ГГГГ и
 * календарём с выпадающими месяцем/годом вместо нативного пикера
 * браузера.
 */
export function DatePicker({
	value,
	onChange,
	min,
	max,
	ariaLabel,
	placeholder = 'ДД.ММ.ГГГГ',
	className
}: DatePickerProps) {
	const [open, setOpen] = React.useState(false)
	const [text, setText] = React.useState(() => formatIsoToRu(value))
	const isFocused = React.useRef(false)

	React.useEffect(() => {
		if (!isFocused.current) setText(formatIsoToRu(value))
	}, [value])

	function commit(rawText: string): void {
		const iso = parseRuDateToIso(rawText)
		const outOfRange = iso && ((min && iso < min) || (max && iso > max))

		if (!iso || outOfRange) {
			setText(formatIsoToRu(value))
			return
		}

		onChange(iso)
		setText(formatIsoToRu(iso))
	}

	return (
		<div className='relative'>
			<input
				type='text'
				inputMode='numeric'
				value={text}
				placeholder={placeholder}
				aria-label={ariaLabel}
				onFocus={() => {
					isFocused.current = true
				}}
				onChange={event => setText(event.target.value)}
				onBlur={event => {
					isFocused.current = false
					commit(event.target.value)
				}}
				onKeyDown={event => {
					if (event.key === 'Enter') event.currentTarget.blur()
				}}
				className={cn(className, 'pr-9')}
			/>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<button
						type='button'
						aria-label='Открыть календарь'
						className='text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex w-9 cursor-pointer items-center justify-center'
					>
						<CalendarIcon className='size-4' />
					</button>
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0' align='end'>
					<Calendar
						mode='single'
						captionLayout='dropdown'
						locale={ru}
						formatters={{
							formatMonthDropdown: date =>
								date.toLocaleString('ru', { month: 'long' })
						}}
						selected={isoToDate(value)}
						defaultMonth={isoToDate(value) ?? isoToDate(max) ?? new Date()}
						startMonth={isoToDate(min) ?? new Date(1900, 0, 1)}
						endMonth={isoToDate(max) ?? new Date(2100, 0, 1)}
						disabled={date => {
							const iso = dateToIso(date)
							if (min && iso < min) return true
							if (max && iso > max) return true
							return false
						}}
						onSelect={date => {
							if (!date) return
							const iso = dateToIso(date)
							onChange(iso)
							setText(formatIsoToRu(iso))
							setOpen(false)
						}}
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}
