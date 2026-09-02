'use client'

import type { MonthRow } from '@/lib/utils/compound-interest'

interface CompoundInterestTableProps {
	rows: MonthRow[]
	step: 'month' | 'year'
}

function money(value: number): string {
	return Math.round(value).toLocaleString('ru-RU')
}

/**
 * Те же данные, что на графике, текстом.
 *
 * Это не украшение и не дубль: по графику нельзя снять точное число, а по
 * таблице можно — и она же закрывает требование к палитре иметь текстовое
 * представление там, где контраст ряда к фону ниже порога. Заголовок
 * прилипает к верху: на пятилетнем сроке строк шестьдесят, и без этого,
 * пролистав до середины, уже не помнишь, что в какой колонке.
 */
export function CompoundInterestTable({
	rows,
	step
}: CompoundInterestTableProps) {
	return (
		<div className='max-h-96 overflow-auto rounded-xl border'>
			<table className='w-full border-collapse text-sm'>
				<caption className='sr-only'>
					{step === 'month'
						? 'Помесячный расчёт вклада'
						: 'Погодовой расчёт вклада'}
				</caption>
				<thead className='sticky top-0 bg-muted/95 backdrop-blur'>
					<tr className='text-left text-muted-foreground'>
						<th scope='col' className='px-3 py-2 font-medium'>
							{step === 'month' ? 'Месяц' : 'Год'}
						</th>
						<th scope='col' className='px-3 py-2 text-right font-medium'>
							Пополнения
						</th>
						<th scope='col' className='px-3 py-2 text-right font-medium'>
							Начислено
						</th>
						<th scope='col' className='px-3 py-2 text-right font-medium'>
							Внесено всего
						</th>
						<th scope='col' className='px-3 py-2 text-right font-medium'>
							Доход всего
						</th>
						<th scope='col' className='px-3 py-2 text-right font-medium'>
							Баланс
						</th>
					</tr>
				</thead>
				<tbody className='font-mono tabular-nums'>
					{rows.map(row => (
						<tr
							key={step === 'month' ? row.month : row.year}
							className='border-t'
						>
							<th scope='row' className='px-3 py-1.5 text-left font-normal'>
								{step === 'month' ? row.month : row.year}
							</th>
							<td className='px-3 py-1.5 text-right text-muted-foreground'>
								{row.contributed > 0 ? money(row.contributed) : '—'}
							</td>
							<td className='px-3 py-1.5 text-right text-green-600 dark:text-green-400'>
								{money(row.interest)}
							</td>
							<td className='px-3 py-1.5 text-right text-muted-foreground'>
								{money(row.totalContributed)}
							</td>
							<td className='px-3 py-1.5 text-right text-muted-foreground'>
								{money(row.totalInterest)}
							</td>
							<td className='px-3 py-1.5 text-right font-medium'>
								{money(row.balance)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
