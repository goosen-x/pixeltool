import Link from 'next/link'

export function TextEmoticonsSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Эмотикон или каомодзи: в чём разница
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Эмотикон читается «сбоку», как{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>:)</code>.
					Повернёшь голову и увидишь улыбку. Каомодзи (顔文字, японский стиль)
					читается прямо, без поворота, и передаёт мимику целым лицом, например{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
						(＾▽＾)
					</code>
					. Каомодзи обычно точнее передают конкретную эмоцию: раздражение,
					смущение, сарказм. Они не ограничены одной «улыбкой» из двух символов.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Самые ходовые каомодзи и что они означают:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Каомодзи</th>
								<th className='py-2 pr-4 font-medium'>Название</th>
								<th className='py-2 font-medium'>Смысл</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>( ͡° ͜ʖ ͡°)</td>
								<td className='py-2 pr-4'>Lenny Face</td>
								<td className='py-2'>многозначительный намёк</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>¯\_(ツ)_/¯</td>
								<td className='py-2 pr-4'>Shrug</td>
								<td className='py-2'>«ну а что я сделаю»</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>(╯°□°）╯︵ ┻━┻</td>
								<td className='py-2 pr-4'>Table Flip</td>
								<td className='py-2'>ярость, всё надоело</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>ಠ_ಠ</td>
								<td className='py-2 pr-4'>Disapproval</td>
								<td className='py-2'>осуждающий взгляд</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>ʕ•ᴥ•ʔ</td>
								<td className='py-2 pr-4'>Bear</td>
								<td className='py-2'>умиление</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>(≧▽≦)</td>
								<td className='py-2 pr-4'>Happy</td>
								<td className='py-2'>бурная радость</td>
							</tr>
						</tbody>
					</table>
				</div>
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
					независимо и позже, в японских текстовых BBS конца 1980-х. Из-за
					особенностей японской раскладки и письменности читать лицо целиком,
					без поворота головы, оказалось естественнее. Обе традиции дожили до
					сегодняшнего дня без изменений, это по-прежнему просто текст, а не
					картинка.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Где это вставляется
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Как обычный текст, смайлик работает везде, где эмодзи может не
					отобразиться или выглядеть чужеродно: в нике для Steam и Discord, в
					комментарии на форуме без поддержки эмодзи, в описании профиля,
					которое рендерится моноширинным шрифтом. Клик по карточке копирует
					смайлик в буфер обмена целиком, вместе со всеми символами.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Полный список готовых эмодзи-картинок на все случаи собран в{' '}
				<Link
					href='/tools/emoji-list'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					списке эмодзи
				</Link>
				. Про стилизованные шрифты и спецсимволы написано в статье{' '}
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
