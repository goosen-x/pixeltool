import Link from 'next/link'

export function FoundationCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Три типа фундамента и как считается объём
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Ленточный — бетонная лента под несущими стенами: объём это длина
					ленты, умноженная на её ширину и высоту. Периметр здесь считается по
					осевой линии, а не по внешнему контуру дома: иначе четыре угла
					попадают в расчёт дважды и объём завышается тем сильнее, чем шире
					лента. Плита — сплошное основание, объём равен произведению длины,
					ширины и толщины. Столбчатый — отдельные опоры, объём одного столба
					это площадь круга на глубину заложения, умноженная на число столбов.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Глубина промерзания грунта
				</h2>
				<p className='mt-4 text-muted-foreground'>
					Подошву ленточного и столбчатого фундамента закладывают ниже глубины
					промерзания, иначе морозное пучение будет выдавливать её вверх.
					Нормативные значения по СП 22.13330.2016:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Город</th>
								<th className='py-2 font-medium'>
									Нормативная глубина промерзания
								</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Москва</td>
								<td className='py-2 font-mono'>1,4 м</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Санкт-Петербург</td>
								<td className='py-2 font-mono'>1,2 м</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Новосибирск</td>
								<td className='py-2 font-mono'>2,2 м</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Краснодар</td>
								<td className='py-2 font-mono'>0,8 м</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Цифры даны для суглинистых и глинистых грунтов. Для песков и
					водонасыщенных грунтов глубина больше, а точное значение зависит от
					того, какой грунт лежит на конкретном участке, поэтому для проекта его
					берут из результатов геологии, а не из таблицы.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Сколько арматуры закладывать
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Продольные прутки идут вдоль всей ленты, обычно четыре в сечении — два
					сверху и два снизу. Длина считается как длина ленты, умноженная на
					число прутков, плюс 10% на нахлёсты и загибы: стыковать арматуру встык
					нельзя, прутки заводят друг за друга. У столбчатого фундамента
					арматура идёт вертикально в каждой опоре, поэтому расчёт ведётся от
					суммарной высоты столбов. Поперечные хомуты сюда не входят — их шаг
					задаёт проект.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Откуда взяты нормы расхода
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Расход цемента, песка, щебня и воды на кубометр берётся из той же
					таблицы, что и в{' '}
					<Link
						href='/tools/concrete-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькуляторе бетона
					</Link>
					: состав смеси не зависит от того, во что её заливают. Для фундамента
					частного дома обычно берут М300. Числа — ориентир для закупки, а
					глубину заложения, сечение арматуры и марку для конкретного дома
					определяет проект: они зависят от грунта, глубины промерзания и
					нагрузки, которые калькулятор знать не может.
				</p>
			</section>
		</div>
	)
}
