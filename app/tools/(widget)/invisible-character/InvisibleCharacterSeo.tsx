export function InvisibleCharacterSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему обычный пробел не подходит
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Большинство полей ввода (ник в игре, имя в мессенджере, статус)
					обрезают пробелы по краям текста, это называется trim, и не дают
					сохранить строку из одних пробелов. Символы на этой странице —
					отдельные юникод-символы с нулевой или невидимой шириной. Для проверки
					на «пустоту» они не считаются пробелом, а глазу не видны.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Один символ может не подойти, и это нормально
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Каждый сервис фильтрует ввод по-своему. Где-то проверяют именно на
					zero-width space и пропускают Braille Blank, где-то наоборот. Заранее
					узнать, какой символ пройдёт в конкретном поле, нельзя, поэтому на
					странице несколько вариантов. Не сработал первый, переходите к
					следующему.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Какой символ на какой площадке обычно проходит проверку:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Символ</th>
								<th className='py-2 pr-4 font-medium'>Кодпоинт</th>
								<th className='py-2 font-medium'>Где обычно работает</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Zero Width Space</td>
								<td className='py-2 pr-4 font-mono'>U+200B</td>
								<td className='py-2'>Telegram: имя и сообщения</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Braille Blank</td>
								<td className='py-2 pr-4 font-mono'>U+2800</td>
								<td className='py-2'>Discord, Roblox, Steam</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Hangul Filler</td>
								<td className='py-2 pr-4 font-mono'>U+3164</td>
								<td className='py-2'>PUBG Mobile, Free Fire, Roblox</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Hangul Choseong Filler</td>
								<td className='py-2 pr-4 font-mono'>U+115F</td>
								<td className='py-2'>Telegram: имя профиля, Roblox</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Combining Grapheme Joiner</td>
								<td className='py-2 pr-4 font-mono'>U+034F</td>
								<td className='py-2'>Telegram, X: имя профиля</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Zero Width Joiner</td>
								<td className='py-2 pr-4 font-mono'>U+200D</td>
								<td className='py-2'>iOS: имена папок</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Arabic Letter High Hamza</td>
								<td className='py-2 pr-4 font-mono'>U+0674</td>
								<td className='py-2'>Discord: ник и статус</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Полный каталог из 68 символов с разбивкой по группам Unicode есть в
					самом инструменте выше.
				</p>
			</section>
		</div>
	)
}
