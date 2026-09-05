import Link from 'next/link'

export function AgeCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему возраст не считается делением на 365
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Простое деление количества прожитых дней на 365 даёт неточный
					результат из-за високосных годов и разной длины месяцев. Калькулятор
					считает по-другому: сначала календарные годы (совпадение месяца и
					числа), затем месяцы внутри незавершённого года, и, наконец, дни — тот
					же способ, каким возраст считают в паспортном столе или загсе.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что означают «дни всего» и «недель»
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Помимо возраста в привычном формате «годы, месяцы, дни» калькулятор
					показывает те же данные в других единицах: сколько дней и недель
					прошло с рождения целиком, сколько это полных месяцев, а также сколько
					дней осталось до следующего дня рождения. Дату можно посчитать не
					только на сегодня, но и на любой другой день, например чтобы узнать
					точный возраст в день важного события. Если же нужна разница между
					двумя датами, не связанными с рождением, для этого есть{' '}
					<Link
						href='/tools/date-difference-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор разницы дат
					</Link>
					.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Круглые возрасты в этих единицах выглядят так. Значения посчитаны
					самим калькулятором, перебором всех дат рождения:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Возраст</th>
								<th className='py-2 pr-4 font-medium'>Дней всего</th>
								<th className='py-2 font-medium'>Недель</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>18 лет</td>
								<td className='py-2 pr-4 font-mono'>6574 или 6575</td>
								<td className='py-2 font-mono'>939</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>30 лет</td>
								<td className='py-2 pr-4 font-mono'>10 957 или 10 958</td>
								<td className='py-2 font-mono'>1565</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>50 лет</td>
								<td className='py-2 pr-4 font-mono'>18 262 или 18 263</td>
								<td className='py-2 font-mono'>2608 или 2609</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>65 лет</td>
								<td className='py-2 pr-4 font-mono'>23 741 или 23 742</td>
								<td className='py-2 font-mono'>3391</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Два значения там, где на промежуток может попасть разное число 29
					февраля: это зависит от даты рождения, а не от ошибки в расчёте.
				</p>
			</section>
		</div>
	)
}
