import Link from 'next/link'

export function CoinFlipSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Ошибка игрока: почему серия орлов не влияет на следующий бросок
				</h2>
				<p className='mt-3 text-muted-foreground'>
					У честной монеты шансы всегда 50 на 50, независимо от того, что выпало
					раньше. Ощущение, что после пяти орлов подряд «должна» выпасть решка,
					— известная когнитивная ошибка (gambler&apos;s fallacy): монета не
					помнит предыдущие броски, у каждого свои независимые 50%.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Если нужно не бинарное решение, а выбор из нескольких вариантов — жребий
				или деление на команды — в статье{' '}
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
