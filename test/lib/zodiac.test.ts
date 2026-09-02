import { describe, it, expect } from 'vitest'
import {
	daysInMonth,
	formatDay,
	formatRange,
	getSignByDate,
	getSignById,
	isCuspDate,
	ZODIAC_SIGNS
} from '@/lib/utils/zodiac'

describe('таблица знаков', () => {
	it('знаков ровно двенадцать', () => {
		expect(ZODIAC_SIGNS).toHaveLength(12)
	})

	it('идентификаторы уникальны', () => {
		const ids = ZODIAC_SIGNS.map(sign => sign.id)
		expect(new Set(ids).size).toBe(12)
	})

	it('каждой стихии достаётся ровно три знака', () => {
		for (const element of ['fire', 'earth', 'air', 'water'] as const) {
			expect(ZODIAC_SIGNS.filter(s => s.element === element)).toHaveLength(3)
		}
	})

	it('каждому качеству достаётся ровно четыре знака', () => {
		for (const quality of ['cardinal', 'fixed', 'mutable'] as const) {
			expect(ZODIAC_SIGNS.filter(s => s.quality === quality)).toHaveLength(4)
		}
	})
})

describe('getSignByDate', () => {
	/**
	 * Главная проверка: двенадцать отрезков обязаны покрыть год целиком.
	 * Прогоняем каждый день високосного года — если бы в границах был зазор
	 * или нахлёст, ошибка вылезла бы именно здесь, а не на глаз в таблице.
	 */
	it('каждый день года попадает ровно в один знак', () => {
		const counts = new Map<string, number>()
		let total = 0

		for (let month = 1; month <= 12; month++) {
			for (let day = 1; day <= daysInMonth(month); day++) {
				const sign = getSignByDate(month, day)
				expect(sign).toBeDefined()
				counts.set(sign.id, (counts.get(sign.id) ?? 0) + 1)
				total++
			}
		}

		expect(total).toBe(366)
		expect(counts.size).toBe(12)
	})

	it('границы знаков совпадают с таблицей', () => {
		for (const sign of ZODIAC_SIGNS) {
			expect(getSignByDate(sign.startMonth, sign.startDay).id).toBe(sign.id)
			expect(getSignByDate(sign.endMonth, sign.endDay).id).toBe(sign.id)
		}
	})

	it('день перед началом знака принадлежит предыдущему', () => {
		expect(getSignByDate(4, 20).id).toBe('oven')
		expect(getSignByDate(4, 21).id).toBe('telets')
		expect(getSignByDate(8, 22).id).toBe('lev')
		expect(getSignByDate(8, 23).id).toBe('deva')
	})

	it('Козерог переходит через Новый год', () => {
		expect(getSignByDate(12, 22).id).toBe('kozerog')
		expect(getSignByDate(12, 31).id).toBe('kozerog')
		expect(getSignByDate(1, 1).id).toBe('kozerog')
		expect(getSignByDate(1, 20).id).toBe('kozerog')
		expect(getSignByDate(1, 21).id).toBe('vodoley')
	})

	it('день перед Козерогом — Стрелец', () => {
		expect(getSignByDate(12, 21).id).toBe('strelets')
	})

	it('29 февраля — Рыбы', () => {
		expect(getSignByDate(2, 29).id).toBe('ryby')
	})

	it('несколько дат наугад', () => {
		expect(getSignByDate(3, 8).id).toBe('ryby')
		expect(getSignByDate(6, 1).id).toBe('bliznetsy')
		expect(getSignByDate(9, 1).id).toBe('deva')
		expect(getSignByDate(11, 7).id).toBe('skorpion')
	})
})

describe('isCuspDate', () => {
	it('первый день знака — пограничный', () => {
		expect(isCuspDate(3, 21)).toBe(true)
	})

	it('последний день знака — пограничный', () => {
		expect(isCuspDate(3, 20)).toBe(true)
	})

	it('середина знака — нет', () => {
		expect(isCuspDate(4, 5)).toBe(false)
		expect(isCuspDate(8, 1)).toBe(false)
	})

	it('пограничных дат ровно 24 — по две на знак', () => {
		let count = 0
		for (let month = 1; month <= 12; month++) {
			for (let day = 1; day <= daysInMonth(month); day++) {
				if (isCuspDate(month, day)) count++
			}
		}
		expect(count).toBe(24)
	})
})

describe('вспомогательное', () => {
	it('getSignById находит знак', () => {
		expect(getSignById('deva')?.name).toBe('Дева')
	})

	it('getSignById на неизвестном слаге возвращает undefined', () => {
		expect(getSignById('zmeenosets')).toBeUndefined()
	})

	it('диапазон форматируется по-русски', () => {
		expect(formatRange(getSignById('oven')!)).toBe('21 марта — 20 апреля')
		expect(formatRange(getSignById('kozerog')!)).toBe('22 декабря — 20 января')
	})

	it('дата форматируется по-русски', () => {
		expect(formatDay(2, 29)).toBe('29 февраля')
	})

	it('в феврале 29 дней, чтобы не отвергать 29 февраля', () => {
		expect(daysInMonth(2)).toBe(29)
		expect(daysInMonth(4)).toBe(30)
		expect(daysInMonth(12)).toBe(31)
	})
})
