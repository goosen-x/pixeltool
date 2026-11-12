/**
 * «Тайный Санта» без сервера: жеребьёвка идёт в браузере организатора, а
 * результат уходит участникам личными ссылками. В каждой ссылке зашита
 * только карточка одного участника (кому он дарит, пожелание, бюджет, дата),
 * поэтому никто, кроме организатора, всей раскладки не видит.
 *
 * Ссылка не шифруется по-настоящему: ключа, который знал бы участник, но не
 * организатор, без сервера не бывает. Имя просто не лежит в URL открытым
 * текстом, чтобы его нельзя было прочитать, случайно глянув на ссылку в чате.
 */

export interface SantaParticipant {
	name: string
	wish: string
}

export interface SantaPair {
	giver: string
	receiver: string
}

export interface SantaCard {
	giver: string
	receiver: string
	wish: string
	budget: string
	date: string
	event: string
}

export const MIN_PARTICIPANTS = 3
export const MAX_PARTICIPANTS = 100

/** Строки вида «Имя» или «Имя: пожелание». */
export function parseParticipants(text: string): SantaParticipant[] {
	return text
		.split('\n')
		.map(line => line.trim())
		.filter(Boolean)
		.map(line => {
			const colon = line.indexOf(':')
			if (colon === -1) return { name: line, wish: '' }
			return {
				name: line.slice(0, colon).trim(),
				wish: line.slice(colon + 1).trim()
			}
		})
		.filter(p => p.name !== '')
}

/** Пары, которые не должны дарить друг другу: «Аня - Петя», «Аня — Петя»,
 *  «Аня, Петя». Обычно это семьи и пары, которые и так дарят друг другу. */
export function parseExclusions(text: string): [string, string][] {
	return (
		text
			.split('\n')
			// Дефис только с пробелами вокруг: «Анна-Мария» это одно имя.
			.map(line => line.split(/\s+-\s+|\s*[–—,]\s*/).map(part => part.trim()))
			.filter(parts => parts.length === 2 && parts[0] && parts[1])
			.map(([a, b]) => [a, b] as [string, string])
	)
}

function shuffle<T>(items: T[]): T[] {
	const result = [...items]
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[result[i], result[j]] = [result[j], result[i]]
	}
	return result
}

/**
 * Каждому участнику случайный получатель: не он сам и не тот, с кем его
 * исключили. Перебор с возвратом по случайно перемешанным кандидатам: на
 * реальных размерах (до 100 человек, несколько исключений) находит ответ
 * сразу, а если исключения не оставляют вариантов, честно говорит об этом,
 * а не зависает и не выдаёт кому-то самого себя.
 */
export function drawSecretSanta(
	names: string[],
	exclusions: [string, string][]
): SantaPair[] | { error: string } {
	if (names.length < MIN_PARTICIPANTS) {
		return { error: `Нужно минимум ${MIN_PARTICIPANTS} участника` }
	}
	if (names.length > MAX_PARTICIPANTS) {
		return { error: `Слишком много участников, максимум ${MAX_PARTICIPANTS}` }
	}
	const lower = names.map(n => n.toLowerCase())
	const duplicate = names.find((_, i) => lower.indexOf(lower[i]) !== i)
	if (duplicate) {
		return {
			error: `Имя «${duplicate}» встречается дважды, добавьте фамилию или инициал`
		}
	}

	const forbidden = new Set<string>()
	for (const [a, b] of exclusions) {
		forbidden.add(`${a.toLowerCase()}\n${b.toLowerCase()}`)
		forbidden.add(`${b.toLowerCase()}\n${a.toLowerCase()}`)
	}
	const allowed = (giver: string, receiver: string) =>
		giver !== receiver &&
		!forbidden.has(`${giver.toLowerCase()}\n${receiver.toLowerCase()}`)

	const givers = shuffle(names)
	const taken = new Set<string>()
	const result: SantaPair[] = []
	let steps = 0

	const place = (index: number): boolean => {
		if (index === givers.length) return true
		if (++steps > 200_000) return false
		const giver = givers[index]
		for (const receiver of shuffle(names)) {
			if (taken.has(receiver) || !allowed(giver, receiver)) continue
			taken.add(receiver)
			result.push({ giver, receiver })
			if (place(index + 1)) return true
			taken.delete(receiver)
			result.pop()
		}
		return false
	}

	if (!place(0)) {
		return {
			error:
				'С такими исключениями распределить подарки нельзя: уберите часть исключений'
		}
	}
	// Порядок выдачи в исходном порядке списка, чтобы организатору было
	// проще рассылать ссылки сверху вниз.
	return names.map(name => result.find(pair => pair.giver === name)!)
}

// --- ссылки ---------------------------------------------------------------

const KEY = 'pixeltool-santa'

function toBase64Url(bytes: Uint8Array): string {
	let binary = ''
	for (const byte of bytes) binary += String.fromCharCode(byte)
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(text: string): Uint8Array {
	const base64 = text.replace(/-/g, '+').replace(/_/g, '/')
	const binary = atob(base64 + '='.repeat((4 - (base64.length % 4)) % 4))
	return Uint8Array.from(binary, char => char.charCodeAt(0))
}

/** XOR с постоянным ключом: только чтобы имя не читалось в ссылке глазами. */
function scramble(bytes: Uint8Array): Uint8Array {
	const key = new TextEncoder().encode(KEY)
	return bytes.map((byte, i) => byte ^ key[i % key.length])
}

export function encodeSantaLink(card: SantaCard): string {
	const payload = [
		1,
		card.giver,
		card.receiver,
		card.wish,
		card.budget,
		card.date,
		card.event
	]
	return toBase64Url(
		scramble(new TextEncoder().encode(JSON.stringify(payload)))
	)
}

export function decodeSantaLink(token: string): SantaCard | null {
	if (!token) return null
	try {
		const json = new TextDecoder('utf-8', { fatal: true }).decode(
			scramble(fromBase64Url(token))
		)
		const data = JSON.parse(json)
		if (!Array.isArray(data) || data[0] !== 1 || data.length !== 7) return null
		const [, giver, receiver, wish, budget, date, event] = data
		if (typeof giver !== 'string' || typeof receiver !== 'string') return null
		return {
			giver,
			receiver,
			wish: String(wish ?? ''),
			budget: String(budget ?? ''),
			date: String(date ?? ''),
			event: String(event ?? '')
		}
	} catch {
		return null
	}
}
