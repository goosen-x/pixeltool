import { describe, expect, it } from 'vitest'
import {
	decodeSantaLink,
	drawSecretSanta,
	encodeSantaLink,
	parseExclusions,
	parseParticipants
} from '@/lib/secret-santa'

describe('parseParticipants', () => {
	it('разбирает имена и пожелания после двоеточия', () => {
		expect(
			parseParticipants('Аня: книга\n\n  Петя  \nОля: что угодно, но не носки')
		).toEqual([
			{ name: 'Аня', wish: 'книга' },
			{ name: 'Петя', wish: '' },
			{ name: 'Оля', wish: 'что угодно, но не носки' }
		])
	})
})

describe('parseExclusions', () => {
	it('понимает дефис, тире и запятую между именами', () => {
		expect(
			parseExclusions('Аня - Петя\nОля — Коля\nМаша, Саша\nАнна-Мария - Ваня')
		).toEqual([
			['Аня', 'Петя'],
			['Оля', 'Коля'],
			['Маша', 'Саша'],
			['Анна-Мария', 'Ваня']
		])
	})
})

describe('drawSecretSanta', () => {
	const names = ['Аня', 'Петя', 'Оля', 'Коля', 'Маша']

	it('никто не дарит сам себе и каждый получает ровно одного', () => {
		for (let i = 0; i < 200; i++) {
			const result = drawSecretSanta(names, [])
			if ('error' in result) throw new Error(result.error)
			expect(result.map(p => p.giver).sort()).toEqual([...names].sort())
			expect(result.map(p => p.receiver).sort()).toEqual([...names].sort())
			for (const pair of result) expect(pair.giver).not.toBe(pair.receiver)
		}
	})

	it('исключённые пары не дарят друг другу ни в одну сторону', () => {
		for (let i = 0; i < 200; i++) {
			const result = drawSecretSanta(names, [['Аня', 'Петя']])
			if ('error' in result) throw new Error(result.error)
			for (const { giver, receiver } of result) {
				expect([giver, receiver].sort()).not.toEqual(['Аня', 'Петя'])
			}
		}
	})

	it('сообщает, когда участников меньше трёх', () => {
		expect(drawSecretSanta(['Аня', 'Петя'], [])).toHaveProperty('error')
	})

	it('сообщает, когда исключения не оставляют вариантов', () => {
		expect(
			drawSecretSanta(
				['Аня', 'Петя', 'Оля'],
				[
					['Аня', 'Петя'],
					['Аня', 'Оля']
				]
			)
		).toHaveProperty('error')
	})

	it('находит вариант, когда исключений много, но решение есть', () => {
		const result = drawSecretSanta(
			['Аня', 'Петя', 'Оля', 'Коля'],
			[
				['Аня', 'Петя'],
				['Оля', 'Коля']
			]
		)
		expect(result).not.toHaveProperty('error')
	})

	it('отказывается от повторяющихся имён', () => {
		expect(drawSecretSanta(['Аня', 'Аня', 'Петя'], [])).toHaveProperty('error')
	})
})

describe('ссылки', () => {
	it('кодирует и раскодирует карточку участника, включая кириллицу', () => {
		const card = {
			giver: 'Аня',
			receiver: 'Петя',
			wish: 'настолку 🎲',
			budget: 'до 1500 ₽',
			date: '27 декабря',
			event: 'Отдел продаж'
		}
		expect(decodeSantaLink(encodeSantaLink(card))).toEqual(card)
	})

	it('не показывает имя подопечного открытым текстом в ссылке', () => {
		const token = encodeSantaLink({
			giver: 'Аня',
			receiver: 'Petr',
			wish: '',
			budget: '',
			date: '',
			event: ''
		})
		expect(token).not.toContain('Petr')
		expect(token).not.toContain(btoa('Petr').slice(0, 4))
	})

	it('возвращает null на мусор', () => {
		expect(decodeSantaLink('мусор')).toBeNull()
		expect(decodeSantaLink('')).toBeNull()
	})
})
