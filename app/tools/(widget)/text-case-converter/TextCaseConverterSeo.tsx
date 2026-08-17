export function TextCaseConverterSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Текст заглавными буквами — и сразу обратно
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Самый частый сценарий — перевести текст в заглавные буквы (UPPERCASE)
					для заголовка, объявления или чтобы выделить фразу, а потом откатить
					обратно в строчные, если получилось слишком «капслочно». Инструмент
					считает все варианты сразу по мере ввода — не нужно нажимать отдельную
					кнопку «в заглавные»: прокрутите список результатов и скопируйте
					нужный. Так же работает Title Case (Каждое Слово С Заглавной) и
					Sentence case (заглавная только в начале предложения — и после
					каждого{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>.</code>,{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>!</code> или{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>?</code>, а
					не только точки).
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					camelCase, snake_case, kebab-case — когда какой
				</h2>
				<p className='mt-3 text-muted-foreground'>
					В разных языках и контекстах программирования принят разный стиль
					именования. JavaScript и Java используют{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
						camelCase
					</code>{' '}
					для переменных и функций. Python и большинство баз данных —{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
						snake_case
					</code>
					. URL и CSS-классы обычно пишут через{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
						kebab-case
					</code>
					, а классы в большинстве языков — с{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
						PascalCase
					</code>
					. Раздел «Для кода» переводит текст сразу во все эти форматы, чтобы не
					переключаться между стилями вручную при переносе имени между языком
					программирования и базой данных, URL или CSS.
				</p>
			</section>
		</div>
	)
}
