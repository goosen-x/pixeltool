import Link from 'next/link'
import { Formula } from '@/components/seo/Formula'

export function NumberBaseConverterSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как перевести число вручную
				</h2>
				<p className='mt-3 text-muted-foreground'>
					В любой позиционной системе значение числа — это сумма цифр,
					умноженных на основание в степени разряда:
				</p>
				<Formula
					className='mt-4'
					latex='N = \sum_{i=0}^{n-1} d_i \cdot b^{i}'
				/>
				<p className='mt-4 text-muted-foreground'>
					Отсюда обратный перевод: 1010 в двоичной — это 1·8 + 0·4 + 1·2 + 0·1,
					то есть 10. В другую сторону считают делением: число делят на
					основание, записывают остатки и читают их снизу вверх. Разбор под
					результатом показывает именно первый способ — его и переписывают в
					тетрадь, потому что ответ без решения не засчитывают.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Одна шестнадцатеричная цифра — четыре двоичных
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Шестнадцать — это два в четвёртой степени, поэтому каждая цифра
					шестнадцатеричной записи ровно соответствует четырём двоичным
					разрядам, и переводить между ними можно по таблице, без арифметики.
					Ради этого системы и придумали: цвет #FF8800 человек прочитает, а те
					же двадцать четыре бита подряд — нет.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Десятичная</th>
								<th className='py-2 pr-4 font-medium'>Двоичная</th>
								<th className='py-2 pr-4 font-medium'>Восьмеричная</th>
								<th className='py-2 font-medium'>Шестнадцатеричная</th>
							</tr>
						</thead>
						<tbody className='font-mono text-foreground'>
							{[
								[0, '0000', '0', '0'],
								[5, '0101', '5', '5'],
								[8, '1000', '10', '8'],
								[10, '1010', '12', 'a'],
								[15, '1111', '17', 'f'],
								[16, '10000', '20', '10'],
								[255, '11111111', '377', 'ff']
							].map(row => (
								<tr key={String(row[0])} className='border-b last:border-0'>
									<td className='py-2 pr-4'>{row[0]}</td>
									<td className='py-2 pr-4'>{row[1]}</td>
									<td className='py-2 pr-4'>{row[2]}</td>
									<td className='py-2'>{row[3]}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему 0,1 не переводится точно
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Дробь конечна в системе, основание которой делится на знаменатель этой
					дроби. Десятая часть в двоичной системе бесконечна и периодична — как
					одна треть в десятичной. Отсюда знаменитая странность
					программирования: 0.1 + 0.2 в большинстве языков даёт
					0.30000000000000004, потому что ни одно из слагаемых не хранится
					точно. Инструмент показывает двенадцать знаков дробной части и
					обрывает счёт — дальше идёт шум округления, а не цифры числа.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Где это встречается
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Шестнадцатеричные числа попадаются чаще, чем кажется: цвета в CSS,
					коды символов Unicode, адреса памяти в отладчике, контрольные суммы
					файлов. Если нужен именно цвет, удобнее{' '}
					<Link
						href='/tools/color-converter'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						конвертер цветов
					</Link>
					: он покажет HEX вместе с RGB и HSL. Для дробей и процентов —{' '}
					<Link
						href='/tools/fraction-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор дробей
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
