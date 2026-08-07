export function AsciiArtGeneratorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Из текста или из картинки — два разных режима
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Режим «Текст» рисует крупный баннер из букв — подходит для заголовков
					README, приветствия в CLI-инструменте или подписи в письме. Режим
					«Изображение» превращает загруженную фотографию в ASCII-рисунок из
					символов разной плотности — для этого лучше подходят контрастные
					картинки с простыми объектами: сложные фото с мелкими деталями на
					выходе превращаются в кашу из символов.
				</p>
			</section>
		</div>
	)
}
