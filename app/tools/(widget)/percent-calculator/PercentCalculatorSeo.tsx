import Link from 'next/link'

export function PercentCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Четыре расчёта вместо одного калькулятора с двумя кнопками
				</h2>
				<p className='mt-3 text-muted-foreground'>
					«Посчитать процент» на практике означает разные вещи: узнать долю
					числа, восстановить число по известной доле, сравнить два числа между
					собой или применить скидку либо наценку к сумме. Формула у каждой
					задачи своя, и в них легко ошибиться, если считать в уме или на
					калькуляторе телефона. Переключите режим сверху и впишите известные
					значения.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Процент</th>
								<th className='py-2 pr-4 font-medium'>От 1 000 ₽</th>
								<th className='py-2 pr-4 font-medium'>От 10 000 ₽</th>
								<th className='py-2 font-medium'>От 100 000 ₽</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>5%</td>
								<td className='py-2 pr-4 font-mono'>50 ₽</td>
								<td className='py-2 pr-4 font-mono'>500 ₽</td>
								<td className='py-2 font-mono'>5 000 ₽</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>10%</td>
								<td className='py-2 pr-4 font-mono'>100 ₽</td>
								<td className='py-2 pr-4 font-mono'>1 000 ₽</td>
								<td className='py-2 font-mono'>10 000 ₽</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>13%</td>
								<td className='py-2 pr-4 font-mono'>130 ₽</td>
								<td className='py-2 pr-4 font-mono'>1 300 ₽</td>
								<td className='py-2 font-mono'>13 000 ₽</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>20%</td>
								<td className='py-2 pr-4 font-mono'>200 ₽</td>
								<td className='py-2 pr-4 font-mono'>2 000 ₽</td>
								<td className='py-2 font-mono'>20 000 ₽</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему «на сколько % A больше B» и «на сколько % B меньше A» дают
					разные числа
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Разница в процентах всегда считается от базового числа, того, с чем
					сравнивают. 120 больше 100 на 20%, а 100 меньше 120 примерно на 16.7%,
					потому что во втором случае базой становится уже 120, а не 100. Режим
					«Разница в процентах» явно спрашивает, какое число базовое, чтобы не
					перепутать направление сравнения.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Разбор всех четырёх формул с числовыми примерами есть в статье{' '}
				<Link
					href='/blog/kak-poschitat-protsent'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Как посчитать процент: 4 формулы с примерами
				</Link>
				. Для процентов, которые начисляются периодически, например по вкладу
				или кредиту, нужен отдельный{' '}
				<Link
					href='/tools/compound-interest-calculator'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					калькулятор сложного процента
				</Link>
				, а если исходная величина задана дробью, её проще перевести числами в{' '}
				<Link
					href='/tools/fraction-calculator'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					калькуляторе дробей
				</Link>
				.
			</p>
		</div>
	)
}
