import Link from 'next/link'

export function SpecialSymbolsPickerSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Когда нужен именно символ, а не эмодзи или шрифт
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Стрелки, тире, знак градуса, валюты, математические знаки — это
					обычные текстовые символы Unicode, а не изображения: они вставляются в
					любой текст, меняют размер вместе со шрифтом страницы и находятся
					поиском по странице, в отличие от картинки или эмодзи.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Другие способы украсить текст — эмодзи, смайлики, стилизованные шрифты —
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
