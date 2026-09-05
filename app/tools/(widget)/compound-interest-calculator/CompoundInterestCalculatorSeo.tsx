import Link from 'next/link'

export function CompoundInterestCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему капитализация важнее, чем кажется по цифре ставки
				</h2>
				<p className='mt-3 text-muted-foreground'>
					При простом проценте банк каждый раз считает начисление от одной и той
					же исходной суммы. При сложном — уже начисленные проценты
					присоединяются к вкладу и сами начинают зарабатывать проценты. Разница
					на короткой дистанции почти незаметна, но на 10–15 годах вклад с
					капитализацией и без неё расходятся уже на десятки процентов при
					одинаковой ставке.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Пример роста вклада 100 000 ₽ без дополнительных пополнений, с
					ежемесячной капитализацией:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Ставка</th>
								<th className='py-2 pr-4 font-medium'>Через 1 год</th>
								<th className='py-2 pr-4 font-medium'>Через 5 лет</th>
								<th className='py-2 font-medium'>Через 10 лет</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>5%</td>
								<td className='py-2 pr-4 font-mono'>105 116 ₽</td>
								<td className='py-2 pr-4 font-mono'>128 336 ₽</td>
								<td className='py-2 font-mono'>164 701 ₽</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>10%</td>
								<td className='py-2 pr-4 font-mono'>110 471 ₽</td>
								<td className='py-2 pr-4 font-mono'>164 531 ₽</td>
								<td className='py-2 font-mono'>270 704 ₽</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>15%</td>
								<td className='py-2 pr-4 font-mono'>116 075 ₽</td>
								<td className='py-2 pr-4 font-mono'>210 718 ₽</td>
								<td className='py-2 font-mono'>444 020 ₽</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему периодичность капитализации меняет итог
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Чем чаще проценты присоединяются к телу вклада, тем раньше они сами
					начинают расти. Ежедневная капитализация при равной ставке всегда
					выгоднее ежемесячной, а та — выгоднее капитализации раз в год: разница
					небольшая в абсолютных числах, но накапливается за годы. Переключите
					периодичность сверху, чтобы сравнить варианты на своих цифрах.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как считается ежемесячное пополнение
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Пополнение добавляется к вкладу раз в месяц независимо от того, какая
					периодичность капитализации выбрана, ровно так же, как это устроено у
					большинства банковских вкладов с довнесением средств. Проценты на
					каждое пополнение начинают начисляться со дня, следующего за его
					внесением, а не задним числом с начала срока. Если проценты в задаче
					простые, без капитализации, посчитать их проще в{' '}
					<Link
						href='/tools/percent-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькуляторе процентов
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
