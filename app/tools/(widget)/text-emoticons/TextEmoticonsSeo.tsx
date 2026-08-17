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

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Откуда взялись смайлики из символов
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Первый документированный эмотикон{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>:-)</code>{' '}
					предложил Скотт Фалман 19 сентября 1982 года на внутренней доске
					объявлений Университета Карнеги — Меллона, чтобы отличать шутки от
					серьёзных сообщений в общих чатах университета. Каомодзи родились
					независимо и позже, в японских текстовых BBS конца 1980-х: из-за
					особенностей японской раскладки и письменности читать лицо целиком,
					без поворота головы, оказалось естественнее. Обе традиции дожили до
					сегодняшнего дня без изменений — это по-прежнему просто текст, а не
					картинка.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Где это вставляется
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Как обычный текст, смайлик работает везде, где эмодзи может не
					отобразиться или выглядеть чужеродно — в нике для Steam и Discord, в
					комментарии на форуме без поддержки эмодзи, в описании профиля,
					которое рендерится моноширинным шрифтом. Скопируйте один клик по
					карточке — он попадёт в буфер обмена целиком, вместе со всеми
					символами.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Готовые эмодзи-картинки — не единственная альтернатива: полный список
				на все случаи собран в{' '}
				<Link
					href='/tools/emoji-list'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					списке эмодзи
				</Link>
				. Ещё способы украсить текст — стилизованные шрифты и спецсимволы — в
				статье{' '}
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
