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
