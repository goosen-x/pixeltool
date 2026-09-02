/**
 * Шар предсказаний: ответ «да / нет / уклончиво» на заданный вопрос.
 *
 * Набор реплик канонический — двадцать штук в той же раскладке, что у
 * настоящей игрушки: десять утвердительных, пять уклончивых, пять
 * отрицательных. Раскладка неслучайна: перевес в сторону «да» — часть
 * задумки, из-за него шар кажется доброжелательным. Если выровнять
 * пропорции, ощущение от инструмента меняется, поэтому трогать их не стоит.
 */

export type AnswerTone = 'positive' | 'neutral' | 'negative'

export interface BallAnswer {
	id: number
	text: string
	tone: AnswerTone
}

export const ANSWERS: BallAnswer[] = [
	{ id: 1, text: 'Бесспорно', tone: 'positive' },
	{ id: 2, text: 'Предрешено', tone: 'positive' },
	{ id: 3, text: 'Никаких сомнений', tone: 'positive' },
	{ id: 4, text: 'Определённо да', tone: 'positive' },
	{ id: 5, text: 'Можешь быть уверен в этом', tone: 'positive' },
	{ id: 6, text: 'Мне кажется — да', tone: 'positive' },
	{ id: 7, text: 'Вероятнее всего', tone: 'positive' },
	{ id: 8, text: 'Хорошие перспективы', tone: 'positive' },
	{ id: 9, text: 'Знаки говорят — да', tone: 'positive' },
	{ id: 10, text: 'Да', tone: 'positive' },
	{ id: 11, text: 'Пока не ясно, попробуй снова', tone: 'neutral' },
	{ id: 12, text: 'Спроси позже', tone: 'neutral' },
	{ id: 13, text: 'Лучше не рассказывать', tone: 'neutral' },
	{ id: 14, text: 'Сейчас нельзя предсказать', tone: 'neutral' },
	{ id: 15, text: 'Сконцентрируйся и спроси опять', tone: 'neutral' },
	{ id: 16, text: 'Даже не думай', tone: 'negative' },
	{ id: 17, text: 'Мой ответ — нет', tone: 'negative' },
	{ id: 18, text: 'По моим данным — нет', tone: 'negative' },
	{ id: 19, text: 'Перспективы не очень хорошие', tone: 'negative' },
	{ id: 20, text: 'Весьма сомнительно', tone: 'negative' }
]

export const TONE_LABELS: Record<AnswerTone, string> = {
	positive: 'скорее да',
	neutral: 'без ответа',
	negative: 'скорее нет'
}

/**
 * Случайный ответ, но не тот же самый, что был перед этим.
 *
 * Без этой оговорки шар примерно в одном случае из двадцати повторяет
 * реплику подряд, и это читается как поломка, а не как совпадение: человек
 * решает, что кнопка не сработала, и жмёт ещё раз. Из выборки убирается
 * ровно один вариант, так что распределение по остальным остаётся ровным.
 *
 * `random` передаётся снаружи, чтобы поведение можно было проверить тестом,
 * а не гадать по частоте выпадений.
 */
export function pickAnswer(
	random: () => number = Math.random,
	previousId?: number
): BallAnswer {
	const pool =
		previousId === undefined
			? ANSWERS
			: ANSWERS.filter(answer => answer.id !== previousId)

	const index = Math.min(pool.length - 1, Math.floor(random() * pool.length))
	return pool[index]
}

/** Сколько ответов каждого тона — для честного текста на странице. */
export function countByTone(): Record<AnswerTone, number> {
	return ANSWERS.reduce(
		(acc, answer) => {
			acc[answer.tone] += 1
			return acc
		},
		{ positive: 0, neutral: 0, negative: 0 } as Record<AnswerTone, number>
	)
}

export interface HistoryEntry {
	question: string
	answer: string
	tone: AnswerTone
	at: number
}

/** Сколько ответов держим в истории. Без регистрации и без сервера. */
export const HISTORY_LIMIT = 20

export function addToHistory(
	history: HistoryEntry[],
	entry: HistoryEntry
): HistoryEntry[] {
	return [entry, ...history].slice(0, HISTORY_LIMIT)
}
