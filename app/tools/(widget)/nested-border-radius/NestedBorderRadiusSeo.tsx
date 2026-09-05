import Link from 'next/link'
import { Formula } from '@/components/seo/Formula'

export function NestedBorderRadiusSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Правило: радиус внутреннего = радиус внешнего минус отступ
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Когда одна скруглённая коробка лежит внутри другой, радиусы не должны
					совпадать. Внутренний элемент отодвинут от внешнего на величину
					отступа, и его угол начинается ближе к центру — значит, и загибаться
					он должен круче. Отсюда вся арифметика: <code>Rᵢ = Rₑ − E</code>, где
					E — расстояние между контурами, то есть padding плюс толщина рамки. То
					же самое с другой стороны: если задан внутренний радиус, внешний равен{' '}
					<code>Rᵢ + E</code>.
				</p>
				<Formula
					latex='R_i = R_e - E'
					caption='Rₑ — радиус внешнего блока, E — расстояние между контурами: padding плюс толщина рамки'
				/>

				<p className='mt-4 text-muted-foreground'>
					Сочетания, которые встречаются чаще всего:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Внешний радиус</th>
								<th className='py-2 pr-4 font-medium'>Отступ</th>
								<th className='py-2 font-medium'>Внутренний радиус</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>12 px</td>
								<td className='py-2 pr-4 font-mono'>4 px</td>
								<td className='py-2 font-mono'>8 px</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>16 px</td>
								<td className='py-2 pr-4 font-mono'>8 px</td>
								<td className='py-2 font-mono'>8 px</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>24 px</td>
								<td className='py-2 pr-4 font-mono'>16 px</td>
								<td className='py-2 font-mono'>8 px</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>8 px</td>
								<td className='py-2 pr-4 font-mono'>12 px</td>
								<td className='py-2 font-mono'>0 px</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Последняя строка показывает частый случай: отступ больше внешнего
					радиуса, вычитание уходит в минус, и внутренний угол остаётся прямым.
					Калькулятор в этой ситуации отдаёт ноль, а не отрицательное число.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как выглядит ошибка
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Самый частый вариант — оставить обоим элементам один и тот же радиус.
					Тогда в углу зазор между контурами становится зрительно шире, чем по
					сторонам: дуги расходятся. Обратная крайность — оставить внутреннему
					нулевой радиус, и угол торчит острым в круглой рамке. Переключатель
					«Одинаковый» в инструменте показывает первый случай: включите его,
					сравните с расчётом и увидите разницу, ради которой формула и нужна.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему в CSS лучше переменные, а не два числа
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Можно выписать оба радиуса вручную, но связь между ними при этом
					теряется: стоит поменять отступ, и углы разъедутся, а причину никто не
					вспомнит. Поэтому инструмент отдаёт код через кастомные свойства, где
					внутренний радиус вычисляется из внешнего прямо в стилях. Обёртка в{' '}
					<code>max(0px, ...)</code> нужна на случай, когда отступ больше
					радиуса: отрицательное значение браузер отбросил бы вместе со всем
					свойством, а так угол просто становится прямым. Такой вложенной
					карточке часто нужна ещё и тень, подобрать её можно в{' '}
					<Link
						href='/tools/css-box-shadow-generator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						генераторе box-shadow
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>Точность приёма</h2>
				<p className='mt-3 text-muted-foreground'>
					Строго математически дуги при таком расчёте не эквидистантны: центры
					окружностей не совпадают, и расстояние между линиями по ходу дуги чуть
					меняется. На практике расхождение меньше того, что различает глаз,
					поэтому приём давно принят в интерфейсной вёрстке и заложен в
					дизайн-системы. Включите «крупно» и посмотрите на угол вблизи — видно,
					насколько близко дуги идут друг к другу.
				</p>
			</section>
		</div>
	)
}
