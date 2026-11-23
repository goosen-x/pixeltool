import { describe, expect, it } from 'vitest'
import {
	bedtimesForWake,
	formatDuration,
	formatTime,
	parseTime,
	wakeTimesForBedtime,
	wrapDay
} from '@/lib/sleep-calculator'

const t = (s: string) => parseTime(s)!
const times = (list: number[]) => list.map(formatTime)

describe('разбор и вывод времени', () => {
	it('понимает разные форматы ввода', () => {
		expect(parseTime('7')).toBe(420)
		expect(parseTime('7:30')).toBe(450)
		expect(parseTime('07.30')).toBe(450)
		expect(parseTime('7 30')).toBe(450)
		expect(parseTime('730')).toBe(450)
		expect(parseTime('0730')).toBe(450)
		expect(parseTime('23:59')).toBe(1439)
		expect(parseTime('24:00')).toBe(0)
		expect(parseTime('7:3')).toBe(450)
	})

	it('отбрасывает мусор и невозможное время', () => {
		expect(parseTime('')).toBeNull()
		expect(parseTime('abc')).toBeNull()
		expect(parseTime('25:00')).toBeNull()
		expect(parseTime('7:60')).toBeNull()
		expect(parseTime('12345')).toBeNull()
	})

	it('форматирует время и длительность', () => {
		expect(formatTime(0)).toBe('00:00')
		expect(formatTime(425)).toBe('07:05')
		expect(formatTime(-15)).toBe('23:45')
		expect(formatTime(1440 + 30)).toBe('00:30')
		expect(formatDuration(450)).toBe('7 ч 30 мин')
		expect(formatDuration(540)).toBe('9 ч')
		expect(formatDuration(45)).toBe('45 мин')
	})

	it('заворачивает минуты в сутки', () => {
		expect(wrapDay(-1)).toBe(1439)
		expect(wrapDay(1440)).toBe(0)
		expect(wrapDay(-1440 * 2 + 5)).toBe(5)
	})
})

describe('во сколько лечь, чтобы проснуться', () => {
	// Сверено с lady.mail.ru/article/528567-kalkulyator-sna: «встать в 7:00 —
	// уснуть в 22:00, 23:30, 01:00, 02:30…» (цикл 90 минут, засыпание не
	// учтено).
	it('совпадает с внешним примером без времени на засыпание', () => {
		const options = bedtimesForWake(t('7:00'), { fallAsleep: 0 })
		expect(times(options.map(o => o.asleepAt))).toEqual([
			'22:00',
			'23:30',
			'01:00',
			'02:30'
		])
		expect(options.map(o => o.cycles)).toEqual([6, 5, 4, 3])
	})

	it('вычитает время на засыпание из времени отбоя', () => {
		const [six] = bedtimesForWake(t('7:00'), { fallAsleep: 15 })
		expect(formatTime(six.bedtime)).toBe('21:45')
		expect(formatTime(six.asleepAt)).toBe('22:00')
		expect(formatTime(six.wake)).toBe('07:00')
		expect(six.sleepMinutes).toBe(540)
	})

	it('при подъёме сразу после полуночи отбой уходит в прошлые сутки', () => {
		const [six] = bedtimesForWake(t('00:30'), { fallAsleep: 15 })
		expect(formatTime(six.bedtime)).toBe('15:15')
	})

	it('учитывает длину цикла', () => {
		const [six] = bedtimesForWake(t('7:00'), { cycle: 100, fallAsleep: 0 })
		expect(formatTime(six.asleepAt)).toBe('21:00')
		expect(six.sleepMinutes).toBe(600)
		expect(six.recommended).toBe(false)
	})
})

describe('во сколько вставать, если лечь', () => {
	// Тот же источник: «лечь в 23:00 — встать в 8:00, 6:30, 5:00, 3:30…».
	it('совпадает с внешним примером без времени на засыпание', () => {
		const options = wakeTimesForBedtime(t('23:00'), { fallAsleep: 0 })
		expect(times(options.map(o => o.wake))).toEqual([
			'03:30',
			'05:00',
			'06:30',
			'08:00'
		])
	})

	it('добавляет время на засыпание к подъёму', () => {
		const options = wakeTimesForBedtime(t('23:00'), { fallAsleep: 15 })
		expect(times(options.map(o => o.wake))).toEqual([
			'03:45',
			'05:15',
			'06:45',
			'08:15'
		])
	})

	it('в норму 7–9 часов попадают 5 и 6 циклов по 90 минут', () => {
		const options = wakeTimesForBedtime(t('23:00'))
		expect(options.filter(o => o.recommended).map(o => o.cycles)).toEqual([
			5, 6
		])
	})

	it('не принимает нулевой цикл и отрицательное засыпание', () => {
		expect(() => wakeTimesForBedtime(0, { cycle: 0 })).toThrow(RangeError)
		expect(() => wakeTimesForBedtime(0, { fallAsleep: -5 })).toThrow(RangeError)
	})
})
