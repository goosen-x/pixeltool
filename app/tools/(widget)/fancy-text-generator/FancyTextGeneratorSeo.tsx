import Link from 'next/link'

export function FancyTextGeneratorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Это не форматирование, а другие символы Unicode
				</h2>
				<p className='mt-3 text-muted-foreground'>
					«Жирный» и «курсивный» результат — не HTML-разметка, а буквы из
					отдельного диапазона Unicode, которые визуально выглядят жирными или
					курсивными. Именно поэтому такой текст работает в местах без
					форматирования — в описании профиля Instagram, в никнейме, в подписи —
					но по той же причине его не может прочитать программа чтения с экрана
					как обычный текст, и поиск по сайту не всегда его находит: для
					компьютера это другие символы, а не жирный «A».
				</p>
			</section>

			<p className='text-muted-foreground'>
				Ещё способы украсить текст — эмодзи, текстовые смайлики и спецсимволы —
				в статье{' '}
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
