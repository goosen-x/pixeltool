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
