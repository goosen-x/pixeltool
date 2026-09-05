import Link from 'next/link'

export function DateDifferenceCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему число дней и разбивка «годы, месяцы, дни» не совпадают с
					делением на 30
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Разбивка считается по календарю, а не по схеме «всего дней ÷ 30 даёт
					месяцы, остаток дни». В месяцах разное число дней (28–31), поэтому
					честный подсчёт идёт по датам напрямую. Сколько раз число в дате
					«докрутилось» до того же дня месяца, столько и месяцев. Из-за этого
					промежуток без одного дня в год всегда посчитается как «11 месяцев и N
					дней», а не как «0 лет 356 дней». Ровно так же вы отмечали бы даты в
					календаре вручную. Если нужно просто отслеживать обратный отсчёт до
					одной конкретной даты, для этого удобнее{' '}
					<Link
						href='/tools/days-until'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						счётчик дней до даты
					</Link>
					, а для возраста человека по дате рождения есть отдельный{' '}
					<Link
						href='/tools/age-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор возраста
					</Link>
					.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Когда нужно прикинуть срок в уме, пользуются усреднёнными величинами.
					Календарь так не считает, но порядок они показывают верно:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Период</th>
								<th className='py-2 pr-4 font-medium'>Средняя длина</th>
								<th className='py-2 font-medium'>Откуда берётся</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Месяц</td>
								<td className='py-2 pr-4 font-mono'>30,44 дня</td>
								<td className='py-2'>365,25 делить на 12</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Квартал</td>
								<td className='py-2 pr-4 font-mono'>91 день</td>
								<td className='py-2'>три средних месяца</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Год</td>
								<td className='py-2 pr-4 font-mono'>365,25 дня</td>
								<td className='py-2'>три обычных года и один високосный</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что считается рабочим днём
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Только календарные будни, с понедельника по пятницу. Праздники и
					переносы выходных калькулятор не учитывает. В России их список
					меняется каждый год отдельным постановлением, и когда считаешь разницу
					между далёкими друг от друга датами, актуального списка может ещё не
					быть.
				</p>
			</section>
		</div>
	)
}
