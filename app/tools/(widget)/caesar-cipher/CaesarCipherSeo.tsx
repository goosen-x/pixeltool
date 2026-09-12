import Link from 'next/link'
import { Formula } from '@/components/seo/Formula'

/**
 * SEO-блок под шифром Цезаря. Закрывает то, что не помещается в FAQ:
 * арифметику сдвига, взлом частотным анализом (главный запрос после
 * «зашифровать» — «расшифровать без ключа»), родню вроде ROT13 и историю
 * шифровального диска, который и нарисован в самом инструменте.
 */
export function CaesarCipherSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как считается сдвиг
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Буквы алфавита нумеруются с нуля, и шифрование — это сложение номера
					буквы с ключом по кругу. «По кругу» здесь не метафора: после последней
					буквы счёт начинается заново с первой, поэтому в инструменте нарисован
					именно диск, а не линейка.
				</p>
				<Formula
					latex='E_k(x) = (x + k) \bmod n \qquad D_k(x) = (x - k + n) \bmod n'
					caption='x — номер буквы в алфавите, k — сдвиг (ключ), n — длина алфавита: 26 для латиницы, 33 для русского алфавита с Ё'
				/>
				<p className='mt-3 text-muted-foreground'>
					Отсюда два следствия, которые видно на диске. Первое: сдвиг всегда
					можно привести к диапазону от 0 до n−1 — сдвиг 30 по латинице это то
					же самое, что сдвиг 4, диск просто провернулся на лишний оборот.
					Второе: нулевой сдвиг оставляет текст как есть, поэтому осмысленных
					ключей на один меньше, чем букв.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как расшифровать текст без ключа
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Самый прямой способ — перебор: включите «перебор ключей», и все 25
					(латиница) или 32 (кириллица) варианта появятся списком под
					инструментом. Осмысленная строка находится глазами за несколько
					секунд, никакой математики не нужно.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Длинный текст вскрывается ещё быстрее — частотным анализом, вообще без
					перебора. Буквы встречаются в языке с устойчивой частотой, а сдвиг её
					не меняет: он только переставляет буквы по кругу. Найдите самую частую
					букву шифротекста, вычтите из её номера номер самой частой буквы языка
					— получите ключ.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Место</th>
								<th className='py-2 pr-4 font-medium'>Русский</th>
								<th className='py-2 font-medium'>Английский</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>1</td>
								<td className='py-2 pr-4 font-mono'>О — 11,0%</td>
								<td className='py-2 font-mono'>E — 12,7%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>2</td>
								<td className='py-2 pr-4 font-mono'>Е — 8,5%</td>
								<td className='py-2 font-mono'>T — 9,1%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>3</td>
								<td className='py-2 pr-4 font-mono'>А — 8,0%</td>
								<td className='py-2 font-mono'>A — 8,2%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>4</td>
								<td className='py-2 pr-4 font-mono'>И — 7,4%</td>
								<td className='py-2 font-mono'>O — 7,5%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>5</td>
								<td className='py-2 pr-4 font-mono'>Н — 6,7%</td>
								<td className='py-2 font-mono'>I — 7,0%</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>6</td>
								<td className='py-2 pr-4 font-mono'>Т — 6,3%</td>
								<td className='py-2 font-mono'>N — 6,7%</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-3 text-sm text-muted-foreground'>
					Русские частоты — по Национальному корпусу русского языка, английские
					— по таблице из «Cryptological Mathematics» Роберта Лиуанда. Цифры
					округлены и заметно плывут на коротких текстах: на одной фразе
					частотный анализ не работает, там надёжнее перебор.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					ROT13 и другие родственники
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Почти всё, что называется «ROT-чем-то», — это шифр Цезаря с
					закреплённым ключом. Общая идея одна: взять упорядоченный набор
					символов и провернуть его ровно на половину длины, чтобы шифрование и
					расшифровка стали одной и той же операцией.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Название</th>
								<th className='py-2 pr-4 font-medium'>Что сдвигает</th>
								<th className='py-2 font-medium'>Пример</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>ROT13</td>
								<td className='py-2 pr-4'>26 латинских букв на 13</td>
								<td className='py-2 font-mono'>Hello → Uryyb</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>ROT5</td>
								<td className='py-2 pr-4'>10 цифр на 5</td>
								<td className='py-2 font-mono'>2026 → 7571</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>ROT18</td>
								<td className='py-2 pr-4'>
									буквы и цифры разом (ROT13 + ROT5)
								</td>
								<td className='py-2 font-mono'>A1 → N6</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>ROT47</td>
								<td className='py-2 pr-4'>94 печатных символа ASCII на 47</td>
								<td className='py-2 font-mono'>Hello → w6==@</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-3 text-muted-foreground'>
					Для русского алфавита такого самообратного ключа нет: 33 буквы на два
					нацело не делятся. Ни один из этих вариантов не защищает данные — это
					способ спрятать спойлер от случайного взгляда, а не от того, кто
					захочет прочитать. Если нужно не скрыть текст, а безопасно передать
					его по текстовому каналу, это другая задача и другой инструмент —{' '}
					<Link
						href='/tools/base64-encoder'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						кодировщик Base64
					</Link>
					. Если нужен по-настоящему стойкий секрет —{' '}
					<Link
						href='/tools/password-generator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						генератор паролей
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Откуда взялся шифровальный диск
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Два кольца букв в инструменте — не украшение, а копия настоящего
					устройства. Первым его описал Леон Баттиста Альберти в 1467 году: два
					соосных медных круга с алфавитами, которые проворачиваются
					относительно друг друга. Идея оказалась живучей — в 1922 году армия
					США приняла на вооружение шифратор M-94 из 25 алюминиевых дисков на
					общей оси, и служил он до Второй мировой.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Сам Цезарь, по «Жизни двенадцати цезарей» Светония, сдвигал буквы на
					три позиции: вместо A писал D. А его преемник Август пользовался
					сдвигом на единицу и, дойдя до конца алфавита, писал вместо X две
					буквы AA — правило «завернуть в начало» тогда ещё не придумали, и диск
					такой шифр нарисовать бы не смог.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Шифр Цезаря — обычная остановка в школьной программе и в квестах.
					Рядом с ним чаще всего оказывается{' '}
					<Link
						href='/tools/morse-code-translator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						азбука Морзе
					</Link>
					: она тоже заменяет буквы, но решает ровно обратную задачу — не
					спрятать сообщение, а передать его как можно надёжнее.
				</p>
			</section>
		</div>
	)
}
