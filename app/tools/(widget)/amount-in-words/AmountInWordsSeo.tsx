import Link from 'next/link'

export function AmountInWordsSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Зачем сумму дублируют словами
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Цифру в документе легко исправить: приписать ноль, поменять запятую,
					подрисовать единицу. Слово так не подделаешь — придётся переписывать
					всю строку, и это будет видно. Поэтому в счетах, договорах,
					доверенностях и приходных ордерах итог пишут дважды: цифрами и
					прописью. Если они разойдутся, юридическую силу имеет запись словами.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему копейки пишут цифрами
				</h2>
				<p className='mt-3 text-muted-foreground'>
					По той же логике, но с обратным знаком: копейки в бухгалтерской
					традиции принято оставлять цифрами — «сто рублей 50 копеек». Так
					строка короче и легче сверяется с итогом, а подделать две цифры после
					слова «рублей» сложнее, чем кажется: рядом стоит сумма прописью,
					которая задаёт порядок величины. Переключатель позволяет записать
					копейки и словами, если этого требует форма документа.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Инструмент знает три валюты и режим без валюты. Формы числительных для
					каждой свои, потому что от них зависит окончание:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Валюта</th>
								<th className='py-2 pr-4 font-medium'>Основная единица</th>
								<th className='py-2 font-medium'>Разменная</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Рубли</td>
								<td className='py-2 pr-4'>рубль, рубля, рублей</td>
								<td className='py-2'>копейка, копейки, копеек</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Доллары</td>
								<td className='py-2 pr-4'>доллар, доллара, долларов</td>
								<td className='py-2'>цент, цента, центов</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Евро</td>
								<td className='py-2 pr-4'>евро, евро, евро</td>
								<td className='py-2'>цент, цента, центов</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>Просто число</td>
								<td className='py-2 pr-4'>без единицы</td>
								<td className='py-2'>без единицы</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Евро не склоняется вовсе, а копейка женского рода, в отличие от рубля:
					поэтому «двадцать одна копейка», но «двадцать один рубль». Именно на
					этом чаще всего и ошибаются, когда пишут сумму вручную.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Где ошибаются автоматические конвертеры
				</h2>
				<p className='mt-3 text-muted-foreground'>
					В русском счёте род зависит от разряда. Рубли мужского рода, а тысячи
					женского, поэтому правильно «одна тысяча рублей», а не «один тысяча»,
					и «две тысячи», а не «два тысячи». Копейки тоже женского рода: «одна
					копейка», «две копейки». Отдельная ловушка — числа от одиннадцати до
					четырнадцати: они требуют формы «рублей», хотя оканчиваются на
					единицу, двойку и тройку. Одиннадцать рублей, а не одиннадцать рубль.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>Смежное</h2>
				<p className='mt-3 text-muted-foreground'>
					Если сумма нужна вместе с налогом, посчитать его можно в{' '}
					<Link
						href='/tools/vat-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькуляторе НДС
					</Link>{' '}
					— там итог тоже дублируется прописью. Для расчёта налога с дохода есть{' '}
					<Link
						href='/tools/ndfl-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор НДФЛ
					</Link>
					. Если в документе сумма указана в иностранной валюте, перевести её в
					рубли по курсу ЦБ поможет{' '}
					<Link
						href='/tools/currency-converter'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						конвертер валют
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
