import Link from 'next/link'

const SIZES = [
	{ size: '16×16', where: 'Вкладка браузера, закладки', need: 'Обязательно' },
	{
		size: '32×32',
		where: 'Вкладка на экране с высокой плотностью, панель задач Windows',
		need: 'Обязательно'
	},
	{ size: '48×48', where: 'Ярлык сайта в Windows', need: 'Желательно' },
	{
		size: '180×180',
		where: 'Домашний экран iPhone (apple-touch-icon)',
		need: 'Желательно'
	},
	{
		size: '192×192',
		where: 'Android Chrome, ярлык на домашнем экране',
		need: 'Желательно'
	},
	{
		size: '512×512',
		where: 'Заставка при установке сайта как приложения (PWA)',
		need: 'Если есть манифест'
	}
]

const code = (text: string) => (
	<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
		{text}
	</code>
)

export function FaviconGuide() {
	return (
		<section className='mt-12 max-w-3xl mx-auto text-left text-foreground'>
			<h2 className='text-2xl font-bold tracking-tight'>Что такое фавикон</h2>
			<p className='mt-3 leading-relaxed'>
				Фавикон (favicon, от <i>favorite icon</i>) — маленькая иконка сайта. Её
				видно на вкладке браузера, в закладках, в истории и в подсказках адресной
				строки. Когда сайт сохраняют на домашний экран телефона, фавикон
				становится ярлыком приложения.
			</p>
			<p className='mt-3 leading-relaxed'>
				Технически это обычная картинка, но подключается она особым тегом и
				должна существовать сразу в нескольких размерах: то, что читается на
				512 пикселях, при 16 превращается в кашу.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Как подключить фавикон
			</h2>
			<p className='mt-3 leading-relaxed'>
				Положите файлы в корень сайта и добавьте три строки в {code('<head>')}:
			</p>
			<pre className='mt-4 overflow-x-auto rounded-lg bg-secondary p-4 text-sm'>
				<code className='font-mono text-secondary-foreground'>{`<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon-32x32.png" type="image/png">
<link rel="apple-touch-icon" href="/favicon-180x180.png">`}</code>
			</pre>
			<p className='mt-3 leading-relaxed'>
				Первая строка закрывает вкладки и старые браузеры. Вторая даёт чёткую
				иконку на экранах с высокой плотностью: PNG там выглядит лучше, чем
				растянутый ICO. Третья нужна для айфонов — без неё iOS возьмёт скриншот
				страницы вместо иконки.
			</p>
			<p className='mt-3 leading-relaxed'>
				Строго говоря, {code('favicon.ico')} в корне сайта браузеры находят и
				сами, даже без тега — они запрашивают этот адрес по умолчанию. Но
				полагаться на это не стоит: тег работает надёжнее, а остальные размеры
				без него всё равно не подключатся.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Чем ICO отличается от PNG
			</h2>
			<p className='mt-3 leading-relaxed'>
				PNG — обычная картинка одного размера. ICO — <strong>контейнер</strong>:
				внутри одного файла лежит сразу несколько версий иконки, и браузер сам
				берёт подходящую под ситуацию. Именно поэтому исторически сложилось
				класть в корень {code('favicon.ico')} — один файл на все случаи.
			</p>
			<p className='mt-3 leading-relaxed'>
				Генератор выше собирает настоящий ICO с кадрами 16, 32 и 48 пикселей.
				Это важная деталь: многие онлайн-инструменты просто переименовывают PNG в{' '}
				{code('.ico')}, потому что браузерный канвас формат ICO не умеет. Такой
				файл обычно работает — браузеры терпимы и определяют формат по
				содержимому, — но это не ICO, и в него нельзя положить несколько
				размеров.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Какие размеры нужны
			</h2>
			<div className='mt-4 overflow-x-auto'>
				<table className='w-full border-collapse text-sm'>
					<thead>
						<tr className='border-b'>
							<th className='py-2 pr-4 text-left font-semibold'>Размер</th>
							<th className='py-2 pr-4 text-left font-semibold'>Где видно</th>
							<th className='py-2 text-left font-semibold'>Нужен ли</th>
						</tr>
					</thead>
					<tbody>
						{SIZES.map(row => (
							<tr key={row.size} className='border-b border-border/50'>
								<td className='py-2 pr-4 font-mono'>{row.size}</td>
								<td className='py-2 pr-4'>{row.where}</td>
								<td className='py-2 text-muted-foreground'>{row.need}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<p className='mt-3 leading-relaxed'>
				Минимальный рабочий набор — {code('favicon.ico')} и PNG на 32 пикселя.
				Остальное добавляют, когда сайт должен прилично выглядеть ярлыком на
				телефоне.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Почему фавикон не меняется
			</h2>
			<p className='mt-3 leading-relaxed'>
				Самая частая жалоба — иконку заменили, а в браузере старая. Причина почти
				всегда в кэше: фавиконы браузеры держат особенно упорно и не обновляют
				даже при обычной перезагрузке. Что делать по порядку:
			</p>
			<ol className='mt-3 list-decimal space-y-2 pl-5 leading-relaxed'>
				<li>
					Откройте {code('/favicon.ico')} прямым адресом. Если там старая
					картинка — файл не перезаписался на сервере, и браузер ни при чём.
				</li>
				<li>
					Если по адресу новая, а на вкладке старая — обновите страницу с
					очисткой кэша: {code('Cmd+Shift+R')} или {code('Ctrl+F5')}.
				</li>
				<li>
					Не помогло — добавьте к адресу версию:{' '}
					{code('<link rel="icon" href="/favicon.ico?v=2">')}. Для браузера это
					новый файл.
				</li>
			</ol>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Фавикон в Next.js
			</h2>
			<p className='mt-3 leading-relaxed'>
				В App Router теги писать не нужно. Положите {code('favicon.ico')} в папку{' '}
				{code('app/')} — Next сам добавит нужный {code('<link>')} в{' '}
				{code('<head>')}. Так же работают {code('icon.png')} и{' '}
				{code('apple-icon.png')}: по именам файлов фреймворк понимает, какой тег
				сгенерировать.
			</p>

			<p className='mt-8 leading-relaxed'>
				Подробнее о том, откуда взялся формат ICO и почему вокруг фавикона
				столько путаницы, — в статье{' '}
				<Link
					href='/blog/favicon-guide'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Фавикон: полное руководство
				</Link>
				.
			</p>
		</section>
	)
}
