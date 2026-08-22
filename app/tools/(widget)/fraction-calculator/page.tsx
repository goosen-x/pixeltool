'use client'

import { useMemo, useState } from 'react'
import { Check, Copy, RotateCcw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import {
	add,
	subtract,
	multiply,
	divide,
	toDecimal,
	toMixedNumber,
	type Fraction
} from '@/lib/utils/fraction-calculator'
import { FractionCalculatorSeo } from './FractionCalculatorSeo'

type Mode = 'add' | 'subtract' | 'multiply' | 'divide'

const MODES: [Mode, string][] = [
	['add', 'Сложение'],
	['subtract', 'Вычитание'],
	['multiply', 'Умножение'],
	['divide', 'Деление']
]

const OPERATOR: Record<Mode, string> = {
	add: '+',
	subtract: '−',
	multiply: '×',
	divide: '÷'
}

const DEFAULTS = { aNum: '1', aDen: '2', bNum: '1', bDen: '3' }

function toInt(value: string): number | null {
	const trimmed = value.trim()
	if (trimmed === '' || trimmed === '-') return null
	const parsed = parseInt(trimmed, 10)
	return Number.isFinite(parsed) ? parsed : null
}

function formatDecimal(value: number): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: 4 })
}

function FractionInput({
	label,
	num,
	den,
	onNumChange,
	onDenChange
}: {
	label: string
	num: string
	den: string
	onNumChange: (value: string) => void
	onDenChange: (value: string) => void
}) {
	const fieldClass =
		'w-16 bg-transparent text-center font-mono text-2xl text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md'

	return (
		<div className='flex flex-col items-center gap-2'>
			<span className='text-xs text-muted-foreground'>{label}</span>
			<div className='flex flex-col items-center gap-1'>
				<input
					type='text'
					inputMode='numeric'
					value={num}
					onChange={event => onNumChange(event.target.value)}
					aria-label={`${label}, числитель`}
					className={fieldClass}
				/>
				<div className='h-0.5 w-14 bg-foreground/60' />
				<input
					type='text'
					inputMode='numeric'
					value={den}
					onChange={event => onDenChange(event.target.value)}
					aria-label={`${label}, знаменатель`}
					className={fieldClass}
				/>
			</div>
		</div>
	)
}

export default function FractionCalculatorPage() {
	const widget = getWidgetById('fraction-calculator')!
	const [mode, setMode] = useState<Mode>('add')

	const [aNum, setANum] = useState(DEFAULTS.aNum)
	const [aDen, setADen] = useState(DEFAULTS.aDen)
	const [bNum, setBNum] = useState(DEFAULTS.bNum)
	const [bDen, setBDen] = useState(DEFAULTS.bDen)

	const [copied, setCopied] = useState(false)

	const aNumVal = toInt(aNum)
	const aDenVal = toInt(aDen)
	const bNumVal = toInt(bNum)
	const bDenVal = toInt(bDen)

	const result = useMemo((): Fraction | null => {
		if (aNumVal === null || aDenVal === null || aDenVal === 0) return null
		if (bNumVal === null || bDenVal === null || bDenVal === 0) return null
		const a: Fraction = { num: aNumVal, den: aDenVal }
		const b: Fraction = { num: bNumVal, den: bDenVal }
		if (mode === 'add') return add(a, b)
		if (mode === 'subtract') return subtract(a, b)
		if (mode === 'multiply') return multiply(a, b)
		return divide(a, b)
	}, [aNumVal, aDenVal, bNumVal, bDenVal, mode])

	const errorMessage = useMemo(() => {
		if (aDenVal === 0 || bDenVal === 0) return 'Знаменатель не может быть 0'
		if (mode === 'divide' && bNumVal === 0) return 'Деление на 0 невозможно'
		if (
			aNumVal === null ||
			aDenVal === null ||
			bNumVal === null ||
			bDenVal === null
		) {
			return 'Заполните обе дроби'
		}
		return null
	}, [aNumVal, aDenVal, bNumVal, bDenVal, mode])

	const mixed = result ? toMixedNumber(result) : null
	const showMixed = Boolean(
		mixed && mixed.num !== 0 && Math.abs(result!.num) > result!.den
	)

	const summaryText = result
		? `${aNum}/${aDen} ${OPERATOR[mode]} ${bNum}/${bDen} = ${result.num}/${result.den} (${formatDecimal(toDecimal(result))})`
		: ''

	const copyResult = () => {
		if (!summaryText) return
		navigator.clipboard.writeText(summaryText)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const reset = () => {
		setANum(DEFAULTS.aNum)
		setADen(DEFAULTS.aDen)
		setBNum(DEFAULTS.bNum)
		setBDen(DEFAULTS.bDen)
		setMode('add')
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{MODES.map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setMode(value)}
								aria-pressed={mode === value}
								className={toolPill(mode === value)}
							>
								{label}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyResult}
							disabled={!result}
							title='Скопировать результат'
							className={toolIconButton}
						>
							{copied ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
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

				<div className='flex flex-wrap items-center justify-center gap-4 px-5 py-10 sm:gap-6 sm:px-6'>
					<FractionInput
						label='Первая дробь'
						num={aNum}
						den={aDen}
						onNumChange={setANum}
						onDenChange={setADen}
					/>
					<span className='font-mono text-3xl text-muted-foreground'>
						{OPERATOR[mode]}
					</span>
					<FractionInput
						label='Вторая дробь'
						num={bNum}
						den={bDen}
						onNumChange={setBNum}
						onDenChange={setBDen}
					/>
					<span className='font-mono text-3xl text-muted-foreground'>=</span>

					{/* Ширина блока зафиксирована явно (w-40), а не выводится из
					контента: у span с ошибкой нет текста, когда дробь валидна,
					а пустой invisible-элемент даёт 0px и не резервирует место —
					сама grid-ячейка тогда «плавает» по ширине активного варианта.
					Явный w-40 держит место навсегда, чем бы ячейка ни была занята. */}
					<div className='grid w-40 place-items-center'>
						<div
							className={cn(
								'col-start-1 row-start-1 flex flex-col items-center gap-2',
								!result && 'invisible'
							)}
						>
							<span className='text-xs text-muted-foreground'>Результат</span>
							<div className='flex flex-col items-center gap-1'>
								<span className='font-mono text-3xl font-bold text-foreground sm:text-4xl'>
									{result ? result.num : 0}
								</span>
								<div className='h-0.5 w-14 bg-foreground' />
								<span className='font-mono text-3xl font-bold text-foreground sm:text-4xl'>
									{result ? result.den : 0}
								</span>
							</div>
						</div>
						<span
							className={cn(
								'col-start-1 row-start-1 text-center text-sm text-muted-foreground',
								result && 'invisible'
							)}
						>
							{errorMessage}
						</span>
					</div>
				</div>

				{/* Полоса всегда в разметке — прячем содержимое через invisible,
				чтобы карточка не меняла высоту при появлении/исчезновении результата. */}
				<div className={toolFooterBar}>
					<span
						className={cn('text-sm text-muted-foreground', !result && 'invisible')}
					>
						≈{' '}
						<span className='font-mono text-foreground'>
							{result ? formatDecimal(toDecimal(result)) : '0'}
						</span>
					</span>
					<span
						className={cn(
							'text-sm text-muted-foreground',
							!(showMixed && mixed) && 'invisible'
						)}
					>
						Смешанное число:{' '}
						<span className='font-mono text-foreground'>
							{mixed ? `${mixed.whole} ${mixed.num}/${mixed.den}` : '0 0/0'}
						</span>
					</span>
				</div>
			</Card>

			<FractionCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
