import Link from 'next/link'
import { Formula } from '@/components/seo/Formula'

export function TypingSpeedTestSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как считаются знаки в минуту и слова в минуту
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Таймер запускается в момент первого нажатия клавиши, а не по кнопке
					«старт» — так секунды не тратятся на раздумья перед началом. Знаки в
					минуту (зн/мин) — это количество верно набранных символов, делённое на
					время в минутах. Слова в минуту считаются по стандартной формуле:
					каждые пять знаков засчитываются как одно условное слово, независимо
					от реальной длины слов в тексте.
				</p>
				<Formula
					latex='\text{зн/мин} = \dfrac{N}{t}'
					caption='N — верно набранные символы, t — время в минутах'
				/>
				<Formula
					latex='\text{сл/мин} = \dfrac{N}{5\,t}'
					caption='то же самое, но пять знаков считаются за слово'
				/>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему точность важнее скорости
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Опечатка подсвечивается сразу — красным фоном под неверным символом, а
					курсор в тексте показывает текущую позицию. Вставка текста через буфер
					обмена отключена намеренно: тест засчитывает только реальный набор с
					клавиатуры. Точность в процентах считается как доля верно набранных
					символов от всех введённых — быстрый набор с частыми ошибками на
					практике медленнее, чем чуть более медленный, но точный. Скорость рук
					на клавиатуре тут ни при чём, а вот скорость реакции на визуальный
					сигнал измеряет отдельный{' '}
					<Link
						href='/tools/reaction-test'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						тест реакции
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что считается нормальной скоростью печати
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Ориентировочные диапазоны, не строгий норматив — скорость сильно
					зависит от языка текста, привычки к слепому набору и того, печатаете
					вы вслепую или смотрите на клавиатуру.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full border-collapse text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-semibold'>Уровень</th>
								<th className='py-2 font-semibold'>Знаков в минуту</th>
							</tr>
						</thead>
						<tbody>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>Новичок</td>
								<td className='py-2 align-top text-muted-foreground'>
									~100 зн/мин
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>Средний уровень</td>
								<td className='py-2 align-top text-muted-foreground'>
									~200 зн/мин
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>Профи, слепая печать</td>
								<td className='py-2 align-top text-muted-foreground'>
									300+ зн/мин
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		</div>
	)
}
