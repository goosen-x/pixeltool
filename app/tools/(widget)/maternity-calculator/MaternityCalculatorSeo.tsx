import Link from 'next/link'

export function MaternityCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Чем декретные отличаются от больничного
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Двумя вещами, и обе в пользу получателя. Во-первых, стаж на размер не
					влияет: платят 100% среднего заработка независимо от того, работаете
					вы восемь лет или один. Во-вторых, делят не на жёсткие 730 дней, а на
					730 минус исключаемые — больничные и прошлые декреты. Чем больше вы
					болели в расчётные годы, тем меньше делитель и тем выше средний
					дневной заработок.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Сколько длится отпуск
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Стандартно 140 календарных дней: 70 до родов и 70 после. При
					осложнённых родах послеродовая часть увеличивается, и всего получается
					156. При многоплодной беременности отпуск начинается раньше и длится
					194 дня. Пособие платят единовременно за весь период сразу, а не
					помесячно.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Роды</th>
								<th className='py-2 font-medium'>Длительность отпуска</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Обычные</td>
								<td className='py-2 font-mono'>140 дней</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Осложнённые</td>
								<td className='py-2 font-mono'>156 дней</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Многоплодная беременность</td>
								<td className='py-2 font-mono'>194 дня</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-3 text-muted-foreground'>
					Точную дату выхода в декрет по неделе беременности удобно прикинуть в{' '}
					<Link
						href='/tools/pregnancy-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькуляторе беременности
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Налогом не облагается
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Пособие по беременности и родам НДФЛ не облагается, поэтому
					начисленная сумма и есть та, что придёт на счёт. Этим оно отличается и
					от{' '}
					<Link
						href='/tools/sick-leave-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						больничного
					</Link>
					, и от отпускных, с которых налог удерживают. Взносы с него тоже не
					платятся.
				</p>
			</section>
		</div>
	)
}
