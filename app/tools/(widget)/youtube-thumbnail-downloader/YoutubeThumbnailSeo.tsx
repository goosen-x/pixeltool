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
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full border-collapse text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-semibold'>Файл</th>
								<th className='py-2 pr-4 font-semibold'>Название</th>
								<th className='py-2 font-semibold'>Разрешение</th>
							</tr>
						</thead>
						<tbody>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top font-mono text-xs'>
									maxresdefault
								</td>
								<td className='py-2 pr-4 align-top'>Максимальное</td>
								<td className='py-2 align-top text-muted-foreground'>
									1280×720
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top font-mono text-xs'>
									sddefault
								</td>
								<td className='py-2 pr-4 align-top'>Стандартное</td>
								<td className='py-2 align-top text-muted-foreground'>
									640×480
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top font-mono text-xs'>
									hqdefault
								</td>
								<td className='py-2 pr-4 align-top'>Высокое</td>
								<td className='py-2 align-top text-muted-foreground'>
									480×360
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top font-mono text-xs'>
									mqdefault
								</td>
								<td className='py-2 pr-4 align-top'>Среднее</td>
								<td className='py-2 align-top text-muted-foreground'>
									320×180
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top font-mono text-xs'>
									default
								</td>
								<td className='py-2 pr-4 align-top'>Миниатюра</td>
								<td className='py-2 align-top text-muted-foreground'>120×90</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		</div>
	)
}
