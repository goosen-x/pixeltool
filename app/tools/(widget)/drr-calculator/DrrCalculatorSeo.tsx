import Link from 'next/link'

export function DrrCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>Что такое ДРР</h2>
				<p className='mt-3 text-muted-foreground'>
					ДРР — доля рекламных расходов в выручке. Рекламный бюджет делят на
					выручку от этой рекламы и умножают на сто. Потратили 30 000, получили
					200 000 выручки — ДРР 15%. Метрику любят на маркетплейсах и в
					перформанс-рекламе, потому что она сразу отвечает на вопрос «сколько
					копеек с каждого рубля выручки уходит на её продвижение».
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					ДРР и ROAS — одно и то же с разных сторон
				</h2>
				<p className='mt-3 text-muted-foreground'>
					<Link
						href='/tools/roas-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						ROAS
					</Link>{' '}
					показывает, сколько выручки принёс рубль рекламы, ДРР — какую долю
					выручки этот рубль составил. ДРР 20% равен ROAS 500%, ДРР 50% — ROAS
					200%. Калькулятор считает обе величины, чтобы удобно было
					разговаривать с теми, кто привык к другой метрике.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Какой ДРР допустим
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Верхняя граница — валовая маржа товара: если ДРР её превысил, сделка
					уходит в минус ещё до учёта прочих расходов. На практике на
					маркетплейсах держат ДРР в диапазоне 5–15% в зависимости от категории
					и наценки. Считать ДРР нужно от выручки, которую принесла именно
					реклама: если брать всю выручку вместе с органикой, показатель
					занижается и маскирует неэффективные кампании.
				</p>
			</section>
		</div>
	)
}
