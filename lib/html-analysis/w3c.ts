import type { Check, CategoryResult } from './analyze'
import { scoreOf } from './analyze'

/** Сообщение из Nu HTML Checker (validator.w3.org/nu). */
export interface W3CMessage {
	type: 'error' | 'info' | 'non-document-error'
	subType?: 'warning' | 'fatal'
	message: string
	lastLine?: number
	extract?: string
}

const NU_ENDPOINT = 'https://validator.w3.org/nu/?out=json'

/**
 * Проверка разметки официальным Nu HTML Checker.
 *
 * У сервиса открытый CORS — запрос идёт прямо из браузера, свой прокси не нужен.
 * Общая для вкладки валидации и для сводного отчёта, чтобы логика жила в одном
 * месте.
 */
export async function validateW3C(html: string): Promise<W3CMessage[]> {
	const response = await fetch(NU_ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'text/html; charset=utf-8' },
		body: html
	})
	if (!response.ok) throw new Error(`W3C ответил ${response.status}`)
	const data = (await response.json()) as { messages?: W3CMessage[] }
	return data.messages ?? []
}

export function w3cSeverity(msg: W3CMessage): 'error' | 'warning' | 'info' {
	if (msg.type === 'error' || msg.subType === 'fatal') return 'error'
	if (msg.subType === 'warning') return 'warning'
	return 'info'
}

/**
 * Сворачивает сообщения W3C в категорию отчёта. Заметки (info) в балл не идут —
 * они не про ошибки, а про мелкие рекомендации, и штрафовать за них незачем.
 */
export function w3cCategory(messages: W3CMessage[]): CategoryResult {
	const checks: Check[] = messages
		.map((msg): Check | null => {
			const severity = w3cSeverity(msg)
			if (severity === 'info') return null
			return {
				id: 'w3c',
				severity,
				title: msg.message,
				detail: msg.lastLine ? `Строка ${msg.lastLine}` : '',
				count: 1
			}
		})
		.filter((c): c is Check => c !== null)

	return {
		key: 'validity',
		label: 'Валидность W3C',
		score: scoreOf(checks),
		checks
	}
}
