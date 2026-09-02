import Link from 'next/link'

export function AreaCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Стены считаются не так, как пол
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Площадь пола — это длина на ширину, и её обычно знают из документов на
					квартиру. Площадь стен считается иначе: периметр комнаты умножается на
					высоту потолка, а из результата вычитаются окна и двери. Комната 5 на
					4 метра с потолком 2,7 даёт 20 квадратов пола и почти 49 квадратов
					стен — разница больше чем вдвое, и именно она нужна для обоев, краски
					и штукатурки.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Проёмы вычитать стоит не всегда. Под покраску их убирают, потому что
					красить там нечего. Под обои опытные мастера считают без вычета или
					вычитают только большие проёмы: рулон всё равно раскраивается с
					запасом, и сэкономленный на дверном проёме кусок обычно уходит в
					обрезки. Инструмент показывает оба числа сразу, чтобы решение
					оставалось за вами.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Треугольник по трём сторонам
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Участок или скат крыши редко даёт высоту треугольника — измерить можно
					только стороны. Поэтому здесь площадь считается по формуле Герона,
					которой нужны именно три стороны и полупериметр. Если стороны не
					образуют треугольника, то есть сумма двух не больше третьей,
					инструмент так и скажет, а не покажет ноль или ошибку: у такой фигуры
					площади не существует, потому что и фигуры не существует.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Круг задаётся диаметром
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Диаметр меряется рулеткой напрямую, через центр, а радиус пришлось бы
					считать в уме. Подставить диаметр в формулу, ждущую радиус, — самая
					частая ошибка в этих расчётах, и стоит она четырёхкратного
					расхождения: площадь растёт как квадрат, поэтому вдвое больший радиус
					даёт вчетверо большую площадь.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что дальше делать с площадью
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Посчитанные квадраты обычно нужны для материала. Для плитки есть{' '}
					<Link
						href='/tools/tile-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор плитки
					</Link>{' '}
					с учётом подрезки и швов, для фундамента —{' '}
					<Link
						href='/tools/foundation-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор фундамента
					</Link>
					, а если нужны кубометры, а не квадраты, —{' '}
					<Link
						href='/tools/volume-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор объёма
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
