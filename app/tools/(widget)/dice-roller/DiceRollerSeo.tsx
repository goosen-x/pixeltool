import Link from 'next/link'

export function DiceRollerSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Кости для настольных игр: сколько бросать сразу
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Бросить можно сразу несколько костей. Это удобно, если физических
					кубиков под рукой нет или не хватает на всех игроков за столом. Каждая
					кость считается независимо, поэтому сумма нескольких костей
					распределена неравномерно. Два кубика чаще дают 7, чем 2 или 12, и это
					не баг, а обычная статистика броска двух костей.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Если вместо кубика нужны монетка или деление на команды, в статье{' '}
				<Link
					href='/blog/randomayzer-zherebevka-online'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Рандомайзер: команды, жребий, кубик и монетка онлайн
				</Link>{' '}
				разобрано, какой инструмент когда использовать.
			</p>
		</div>
	)
}
