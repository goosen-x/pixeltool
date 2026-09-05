import Link from 'next/link'

export function EmojiListSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Откуда взялись эмодзи
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Первые эмодзи в 1999 году нарисовал японский дизайнер Сигэтака Курита,
					172 значка 12×12 пикселей для мобильного интернета оператора NTT
					DoCoMo. Три японских оператора быстро обзавелись своими,
					несовместимыми друг с другом наборами, и одна и та же картинка на
					разных телефонах означала разные вещи. В конце 2000-х инженеры Google
					и Apple предложили внести около 625 эмодзи в Unicode, международный
					стандарт кодирования символов. В октябре 2010 года Unicode 6.0
					закрепил 722 эмодзи официально, и с этого момента символ с одним и тем
					же кодом стало можно отправить с любого устройства на любое. Сегодня
					новые эмодзи проходят через открытый конкурс предложений при Unicode
					Consortium и добавляются примерно раз в год.
				</p>

				<p className='mt-4 text-muted-foreground'>
					В каталоге 1902 эмодзи, разложенных по семи категориям Unicode:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Категория</th>
								<th className='py-2 pr-4 font-medium'>Эмодзи</th>
								<th className='py-2 font-medium'>Примеры</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Смайлики и люди</td>
								<td className='py-2 pr-4 font-mono'>547</td>
								<td className='py-2'>😀 😍 🤔</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Символы и флаги</td>
								<td className='py-2 pr-4 font-mono'>494</td>
								<td className='py-2'>❤️ ✅ 🇷🇺</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Объекты</td>
								<td className='py-2 pr-4 font-mono'>266</td>
								<td className='py-2'>💡 📱 🔑</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Путешествия и места</td>
								<td className='py-2 pr-4 font-mono'>219</td>
								<td className='py-2'>🌍 🚗 ✈️</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Животные и природа</td>
								<td className='py-2 pr-4 font-mono'>160</td>
								<td className='py-2'>🐶 🌸 🔥</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Еда и напитки</td>
								<td className='py-2 pr-4 font-mono'>131</td>
								<td className='py-2'>🍕 ☕ 🍎</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Активности</td>
								<td className='py-2 pr-4 font-mono'>85</td>
								<td className='py-2'>⚽ 🎉 🎮</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему один и тот же эмодзи выглядит по-разному
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Эмодзи — это символ Unicode, а не картинка. Единого рисунка у него
					нет, каждая платформа (iOS, Android, Windows, WhatsApp) рисует его
					по-своему в собственном наборе иконок. Поэтому один и тот же эмодзи 😀
					может выглядеть немного иначе у отправителя и получателя. Это не баг,
					так работает стандарт Unicode.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Когда нужна картинка, а не символ
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Как символ эмодзи вставляется в любой текст и меняет размер вместе со
					шрифтом страницы, и для чата или поста этого достаточно. Но в макете
					или презентации иногда нужен готовый файл, а не символ, который
					отрисует шрифт устройства зрителя. Наведите курсор на эмодзи, и сверху
					появится кнопка скачивания. Она сохранит его как PNG 256×256 в
					системном наборе эмодзи вашего устройства, то есть в стиле Apple на
					iPhone, Google на Android и так далее.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Выразить эмоцию текстом можно не только эмодзи. Набранные из обычных
				символов «kaomoji» и{' '}
				<Link
					href='/tools/text-emoticons'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					текстовые смайлики
				</Link>{' '}
				вроде ¯\_(ツ)_/¯ работают даже там, где эмодзи не поддерживаются. Про
				стилизованные шрифты и спецсимволы написано в статье{' '}
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
