import Link from 'next/link'

export function UnitConverterSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Метрическая система и английские единицы: откуда разница
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Почти весь мир, включая Россию, использует метрическую систему
					(миллиметры, килограммы, градусы Цельсия). Она построена на степенях
					десяти, поэтому перевод внутри неё сводится к переносу запятой. США и
					отчасти Великобритания остались на имперской системе (дюймы, фунты,
					градусы Фаренгейта). Она старше метрической и исторически привязана к
					бытовым предметам, а не к десятичной логике. Отсюда и некруглые
					коэффициенты вроде «25,4» или «453,59237». Единицы возникли независимо
					друг от друга, а потом их просто договорились точно приравнять.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему нельзя просто округлить коэффициент
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Коэффициенты перевода (1 дюйм = 25,4 мм, 1 фунт = 0,45359237 кг)
					зафиксированы международными соглашениями как точные значения, а не
					приближённые. На малых числах округление незаметно, но чем больше
					исходное значение и чем больше промежуточных пересчётов, тем сильнее
					накапливается погрешность. Этот конвертер считает по точным
					коэффициентам на каждом шаге, без промежуточного округления.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Самые частые пары единиц
				</h2>
				<p className='mt-3 text-muted-foreground'>
					У каждой пары ниже есть отдельная страница с расчётом, историей
					единицы и ответами на частые вопросы:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Единицы</th>
								<th className='py-2 font-medium'>Коэффициент</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>
									<Link
										href='/tools/unit-converter/mili-v-kilometry'
										className='cursor-pointer font-medium text-primary hover:underline'
									>
										Мили и километры
									</Link>
								</td>
								<td className='py-2 font-mono'>1 миля = 1,609344 км</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>
									<Link
										href='/tools/unit-converter/funty-v-kg'
										className='cursor-pointer font-medium text-primary hover:underline'
									>
										Фунты и килограммы
									</Link>
								</td>
								<td className='py-2 font-mono'>1 фунт = 0,45359237 кг</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>
									<Link
										href='/tools/unit-converter/celsiy-v-farengeyt'
										className='cursor-pointer font-medium text-primary hover:underline'
									>
										Цельсий и Фаренгейт
									</Link>
								</td>
								<td className='py-2 font-mono'>°F = °C × 9/5 + 32</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		</div>
	)
}
