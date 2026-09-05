import Link from 'next/link'

export function ExpiryDateCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Срок годности и срок хранения: разные вещи на одной упаковке
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Производитель почти всегда указывает срок хранения («годен 6 месяцев
					со дня изготовления») и дату изготовления отдельно, а не готовую дату
					истечения. Считать конечную дату в уме рискованно, особенно если срок
					в месяцах или годах, а не в днях. Легко забыть, что в феврале 28 дней,
					а не 30.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Срок можно задать в разных единицах, и прибавляются они по-разному:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Единица</th>
								<th className='py-2 pr-4 font-medium'>Как прибавляется</th>
								<th className='py-2 font-medium'>Пример</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Дни</td>
								<td className='py-2 pr-4'>ровно столько суток</td>
								<td className='py-2'>10 января + 30 дней = 9 февраля</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Месяцы</td>
								<td className='py-2 pr-4'>календарно, то же число</td>
								<td className='py-2'>15 марта + 6 месяцев = 15 сентября</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>Годы</td>
								<td className='py-2 pr-4'>календарно, та же дата</td>
								<td className='py-2'>1 июня 2026 + 2 года = 1 июня 2028</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Календарное прибавление даёт неочевидный эффект на концах месяцев: 31
					января плюс месяц это 28 февраля, а не 3 марта. Инструмент ведёт себя
					так же, как считают сроки на производстве.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему подсчёт календарный, а не по среднему числу дней
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Месяцы и годы прибавляются к дате производства так же, как если бы вы
					отмечали их в календаре вручную. Месяц от 31 января даёт 28 или 29
					февраля, в зависимости от високосного года, а не «31 января плюс 30
					дней». Разница набегает в несколько дней, и для скоропортящихся
					продуктов это уже имеет значение. Если нужно просто узнать, сколько
					дней осталось до готовой даты истечения, для этого есть{' '}
					<Link
						href='/tools/date-difference-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор разницы дат
					</Link>
					.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Частую ошибку с месяцами разной длины и пример расчёта разбираем в
				статье{' '}
				<Link
					href='/blog/kak-poschitat-srok-godnosti'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Как посчитать срок годности продукта по дате производства
				</Link>
				.
			</p>
		</div>
	)
}
