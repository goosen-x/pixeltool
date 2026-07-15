/**
 * Линтинг HTML через HTMLHint. Чистая синхронная функция без сети: работает
 * прямо по строке разметки в браузере и возвращает находки с позицией.
 *
 * В отличие от analyze.ts (оценка качества с баллом) линтинг не влияет на балл —
 * это отдельный список стилевых и корректностных замечаний.
 */

import { HTMLHint } from 'htmlhint'

export interface LintMessage {
	/** Идентификатор правила HTMLHint, напр. 'tag-pair'. */
	rule: string
	severity: 'error' | 'warning'
	message: string
	line: number
	col: number
	/** Ссылка на описание правила. */
	link: string
}

/**
 * Набор правил: только корректностные и однозначные, без стилевых придирок,
 * чтобы не зашумлять вывод. doctype-first и title-require имеют смысл лишь для
 * целой страницы — на фрагменте разметки они дают ложные срабатывания.
 */
function ruleset(wholePage: boolean): Record<string, unknown> {
	return {
		'tagname-lowercase': true,
		'attr-lowercase': true,
		'attr-value-double-quotes': true,
		'attr-no-duplication': true,
		'tag-pair': true,
		'spec-char-escape': true,
		'id-unique': true,
		'src-not-empty': true,
		'alt-require': true,
		'doctype-first': wholePage,
		'title-require': wholePage
	}
}

export function lintHtml(html: string): LintMessage[] {
	if (!html.trim()) return []

	const wholePage = /<!doctype/i.test(html) || /<html[\s>]/i.test(html)

	return HTMLHint.verify(html, ruleset(wholePage))
		.map(item => ({
			rule: item.rule.id,
			// HTMLHint различает error/warning/info; info по строгости приравниваем
			// к warning — отдельная градация тут была бы избыточной.
			severity: (item.type === 'error' ? 'error' : 'warning') as
				| 'error'
				| 'warning',
			message: item.message,
			line: item.line,
			col: item.col,
			link: item.rule.link
		}))
		.sort((a, b) => {
			if (a.severity !== b.severity) return a.severity === 'error' ? -1 : 1
			return a.line - b.line || a.col - b.col
		})
}
