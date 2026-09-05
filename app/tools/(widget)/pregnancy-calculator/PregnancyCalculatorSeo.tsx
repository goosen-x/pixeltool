import Link from 'next/link'

export function PregnancyCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что считает калькулятор и чего он не делает
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Калькулятор выполняет арифметику по дате: прибавляет к первому дню
					последней менструации известное число дней и переводит разницу в
					недели. Он не оценивает состояние здоровья, не ставит диагнозов и не
					заменяет наблюдение врача. Точный срок определяют по УЗИ, особенно в
					первом триместре, и именно эта оценка считается основной, если
					расходится с расчётом по дате. Норма калорий на каждом сроке своя, её
					можно уточнить в{' '}
					<Link
						href='/tools/calorie-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькуляторе калорий
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Акушерский срок и правило Негеле
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Акушерский срок отсчитывается от первого дня последней менструации, а
					не от зачатия — так принято в женской консультации, потому что дату
					зачатия обычно никто не знает, а дату менструации помнят. Из-за этого
					в первые две недели «беременности» её формально ещё нет.
					Предполагаемая дата родов по правилу Негеле — это первый день
					последней менструации плюс 280 дней, то есть сорок недель.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Весь срок делят на три триместра, границы считают в акушерских
					неделях:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Триместр</th>
								<th className='py-2 pr-4 font-medium'>Недели</th>
								<th className='py-2 font-medium'>Что происходит</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Первый</td>
								<td className='py-2 pr-4 font-mono'>1–13</td>
								<td className='py-2'>
									закладка органов, первый скрининг на 11–13 неделе
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Второй</td>
								<td className='py-2 pr-4 font-mono'>14–27</td>
								<td className='py-2'>
									второй скрининг, обычно самый спокойный период
								</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Третий</td>
								<td className='py-2 pr-4 font-mono'>28–40</td>
								<td className='py-2'>
									декретный отпуск с 30 недели, подготовка к родам
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Зачем поправка на длину цикла
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Правило Негеле выведено для цикла в 28 дней, когда овуляция приходится
					примерно на его середину. При более длинном цикле овуляция наступает
					позже, значит и роды сдвигаются вперёд: калькулятор прибавляет разницу
					между вашим циклом и 28 днями. При цикле 35 дней дата родов уезжает на
					неделю позже, при 21 дне — на неделю раньше.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Когда начинается декретный отпуск
				</h2>
				<p className='mt-3 text-muted-foreground'>
					В России отпуск по беременности и родам открывают с 30-й недели при
					одноплодной беременности и с 28-й — при многоплодной. Листок
					нетрудоспособности выдаёт врач; калькулятор лишь показывает, на какую
					календарную дату приходится эта неделя, чтобы можно было заранее
					спланировать дела на работе. Сумму самого пособия считает{' '}
					<Link
						href='/tools/maternity-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор декретных
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
