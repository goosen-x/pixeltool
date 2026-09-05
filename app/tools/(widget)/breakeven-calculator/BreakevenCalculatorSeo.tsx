import Link from 'next/link'

export function BreakevenCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как считается точка безубыточности
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Точка безубыточности в штуках — это постоянные затраты, делённые на
					маржинальную прибыль с одной продажи. Маржинальная прибыль — цена
					минус переменные затраты на единицу: столько остаётся с каждой продажи
					на покрытие аренды, окладов и других расходов, которые не меняются от
					объёма. Когда накопленная маржа сравнялась с постоянными затратами,
					бизнес вышел в ноль; всё, что продано сверх этого, — прибыль.
					Насколько выгодным получился сам проект, показывает{' '}
					<Link
						href='/tools/roi-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор ROI
					</Link>
					.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Модель</th>
								<th className='py-2 pr-4 font-medium'>Затраты и цена</th>
								<th className='py-2 font-medium'>Точка безубыточности</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Кофейня</td>
								<td className='py-2 pr-4 font-mono'>
									300 000 ₽ пост., цена 250 ₽, перем. 100 ₽
								</td>
								<td className='py-2 font-mono'>2 000 чашек, 500 000 ₽</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Онлайн-курс</td>
								<td className='py-2 pr-4 font-mono'>
									200 000 ₽ пост., цена 5 000 ₽, перем. 1 000 ₽
								</td>
								<td className='py-2 font-mono'>50 продаж, 250 000 ₽</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Постоянные и переменные затраты
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Постоянные не зависят от того, продали вы сто единиц или тысячу:
					аренда, оклады, бухгалтерия, подписки на сервисы. Переменные растут с
					каждой продажей: сырьё и комплектующие, комиссия эквайринга и
					маркетплейса, упаковка, доставка, сдельная оплата. Одна и та же статья
					бывает и той, и другой — например, зарплата на окладе постоянная, а на
					проценте от выручки переменная.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Когда точки безубыточности нет
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Если переменные затраты на единицу равны цене или выше неё, каждая
					продажа приносит убыток, и наращивание объёма только ускоряет потери.
					Формула в этом случае даёт деление на ноль или отрицательное число, и
					калькулятор честно сообщает, что решения нет. Сначала нужно поднять
					цену, снизить себестоимость или отказаться от продукта — считать объём
					бессмысленно. Подобрать новую цену от нужной маржи или наценки поможет{' '}
					<Link
						href='/tools/pricing-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор наценки
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
