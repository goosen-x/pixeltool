import Link from 'next/link'

export function PercentCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Четыре расчёта вместо одного калькулятора с двумя кнопками
				</h2>
				<p className='mt-3 text-muted-foreground'>
					«Посчитать процент» на практике означает разные вещи: узнать долю
					числа, восстановить число по известной доле, сравнить два числа между
					собой или применить скидку/наценку к сумме. Формула у каждой задачи
					своя, и в них легко ошибиться, если считать в уме или на калькуляторе
					телефона — переключите режим сверху и впишите известные значения.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему «на сколько % A больше B» и «на сколько % B меньше A» — разные
					числа
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Разница в процентах всегда считается от базового числа — того, с чем
					сравнивают. 120 больше 100 на 20%, но 100 меньше 120 не на 20%, а
					примерно на 16.7% — потому что во втором случае базой становится уже
					120, а не 100. Режим «Разница в процентах» явно спрашивает, какое
					число базовое, чтобы не перепутать направление сравнения.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Разбор всех четырёх формул с числовыми примерами — в статье{' '}
				<Link
					href='/blog/kak-poschitat-protsent'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Как посчитать процент: 4 формулы с примерами
				</Link>
				.
			</p>
		</div>
	)
}
