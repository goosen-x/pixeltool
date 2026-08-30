export type TarotSuit = 'wands' | 'cups' | 'swords' | 'pentacles'

export interface TarotCard {
	slug: string
	name: string
	image: string
	suit?: TarotSuit
	/** Номер в нумерологии матрицы судьбы (1-22, Шут = 22). Только у старших арканов. */
	majorNumber?: number
}

const SUIT_LABEL: Record<TarotSuit, string> = {
	wands: 'Жезлов',
	cups: 'Кубков',
	swords: 'Мечей',
	pentacles: 'Пентаклей'
}

const RANKS: { slug: string; label: string }[] = [
	{ slug: 'ace', label: 'Туз' },
	{ slug: 'two', label: 'Двойка' },
	{ slug: 'three', label: 'Тройка' },
	{ slug: 'four', label: 'Четвёрка' },
	{ slug: 'five', label: 'Пятёрка' },
	{ slug: 'six', label: 'Шестёрка' },
	{ slug: 'seven', label: 'Семёрка' },
	{ slug: 'eight', label: 'Восьмёрка' },
	{ slug: 'nine', label: 'Девятка' },
	{ slug: 'ten', label: 'Десятка' },
	{ slug: 'page', label: 'Паж' },
	{ slug: 'knight', label: 'Рыцарь' },
	{ slug: 'queen', label: 'Королева' },
	{ slug: 'king', label: 'Король' }
]

const SUITS: TarotSuit[] = ['wands', 'cups', 'swords', 'pentacles']

/** 22 старших аркана, в порядке нумерологии матрицы судьбы (Шут = 22, не 0). */
export const MAJOR_ARCANA_DECK: TarotCard[] = [
	{ slug: 'the-magician', name: 'Маг', majorNumber: 1 },
	{ slug: 'the-high-priestess', name: 'Верховная Жрица', majorNumber: 2 },
	{ slug: 'the-empress', name: 'Императрица', majorNumber: 3 },
	{ slug: 'the-emperor', name: 'Император', majorNumber: 4 },
	{ slug: 'the-hierophant', name: 'Иерофант', majorNumber: 5 },
	{ slug: 'the-lovers', name: 'Влюблённые', majorNumber: 6 },
	{ slug: 'the-chariot', name: 'Колесница', majorNumber: 7 },
	{ slug: 'strength', name: 'Сила', majorNumber: 8 },
	{ slug: 'the-hermit', name: 'Отшельник', majorNumber: 9 },
	{ slug: 'wheel-of-fortune', name: 'Колесо Фортуны', majorNumber: 10 },
	{ slug: 'justice', name: 'Справедливость', majorNumber: 11 },
	{ slug: 'the-hanged-man', name: 'Повешенный', majorNumber: 12 },
	// Файл называется transformation, не death — источник картинок избегал
	// прямого «Смерть» в промте генерации, смысл аркана это не меняет.
	{ slug: 'transformation', name: 'Смерть', majorNumber: 13 },
	{ slug: 'temperance', name: 'Умеренность', majorNumber: 14 },
	{ slug: 'the-devil', name: 'Дьявол', majorNumber: 15 },
	{ slug: 'the-tower', name: 'Башня', majorNumber: 16 },
	{ slug: 'the-star', name: 'Звезда', majorNumber: 17 },
	{ slug: 'the-moon', name: 'Луна', majorNumber: 18 },
	{ slug: 'the-sun', name: 'Солнце', majorNumber: 19 },
	{ slug: 'judgement', name: 'Суд', majorNumber: 20 },
	{ slug: 'the-world', name: 'Мир', majorNumber: 21 },
	{ slug: 'the-fool', name: 'Шут', majorNumber: 22 }
].map(card => ({ ...card, image: `/images/tarot/${card.slug}.webp` }))

/** 56 младших арканов: 4 масти × (туз-десятка + паж/рыцарь/королева/король). */
export const MINOR_ARCANA_DECK: TarotCard[] = SUITS.flatMap(suit =>
	RANKS.map(rank => {
		const slug = `${rank.slug}-of-${suit}`
		return {
			slug,
			name: `${rank.label} ${SUIT_LABEL[suit]}`,
			image: `/images/tarot/${slug}.webp`,
			suit
		}
	})
)

/** Полная колода Таро, 78 карт: сперва старшие арканы, затем младшие по мастям. */
export const TAROT_DECK: TarotCard[] = [
	...MAJOR_ARCANA_DECK,
	...MINOR_ARCANA_DECK
]

export function getTarotCardByMajorNumber(
	number: number
): TarotCard | undefined {
	return MAJOR_ARCANA_DECK.find(card => card.majorNumber === number)
}
