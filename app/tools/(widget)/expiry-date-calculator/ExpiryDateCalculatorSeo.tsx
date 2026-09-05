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
