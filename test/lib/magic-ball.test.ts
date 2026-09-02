import { describe, it, expect } from 'vitest'
import {
	addToHistory,
	ANSWERS,
	countByTone,
	HISTORY_LIMIT,
	pickAnswer,
	type HistoryEntry
} from '@/lib/utils/magic-ball'

describe('набор ответов', () => {
	it('двадцать реплик, как у настоящей игрушки', () => {
		expect(ANSWERS).toHaveLength(20)
	})

	it('раскладка 10 / 5 / 5 сохранена', () => {
		expect(countByTone()).toEqual({ positive: 10, neutral: 5, negative: 5 })
	})

	it('идентификаторы уникальны', () => {
		expect(new Set(ANSWERS.map(a => a.id)).size).toBe(20)
	})

	it('тексты не повторяются', () => {
		expect(new Set(ANSWERS.map(a => a.text)).size).toBe(20)
	})
})

describe('pickAnswer', () => {
	it('нулевое случайное число даёт первый вариант', () => {
		expect(pickAnswer(() => 0).id).toBe(1)
	})

	it('число у единицы не выходит за границу массива', () => {
		expect(pickAnswer(() => 0.999999).id).toBe(20)
		expect(pickAnswer(() => 1)).toBeDefined()
	})

	it('предыдущий ответ не повторяется', () => {
		// При random()=0 без ограничения выпал бы id 1; исключаем его и
		// ожидаем следующий по порядку
		expect(pickAnswer(() => 0, 1).id).toBe(2)
	})

	it('ни при каком случайном числе предыдущий не выпадает', () => {
		for (const previous of ANSWERS.map(a => a.id)) {
			for (let step = 0; step < 20; step++) {
				const answer = pickAnswer(() => step / 20, previous)
				expect(answer.id).not.toBe(previous)
			}
		}
	})

	it('доступны все двадцать вариантов', () => {
		const seen = new Set<number>()
		for (let step = 0; step < 20; step++) {
			seen.add(pickAnswer(() => step / 20).id)
		}
		expect(seen.size).toBe(20)
	})
})

describe('история', () => {
	const entry = (text: string): HistoryEntry => ({
		question: '',
		answer: text,
		tone: 'positive',
		at: 0
	})

	it('новый ответ встаёт первым', () => {
		const result = addToHistory([entry('старый')], entry('новый'))
		expect(result[0].answer).toBe('новый')
	})

	it('длина не превышает предела', () => {
		let history: HistoryEntry[] = []
		for (let i = 0; i < HISTORY_LIMIT + 10; i++) {
			history = addToHistory(history, entry(`ответ ${i}`))
		}
		expect(history).toHaveLength(HISTORY_LIMIT)
	})

	it('вытесняются самые старые', () => {
		let history: HistoryEntry[] = []
		for (let i = 0; i < HISTORY_LIMIT + 1; i++) {
			history = addToHistory(history, entry(`ответ ${i}`))
		}
		expect(history.some(item => item.answer === 'ответ 0')).toBe(false)
	})
})
