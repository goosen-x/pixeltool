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
		worksWell: 'Telegram (имя, сообщения)',
		note: 'Самый распространённый вариант — нулевая ширина, между буквами обычного текста незаметен. В @username Telegram его не пропускает.'
	},
	{
		id: 'braille-blank',
		name: 'Braille Blank',
		char: '⠀',
		codepoint: 'U+2800',
		worksWell: 'Discord, Roblox',
		note: 'Классика для пустого ника в Steam — в отличие от zero-width символов это «настоящий» печатный символ, поля с проверкой на пустоту его пропускают.'
	},
	{
		id: 'hangul-filler',
		name: 'Hangul Filler',
		char: 'ㅤ',
		codepoint: 'U+3164',
		worksWell: 'PUBG Mobile, Free Fire, Roblox, Steam',
		note: 'Технически корейский символ-заполнитель, но рендерится пустым — привычный вариант для игровых ников на мобильных платформах.'
	},
	{
		id: 'zwnj',
		name: 'Zero Width Non-Joiner',
		char: '‌',
		codepoint: 'U+200C',
		worksWell: 'Запасной вариант для текста',
		note: 'С Unicode 15.0 отнесён к ограниченным для идентификаторов, поэтому в никах проходит всё реже. В обычном тексте по-прежнему работает.'
	},
	{
		id: 'zwj',
		name: 'Zero Width Joiner',
		char: '‍',
		codepoint: 'U+200D',
		worksWell: 'iOS (имена папок)',
		note: 'Проверен вручную: подходит для папки без названия на iOS. В никах соцсетей, как и соседний U+200C, чаще фильтруется.'
	}
]

export interface InvisiblePlatform {
	id: string
	name: string
	/** Где именно на платформе символ проходит: ник, статус, био. */
	field: string
	/**
	 * id символа из invisibleCharacters выше. Пусто, если площадка вырезает
	 * невидимые символы и копировать нечего.
	 */
	charId?: string
	/** Насколько надёжны данные: см. docs/seo/invisible-character-platforms.md */
	confidence: 'verified' | 'sources' | 'thin'
	/** Известное ограничение, если есть. */
	caveat?: string
}

/**
 * Какой символ пробовать первым на конкретной площадке.
 *
 * Составлено по разбору источников (docs/seo/invisible-character-platforms.md,
 * 23.08.2026). Почти везде первым идёт Hangul Filler: для валидатора это буква,
 * а не пробел и не служебный символ, поэтому фильтры пропускают его чаще
 * остальных. Zero-width группа наоборот попадает под типовые регулярки, а
 * Discord прямо пишет об их фильтрации в документации API.
 *
 * confidence честно отражает происхождение данных: 'verified' — проверено
 * вручную, 'sources' — сходятся несколько источников, 'thin' — данных мало.
 */
export const invisiblePlatforms: InvisiblePlatform[] = [
	{
		id: 'telegram',
		name: 'Telegram',
		field: 'имя и сообщения',
		charId: 'zwsp',
		confidence: 'sources',
		caveat: 'В @username не проходит: фильтр на стороне сервера'
	},
	{
		id: 'discord',
		name: 'Discord',
		field: 'ник и статус',
		charId: 'braille-blank',
		confidence: 'sources',
		caveat: 'Zero-width символы Discord фильтрует, о чём пишет в документации'
	},
	{
		id: 'steam',
		name: 'Steam',
		field: 'ник профиля',
		charId: 'hangul-filler',
		confidence: 'sources',
		caveat: 'Valve периодически закрывает конкретные символы обновлениями'
	},
	{
		id: 'roblox',
		name: 'Roblox',
		field: 'отображаемое имя',
		charId: 'hangul-filler',
		confidence: 'sources'
	},
	{
		id: 'pubg',
		name: 'PUBG Mobile',
		field: 'игровой ник',
		charId: 'hangul-filler',
		confidence: 'sources'
	},
	{
		id: 'freefire',
		name: 'Free Fire',
		field: 'игровой ник',
		charId: 'hangul-filler',
		confidence: 'sources'
	},
	{
		id: 'instagram',
		name: 'Instagram',
		field: 'био и подписи',
		charId: 'hangul-filler',
		confidence: 'sources',
		caveat: 'В @username невидимые символы не проходят'
	},
	{
		id: 'whatsapp',
		name: 'WhatsApp',
		field: 'статус',
		charId: 'hangul-filler',
		confidence: 'sources'
	},
	{
		id: 'ios',
		name: 'iOS',
		field: 'имя папки',
		charId: 'zwj',
		confidence: 'verified'
	},
	{
		// Проверено владельцем проекта 23.08.2026: VK ID вырезает скрытые
		// символы, неразрывные пробелы и пустые строки прямо при сохранении, а
		// заявку на смену имени дополнительно смотрит модератор. Оставляем в
		// списке намеренно: запрос «невидимое имя ВК» массовый, и честный ответ
		// «не получится» полезнее молчания.
		id: 'vk',
		name: 'ВКонтакте',
		field: 'имя и статус',
		confidence: 'verified',
		caveat: 'VK ID удаляет скрытые символы при сохранении, плюс модерация имён'
	},
	{
		id: 'tiktok',
		name: 'TikTok',
		field: 'ник и био',
		charId: 'hangul-filler',
		confidence: 'thin'
	},
	{
		id: 'x',
		name: 'X (Twitter)',
		field: 'имя и посты',
		charId: 'hangul-filler',
		confidence: 'thin'
	}
]

export function getInvisibleChar(charId: string): string {
	return invisibleCharacters.find(c => c.id === charId)?.char ?? ''
}
