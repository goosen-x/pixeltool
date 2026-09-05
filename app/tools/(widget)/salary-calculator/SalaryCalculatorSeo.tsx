import Link from 'next/link'

export function SalaryCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Оклад и «на руки» — разные числа
				</h2>
				<p className='mt-3 text-muted-foreground'>
					В вакансиях и трудовых договорах пишут начисленную сумму, а обсуждают
					обычно ту, что придёт на карту. Между ними НДФЛ. При окладе 150 тысяч
					в месяц на руки выходит около 130 тысяч, и эти двадцать тысяч разницы
					стоит проговаривать на переговорах прямо, чтобы не выяснить потом, что
					стороны имели в виду разное.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Оклад</th>
								<th className='py-2 font-medium'>На руки</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>50 000 ₽</td>
								<td className='py-2 font-mono'>43 500 ₽</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>100 000 ₽</td>
								<td className='py-2 font-mono'>87 000 ₽</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>150 000 ₽</td>
								<td className='py-2 font-mono'>130 500 ₽</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему считаем за год, а не за месяц
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Шкала НДФЛ прогрессивная и применяется к доходу за год, а не за месяц.
					Поэтому месячная сумма переводится в годовую, налог считается по
					ступеням, и результат возвращается обратно в месяц. Практическое
					следствие: у высокого дохода в начале года на руки приходит больше,
					чем в конце, — как только годовой доход перешагивает порог, ставка на
					остаток года растёт.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Взносы платит работодатель
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Страховые взносы в фонды идут сверх вашего оклада и из зарплаты не
					удерживаются, поэтому в расчёте их нет. Работодателю сотрудник
					обходится примерно на 30% дороже оклада, но на сумму в руках это не
					влияет. Единственное, что удерживают из начисленного, — НДФЛ, разбивку
					по ступеням шкалы можно посмотреть в{' '}
					<Link
						href='/tools/ndfl-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькуляторе НДФЛ
					</Link>
					. Отпускные считаются по другой базе, среднему заработку за 12
					месяцев, для них есть отдельный{' '}
					<Link
						href='/tools/vacation-pay-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор отпускных
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
