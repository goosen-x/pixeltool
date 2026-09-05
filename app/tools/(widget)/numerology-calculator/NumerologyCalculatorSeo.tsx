import Link from 'next/link'
import { PERSONAL_YEAR_MEANINGS } from '@/lib/utils/numerology'

export function NumerologyCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как считается число жизненного пути
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Складываются все цифры даты рождения, и сумма сворачивается до одной
					цифры. Для 15 апреля 1990 года это 1 + 5 = 6 за день, 4 за месяц, 1 +
					9 + 9 + 0 = 19 → 10 → 1 за год; 6 + 4 + 1 = 11. Числа 11, 22 и 33 в
					этой системе называют мастер-числами и дальше не сворачивают — поэтому
					здесь ответ именно 11, а не 2. В русскоязычной традиции тот же
					результат часто называют числом судьбы: формула одна, названия разные.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Что традиция приписывает каждому числу:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Число</th>
								<th className='py-2 font-medium'>Ключевое слово</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>1</td>
								<td className='py-2'>начало</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>2</td>
								<td className='py-2'>согласие</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>3</td>
								<td className='py-2'>выражение</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>4</td>
								<td className='py-2'>основание</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>5</td>
								<td className='py-2'>движение</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>6</td>
								<td className='py-2'>забота</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>7</td>
								<td className='py-2'>осмысление</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>8</td>
								<td className='py-2'>масштаб</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>9</td>
								<td className='py-2'>завершение</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>11 и 22</td>
								<td className='py-2'>
									мастер-числа, не сворачиваются до одной цифры
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Чем число дня рождения отличается от числа жизненного пути
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Число дня рождения считается только по числу месяца, без самого месяца
					и года: 29-е даёт 11, 31-е — 4. Его трактуют как более частную
					характеристику, тогда как жизненный путь строится по всей дате
					целиком. Оба числа детерминированы — у одной даты рождения всегда один
					и тот же результат, никакой случайности в расчёте нет.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Персональный год: расчёт, который меняется каждый год
				</h2>
				<p className='mt-3 text-muted-foreground'>
					В отличие от числа жизненного пути, персональный год не постоянен: он
					складывается из дня и месяца рождения плюс текущий календарный год, и
					меняется раз в год. Например, для 15 апреля персональный год 2026-го
					считается так: 1+5 = 6 за день, 4 за месяц, 2+0+2+6 = 10 → 1 за год;
					6+4+1 = 11 → 1+1 = 2. Персональный год 2026 = 2.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Здесь есть важное отличие от числа жизненного пути: персональный год
					всегда сворачивается до одной цифры от 1 до 9, мастер-числа 11, 22 и
					33 в нём не сохраняются. Если бы промежуточная сумма 11 осталась как
					есть, ответ был бы другим, но ни один источник так не считает, поэтому
					здесь применяется полная свёртка.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Девять тем персонального года
				</h2>
				<div className='mt-3 grid gap-3 sm:grid-cols-3'>
					{([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map(number => (
						<div key={number} className='rounded-lg border p-3'>
							<span className='block font-mono text-lg font-bold text-foreground'>
								{number}
							</span>
							<p className='mt-1 text-sm text-muted-foreground'>
								{PERSONAL_YEAR_MEANINGS[number]}
							</p>
						</div>
					))}
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Чем это не является
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Нумерология — культурная традиция толкования чисел, у неё нет научного
					обоснования, и результат расчёта не говорит ничего о конкретном
					человеке. Считать его основанием для решений о здоровье, деньгах,
					работе или отношениях не стоит. Инструмент честно выполняет арифметику
					и приводит принятую трактовку — не более того. Похожим образом дату
					рождения раскладывает и{' '}
					<Link
						href='/tools/destiny-matrix-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						матрица судьбы
					</Link>
					, только через символику Таро, а не через цифры жизненного пути.
				</p>
			</section>
		</div>
	)
}
