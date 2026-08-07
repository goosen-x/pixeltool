import Link from 'next/link'

export function TeamRandomizerSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Когда команды не делятся поровну
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Если число участников не делится на число команд без остатка, лишние
					люди распределяются по одному в разные команды — разница между самой
					большой и самой маленькой командой никогда не превышает одного
					человека. Например, 11 человек на 3 команды дадут 4+4+3, а не 5+3+3.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Если вместо команд нужен жребий или монетка — в статье{' '}
				<Link
					href='/blog/randomayzer-zherebevka-online'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Рандомайзер: команды, жребий, кубик и монетка онлайн
				</Link>{' '}
				разобрано, какой инструмент для какой задачи.
			</p>
		</div>
	)
}
