import Link from 'next/link'
import { Formula } from '@/components/seo/Formula'

export function VolumeCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Кубометры и литры — одно и то же
				</h2>
				<p className='mt-3 text-muted-foreground'>
					В кубическом метре ровно тысяча литров, и это не приблизительно, а по
					определению: литр — это кубический дециметр, а в метре десять
					дециметров, значит в кубометре тысяча кубических дециметров. Поэтому
					результат показан сразу в обеих величинах: бетон и грунт считают в
					кубометрах, воду и топливо в литрах, а пересчитывать между ними в уме
					нет нужды. Проверить просто: куб со стороной десять сантиметров
					вмещает ровно литр.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Все фигуры, которые считает калькулятор, и формулы за ними. Круглые
					фигуры задаются диаметром, поэтому в формулах он делится пополам:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Фигура</th>
								<th className='py-2 pr-4 font-medium'>Что задаётся</th>
								<th className='py-2 font-medium'>Объём</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Короб</td>
								<td className='py-2 pr-4'>три стороны</td>
								<td className='py-2 font-mono'>a × b × c</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Цилиндр</td>
								<td className='py-2 pr-4'>диаметр и высота</td>
								<td className='py-2 font-mono'>π × d² × h / 4</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Труба, внутренний объём</td>
								<td className='py-2 pr-4'>внутренний диаметр и длина</td>
								<td className='py-2 font-mono'>π × d² × L / 4</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Труба, объём стенки</td>
								<td className='py-2 pr-4'>наружный и внутренний диаметр</td>
								<td className='py-2 font-mono'>π × (D² − d²) × L / 4</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Шар</td>
								<td className='py-2 pr-4'>диаметр</td>
								<td className='py-2 font-mono'>π × d³ / 6</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Конус</td>
								<td className='py-2 pr-4'>диаметр основания и высота</td>
								<td className='py-2 font-mono'>π × d² × h / 12</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Усечённый конус</td>
								<td className='py-2 pr-4'>два диаметра и высота</td>
								<td className='py-2 font-mono'>π × h × (D² + D×d + d²) / 12</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Один кубометр это ровно 1000 литров, поэтому результат показывается
					сразу в обеих единицах: бетон считают в кубах, а ёмкости в литрах.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему диаметр, а не радиус
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Все круглые фигуры здесь задаются диаметром. Так меряют в жизни:
					рулетка ложится через центр бочки или поперёк трубы, а радиус
					приходится получать делением в уме. Именно на этом чаще всего и
					ошибаются — подставляют диаметр туда, где формула ждёт радиус, и
					получают объём вчетверо больше настоящего. У труб диаметр к тому же
					указан в маркировке, и лишний пересчёт там просто негде взять.
				</p>
				<Formula
					latex='V = \dfrac{\pi d^2 h}{4}'
					caption='d — диаметр основания, h — высота цилиндра'
				/>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Труба: стенки и вместимость — разные числа
				</h2>
				<p className='mt-3 text-muted-foreground'>
					У трубы два осмысленных объёма, и путать их дорого. Объём стенок — это
					металл или пластик между внешним и внутренним диаметром, он нужен для
					веса и для стоимости материала. Вместимость — то, что войдёт внутрь,
					считается по внутреннему диаметру и нужна для расчёта теплоносителя
					или воды в системе. Инструмент показывает оба, чтобы не пришлось
					считать дважды. Сумма их равна объёму сплошного цилиндра того же
					наружного диаметра — на этом равенстве расчёт и проверяется.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Конус, усечённый конус и что это в жизни
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Конус занимает ровно треть цилиндра с тем же основанием и высотой —
					соотношение, известное со времён Архимеда и удобное для быстрой
					прикидки. Усечённый конус, у которого верх шире или уже низа, — это
					обычное ведро, бункер или воронка; если оба диаметра сделать
					одинаковыми, формула честно вырождается в цилиндр, а если верхний
					обнулить — в конус.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>Соседние расчёты</h2>
				<p className='mt-3 text-muted-foreground'>
					Для объёма бетона с расчётом состава смеси есть{' '}
					<Link
						href='/tools/concrete-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор бетона
					</Link>
					, для площадей —{' '}
					<Link
						href='/tools/area-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор площади
					</Link>
					, а перевести кубометры в другие единицы поможет{' '}
					<Link
						href='/tools/unit-converter'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						конвертер единиц
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
