import Link from 'next/link'
import { Formula } from '@/components/seo/Formula'

export function TileCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Зачем нужен запас на подрезку
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Прежде чем считать плитку, стоит точно измерить площадь помещения в{' '}
					<Link
						href='/tools/area-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькуляторе площади
					</Link>
					, особенно если комната неправильной формы. Плитка у стен, вокруг труб
					и в углах почти всегда режется, и обрезки редко подходят для другого
					места — их выбрасывают. Стандартный запас — 10% для прямой укладки,
					15–20% для укладки по диагонали или в помещении со сложной геометрией
					(эркеры, ниши, много углов). Взять плитку впритык — почти
					гарантированно доехать за докупкой в разгар ремонта, когда партия с
					тем же оттенком уже может не продаваться.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Сколько закладывать сверху, зависит от раскладки: чем больше плиток
					придётся резать по диагонали, тем больше уходит в отход. Ориентиры:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Тип укладки</th>
								<th className='py-2 font-medium'>Запас</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Прямая, шов в шов</td>
								<td className='py-2 font-mono'>5–7%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Вразбежку, со смещением</td>
								<td className='py-2 font-mono'>7–10%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Диагональная</td>
								<td className='py-2 font-mono'>10–15%</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Ёлочка и сложные раскладки</td>
								<td className='py-2 font-mono'>15%</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					К этому добавляют бой при доставке и запас на будущий ремонт: через
					год той же партии в продаже может не быть, а плитка из другой партии
					отличается оттенком.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Формула расхода затирки
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Расход считается по формуле, которой пользуются производители затирки.
					Чем крупнее плитка, тем меньше швов на квадратный метр и тем ниже
					расход — у плитки 60×60 см он заметно меньше, чем у мозаики того же
					типа затирки. Итоговая цифра — ориентир: точный расход зависит от
					конкретной марки смеси и указан на упаковке. Стяжку под плитку, если
					её ещё нет, можно рассчитать в{' '}
					<Link
						href='/tools/concrete-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькуляторе бетона
					</Link>
					.
				</p>
				<Formula
					latex='Q = \dfrac{L + W}{L \cdot W} \cdot t \cdot s \cdot \rho'
					caption='L и W — длина и ширина плитки в мм, t — толщина плитки, s — ширина шва, ρ — плотность смеси, около 1,8 г/см³'
				/>
			</section>
		</div>
	)
}
