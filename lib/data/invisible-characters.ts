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
		id: 'choseong-filler',
		name: 'Hangul Choseong Filler',
		char: 'ᅟ',
		codepoint: 'U+115F',
		worksWell: 'Telegram (имя профиля), Roblox',
		note: 'Родственник Hangul Filler из того же корейского блока и такой же буквы по категории. Проверен вручную в Telegram, у Roblox упоминается как запасной вариант.'
	},
	{
		id: 'jungseong-filler',
		name: 'Hangul Jungseong Filler',
		char: 'ᅠ',
		codepoint: 'U+1160',
		worksWell: 'Telegram (имя профиля)',
		note: 'Третий заполнитель из корейского блока, проверен вручную в Telegram. Если фильтр знает про U+3164 и U+115F, этот может остаться незамеченным.'
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
		// В исходнике записан escape-последовательностью намеренно: это
		// комбинирующая метка, и литерал в кавычках визуально прилипал бы к
		// соседнему символу, что превращает правку файла в лотерею.
		id: 'cgj',
		name: 'Combining Grapheme Joiner',
		char: '\u034F',
		codepoint: 'U+034F',
		worksWell: 'Telegram, X (имя профиля)',
		note: 'Проверен вручную в имени профиля Telegram и X. Формально это комбинирующая метка, а не пробел, поэтому фильтры пропускают его там, где режут zero-width символы.'
	},
	{
		// Тоже записан escape-последовательностью: bidi-метка невидима и в
		// редакторе, литерал в кавычках было бы не отличить от пустой строки.
		id: 'alm',
		name: 'Arabic Letter Mark',
		char: '\u061C',
		codepoint: 'U+061C',
		worksWell: 'Telegram (имя профиля)',
		note: 'Проверен вручную в имени профиля Telegram. Служебная метка направления письма: формально та же категория, что у Zero Width Space, но конкретно её фильтры обычно не перечисляют.'
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
		// Проверено владельцем проекта 23.08.2026 в имени профиля. U+200B там
		// тоже описывают как рабочий, но подтверждён вручную именно CGJ.
		id: 'telegram',
		name: 'Telegram',
		field: 'имя профиля',
		charId: 'cgj',
		confidence: 'verified',
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
		// Проверено владельцем проекта 23.08.2026 в имени профиля. Про текст
		// постов данных нет, поэтому поле сузили до проверенного.
		id: 'x',
		name: 'X (Twitter)',
		field: 'имя профиля',
		charId: 'cgj',
		confidence: 'verified'
	}
]

export function getInvisibleChar(charId: string): string {
	return invisibleCharacters.find(c => c.id === charId)?.char ?? ''
}

export type InvisibleGroup = 'space' | 'zerowidth' | 'bidi' | 'filler' | 'other'

export interface CatalogEntry {
	codepoint: string
	name: string
	char: string
	/** Категория Unicode: по ней обычно и написан фильтр площадки. */
	category: string
	group: InvisibleGroup
}

export const INVISIBLE_GROUPS: Record<InvisibleGroup, string> = {
	space: 'Пробелы разной ширины',
	zerowidth: 'Нулевой ширины и служебные',
	bidi: 'Метки направления письма',
	filler: 'Заполнители и пустые знаки',
	other: 'Прочие невидимые'
}

/**
 * Полный каталог невидимых символов: 68 штук.
 *
 * Собран из перечня invisible-characters.com, но не скопирован вслепую. Из
 * исходных 87 позиций отброшены дубликат U+1D000, незанятый кодпоинт U+2065,
 * пять управляющих символов (табуляция, перевод строки и соседи: в однострочном
 * поле имени они не невидимые, а ломающие) и двенадцать печатных глифов вроде
 * нот и египетского иероглифа, которые прекрасно видны. Имена взяты из базы
 * Unicode, а не из источника: там серия U+1D000–U+1D159 подписана глаголицей,
 * хотя это византийские и обычные музыкальные знаки.
 *
 * Символы записаны escape-последовательностями намеренно: литералы невидимы в
 * редакторе, и любая правка файла превращалась бы в угадайку.
 */
