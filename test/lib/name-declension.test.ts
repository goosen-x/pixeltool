import { describe, expect, it } from 'vitest'
import {
	declineFirstName,
	declineFullName,
	declinePatronymic,
	declineSurname,
	detectGender,
	formatName,
	splitFullName
} from '@/lib/name-declension'

const fio = (last: string, first: string, middle: string) =>
	declineFullName({ last, first, middle })

describe('ФИО целиком', () => {
	it('Иванов Иван Иванович по всем падежам', () => {
		const d = fio('Иванов', 'Иван', 'Иванович')
		expect([0, 1, 2, 3, 4, 5].map(i => formatName(d, i, 'fio'))).toEqual([
			'Иванов Иван Иванович',
			'Иванова Ивана Ивановича',
			'Иванову Ивану Ивановичу',
			'Иванова Ивана Ивановича',
			'Ивановым Иваном Ивановичем',
			'Иванове Иване Ивановиче'
		])
	})

	it('Иванова Мария Сергеевна по всем падежам', () => {
		const d = fio('Иванова', 'Мария', 'Сергеевна')
		expect([0, 1, 2, 3, 4, 5].map(i => formatName(d, i, 'fio'))).toEqual([
			'Иванова Мария Сергеевна',
			'Ивановой Марии Сергеевны',
			'Ивановой Марии Сергеевне',
			'Иванову Марию Сергеевну',
			'Ивановой Марией Сергеевной',
			'Ивановой Марии Сергеевне'
		])
	})

	// Хрестоматийные формы из школьной и справочной литературы:
	// «с Гоголем», «о Толстом», «Льва Николаевича Толстого».
	it('Гоголь Николай Васильевич и Толстой Лев Николаевич', () => {
		const g = fio('Гоголь', 'Николай', 'Васильевич')
		expect(formatName(g, 4, 'fio')).toBe('Гоголем Николаем Васильевичем')
		const t = fio('Толстой', 'Лев', 'Николаевич')
		expect(formatName(t, 1, 'fio')).toBe('Толстого Льва Николаевича')
		expect(formatName(t, 4, 'fio')).toBe('Толстым Львом Николаевичем')
		expect(formatName(t, 5, 'fio')).toBe('Толстом Льве Николаевиче')
	})

	it('инициалы и порядок «Имя Отчество Фамилия»', () => {
		const d = fio('Петрова', 'Анна', 'Ильинична')
		expect(formatName(d, 2, 'initials')).toBe('Петровой А. И.')
		expect(formatName(d, 1, 'iof')).toBe('Анны Ильиничны Петровой')
	})

	it('пустые поля пропускаются', () => {
		const d = fio('', 'Ольга', '')
		expect(formatName(d, 1, 'fio')).toBe('Ольги')
		expect(formatName(d, 1, 'initials')).toBe('О.')
	})
})

describe('фамилии', () => {
	it('мужские на согласный склоняются, женские нет', () => {
		expect(declineSurname('Шевчук', 'male')).toEqual([
			'Шевчук',
			'Шевчука',
			'Шевчуку',
			'Шевчука',
			'Шевчуком',
			'Шевчуке'
		])
		expect(new Set(declineSurname('Шевчук', 'female'))).toEqual(
			new Set(['Шевчук'])
		)
		expect(new Set(declineSurname('Гоголь', 'female'))).toEqual(
			new Set(['Гоголь'])
		)
	})

	it('на -о, -их/-ых, -е и на -а после гласной не склоняются', () => {
		for (const s of ['Шевченко', 'Черных', 'Седых', 'Гёте', 'Галуа']) {
			expect(new Set(declineSurname(s, 'male'))).toEqual(new Set([s]))
		}
	})

	// Розенталь: на -а/-я склоняются при обоих полах (Глинка, Берия)
	it('на -а и -ия склоняются у обоих полов', () => {
		expect(declineSurname('Глинка', 'male')).toEqual([
			'Глинка',
			'Глинки',
			'Глинке',
			'Глинку',
			'Глинкой',
			'Глинке'
		])
		expect(declineSurname('Берия', 'male')[1]).toBe('Берии')
		expect(declineSurname('Головня', 'female')[2]).toBe('Головне')
		expect(declineSurname('Пуща', 'female')[4]).toBe('Пущей')
	})

	it('прилагательные: -ский, -ая, -ой, -ий после к', () => {
		expect(declineSurname('Достоевский', 'male')).toEqual([
			'Достоевский',
			'Достоевского',
			'Достоевскому',
			'Достоевского',
			'Достоевским',
			'Достоевском'
		])
		expect(declineSurname('Достоевская', 'female')).toEqual([
			'Достоевская',
			'Достоевской',
			'Достоевской',
			'Достоевскую',
			'Достоевской',
			'Достоевской'
		])
		expect(declineSurname('Луговской', 'male')[4]).toBe('Луговским')
		expect(declineSurname('Горький', 'male')[2]).toBe('Горькому')
		expect(declineSurname('Красный', 'male')[4]).toBe('Красным')
	})

	it('мужские на -ей, -ай, -ич', () => {
		expect(declineSurname('Палей', 'male')[4]).toBe('Палеем')
		expect(declineSurname('Бугай', 'male')[1]).toBe('Бугая')
		expect(declineSurname('Абрамович', 'male')[4]).toBe('Абрамовичем')
		expect(declineSurname('Абрамович', 'female')[4]).toBe('Абрамович')
	})

	it('двойная фамилия склоняется по частям', () => {
		expect(declineSurname('Римский-Корсаков', 'male')[1]).toBe(
			'Римского-Корсакова'
		)
		expect(declineSurname('Салтыков-Щедрин', 'male')[4]).toBe(
			'Салтыковым-Щедриным'
		)
	})

	it('регистр сохраняется', () => {
		expect(declineSurname('ИВАНОВ', 'male')[1]).toBe('ИВАНОВА')
		expect(declineSurname('иванов', 'male')[1]).toBe('Иванова')
	})

	it('латиница не склоняется', () => {
		expect(declineSurname('Smith', 'male')[1]).toBe('Smith')
	})
})

