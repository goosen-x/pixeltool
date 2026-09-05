import Link from 'next/link'

export function ConcreteCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как выбрать марку бетона
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Марка обозначает прочность на сжатие и определяет, для чего годится
					бетон. М100 — тощий бетон для подготовительного слоя под фундамент или
					садовые дорожки, где на прочность почти нет нагрузки. М200 — стяжка
					пола и лёгкие конструкции вроде ступеней (площадь под будущую плитку
					считает{' '}
					<Link
						href='/tools/tile-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор плитки
					</Link>
					). М300 — стандарт для фундамента частного дома и монолитной плиты, а
					объём и армирование самого фундамента удобнее прикинуть в{' '}
					<Link
						href='/tools/foundation-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькуляторе фундамента
					</Link>
					. М400 нужен уже под несущие стены, колонны и балки с высокой
					нагрузкой. Для ответственных конструкций марку стоит уточнить в
					проекте, а не выбирать на глаз.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Чем выше марка, тем больше цемента в составе и тем большую нагрузку
					выдерживает готовая конструкция:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Марка</th>
								<th className='py-2 font-medium'>Где применяют</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>M100</td>
								<td className='py-2'>
									подготовка под фундамент, подбетонка, стяжка без нагрузки
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>M150</td>
								<td className='py-2'>
									стяжка пола, садовые дорожки, бетонирование столбов
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>M200</td>
								<td className='py-2'>
									отмостка, стяжка под нагрузкой, лёгкий ленточный фундамент
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>M250</td>
								<td className='py-2'>
									ленточный фундамент и плита под частный дом
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>M300</td>
								<td className='py-2'>фундаменты, монолитные плиты, лестницы</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>M350</td>
								<td className='py-2'>
									несущие конструкции, плиты перекрытия, колонны
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>M400</td>
								<td className='py-2'>
									конструкции с высокой нагрузкой, чаши бассейнов
								</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>M500</td>
								<td className='py-2'>
									специальные и гидротехнические сооружения
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Откуда взяты нормы расхода материалов
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Расход цемента, песка, щебня и воды на 1 м³ приведён для цемента марки
					М400 и щебня фракции 20 мм — это самое частое сочетание для частного
					строительства. Реальный расход у конкретного завода или карьера может
					отличаться на несколько процентов из-за влажности песка и фракции
					щебня, поэтому цифры — надёжный ориентир для закупки с запасом, а не
					точная лабораторная рецептура для бетонного узла.
				</p>
			</section>
		</div>
	)
}
