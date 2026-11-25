import { describe, it, expect } from 'vitest'
import {
	daysInMonth,
	findIngress,
	getBirthDaySign,
	getCuspSigns,
	getSignAt,
	localToUtc,
	russiaUtcOffset,
	sunLongitude,
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
		expect(getSignByDate(4, 19).id).toBe('oven')
		expect(getSignByDate(4, 20).id).toBe('telets')
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

	it('пограничные дни отданы знаку, который выпадает на них чаще', () => {
		// 19 февраля по Москве в 70% лет 1930–2030 уже Рыбы, 23 октября в 70%
		// ещё Весы, 20 апреля в 56% уже Телец, 21 мая в 58% уже Близнецы.
		expect(getSignByDate(2, 18).id).toBe('vodoley')
		expect(getSignByDate(2, 19).id).toBe('ryby')
		expect(getSignByDate(10, 23).id).toBe('vesy')
		expect(getSignByDate(10, 24).id).toBe('skorpion')
		expect(getSignByDate(4, 20).id).toBe('telets')
		expect(getSignByDate(5, 21).id).toBe('bliznetsy')
	})

	// 23 августа — честная монетка (49 на 51 по суткам), поэтому порог
	// чуть ниже половины: важно, чтобы таблица не ошибалась чаще, чем попадает.
	it('табличный знак совпадает с расчётом в полдень по Москве хотя бы в 45% лет', () => {
		for (let month = 1; month <= 12; month++) {
			for (let day = 1; day <= daysInMonth(month); day++) {
				if (month === 2 && day === 29) continue
				let hits = 0
				for (let year = 1930; year <= 2030; year++) {
					const noon = localToUtc(year, month, day, 12 * 60, 3)
					if (getSignAt(noon).id === getSignByDate(month, day).id) hits++
				}
				expect(hits, `${day}.${month}`).toBeGreaterThanOrEqual(46)
			}
		}
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
	it('первый день знака и день перед ним — пограничные', () => {
		expect(isCuspDate(3, 21)).toBe(true)
		expect(isCuspDate(3, 20)).toBe(true)
	})

	it('24 октября пограничное: в части лет Солнце входит в Скорпион именно в этот день', () => {
		expect(isCuspDate(10, 24)).toBe(true)
	})

	it('середина знака — нет', () => {
		expect(isCuspDate(4, 5)).toBe(false)
		expect(isCuspDate(8, 1)).toBe(false)
		expect(isCuspDate(2, 29)).toBe(false)
	})

	it('пограничных дат по три на каждую из двенадцати границ', () => {
		let count = 0
		for (let month = 1; month <= 12; month++) {
			for (let day = 1; day <= daysInMonth(month); day++) {
				if (isCuspDate(month, day)) count++
			}
		}
		expect(count).toBe(36)
	})

	it('getCuspSigns называет оба знака у границы', () => {
		expect(getCuspSigns(10, 24).map(s => s.id)).toEqual(['vesy', 'skorpion'])
		expect(getCuspSigns(10, 23).map(s => s.id)).toEqual(['vesy', 'skorpion'])
		expect(getCuspSigns(1, 20).map(s => s.id)).toEqual(['kozerog', 'vodoley'])
		expect(getCuspSigns(12, 22).map(s => s.id)).toEqual(['strelets', 'kozerog'])
	})
})

describe('расчёт по году и времени', () => {
	const MINUTE = 60_000

	/**
	 * Сверка с опубликованными моментами (USNO / timeanddate): равноденствия
	 * и солнцестояния — это входы Солнца в Овен, Рак, Весы и Козерог.
	 */
	it.each([
		['весеннее равноденствие 2025', Date.UTC(2025, 2, 20, 9, 1), 'oven'],
		['летнее солнцестояние 2024', Date.UTC(2024, 5, 20, 20, 51), 'rak'],
		['осеннее равноденствие 2023', Date.UTC(2023, 8, 23, 6, 50), 'vesy'],
		['зимнее солнцестояние 2000', Date.UTC(2000, 11, 21, 13, 37), 'kozerog']
	] as const)('%s совпадает в пределах 20 минут', (_, moment, sign) => {
		const ingress = findIngress(moment - 6 * 60 * MINUTE, moment + 6 * 60 * MINUTE)
		expect(ingress).not.toBeNull()
		expect(Math.abs(ingress! - moment)).toBeLessThan(20 * MINUTE)
		expect(getSignAt(ingress! + MINUTE).id).toBe(sign)
	})

	it('долгота Солнца в равноденствие около нуля', () => {
		const longitude = sunLongitude(Date.UTC(2025, 2, 20, 9, 1))
		expect(Math.min(longitude, 360 - longitude)).toBeLessThan(0.02)
	})

	it('день перехода: знак меняется внутри суток', () => {
		// 20 марта 2025 по Москве: переход в Овен около полудня.
		const result = getBirthDaySign(2025, 3, 20, 3)
		expect(result.signAtStart.id).toBe('ryby')
		expect(result.signAtEnd.id).toBe('oven')
		expect(result.ingressUtc).not.toBeNull()
	})

	it('24 октября 1987 по Москве до 1:55 ещё Весы, хотя по таблице Скорпион', () => {
		const offset = russiaUtcOffset(3, 1987, 10, 24)
		const result = getBirthDaySign(1987, 10, 24, offset)
		expect(result.signAtStart.id).toBe('vesy')
		expect(result.signAtEnd.id).toBe('skorpion')
		expect(getSignAt(localToUtc(1987, 10, 24, 60, offset)).id).toBe('vesy')
		expect(getSignAt(localToUtc(1987, 10, 24, 6 * 60, offset)).id).toBe('skorpion')
	})

	it('день без перехода: весь день один знак', () => {
		const result = getBirthDaySign(2026, 7, 15, 3)
		expect(result.ingressUtc).toBeNull()
		expect(result.signAtStart.id).toBe('rak')
	})
})

describe('russiaUtcOffset', () => {
	it('сейчас Москва UTC+3 круглый год', () => {
		expect(russiaUtcOffset(3, 2026, 7, 1)).toBe(3)
		expect(russiaUtcOffset(3, 2026, 1, 1)).toBe(3)
	})

	it('летнее время 1996–2010 до последнего воскресенья октября', () => {
		expect(russiaUtcOffset(3, 2005, 7, 1)).toBe(4)
		expect(russiaUtcOffset(3, 2005, 10, 29)).toBe(4)
		expect(russiaUtcOffset(3, 2005, 10, 30)).toBe(3)
		expect(russiaUtcOffset(3, 2005, 1, 15)).toBe(3)
	})

	it('до 1996 летнее время кончалось в сентябре', () => {
		expect(russiaUtcOffset(3, 1990, 9, 29)).toBe(4)
		expect(russiaUtcOffset(3, 1990, 10, 24)).toBe(3)
	})

	it('2011–2014 — круглогодичное летнее', () => {
		expect(russiaUtcOffset(3, 2012, 1, 1)).toBe(4)
		expect(russiaUtcOffset(3, 2014, 10, 27)).toBe(3)
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
		expect(formatRange(getSignById('oven')!)).toBe('21 марта — 19 апреля')
		expect(formatRange(getSignById('kozerog')!)).toBe('22 декабря — 20 января')
		expect(formatRange(getSignById('ryby')!)).toBe('19 февраля — 20 марта')
	})

	it('дата форматируется по-русски', () => {
		expect(formatDay(2, 29)).toBe('29 февраля')
	})

	it('в феврале 29 дней, чтобы не отвергать 29 февраля', () => {
		expect(daysInMonth(2)).toBe(29)
		expect(daysInMonth(4)).toBe(30)
		expect(daysInMonth(12)).toBe(31)
	})

	it('с годом февраль считается по календарю', () => {
		expect(daysInMonth(2, 2023)).toBe(28)
		expect(daysInMonth(2, 2024)).toBe(29)
		expect(daysInMonth(2, 1900)).toBe(28)
		expect(daysInMonth(2, 2000)).toBe(29)
	})
})