describe('имена', () => {
	it('мужские', () => {
		expect(declineFirstName('Дмитрий', 'male')).toEqual([
			'Дмитрий',
			'Дмитрия',
			'Дмитрию',
			'Дмитрия',
			'Дмитрием',
			'Дмитрии'
		])
		expect(declineFirstName('Сергей', 'male')[5]).toBe('Сергее')
		expect(declineFirstName('Игорь', 'male')[4]).toBe('Игорем')
		expect(declineFirstName('Павел', 'male')[1]).toBe('Павла')
		expect(declineFirstName('Пётр', 'male')[2]).toBe('Петру')
		expect(declineFirstName('Никита', 'male')[1]).toBe('Никиты')
		expect(declineFirstName('Илья', 'male')[4]).toBe('Ильёй')
		expect(declineFirstName('Лука', 'male')[1]).toBe('Луки')
	})

	it('женские', () => {
		expect(declineFirstName('Ольга', 'female')[1]).toBe('Ольги')
		expect(declineFirstName('Дарья', 'female')[2]).toBe('Дарье')
		expect(declineFirstName('Юлия', 'female')[2]).toBe('Юлии')
		expect(declineFirstName('Наташа', 'female')[4]).toBe('Наташей')
		expect(declineFirstName('Любовь', 'female')).toEqual([
			'Любовь',
			'Любови',
			'Любови',
			'Любовь',
			'Любовью',
			'Любови'
		])
		expect(declineFirstName('Нинель', 'female')[4]).toBe('Нинелью')
		expect(declineFirstName('Кармен', 'female')[1]).toBe('Кармен')
		expect(declineFirstName('Анна-Мария', 'female')[1]).toBe('Анны-Марии')
	})
})

describe('отчества', () => {
	it('мужские и женские', () => {
		expect(declinePatronymic('Ильич', 'male')[4]).toBe('Ильичом')
		expect(declinePatronymic('Никитич', 'male')[4]).toBe('Никитичем')
		expect(declinePatronymic('Ильинична', 'female')[1]).toBe('Ильиничны')
	})

	it('тюркские отчества с оглы и кызы не склоняются', () => {
		expect(new Set(declinePatronymic('Гейдар оглы', 'male'))).toEqual(
			new Set(['Гейдар оглы'])
		)
		const d = fio('Алиев', 'Ильхам', 'Гейдар оглы')
		expect(formatName(d, 2, 'fio')).toBe('Алиеву Ильхаму Гейдар оглы')
		expect(formatName(d, 2, 'initials')).toBe('Алиеву И. Г.')
	})
})

describe('пол', () => {
	it('по отчеству, имени, фамилии', () => {
		expect(detectGender({ last: '', first: 'Саша', middle: 'Петровна' })).toBe(
			'female'
		)
		expect(detectGender({ last: 'Смирнова', first: 'Саша', middle: '' })).toBe(
			'female'
		)
		expect(detectGender({ last: '', first: 'Никита', middle: '' })).toBe('male')
		expect(detectGender({ last: 'Шевчук', first: 'Женя', middle: '' })).toBe(
			null
		)
	})

	it('без подсказок пол по умолчанию мужской и помечен как не определённый', () => {
		const d = declineFullName({ last: 'Шевчук', first: 'Женя', middle: '' })
		expect(d.gender).toBe('male')
		expect(d.detected).toBe(false)
		const f = declineFullName(
			{ last: 'Шевчук', first: 'Женя', middle: '' },
			'female'
		)
		expect(f.last[1]).toBe('Шевчук')
		expect(f.first[1]).toBe('Жени')
	})
})

describe('разбор вставленной строки', () => {
	it('Фамилия Имя Отчество', () => {
		expect(splitFullName(' Иванов  Иван Иванович ')).toEqual({
			last: 'Иванов',
			first: 'Иван',
			middle: 'Иванович'
		})
	})
	it('Имя Отчество Фамилия', () => {
		expect(splitFullName('Анна Сергеевна Петрова')).toEqual({
			last: 'Петрова',
			first: 'Анна',
			middle: 'Сергеевна'
		})
	})
	it('отчество из двух слов', () => {
		expect(splitFullName('Алиев Ильхам Гейдар оглы').middle).toBe(
			'Гейдар оглы'
		)
	})
})

describe('короткие и иностранные фамилии', () => {
	it('Цой склоняется как существительное, а не как Толстой', () => {
		expect(declineSurname('Цой', 'male')).toEqual([
			'Цой',
			'Цоя',
			'Цою',
			'Цоя',
			'Цоем',
			'Цое'
		])
	})
	it('французские с ударением на конце не склоняются', () => {
		expect(declineSurname('Дюма', 'male')[1]).toBe('Дюма')
		expect(declineSurname('Золя', 'male')[2]).toBe('Золя')
	})
})

describe('приставки в фамилиях', () => {
	it('Тер-, Сен-, фон не склоняются, склоняется основная часть', () => {
		expect(declineSurname('Тер-Петросян', 'male')[1]).toBe('Тер-Петросяна')
		expect(declineSurname('Сен-Жюст', 'male')[4]).toBe('Сен-Жюстом')
		expect(declineSurname('фон Браун', 'male')[1]).toBe('фон Брауна')
		expect(declineSurname('Тер-Петросян', 'female')[1]).toBe('Тер-Петросян')
	})
})
