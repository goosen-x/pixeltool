// htmlhint не поставляет собственные типы — объявляем минимальный контракт той
// части API, которой пользуемся (HTMLHint.verify).
declare module 'htmlhint' {
	export interface HintRule {
		id: string
		description: string
		link: string
	}

	export interface HintMessage {
		type: 'error' | 'warning' | 'info'
		message: string
		raw: string
		evidence: string
		line: number
		col: number
		rule: HintRule
	}

	export const HTMLHint: {
		verify(html: string, ruleset: Record<string, unknown>): HintMessage[]
	}
}
