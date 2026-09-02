'use client'

/**
 * Поле ввода трудовых калькуляторов. Вынесено общим, потому что все пять
 * страниц кластера состоят из одинаковых числовых полей с подписью и
 * пояснением, и держать пять копий одной разметки — верный способ развести
 * их по виду при первой правке.
 */
interface LaborFieldProps {
	label: string
	value: string
	onChange: (value: string) => void
	hint?: string
	suffix?: string
}

export function LaborField({
	label,
	value,
	onChange,
	hint,
	suffix
}: LaborFieldProps) {
	return (
		<label className='block'>
			<span className='mb-1.5 block text-sm text-muted-foreground'>
				{label}
				{suffix && <span className='text-muted-foreground/70'>, {suffix}</span>}
			</span>
			<input
				type='text'
				inputMode='decimal'
				value={value}
				onChange={event => onChange(event.target.value)}
				aria-label={label}
				className='w-full rounded-md border bg-background px-3 py-2 font-mono text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
			/>
			{hint && (
				<span className='mt-1 block text-xs text-muted-foreground'>{hint}</span>
			)}
		</label>
	)
}

export function parseNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(/\s/g, '').replace(',', '.'))
	return Number.isFinite(parsed) ? parsed : null
}

export function money(value: number): string {
	return Math.round(value).toLocaleString('ru-RU')
}

export function moneyPrecise(value: number): string {
	return value.toLocaleString('ru-RU', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	})
}

/** Плитка результата — тот же вид, что в остальных калькуляторах сайта. */
export function ResultTile({
	value,
	label,
	accent,
	/** Единица после числа. Не всякая плитка денежная: у декретных, например,
	 *  показывается число дней, и рубль там был бы прямой ошибкой. */
	unit = '₽'
}: {
	value: string
	label: string
	accent?: 'primary' | 'green'
	unit?: string
}) {
	const color =
		accent === 'primary'
			? 'text-primary'
			: accent === 'green'
				? 'text-green-600 dark:text-green-400'
				: 'text-foreground'

	return (
		<div className='rounded-xl border p-4'>
			<span
				className={`block font-mono text-xl font-bold whitespace-nowrap tabular-nums sm:text-2xl ${color}`}
			>
				{value}
				{unit && (
					<span className='ml-1 text-base text-muted-foreground'>{unit}</span>
				)}
			</span>
			<span className='mt-1 block text-sm text-muted-foreground'>{label}</span>
		</div>
	)
}
