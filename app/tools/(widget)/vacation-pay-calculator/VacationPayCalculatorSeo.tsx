import Link from 'next/link'

export function VacationPayCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему в отпуске «теряются» деньги
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Замечают почти все: месяц с отпуском выходит дешевле обычного, хотя
					отработано столько же. Причина в разных знаменателях. Зарплату платят
					за рабочие дни, которых в месяце около двадцати одного, а отпускные
					считают через календарные, которых 29,3. Значит, один день отпуска
					дешевле одного рабочего дня примерно на треть, и чем больше рабочих
					дней вы заменили отпускными, тем заметнее разница.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Это не ошибка бухгалтерии и не удержание: так устроена статья 139
					Трудового кодекса. Выгоднее брать отпуск в месяцах, где много рабочих
					дней и мало праздников, — январь и май в этом смысле худшие.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Пример по формуле калькулятора для отпуска в 28 дней при полном
					расчётном периоде (12 месяцев, делитель 351,6 календарного дня):
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Оклад в месяц</th>
								<th className='py-2 pr-4 font-medium'>Отпускные начислено</th>
								<th className='py-2 font-medium'>На руки после НДФЛ</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>50 000 ₽</td>
								<td className='py-2 pr-4 font-mono'>47 782 ₽</td>
								<td className='py-2 font-mono'>41 570 ₽</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>100 000 ₽</td>
								<td className='py-2 pr-4 font-mono'>95 563 ₽</td>
								<td className='py-2 font-mono'>83 140 ₽</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>150 000 ₽</td>
								<td className='py-2 pr-4 font-mono'>143 345 ₽</td>
								<td className='py-2 font-mono'>124 710 ₽</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что входит в расчётный период
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Берутся 12 календарных месяцев перед отпуском. В заработок входят
					оклад, премии и надбавки — посчитать, сколько из оклада реально
					приходит на руки, можно в{' '}
					<Link
						href='/tools/salary-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькуляторе зарплаты
					</Link>
					. Не входят прошлые отпускные, больничные и командировочные — эти дни
					из периода исключаются вместе с выплатами, для больничных суммы
					удобнее проверить в{' '}
					<Link
						href='/tools/sick-leave-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькуляторе больничного
					</Link>
					. Поэтому в поле «полных месяцев» ставят только те, что отработаны
					целиком, а остаток пересчитывают в календарные дни отдельно.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Число 29,3 не выдумано
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Это среднемесячное число календарных дней, законодательно
					установленное для таких расчётов: 365 дней минус 14 нерабочих
					праздничных, делённые на 12. Менять его нельзя, даже если в конкретном
					месяце дней больше. До 2014 года коэффициент был 29,4, и старые
					калькуляторы иногда всё ещё считают по нему.
				</p>
			</section>
		</div>
	)
}