export const invisibleCharacterCatalog: CatalogEntry[] = [
	{
		codepoint: 'U+00A0',
		name: 'No-Break Space',
		char: '\u00A0',
		category: 'Zs',
		group: 'space'
	},
	{
		codepoint: 'U+1680',
		name: 'Ogham Space Mark',
		char: '\u1680',
		category: 'Zs',
		group: 'space'
	},
	{
		codepoint: 'U+2000',
		name: 'En Quad',
		char: '\u2000',
		category: 'Zs',
		group: 'space'
	},
	{
		codepoint: 'U+2001',
		name: 'Em Quad',
		char: '\u2001',
		category: 'Zs',
		group: 'space'
	},
	{
		codepoint: 'U+2002',
		name: 'En Space',
		char: '\u2002',
		category: 'Zs',
		group: 'space'
	},
	{
		codepoint: 'U+2003',
		name: 'Em Space',
		char: '\u2003',
		category: 'Zs',
		group: 'space'
	},
	{
		codepoint: 'U+2004',
		name: 'Three-Per-Em Space',
		char: '\u2004',
		category: 'Zs',
		group: 'space'
	},
	{
		codepoint: 'U+2005',
		name: 'Four-Per-Em Space',
		char: '\u2005',
		category: 'Zs',
		group: 'space'
	},
	{
		codepoint: 'U+2006',
		name: 'Six-Per-Em Space',
		char: '\u2006',
		category: 'Zs',
		group: 'space'
	},
	{
		codepoint: 'U+2007',
		name: 'Figure Space',
		char: '\u2007',
		category: 'Zs',
		group: 'space'
	},
	{
		codepoint: 'U+2008',
		name: 'Punctuation Space',
		char: '\u2008',
		category: 'Zs',
		group: 'space'
	},
	{
		codepoint: 'U+2009',
		name: 'Thin Space',
		char: '\u2009',
		category: 'Zs',
		group: 'space'
	},
	{
		codepoint: 'U+200A',
		name: 'Hair Space',
		char: '\u200A',
		category: 'Zs',
		group: 'space'
	},
	{
		codepoint: 'U+202F',
		name: 'Narrow No-Break Space',
		char: '\u202F',
		category: 'Zs',
		group: 'space'
	},
	{
		codepoint: 'U+205F',
		name: 'Medium Mathematical Space',
		char: '\u205F',
		category: 'Zs',
		group: 'space'
	},
	{
		codepoint: 'U+3000',
		name: 'Ideographic Space',
		char: '\u3000',
		category: 'Zs',
		group: 'space'
	},
	{
		codepoint: 'U+00AD',
		name: 'Soft Hyphen',
		char: '\u00AD',
		category: 'Cf',
		group: 'zerowidth'
	},
	{
		codepoint: 'U+180E',
		name: 'Mongolian Vowel Separator',
		char: '\u180E',
		category: 'Cf',
		group: 'zerowidth'
	},
	{
		codepoint: 'U+200B',
		name: 'Zero Width Space',
		char: '\u200B',
		category: 'Cf',
		group: 'zerowidth'
	},
	{
		codepoint: 'U+200C',
		name: 'Zero Width Non-Joiner',
		char: '\u200C',
		category: 'Cf',
		group: 'zerowidth'
	},
	{
		codepoint: 'U+200D',
		name: 'Zero Width Joiner',
		char: '\u200D',
		category: 'Cf',
		group: 'zerowidth'
	},
	{
		codepoint: 'U+2060',
		name: 'Word Joiner',
		char: '\u2060',
		category: 'Cf',
		group: 'zerowidth'
	},
	{
		codepoint: 'U+2061',
		name: 'Function Application',
		char: '\u2061',
		category: 'Cf',
		group: 'zerowidth'
	},
	{
		codepoint: 'U+2062',
		name: 'Invisible Times',
		char: '\u2062',
		category: 'Cf',
		group: 'zerowidth'
	},
	{
		codepoint: 'U+2063',
		name: 'Invisible Separator',
		char: '\u2063',
		category: 'Cf',
		group: 'zerowidth'
	},
	{
		codepoint: 'U+2064',
		name: 'Invisible Plus',
		char: '\u2064',
		category: 'Cf',
		group: 'zerowidth'
	},
	{
		codepoint: 'U+FEFF',
		name: 'Zero Width No-Break Space',
		char: '\uFEFF',
		category: 'Cf',
		group: 'zerowidth'
	},
	{
		codepoint: 'U+061C',
		name: 'Arabic Letter Mark',
		char: '\u061C',
		category: 'Cf',
		group: 'bidi'
	},
	{
		codepoint: 'U+200E',
		name: 'Left-To-Right Mark',
		char: '\u200E',
		category: 'Cf',
		group: 'bidi'
	},
	{
		codepoint: 'U+200F',
		name: 'Right-To-Left Mark',
		char: '\u200F',
		category: 'Cf',
		group: 'bidi'
	},
	{
		codepoint: 'U+202A',
		name: 'Left-To-Right Embedding',
		char: '\u202A',
		category: 'Cf',
		group: 'bidi'
	},
	{
		codepoint: 'U+202B',
		name: 'Right-To-Left Embedding',
		char: '\u202B',
		category: 'Cf',
		group: 'bidi'
	},
	{
		codepoint: 'U+202C',
		name: 'Pop Directional Formatting',
		char: '\u202C',
		category: 'Cf',
		group: 'bidi'
	},
	{
		codepoint: 'U+202D',
		name: 'Left-To-Right Override',
		char: '\u202D',
		category: 'Cf',
		group: 'bidi'
	},
	{
		codepoint: 'U+202E',
		name: 'Right-To-Left Override',
		char: '\u202E',
		category: 'Cf',
		group: 'bidi'
	},
	{
		codepoint: 'U+2066',
		name: 'Left-To-Right Isolate',
		char: '\u2066',
		category: 'Cf',
		group: 'bidi'
	},
	{
		codepoint: 'U+2067',
		name: 'Right-To-Left Isolate',
		char: '\u2067',
		category: 'Cf',
		group: 'bidi'
	},
	{
		codepoint: 'U+2068',
		name: 'First Strong Isolate',
		char: '\u2068',
		category: 'Cf',
		group: 'bidi'
	},
	{
		codepoint: 'U+2069',
		name: 'Pop Directional Isolate',
		char: '\u2069',
		category: 'Cf',
		group: 'bidi'
	},
	{
		codepoint: 'U+115F',
		name: 'Hangul Choseong Filler',
		char: '\u115F',
		category: 'Lo',
		group: 'filler'
	},
	{
		codepoint: 'U+1160',
		name: 'Hangul Jungseong Filler',
		char: '\u1160',
		category: 'Lo',
		group: 'filler'
	},
	{
		codepoint: 'U+17B4',
		name: 'Khmer Vowel Inherent Aq',
		char: '\u17B4',
		category: 'Mn',
		group: 'filler'
	},
	{
		codepoint: 'U+17B5',
		name: 'Khmer Vowel Inherent Aa',
		char: '\u17B5',
		category: 'Mn',
		group: 'filler'
	},
	{
		codepoint: 'U+2800',
		name: 'Braille Pattern Blank',
		char: '\u2800',
		category: 'So',
		group: 'filler'
	},
	{
		codepoint: 'U+3164',
		name: 'Hangul Filler',
		char: '\u3164',
		category: 'Lo',
		group: 'filler'
	},
	{
		codepoint: 'U+FFA0',
		name: 'Halfwidth Hangul Filler',
		char: '\uFFA0',
		category: 'Lo',
		group: 'filler'
	},
	{
		codepoint: 'U+0020',
		name: 'Space',
		char: '\u0020',
		category: 'Zs',
		group: 'other'
	},
	{
		codepoint: 'U+034F',
		name: 'Combining Grapheme Joiner',
		char: '\u034F',
		category: 'Mn',
		group: 'other'
	},
	{
		codepoint: 'U+180B',
		name: 'Mongolian Free Variation Selector One',
		char: '\u180B',
		category: 'Mn',
		group: 'other'
	},
	{
		codepoint: 'U+180C',
		name: 'Mongolian Free Variation Selector Two',
		char: '\u180C',
		category: 'Mn',
		group: 'other'
	},
	{
		codepoint: 'U+180D',
		name: 'Mongolian Free Variation Selector Three',
		char: '\u180D',
		category: 'Mn',
		group: 'other'
	},
	{
		codepoint: 'U+206A',
		name: 'Inhibit Symmetric Swapping',
		char: '\u206A',
		category: 'Cf',
		group: 'other'
	},
	{
		codepoint: 'U+206B',
		name: 'Activate Symmetric Swapping',
		char: '\u206B',
		category: 'Cf',
		group: 'other'
	},
	{
		codepoint: 'U+206C',
		name: 'Inhibit Arabic Form Shaping',
		char: '\u206C',
		category: 'Cf',
		group: 'other'
	},
	{
		codepoint: 'U+206D',
		name: 'Activate Arabic Form Shaping',
		char: '\u206D',
		category: 'Cf',
		group: 'other'
	},
	{
		codepoint: 'U+206E',
		name: 'National Digit Shapes',
		char: '\u206E',
		category: 'Cf',
		group: 'other'
	},
	{
		codepoint: 'U+206F',
		name: 'Nominal Digit Shapes',
		char: '\u206F',
		category: 'Cf',
		group: 'other'
	},
	{
		codepoint: 'U+FFF9',
		name: 'Interlinear Annotation Anchor',
		char: '\uFFF9',
		category: 'Cf',
		group: 'other'
	},
	{
		codepoint: 'U+FFFA',
		name: 'Interlinear Annotation Separator',
		char: '\uFFFA',
		category: 'Cf',
		group: 'other'
	},
	{
		codepoint: 'U+FFFB',
		name: 'Interlinear Annotation Terminator',
		char: '\uFFFB',
		category: 'Cf',
		group: 'other'
	},
	{
		codepoint: 'U+1D173',
		name: 'Musical Symbol Begin Beam',
		char: '\u{1D173}',
		category: 'Cf',
		group: 'other'
	},
	{
		codepoint: 'U+1D174',
		name: 'Musical Symbol End Beam',
		char: '\u{1D174}',
		category: 'Cf',
		group: 'other'
	},
	{
		codepoint: 'U+1D175',
		name: 'Musical Symbol Begin Tie',
		char: '\u{1D175}',
		category: 'Cf',
		group: 'other'
	},
	{
		codepoint: 'U+1D176',
		name: 'Musical Symbol End Tie',
		char: '\u{1D176}',
		category: 'Cf',
		group: 'other'
	},
	{
		codepoint: 'U+1D177',
		name: 'Musical Symbol Begin Slur',
		char: '\u{1D177}',
		category: 'Cf',
		group: 'other'
	},
	{
		codepoint: 'U+1D178',
		name: 'Musical Symbol End Slur',
		char: '\u{1D178}',
		category: 'Cf',
		group: 'other'
	},
	{
		codepoint: 'U+1D179',
		name: 'Musical Symbol Begin Phrase',
		char: '\u{1D179}',
		category: 'Cf',
		group: 'other'
	},
	{
		codepoint: 'U+1D17A',
		name: 'Musical Symbol End Phrase',
		char: '\u{1D17A}',
		category: 'Cf',
		group: 'other'
	}
]
