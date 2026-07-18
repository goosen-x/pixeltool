import Link from 'next/link'

/**
 * SEO-контент под инструментом проверки JavaScript. Секции покрывают реальные
 * интенты кластера — как проверить JS на ошибки, частые ошибки синтаксиса,
 * отличие синтаксиса от рантайма и вопрос про TypeScript — без набивки ключей.
 */
export function JsSyntaxSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как проверить JavaScript на ошибки
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Скрипт не запускается или страница молча не реагирует — чаще всего
					виновата синтаксическая ошибка: пропущенная скобка, лишняя запятая,
					опечатка в ключевом слове. Вставьте код в поле выше, и проверка
					разберёт его прямо в браузере, без запуска, и укажет строку и колонку,
					где споткнулся парсер. Поддерживается современный JavaScript
					(ES6/ES2020+) и JSX — то, что выполняется в браузере напрямую.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Частые ошибки синтаксиса
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Больше девяти из десяти «поломок» — это одно из нескольких: незакрытая
					скобка <code className='font-mono'>{'}'}</code> или кавычка,
					пропущенная запятая между полями объекта, опечатка в ключевом слове (
					<code className='font-mono'>fucntion</code>,{' '}
					<code className='font-mono'>retrun</code>), забытые кавычки у строки.
					Все эти случаи проверка ловит до запуска — просто разбирая текст кода,
					как это делает движок браузера.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Синтаксис или выполнение
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Ошибки в JavaScript бывают двух видов. <strong>Синтаксические</strong>{' '}
					(<code className='font-mono'>SyntaxError</code>) — код не
					соответствует грамматике языка и не запускается вообще; их и находит
					проверка синтаксиса. <strong>Ошибки выполнения</strong> (
					<code className='font-mono'>TypeError</code>,{' '}
					<code className='font-mono'>ReferenceError</code>) возникают уже в
					работающем коде и видны только в консоли браузера. Этот инструмент
					закрывает первый случай — когда нужно быстро понять, почему скрипт не
					грузится, не открывая IDE.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					А что с TypeScript
				</h2>
				<p className='mt-3 text-muted-foreground'>
					TypeScript — это тот же JavaScript плюс типы:{' '}
					<code className='font-mono'>name: string</code>, интерфейсы,
					дженерики. Обычная проверка JS на таком коде споткнётся уже на
					двоеточии с типом — для JavaScript это чужой синтаксис. Типы проверяет
					компилятор TypeScript (<code className='font-mono'>tsc</code>) или
					онлайн-песочница Playground. Этот инструмент рассчитан на JavaScript и
					JSX.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Подробный разбор частых ошибок и чем синтаксис отличается от ошибок
				выполнения — в статье{' '}
				<Link
					href='/blog/proverka-javascript'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Проверка JavaScript: как найти ошибку в коде
				</Link>
				.
			</p>
		</div>
	)
}
