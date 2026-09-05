import katex from 'katex'
import { cn } from '@/lib/utils'

interface FormulaProps {
	/** Выражение в синтаксисе LaTeX, напр. '\\text{ИМТ} = \\dfrac{m}{h^2}' */
	latex: string
	/** Расшифровка переменных под формулой, напр. 'm — вес в кг, h — рост в м' */
	caption?: string
	className?: string
}

/**
 * Формула рендерится в статический HTML на сервере (katex.renderToString),
 * без клиентского JS — текст остаётся настоящим текстом для краулера, не
 * картинкой и не canvas. CSS подключён глобально в app/globals.css.
 */
export function Formula({ latex, caption, className }: FormulaProps) {
	const html = katex.renderToString(latex, {
		throwOnError: false,
		displayMode: true
	})

	return (
		<div
			className={cn(
				'my-4 overflow-x-auto rounded-lg border bg-muted/30 px-4 py-5',
				className
			)}
		>
			<div
				className='flex justify-center text-base sm:text-lg'
				dangerouslySetInnerHTML={{ __html: html }}
			/>
			{caption && (
				<p className='mt-3 text-center text-sm text-muted-foreground'>
					{caption}
				</p>
			)}
		</div>
	)
}
