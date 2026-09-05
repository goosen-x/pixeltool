import Link from 'next/link'

export function NdflCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Повышенная ставка берётся не со всего дохода
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Это главное недоразумение вокруг прогрессивной шкалы. Перешагнув
					порог, человек боится, что теперь весь его доход обложат по новой
					ставке, и иногда даже отказывается от повышения. Работает иначе:
					каждая ступень применяется только к своей части дохода. При доходе 2,5
					миллиона первые 2,4 миллиона облагаются по 13%, и только оставшиеся
					сто тысяч — по 15%. Налог выходит 327 тысяч, а не 375, как получилось
					бы при обложении всей суммы по верхней ставке.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Поэтому инструмент показывает разбивку по ступеням: видно, сколько
					дохода попало в каждую и сколько налога с неё вышло. Средняя ставка по
					всему доходу всегда ниже верхней ступени, и её тоже видно рядом с
					суммой налога.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Ставка</th>
								<th className='py-2 font-medium'>Годовой доход</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>13%</td>
								<td className='py-2'>до 2,4 млн ₽</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>15%</td>
								<td className='py-2'>с 2,4 до 5 млн ₽</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>18%</td>
								<td className='py-2'>с 5 до 20 млн ₽</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>20%</td>
								<td className='py-2'>с 20 до 50 млн ₽</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>22%</td>
								<td className='py-2'>свыше 50 млн ₽</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-3 text-muted-foreground'>
					Каждая ставка касается только части дохода сверх своего порога, не
					всей суммы целиком. При доходе 6 млн в год по 18% облагаются не все 6
					млн, а только 1 млн сверх порога в 5 млн — остальное посчитано по
					нижним ступеням.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Обратный расчёт от суммы на руки
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Второй режим решает задачу наоборот: известно, сколько хочется
					получать на руки, надо понять, какую сумму должны начислить. При
					плоской ставке это просто деление, а при прогрессивной — нет, потому
					что ставка сама зависит от искомой величины. Инструмент идёт по
					ступеням снизу вверх и набирает, пока не закроет нужную сумму. Это
					полезно при обсуждении зарплаты: договариваться удобнее в чистых
					деньгах, а в договоре пишут начисленные. Полный разбор «оклад → на
					руки» со взносами есть в{' '}
					<Link
						href='/tools/salary-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькуляторе зарплаты
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Чего калькулятор не знает
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Он считает налог с дохода по шкале и не учитывает вычеты — стандартные
					на детей, имущественные при покупке жилья, социальные за лечение и
					обучение, инвестиционные по ИИС. Любой из них уменьшает облагаемую
					базу, а значит и налог. Не учитывает он и того, что часть доходов
					облагается отдельно от основной базы: дивиденды, выигрыши, проценты по
					вкладам считаются по своим правилам. Для нерезидентов действует
					плоская ставка вместо шкалы. Это налог с дохода физлица, а не с
					реализации: для НДС с продаж есть отдельный{' '}
					<Link
						href='/tools/vat-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор НДС
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
