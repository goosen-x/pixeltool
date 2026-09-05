import Link from 'next/link'

export function CurrencyConverterSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Курс Центробанка — не курс обмена
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Центробанк устанавливает официальный курс раз в рабочий день на
					основании биржевых торгов предыдущего дня. Он нужен для отчётности,
					таможни, налогов и договоров, но по нему нигде не меняют деньги: в
					банке курс покупки будет ниже, курс продажи выше, и разница между ними
					и есть заработок обменника. Расхождение обычно от одного до трёх
					процентов, а в неспокойные дни больше.
				</p>
				<p className='mt-3 text-muted-foreground'>
					В выходные и праздники курс не обновляется: показывается последний
					установленный. Дата, на которую он действует, выведена в шапке
					инструмента — это и есть дата ЦБ, а не сегодняшнее число.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему у иены странный курс
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Центробанк публикует курс не за одну единицу, а за номинал: у японской
					иены и корейской воны это 100, у некоторых валют 1000 или 10000.
					Сделано это ради читаемости — курс за одну иену выглядел бы как 0,54
					рубля. Инструмент делит на номинал автоматически, поэтому в расчёте
					участвует честная цена одной единицы. Если сравниваете с таблицей на
					сайте ЦБ, обратите внимание на колонку номинала.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Центробанк публикует курс не всегда за одну единицу: у валют с мелким
					номиналом он даётся за сотню или тысячу, иначе в курсе было бы слишком
					много нулей после запятой. Инструмент делит на номинал автоматически:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Валюта</th>
								<th className='py-2 font-medium'>Курс ЦБ даётся за</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>
									Иена, тенге, драм, индийская рупия, форинт
								</td>
								<td className='py-2'>100 единиц</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Вона, тугрик, кьят</td>
								<td className='py-2'>1000 единиц</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>
									Донг, узбекский сум, индонезийская рупия
								</td>
								<td className='py-2'>10 000 единиц</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Иранский риал</td>
								<td className='py-2'>1 000 000 единиц</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>
									Доллар, евро, юань, фунт и большинство остальных
								</td>
								<td className='py-2'>1 единицу</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Поэтому «курс иены 55 рублей» означает 55 рублей за сто иен, то есть
					около 55 копеек за одну.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Кросс-курс между двумя валютами
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Центробанк устанавливает курсы только к рублю, поэтому пара вроде
					«доллар — евро» считается через него: сначала в рубли, потом из
					рублей. Такой кросс-курс может слегка отличаться от биржевого курса
					этой пары, и это не ошибка расчёта, а следствие того, что оба курса
					установлены к третьей валюте в разные моменты торгов. У Центробанка
					нет курса для криптовалют — для них есть отдельный{' '}
					<Link
						href='/tools/bitcoin-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор биткоина
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
