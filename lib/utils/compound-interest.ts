/**
 * Сложный процент с ежемесячным пополнением.
 *
 * Дневная симуляция, а не готовая формула аннуитета: пополнение всегда
 * ежемесячное (так его чаще всего ищут), а капитализация может быть
 * ежедневной, ежемесячной, ежеквартальной или годовой — эти два периода не
 * совпадают, и формула сложных процентов одним выражением такую комбинацию
 * не считает. Проценты копятся каждый день на текущий остаток и добавляются
 * к нему только в дату капитализации — до этого сами на себя не начисляются,
 * ровно как в банковском вкладе.
 *
 * Раньше эта логика жила прямо в странице тула и отдавала только три итоговых
 * числа. Вынесена сюда вместе с помесячной разбивкой: она нужна и графику, и
 * таблице, и её саму можно покрыть тестами.
 */

export type Capitalization = 365 | 12 | 4 | 1

/** Состояние счёта на конец расчётного месяца. */
export interface MonthRow {
	/** Номер месяца от начала, с единицы. */
	month: number
	/** Номер года, с единицы — для группировки и переключения на годовой шаг. */
	year: number
	/** Пополнения за этот месяц. */
	contributed: number
	/** Начислено процентов за этот месяц. */
	interest: number
	/** Внесено всего нарастающим итогом, вместе с начальной суммой. */
	totalContributed: number
	/** Начислено процентов всего нарастающим итогом. */
	totalInterest: number
	/** Сумма на счёте с учётом накопленных, но ещё не капитализированных процентов. */
	balance: number
}

export interface SimulationResult {
	finalAmount: number
	totalContributed: number
	interestEarned: number
	months: MonthRow[]
}

export interface SimulationInput {
	principal: number
	annualRatePercent: number
	years: number
	monthlyContribution: number
	capitalizationsPerYear: Capitalization
}

export function simulate({
	principal,
	annualRatePercent,
	years,
	monthlyContribution,
	capitalizationsPerYear
}: SimulationInput): SimulationResult | null {
	const totalDays = Math.round(years * 365)
	if (totalDays <= 0 || principal < 0 || monthlyContribution < 0) return null

	const dailyRate = annualRatePercent / 100 / 365

	let balance = principal
	let pendingInterest = 0
	let totalContributed = principal

	let capIndex = 1
	let nextCapDay = Math.round(365 / capitalizationsPerYear)
	let contribIndex = 1
	let nextContribDay = Math.round(365 / 12)

	let monthIndex = 1
	let nextMonthDay = Math.round(365 / 12)

	const months: MonthRow[] = []
	let previousContributed = principal
	let previousInterest = 0

	const pushRow = (dayOfRow: number) => {
		const onAccount = balance + pendingInterest
		const totalInterest = onAccount - totalContributed

		months.push({
			month: monthIndex,
			year: Math.ceil(monthIndex / 12),
			contributed: totalContributed - previousContributed,
			interest: totalInterest - previousInterest,
			totalContributed,
			totalInterest,
			balance: onAccount
		})

		previousContributed = totalContributed
		previousInterest = totalInterest
		void dayOfRow
	}

	for (let day = 1; day <= totalDays; day++) {
		pendingInterest += balance * dailyRate

		if (monthlyContribution > 0 && day === nextContribDay) {
			balance += monthlyContribution
			totalContributed += monthlyContribution
			contribIndex++
			nextContribDay = Math.round((contribIndex * 365) / 12)
		}

		if (day === nextCapDay) {
			balance += pendingInterest
			pendingInterest = 0
			capIndex++
			nextCapDay = Math.round((capIndex * 365) / capitalizationsPerYear)
		}

		// Снимок делается после пополнения и капитализации того же дня, чтобы
		// строка таблицы совпадала с тем, что человек увидел бы на выписке на
		// конец месяца, а не с промежуточным состоянием внутри дня.
		if (day === nextMonthDay) {
			pushRow(day)
			monthIndex++
			nextMonthDay = Math.round((monthIndex * 365) / 12)
		}
	}

	// Хвост неполного месяца: при сроке вроде 2,5 лет последние дни иначе не
	// попали бы ни в одну строку, и таблица не сошлась бы с итогом.
	const lastRow = months[months.length - 1]
	const finalAmount = balance + pendingInterest
	if (!lastRow || Math.abs(lastRow.balance - finalAmount) > 1e-9) {
		pushRow(totalDays)
	}

	return {
		finalAmount,
		totalContributed,
		interestEarned: finalAmount - totalContributed,
		months
	}
}

/**
 * Свёртка помесячных строк в годовые — то же, что показывает таблица на
 * годовом шаге. Берём последнюю строку каждого года для остатков и сумму
 * приростов внутри года для пополнений и процентов.
 */
export function toYearRows(months: MonthRow[]): MonthRow[] {
	const byYear = new Map<number, MonthRow[]>()
	for (const row of months) {
		const list = byYear.get(row.year)
		if (list) list.push(row)
		else byYear.set(row.year, [row])
	}

	return [...byYear.entries()]
		.sort((a, b) => a[0] - b[0])
		.map(([year, rows]) => {
			const last = rows[rows.length - 1]
			return {
				...last,
				year,
				contributed: rows.reduce((sum, row) => sum + row.contributed, 0),
				interest: rows.reduce((sum, row) => sum + row.interest, 0)
			}
		})
}
