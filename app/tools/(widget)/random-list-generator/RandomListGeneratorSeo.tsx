import Link from 'next/link'

export function RandomListGeneratorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Чем это отличается от жеребьёвки
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Жеребьёвка вытягивает элементы по одному, и это удобно, когда процесс
					выбора должен идти на глазах у всех. Здесь же список перемешивается
					целиком за один клик. На выходе тот же список, но в новом
					непредсказуемом порядке. Подходит, когда важен только результат, а не
					сам процесс.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Если нужен не весь список в новом порядке, а один случайный номер,
				возьмите{' '}
				<Link
					href='/tools/random-number-generator'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					генератор случайных чисел
				</Link>
				, а для деления списка участников на равные группы есть{' '}
				<Link
					href='/tools/team-randomizer'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					разделение на команды
				</Link>
				. Другие способы получить случайный результат (жребий, монетка, кубик,
				деление на команды) собраны в статье{' '}
				<Link
					href='/blog/randomayzer-zherebevka-online'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Рандомайзер: команды, жребий, кубик и монетка онлайн
				</Link>
				.
			</p>
		</div>
	)
}
