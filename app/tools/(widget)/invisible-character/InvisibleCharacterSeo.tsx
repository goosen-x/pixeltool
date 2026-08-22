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
			</section>
		</div>
	)
}
