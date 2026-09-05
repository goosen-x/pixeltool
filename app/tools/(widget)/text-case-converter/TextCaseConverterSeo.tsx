import Link from 'next/link'

export function TextCaseConverterSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Текст заглавными буквами и сразу обратно
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Чаще всего текст переводят в заглавные буквы (UPPERCASE) для заголовка
					или объявления, а потом откатывают обратно в строчные, если получилось
					слишком «капслочно». Инструмент считает все варианты сразу по мере
					ввода, отдельную кнопку «в заглавные» нажимать не нужно. Прокрутите
					список результатов и скопируйте нужный. Так же работает Title Case
					(Каждое Слово С Заглавной) и Sentence case (заглавная только в начале
					предложения и после каждого{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>.</code>,{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>!</code> или{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>?</code>, а
					не только точки). Если после смены регистра нужна ещё и стилизация,
					жирный или готический шрифт для ника, для этого есть{' '}
					<Link
						href='/tools/fancy-text-generator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						генератор красивого текста
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					camelCase, snake_case, kebab-case: когда какой
				</h2>
				<p className='mt-3 text-muted-foreground'>
					В разных языках и контекстах программирования принят разный стиль
					именования. JavaScript и Java используют{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
						camelCase
					</code>{' '}
					для переменных и функций. Python и большинство баз данных берут{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
						snake_case
					</code>
					. URL и CSS-классы обычно пишут через{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
						kebab-case
					</code>
					, а классы в большинстве языков пишут с{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
						PascalCase
					</code>
					. Раздел «Для кода» переводит текст сразу во все эти форматы, чтобы не
					переключаться между стилями вручную при переносе имени между языком
					программирования и базой данных, URL или CSS.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full border-collapse text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-semibold'>Формат</th>
								<th className='py-2 font-semibold'>hello world</th>
							</tr>
						</thead>
						<tbody>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>UPPERCASE</td>
								<td className='py-2 align-top text-muted-foreground'>
									HELLO WORLD
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>lowercase</td>
								<td className='py-2 align-top text-muted-foreground'>
									hello world
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>Title Case</td>
								<td className='py-2 align-top text-muted-foreground'>
									Hello World
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>camelCase</td>
								<td className='py-2 align-top text-muted-foreground'>
									helloWorld
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>snake_case</td>
								<td className='py-2 align-top text-muted-foreground'>
									hello_world
								</td>
							</tr>
						</tbody>
					</table>
					<p className='mt-2 text-xs text-muted-foreground'>
						Пример на латинице не случаен: camelCase и snake_case — это
						соглашения именования в коде, а не способ записи русских слов, они
						рассчитаны на латинские буквы.
					</p>
				</div>
			</section>

			<p className='text-muted-foreground'>
				Если в тексте вперемешку кириллица и похожая на неё латиница, смена
				регистра эту проблему не решит, для неё нужен отдельный{' '}
				<Link
					href='/tools/latin-cyrillic-checker'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					поиск букв-двойников
				</Link>
				.
			</p>
		</div>
	)
}
