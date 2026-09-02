import { describe, it, expect } from 'vitest'
import {
	integerToWords,
	moneyToWords,
	pluralForm,
	RUBLE_FORMS
} from '@/lib/utils/number-to-words'

describe('pluralForm', () => {
	it('единственное число', () => {
		expect(pluralForm(1, RUBLE_FORMS)).toBe('рубль')
		expect(pluralForm(21, RUBLE_FORMS)).toBe('рубль')
		expect(pluralForm(101, RUBLE_FORMS)).toBe('рубль')
	})

	it('от двух до четырёх', () => {
		expect(pluralForm(2, RUBLE_FORMS)).toBe('рубля')
		expect(pluralForm(23, RUBLE_FORMS)).toBe('рубля')
	})

	it('множественное', () => {
		expect(pluralForm(5, RUBLE_FORMS)).toBe('рублей')
		expect(pluralForm(0, RUBLE_FORMS)).toBe('рублей')
	})

	it('подростки — исключение, на котором чаще всего ошибаются', () => {
		expect(pluralForm(11, RUBLE_FORMS)).toBe('рублей')
		expect(pluralForm(12, RUBLE_FORMS)).toBe('рублей')
		expect(pluralForm(14, RUBLE_FORMS)).toBe('рублей')
		expect(pluralForm(111, RUBLE_FORMS)).toBe('рублей')
	})
})

describe('integerToWords', () => {
	it('ноль', () => {
		expect(integerToWords(0)).toBe('ноль')
	})

	it('единицы', () => {
		expect(integerToWords(1)).toBe('один')
		expect(integerToWords(9)).toBe('девять')
	})

	it('женский род меняет первые два числительных', () => {
		expect(integerToWords(1, true)).toBe('одна')
		expect(integerToWords(2, true)).toBe('две')
		expect(integerToWords(3, true)).toBe('три')
	})

	it('подростки не разбираются на десятки и единицы', () => {
		expect(integerToWords(11)).toBe('одиннадцать')
		expect(integerToWords(19)).toBe('девятнадцать')
	})

	it('десятки и сотни', () => {
		expect(integerToWords(20)).toBe('двадцать')
		expect(integerToWords(45)).toBe('сорок пять')
		expect(integerToWords(100)).toBe('сто')
		expect(integerToWords(999)).toBe('девятьсот девяносто девять')
	})

	it('тысячи женского рода', () => {
		expect(integerToWords(1000)).toBe('одна тысяча')
		expect(integerToWords(2000)).toBe('две тысячи')
		expect(integerToWords(5000)).toBe('пять тысяч')
		expect(integerToWords(21000)).toBe('двадцать одна тысяча')
	})

	it('миллионы мужского рода', () => {
		expect(integerToWords(1000000)).toBe('один миллион')
		expect(integerToWords(2000000)).toBe('два миллиона')
		expect(integerToWords(5000000)).toBe('пять миллионов')
	})

	it('пропущенные разряды не оставляют дыр', () => {
		expect(integerToWords(1000001)).toBe('один миллион один')
		expect(integerToWords(1000100)).toBe('один миллион сто')
	})

	it('составное число целиком', () => {
		expect(integerToWords(123456789)).toBe(
			'сто двадцать три миллиона четыреста пятьдесят шесть тысяч семьсот восемьдесят девять'
		)
	})

	it('миллиарды и триллионы', () => {
		expect(integerToWords(1000000000)).toBe('один миллиард')
		expect(integerToWords(1000000000000)).toBe('один триллион')
	})

	it('отрицательные', () => {
		expect(integerToWords(-5)).toBe('минус пять')
	})
})

describe('moneyToWords', () => {
	it('целая сумма', () => {
		expect(moneyToWords(1000)).toBe('Одна тысяча рублей 00 копеек')
	})

	it('с копейками', () => {
		expect(moneyToWords(1234.56)).toBe(
			'Одна тысяча двести тридцать четыре рубля 56 копеек'
		)
	})

	it('копейки добиваются нулём слева', () => {
		expect(moneyToWords(10.05)).toContain('05 копеек')
	})

	it('склонение копеек', () => {
		expect(moneyToWords(1.01)).toContain('01 копейка')
		expect(moneyToWords(1.02)).toContain('02 копейки')
		expect(moneyToWords(1.11)).toContain('11 копеек')
	})

	it('рубли склоняются отдельно от копеек', () => {
		expect(moneyToWords(21.21)).toBe('Двадцать один рубль 21 копейка')
	})

	it('копейки словами, если попросили', () => {
		expect(moneyToWords(2.02, { kopecksAsDigits: false })).toBe(
			'Два рубля две копейки'
		)
	})

	it('копейки женского рода при записи словами', () => {
		expect(moneyToWords(0.01, { kopecksAsDigits: false })).toBe(
			'Ноль рублей одна копейка'
		)
	})

	it('округление до копейки происходит один раз', () => {
		// 0.005 не должно дать «ноль копеек» при одном месте округления
		// и «одну» при другом
		expect(moneyToWords(10.004)).toContain('00 копеек')
		expect(moneyToWords(10.006)).toContain('01 копейка')
	})

	it('ноль', () => {
		expect(moneyToWords(0)).toBe('Ноль рублей 00 копеек')
	})

	it('без заглавной, если попросили', () => {
		expect(moneyToWords(5, { capitalize: false })).toBe('пять рублей 00 копеек')
	})

	it('отрицательная сумма', () => {
		expect(moneyToWords(-5)).toBe('Минус пять рублей 00 копеек')
	})

	it('свои единицы измерения', () => {
		expect(
			moneyToWords(2, {
				rubleForms: ['доллар', 'доллара', 'долларов'],
				kopeckForms: ['цент', 'цента', 'центов']
			})
		).toBe('Два доллара 00 центов')
	})
})
