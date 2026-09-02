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
					.
				</p>
			</section>
		</div>
	)
}
