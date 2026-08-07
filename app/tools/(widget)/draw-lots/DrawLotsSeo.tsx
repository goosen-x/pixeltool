import Link from 'next/link'

export function DrawLotsSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Жеребьёвка для Тайного Санты и турниров
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Впишите имена участников списком — каждое имя вытягивается один раз,
					порядок непредсказуем заранее. Подходит и для жеребьёвки турнирной
					сетки, и для розыгрыша призов, и для того, чтобы честно раздать
					карточки Тайного Санты без спора, кто кому достался.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Чем жеребьёвка отличается от деления на команды или броска монеты — в
				статье{' '}
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
