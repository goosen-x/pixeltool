import Link from 'next/link'

export function CycleTimeCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>Закон Литтла</h2>
				<p className='mt-3 text-muted-foreground'>
					Объём незавершённой работы равен пропускной способности, умноженной на
					время выполнения. Если в работе одновременно 12 задач, а закрывается 3
					в неделю, средняя задача проходит весь путь за 4 недели. Зная любые
					два значения, третье можно посчитать: оставьте пустым то, что хотите
					найти. Формула работает для устойчивого потока — когда объём работы и
					скорость команды примерно постоянны, без авралов и простоев.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Cycle time и lead time
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Cycle time считают с момента, когда задачу реально взяли в работу.
					Lead time — с момента, когда её завели в бэклог. Разница между ними —
					это время ожидания в очереди, и часто именно оно, а не сама работа,
					растягивает сроки поставки. Клиент чувствует lead time, команда
					управляет cycle time.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как ускорить поток
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Самый надёжный рычаг — ограничить число задач в работе одновременно.
					Чем меньше параллельных задач, тем меньше переключений контекста и
					времени, которое задача проводит в ожидании, и тем быстрее каждая
					доходит до конца — при той же численности команды. Прогноз, сколько
					команда успеет за спринт, даёт{' '}
					<Link
						href='/tools/team-capacity-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор ёмкости команды
					</Link>
					, а порядок, в котором брать задачи в работу, поможет расставить{' '}
					<Link
						href='/tools/rice-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор RICE
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
