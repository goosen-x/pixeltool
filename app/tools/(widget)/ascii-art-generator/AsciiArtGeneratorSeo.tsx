export function AsciiArtGeneratorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Два разных режима: из текста и из картинки
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Режим «Текст» рисует крупный баннер из букв. Он подходит для
					заголовков README, приветствия в CLI-инструменте или подписи в письме.
					Режим «Изображение» превращает загруженную фотографию в ASCII-рисунок
					из символов разной плотности. Здесь лучше работают контрастные
					картинки с простыми объектами, а фото с мелкими деталями на выходе
					превращаются в кашу из символов.
				</p>
			</section>
		</div>
	)
}
