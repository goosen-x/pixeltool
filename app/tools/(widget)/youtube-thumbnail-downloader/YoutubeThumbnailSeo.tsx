export function YoutubeThumbnailSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему maxres иногда недоступен
				</h2>
				<p className='mt-3 text-muted-foreground'>
					YouTube генерирует превью в разрешении 1280×720 (maxresdefault) не для
					каждого видео. Чаще всего его нет у старых роликов, видео в низком
					исходном качестве и части трансляций. Тогда доступны только более
					мелкие варианты: standard (640×480), high (480×360), medium (320×180)
					и default (120×90). Инструмент предлагает их автоматически, если самое
					крупное превью не существует.
				</p>
			</section>
		</div>
	)
}
