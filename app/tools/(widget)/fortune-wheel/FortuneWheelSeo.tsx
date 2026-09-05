import Link from 'next/link'

export function FortuneWheelSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Результат готов раньше, чем колесо остановится
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Сектор-победитель выбирается случайным числом в самый момент запуска,
					а вращение — это уже анимация под готовый результат, не наоборот.
					Впишите свои варианты, каждый на новой строке, и нажмите «Крутить
					колесо». Если нужно провести несколько раундов подряд без повторов —
					включите «Убирать победителя из колеса».
				</p>

				<p className='mt-4 text-muted-foreground'>
					Сколько градусов занимает сектор и с какой вероятностью он выпадает:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Секторов</th>
								<th className='py-2 pr-4 font-medium'>Угол сектора</th>
								<th className='py-2 font-medium'>Вероятность</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>2</td>
								<td className='py-2 pr-4 font-mono'>180°</td>
								<td className='py-2 font-mono'>50%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>4</td>
								<td className='py-2 pr-4 font-mono'>90°</td>
								<td className='py-2 font-mono'>25%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>6</td>
								<td className='py-2 pr-4 font-mono'>60°</td>
								<td className='py-2 font-mono'>16,7%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>8</td>
								<td className='py-2 pr-4 font-mono'>45°</td>
								<td className='py-2 font-mono'>12,5%</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>12</td>
								<td className='py-2 pr-4 font-mono'>30°</td>
								<td className='py-2 font-mono'>8,3%</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Сектора одинаковые, поэтому вероятность зависит только от их числа.
					Чтобы вариант выпадал чаще, его вписывают дважды.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Для чего используют колесо со своими вариантами
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Чаще всего — там, где нужно снять с себя ответственность за выбор: что
					приготовить на ужин, кому мыть посуду, какой приз достанется участнику
					розыгрыша, с какой задачи начать рабочий день. В отличие от{' '}
					<Link
						href='/tools/coin-flip'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						подбрасывания монеты
					</Link>
					, колесо подходит для любого числа вариантов, а не только для двух.
					Для да/нет-вопросов без своих вариантов есть ещё{' '}
					<Link
						href='/tools/magic-ball'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						магический шар
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
