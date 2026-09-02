import { describe, it, expect } from 'vitest'
import {
	addToHistory,
	ANSWERS,
	BINARY_ANSWERS,
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

describe('режим «только да или нет»', () => {
	it('отдаёт ровно два варианта', () => {
		expect(BINARY_ANSWERS.map(a => a.text)).toEqual(['Да', 'Нет'])
	})

	it('шансы поровну: нижняя половина да, верхняя нет', () => {
		expect(pickAnswer(() => 0, undefined, 'binary').text).toBe('Да')
		expect(pickAnswer(() => 0.49, undefined, 'binary').text).toBe('Да')
		expect(pickAnswer(() => 0.5, undefined, 'binary').text).toBe('Нет')
		expect(pickAnswer(() => 0.99, undefined, 'binary').text).toBe('Нет')
	})

	it('повтор подряд разрешён — иначе вышло бы чередование, а не случайность', () => {
		const previous = BINARY_ANSWERS[0].id
		expect(pickAnswer(() => 0, previous, 'binary').id).toBe(previous)
	})

	it('идентификаторы не пересекаются с каноническими', () => {
		const classic = new Set(ANSWERS.map(a => a.id))
		for (const answer of BINARY_ANSWERS) {
			expect(classic.has(answer.id)).toBe(false)
		}
	})

	it('классический режим по-прежнему исключает повтор', () => {
		expect(pickAnswer(() => 0, 1, 'classic').id).toBe(2)
	})
})
