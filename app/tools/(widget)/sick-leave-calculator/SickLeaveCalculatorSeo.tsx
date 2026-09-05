import Link from 'next/link'

export function SickLeaveCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Больничный считается не так, как отпускные
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Разница в знаменателе. У{' '}
					<Link
						href='/tools/vacation-pay-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						отпускных
					</Link>{' '}
					заработок за год делят на календарные дни через коэффициент 29,3, а у
					больничного берут заработок за два полных календарных года и делят на
					жёсткое число 730 — независимо от того, сколько дней вы отработали и
					были ли високосные годы. Поэтому человек, проработавший неполный
					период, получает меньше: пустые месяцы всё равно попадают в делитель.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Стаж решает, сколько заплатят
				</h2>
				<p className='mt-3 text-muted-foreground'>
					До пяти лет страхового стажа платят 60% среднего заработка, от пяти до
					восьми — 80%, от восьми — 100%. Порог считается на день начала
					болезни, и разница ощутимая: при одном и том же заработке восьмилетний
					стаж даёт в полтора раза больше, чем четырёхлетний. Страховой стаж —
					это периоды, когда за вас платили взносы, и он не всегда совпадает с
					общим трудовым.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Страховой стаж</th>
								<th className='py-2 font-medium'>Процент от заработка</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>До 5 лет</td>
								<td className='py-2 font-mono'>60%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>От 5 до 8 лет</td>
								<td className='py-2 font-mono'>80%</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>От 8 лет</td>
								<td className='py-2 font-mono'>100%</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Потолок сверху и пол снизу
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Заработок каждого года учитывается не больше предельной базы для
					взносов: всё, что сверх неё, в расчёт не идёт, потому что с него не
					платились взносы. Снизу действует обратное ограничение — пособие не
					может быть меньше расчёта по МРОТ. Оба значения государство меняет
					каждый год, поэтому они вынесены в поля ввода, а не зашиты намертво:
					калькулятор с прошлогодним МРОТ выдаёт уверенный неправильный ответ.
					По такому же среднему заработку за два года считается и{' '}
					<Link
						href='/tools/maternity-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						пособие по беременности и родам
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
