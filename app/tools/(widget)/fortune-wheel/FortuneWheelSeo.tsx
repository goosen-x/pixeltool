import Link from 'next/link'

export function FortuneWheelSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Результат готов раньше, чем колесо остановится
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Сектор-победитель выбирается случайным числом в самый момент запуска,
					а вращение — это уже анимация под готовый результат, не наоборот.
					Впишите свои варианты, каждый на новой строке, и нажмите «Крутить
					колесо». Если нужно провести несколько раундов подряд без повторов —
					включите «Убирать победителя из колеса».
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Для чего используют колесо со своими вариантами
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Чаще всего — там, где нужно снять с себя ответственность за выбор: что
					приготовить на ужин, кому мыть посуду, какой приз достанется участнику
					розыгрыша, с какой задачи начать рабочий день. В отличие от{' '}
					<Link
						href='/tools/coin-flip'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						подбрасывания монеты
					</Link>
					, колесо подходит для любого числа вариантов, а не только для двух.
					Для да/нет-вопросов без своих вариантов есть ещё{' '}
					<Link
						href='/tools/magic-ball'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						магический шар
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
