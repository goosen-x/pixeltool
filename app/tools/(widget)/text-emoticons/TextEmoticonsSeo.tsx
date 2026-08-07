import Link from 'next/link'

export function TextEmoticonsSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Эмотикон или каомодзи — в чём разница
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Эмотикон читается «сбоку», как в{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>:)</code> —
					повернёшь голову и увидишь улыбку. Каомодзи (顔文字, японский стиль)
					читается прямо, без поворота, и передаёт мимику целым лицом, например{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
						(＾▽＾)
					</code>
					. Каомодзи обычно точнее передают конкретную эмоцию — раздражение,
					смущение, сарказм, — потому что не ограничены одной «улыбкой» из двух
					символов.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Ещё три способа украсить текст без картинок — эмодзи, стилизованные
				шрифты и спецсимволы — в статье{' '}
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
