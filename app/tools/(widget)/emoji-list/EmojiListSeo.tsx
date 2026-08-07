import Link from 'next/link'

export function EmojiListSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему один и тот же эмодзи выглядит по-разному
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Эмодзи — это символ Unicode, а не картинка: у него нет единого
					рисунка, каждая платформа (iOS, Android, Windows, WhatsApp) рисует его
					по-своему в собственном наборе иконок. Поэтому один и тот же эмодзи 😀
					может выглядеть немного иначе у отправителя и получателя — это не баг,
					так работает стандарт Unicode.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Ещё способы украсить текст — текстовые смайлики, стилизованные шрифты и
				спецсимволы — в статье{' '}
				<Link
					href='/blog/smayliki-shrifty-simvoly-dlya-teksta'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Смайлики текстом, эмодзи, красивые шрифты и символы
				</Link>
				.
			</p>
		</div>
	)
}
