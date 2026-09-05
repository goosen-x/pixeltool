import Link from 'next/link'
import { Formula } from '@/components/seo/Formula'

export function VatCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Начислить и выделить — разные формулы
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Это главная ошибка в расчётах НДС. Начислить сверху просто: берём
					сумму без налога и умножаем на ставку. А вот выделить налог из суммы,
					в которой он уже сидит, умножением не получится: 22% от суммы с
					налогом больше, чем налог внутри неё. Делить надо на 122 и умножать на
					22, а не брать 22% от итога.
				</p>
				<Formula
					latex='\text{НДС сверху} = S \cdot \dfrac{22}{100}'
					caption='S — сумма без налога'
				/>
				<Formula
					latex='\text{НДС внутри} = S_{\text{с НДС}} \cdot \dfrac{22}{122}'
					caption='делитель 122 это 100 плюс ставка, а не 100'
				/>
				<p className='mt-3 text-muted-foreground'>
					На числах: если цена с НДС 1220 рублей, то налог внутри — 220, а не
					268,40. Разница набегает быстро, и в актах сверки её потом ищут долго.
					Переключатель наверху выбирает, какую из двух задач вы решаете.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Ставка выросла до 22%
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Основная ставка НДС с 2026 года — 22% вместо прежних 20%. Льготная 10%
					осталась для продуктов, детских товаров и лекарств, нулевая — для
					экспорта и международных перевозок. Отдельно стоят 5% и 7% для
					упрощённой системы. Все варианты вынесены в переключатель, потому что
					подставить не ту ставку легче, чем кажется, а результат отличается на
					проценты от суммы договора.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Ставка</th>
								<th className='py-2 font-medium'>Когда применяется</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>0%</td>
								<td className='py-2'>
									Экспорт товаров и международные перевозки
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>10%</td>
								<td className='py-2'>
									Продукты питания, детские товары, лекарства и медицинские
									изделия, книги и периодика
								</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>22%</td>
								<td className='py-2'>
									Основная ставка, все остальные товары и услуги
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Сумма прописью для документа
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Итог с НДС инструмент сразу дублирует словами: в счетах и договорах
					сумму положено писать прописью, чтобы её нельзя было дописать или
					исправить незаметно. Копейки при этом пишут цифрами — по той же
					причине. Если сумма нужна прописью отдельно, для этого есть{' '}
					<Link
						href='/tools/amount-in-words'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						отдельный инструмент
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>Оговорка</h2>
				<p className='mt-3 text-muted-foreground'>
					Калькулятор считает арифметику по выбранной ставке и не заменяет
					бухгалтера. Он не знает про вычеты, авансы, раздельный учёт и
					особенности вашего режима налогообложения. Ставки указаны на дату,
					которая написана в подвале инструмента: законодательство меняется, и
					сверяться стоит с актуальной редакцией Налогового кодекса. Если нужен
					не налог с продажи, а налог с зарплаты, для этого есть отдельный{' '}
					<Link
						href='/tools/ndfl-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор НДФЛ
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
