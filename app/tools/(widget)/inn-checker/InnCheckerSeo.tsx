import Link from 'next/link'
import { Formula } from '@/components/seo/Formula'

export function InnCheckerSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что проверяется, а что нет
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Последние цифры ИНН — контрольные: они вычисляются из предыдущих по
					формуле из приказа МНС России от 03.03.2004 № БГ-3-09/178. Инструмент
					повторяет этот расчёт и сравнивает результат с тем, что в номере. Если
					цифры не сходятся, номер точно набран с ошибкой — переставленные
					местами цифры и опечатки ловятся почти всегда. Обратное неверно:
					прошедший проверку номер лишь мог быть выдан, но может не принадлежать
					никому. Существует ли организация и совпадает ли название, смотрят в
					реестре ФНС на nalog.gov.ru — это разные вопросы, и здесь решается
					только первый.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как считается цифра
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Каждая цифра номера умножается на свой вес, произведения складываются,
					сумма делится на 11, а остаток — ещё раз на 10:
				</p>
				<Formula
					className='mt-4'
					latex='K = \\left(\\left(\\sum_{i=1}^{n} w_i \\cdot d_i\\right) \\bmod 11\\right) \\bmod 10'
				/>
				<p className='mt-4 text-muted-foreground'>
					Второе деление, на 10, нужно из-за остатка 10: цифры с таким значением
					не существует, и её заменяет ноль. Веса заданы приказом и для каждой
					позиции свои:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Что считаем</th>
								<th className='py-2 font-medium'>Веса по позициям</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>10-я цифра, организация</td>
								<td className='py-2 font-mono text-xs'>2 4 10 3 5 9 4 6 8</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>11-я цифра, человек</td>
								<td className='py-2 font-mono text-xs'>7 2 4 10 3 5 9 4 6 8</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>12-я цифра, человек</td>
								<td className='py-2 font-mono text-xs'>
									3 7 2 4 10 3 5 9 4 6 8
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Веса не случайны: они подобраны так, чтобы схема ловила две самые
					частые ошибки набора — искажение одной цифры и перестановку соседних.
					Именно поэтому проверка почти всегда срабатывает на опечатке, хотя
					занимает девять умножений.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Десять цифр и двенадцать
				</h2>
				<p className='mt-3 text-muted-foreground'>
					У организаций номер десятизначный с одной контрольной цифрой в конце.
					У людей и индивидуальных предпринимателей — двенадцатизначный, и
					контрольных цифр там две: одиннадцатая и двенадцатая, каждая со своим
					набором весов. Инструмент определяет тип по длине, так что выбирать
					ничего не нужно. Любая другая длина — сразу ошибка: одиннадцати- или
					девятизначных ИНН не бывает.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Откуда берётся регион
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Первые две цифры — код субъекта РФ, следующие две — код инспекции,
					выдавшей номер. Коды субъектов те же, что на автомобильных номерах: 77
					— Москва, 78 — Санкт-Петербург, 50 — Московская область. Полную
					таблицу можно посмотреть в{' '}
					<Link
						href='/tools/car-region-codes'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						кодах регионов на автомобильных номерах
					</Link>
					. Важная оговорка: регион в ИНН остаётся тем, где номер выдали, даже
					если компания давно переехала, — по нему нельзя судить о нынешнем
					адресе.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Когда это нужно на практике
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Чаще всего — при переносе реквизитов руками: из письма в договор, из
					счёта в платёжку. Одна переставленная цифра превращает платёж в
					невыясненный, а возвращать его дольше, чем проверить номер заранее.
					Рядом пригодятся{' '}
					<Link
						href='/tools/amount-in-words'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						сумма прописью
					</Link>{' '}
					и{' '}
					<Link
						href='/tools/vat-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор НДС
					</Link>{' '}
					— обычные соседи по тому же документу.
				</p>
			</section>
		</div>
	)
}
