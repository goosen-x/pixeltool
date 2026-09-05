import Link from 'next/link'

export function BitcoinCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Курс без задержки на обновление вкладки
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Курс биткоина меняется по несколько раз в час, поэтому калькулятор
					запрашивает цену у CoinGecko при каждом открытии страницы и по кнопке
					обновления — а не хранит устаревшее значение на сервере. Введите сумму
					в криптовалюте или в обычных деньгах, калькулятор сам посчитает
					эквивалент в другую сторону. Для перевода между обычными валютами по
					курсу ЦБ есть отдельный{' '}
					<Link
						href='/tools/currency-converter'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						конвертер валют
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Откуда берутся цифры
				</h2>
				<p className='mt-3 text-muted-foreground'>
					CoinGecko собирает котировки с десятков крупных бирж и публикует
					усреднённую цену — тот же источник, которым пользуется большинство
					подобных калькуляторов и агрегаторов. Курс актуален на момент запроса:
					если вкладка открыта долго, нажмите «Обновить курс», чтобы подтянуть
					свежую цену.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Инструмент считает три монеты в трёх валютах:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Монета</th>
								<th className='py-2 pr-4 font-medium'>Тикер</th>
								<th className='py-2 font-medium'>Особенность</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Bitcoin</td>
								<td className='py-2 pr-4 font-mono'>BTC</td>
								<td className='py-2'>
									курс меняется постоянно, дробные суммы считаются в сатоши
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Ethereum</td>
								<td className='py-2 pr-4 font-mono'>ETH</td>
								<td className='py-2'>
									вторая по капитализации, курс тоже плавающий
								</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Tether</td>
								<td className='py-2 pr-4 font-mono'>USDT</td>
								<td className='py-2'>стейблкоин, держится около доллара</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		</div>
	)
}
