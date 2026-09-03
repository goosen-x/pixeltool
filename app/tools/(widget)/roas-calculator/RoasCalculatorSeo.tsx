export function RoasCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как считается ROAS
				</h2>
				<p className='mt-3 text-muted-foreground'>
					ROAS (return on ad spend) — отношение выручки от рекламы к расходам на
					эту рекламу. Выручку делят на рекламный бюджет; результат выражают в
					процентах или коэффициентом. Потратили 50 000, получили 200 000
					выручки — ROAS 400%, то есть 4 рубля выручки на каждый вложенный
					рубль.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					ROAS, ДРР и ROI — как связаны
				</h2>
				<p className='mt-3 text-muted-foreground'>
					ДРР — это перевёрнутый ROAS: доля рекламных расходов в выручке. ROAS
					400% равен ДРР 25%. ROI отличается принципиально: он вычитает
					себестоимость товара и прочие затраты, поэтому всегда ниже ROAS. ROAS
					удобен для быстрой отбраковки убыточных каналов, но окончательное
					решение принимают по прибыли.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Какой ROAS нужен для прибыли
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Минимальный ROAS, при котором реклама не в убыток, зависит от маржи.
					Если валовая маржа 30%, точка окупаемости примерно на ROAS 330%: при
					меньшем значении реклама съедает больше, чем приносит прибыли. Формула
					ориентира — сто процентов, делённые на долю маржи. Проверить общую
					окупаемость проекта с учётом всех затрат поможет калькулятор ROI.
				</p>
			</section>
		</div>
	)
}
