import Link from 'next/link'

export function FractionCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как считаются дроби
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Сложение и вычитание приводят обе дроби к общему знаменателю
					(перемножением знаменателей), умножение перемножает числители и
					знаменатели отдельно, деление заменяется умножением на перевёрнутую
					вторую дробь. После любой операции результат делится на наибольший
					общий делитель числителя и знаменателя, чтобы получить простейший вид.
					Если дробь нужно перевести в проценты или наоборот, для этого есть{' '}
					<Link
						href='/tools/percent-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор процентов
					</Link>
					.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Ходовые дроби в десятичном виде и в процентах, чтобы не считать в уме:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Дробь</th>
								<th className='py-2 pr-4 font-medium'>Десятичная</th>
								<th className='py-2 font-medium'>Проценты</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>1/2</td>
								<td className='py-2 pr-4 font-mono'>0,5</td>
								<td className='py-2 font-mono'>50%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>1/3</td>
								<td className='py-2 pr-4 font-mono'>0,333…</td>
								<td className='py-2 font-mono'>33,3%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>2/3</td>
								<td className='py-2 pr-4 font-mono'>0,666…</td>
								<td className='py-2 font-mono'>66,7%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>1/4</td>
								<td className='py-2 pr-4 font-mono'>0,25</td>
								<td className='py-2 font-mono'>25%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>3/4</td>
								<td className='py-2 pr-4 font-mono'>0,75</td>
								<td className='py-2 font-mono'>75%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>1/5</td>
								<td className='py-2 pr-4 font-mono'>0,2</td>
								<td className='py-2 font-mono'>20%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>1/8</td>
								<td className='py-2 pr-4 font-mono'>0,125</td>
								<td className='py-2 font-mono'>12,5%</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>1/16</td>
								<td className='py-2 pr-4 font-mono'>0,0625</td>
								<td className='py-2 font-mono'>6,25%</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Дроби с тройкой в знаменателе в десятичном виде не заканчиваются
					никогда, поэтому в расчётах их лучше держать дробью до последнего
					шага, а округлять только результат.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Откуда берётся общий знаменатель
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Калькулятор берёт произведение двух знаменателей, а не их наименьшее
					общее кратное. Это проще и всегда работает, только числа в
					промежуточном вычислении получаются чуть больше. На итоговый
					упрощённый результат способ не влияет: 1/4 + 1/6 через произведение
					знаменателей (24) и через НОК (12) в итоге сокращаются к одной и той
					же дроби 5/12. Если нужно решить пропорцию с дробями, а не сложить их,
					для этого есть{' '}
					<Link
						href='/tools/proportion-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор пропорций
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
