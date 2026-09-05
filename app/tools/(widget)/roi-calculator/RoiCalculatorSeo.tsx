import Link from 'next/link'

export function RoiCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что показывает ROI
				</h2>
				<p className='mt-3 text-muted-foreground'>
					ROI (return on investment) — это отношение чистой прибыли от вложения
					к его сумме. Формула простая: из возврата вычитаем вложенное, делим на
					вложенное и умножаем на сто. Вложили 100 000, вернули 130 000 — ROI
					30%. Метрика универсальная: ею одинаково меряют рекламную кампанию,
					закупку оборудования и покупку акций, потому что она сводит любой
					проект к одному числу, которое можно сравнить с другим.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Ориентировочные диапазоны по типам вложений, в среднем по рынку —
					реальный ROI сильно зависит от ниши, конкуренции и горизонта проекта:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Тип вложений</th>
								<th className='py-2 font-medium'>Ориентировочный ROI</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Маркетинг и реклама</td>
								<td className='py-2 font-mono'>100–500%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Производство, оборудование</td>
								<td className='py-2 font-mono'>15–30% годовых</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Недвижимость</td>
								<td className='py-2 font-mono'>8–20% годовых</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему важен срок и что такое годовой ROI
				</h2>
				<p className='mt-3 text-muted-foreground'>
					ROI 30% сам по себе не говорит, хорошо это или плохо, пока неизвестен
					срок. 30% за полгода — это отличная доходность, 30% за пять лет — хуже
					банковского вклада. Годовой ROI приводит результат к одному году по
					формуле сложного процента, и только после этого проекты с разным
					горизонтом становятся сопоставимыми. Поле срока в калькуляторе
					необязательное: без него считается простой ROI за весь период. Смежный
					вопрос — когда проект вообще выходит в ноль, для этого есть{' '}
					<Link
						href='/tools/breakeven-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор точки безубыточности
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					ROI, ROMI и ROAS — в чём разница
				</h2>
				<p className='mt-3 text-muted-foreground'>
					ROI учитывает все затраты на проект, ROMI — только маркетинговые, ROAS
					— отношение выручки к рекламному бюджету вообще без вычета
					себестоимости товара. Поэтому у одной и той же кампании ROAS всегда
					выглядит внушительнее ROI. Для оценки окупаемости рекламы отдельно
					есть калькуляторы ROAS и ДРР, а для юнит-экономики привлечения —{' '}
					<Link
						href='/tools/cac-ltv-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор CAC и LTV
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
