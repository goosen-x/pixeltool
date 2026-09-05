import Link from 'next/link'

export function ProportionCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Правило креста: как решается пропорция
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Пропорция a/b = c/d означает, что отношение a к b равно отношению c к
					d. Чтобы найти неизвестное число, три известных перемножаются
					крест-накрест, а результат делится на оставшееся: например, для d это
					b × c / a. Калькулятор сам определяет, какое поле искать — это то,
					которое вы оставили пустым. Если известные числа заданы дробями, а не
					целыми, посчитать их проще в{' '}
					<Link
						href='/tools/fraction-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькуляторе дробей
					</Link>
					.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Одна и та же пропорция закрывает разные бытовые задачи:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Задача</th>
								<th className='py-2 pr-4 font-medium'>Пропорция</th>
								<th className='py-2 font-medium'>Что ищем</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Рецепт на другое число порций</td>
								<td className='py-2 pr-4 font-mono'>
									4 порции / 200 г = 6 порций / x
								</td>
								<td className='py-2'>сколько граммов</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Масштаб чертежа 1:100</td>
								<td className='py-2 pr-4 font-mono'>
									1 см / 100 см = 3,5 см / x
								</td>
								<td className='py-2'>размер в жизни</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Скидка в процентах</td>
								<td className='py-2 pr-4 font-mono'>100% / 4500 ₽ = 15% / x</td>
								<td className='py-2'>размер скидки</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Расход краски</td>
								<td className='py-2 pr-4 font-mono'>
									10 м² / 1,2 л = 34 м² / x
								</td>
								<td className='py-2'>сколько литров</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Решается всё одинаково: перемножить по диагонали и разделить на
					оставшееся число. Это и есть правило креста.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Где пропорция пригождается на практике
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Пропорция работает шире, чем задачи из учебника. Развести бензин с
					маслом в нужном соотношении для двухтактного двигателя, пересчитать
					количество ингредиентов в рецепте под другое число порций, увеличить
					чертёж с сохранением пропорций сторон, перевести рецепт бетонной смеси
					на другой объём — везде используется одна и та же схема: известное
					соотношение двух величин переносится на новую пару чисел.
				</p>
			</section>
		</div>
	)
}
