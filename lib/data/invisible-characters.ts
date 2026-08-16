export interface InvisibleCharacter {
	id: string
	name: string
	char: string
	codepoint: string
	worksWell: string
	note: string
}

/**
 * Реальные невидимые/пустые юникод-символы. Не выдумка — каждый из них
 * годами используется для пустых ников в конкретных сервисах (Braille
 * Blank — классика для Steam, Hangul Filler — для PUBG), поэтому у
 * каждого есть пометка, где он обычно проходит проверку.
 */
export const invisibleCharacters: InvisibleCharacter[] = [
	{
		id: 'zwsp',
		name: 'Zero Width Space',
		char: '​',
		codepoint: 'U+200B',
		worksWell: 'Telegram, ВК',
		note: 'Самый распространённый вариант — нулевая ширина, между буквами обычного текста незаметен.'
	},
	{
		id: 'braille-blank',
		name: 'Braille Blank',
		char: '⠀',
		codepoint: 'U+2800',
		worksWell: 'Steam, Discord',
		note: 'Классика для пустого ника в Steam — в отличие от zero-width символов это «настоящий» печатный символ, поля с проверкой на пустоту его пропускают.'
	},
	{
		id: 'hangul-filler',
		name: 'Hangul Filler',
		char: 'ㅤ',
		codepoint: 'U+3164',
		worksWell: 'PUBG Mobile, мобильные игры',
		note: 'Технически корейский символ-заполнитель, но рендерится пустым — привычный вариант для игровых ников на мобильных платформах.'
	},
	{
		id: 'zwnj',
		name: 'Zero Width Non-Joiner',
		char: '‌',
		codepoint: 'U+200C',
		worksWell: 'Универсальный запасной вариант',
		note: 'Если предыдущие три не подошли — стоит попробовать этот, некоторые фильтры настроены именно на первые два.'
	}
]
