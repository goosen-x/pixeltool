import {
	digitSum,
	lifePathNumber,
	personalYearNumber,
	MASTER_NUMBERS
} from '@/lib/utils/numerology'

function reductionPath(value: number, stopOnMaster: boolean): number[] {
	const path = [value]
	let current = value
	while (
		current > 9 &&
		!(stopOnMaster && MASTER_NUMBERS.includes(current as 11 | 22 | 33))
	) {
		current = digitSum(current)
		path.push(current)
	}
	return path
}

interface StepRowProps {
	title: string
	parts: { label: string; value: number }[]
	total: number
	stopOnMaster: boolean
	startDelayStep: number
}

function StepRow({ title, parts, total, stopOnMaster, startDelayStep }: StepRowProps) {
	const path = reductionPath(total, stopOnMaster)
	let stepIndex = startDelayStep

	return (
		<div className='rounded-xl border p-4'>
			<span className='block text-sm font-medium text-foreground'>{title}</span>
			<div className='mt-3 flex flex-wrap items-center gap-2 text-sm'>
				{parts.map((part, index) => (
					<span key={part.label} className='flex items-center gap-2'>
						<span
							className='animate-step-reveal rounded-md border px-2 py-1 font-mono'
							style={{ animationDelay: `${stepIndex++ * 200}ms` }}
						>
							{part.label} → {digitSum(part.value)}
						</span>
						{index < parts.length - 1 && (
							<span className='text-muted-foreground'>+</span>
						)}
					</span>
				))}
				<span className='text-muted-foreground'>=</span>
				{path.map((value, index) => (
					<span key={index} className='flex items-center gap-2'>
						<span
							className='animate-step-reveal rounded-md border bg-muted/40 px-2 py-1 font-mono'
							style={{ animationDelay: `${stepIndex++ * 200}ms` }}
						>
							{value}
						</span>
						{index < path.length - 1 && (
							<span className='text-muted-foreground'>→</span>
						)}
					</span>
				))}
			</div>
		</div>
	)
}

interface NumerologyStepBreakdownProps {
	day: number
	month: number
	year: number
	currentYear: number
}

export function NumerologyStepBreakdown({
	day,
	month,
	year,
	currentYear
}: NumerologyStepBreakdownProps) {
	const lifePathTotal = digitSum(day) + digitSum(month) + digitSum(year)
	const personalYearTotal = digitSum(day) + digitSum(month) + digitSum(currentYear)

	return (
		<div className='mx-auto mt-6 max-w-lg space-y-4'>
			<StepRow
				title={`Число жизненного пути = ${lifePathNumber(day, month, year)}`}
				parts={[
					{ label: 'день', value: day },
					{ label: 'месяц', value: month },
					{ label: 'год', value: year }
				]}
				total={lifePathTotal}
				stopOnMaster
				startDelayStep={0}
			/>
			<StepRow
				title={`Персональный год ${currentYear} = ${personalYearNumber(day, month, currentYear)}`}
				parts={[
					{ label: 'день', value: day },
					{ label: 'месяц', value: month },
					{ label: 'текущий год', value: currentYear }
				]}
				total={personalYearTotal}
				stopOnMaster={false}
				startDelayStep={4}
			/>
		</div>
	)
}
