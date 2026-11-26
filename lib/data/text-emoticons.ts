/**
 * Смайлики из символов и каомодзи для /tools/text-emoticons.
 *
 * Категории разложены по тому, что ищут в Вордстате: «грустные», «злые»,
 * «милые», «котики», «сердечки» (см. комментарий у виджета в
 * lib/constants/widgets/text.ts). Раньше всё грустное, злое и влюблённое
 * лежало одной кучей «Эмоции» на 52 штуки.
 */

export interface Emoticon {
	text: string
	/** Ключ подписи из EMOTICON_LABELS. */
	name: string
}

export interface EmoticonCategory {
	id: string
	label: string
	emoticons: Emoticon[]
}

/** Подпись под смайликом. */
export const EMOTICON_LABELS: Record<string, string> = {
	lennyFace: 'Ленни фейс',
	shrug: 'Пожимание плечами',
	tableFlip: 'Переворот стола',
	tableUnflip: 'Стол на место',
	disapproval: 'Осуждение',
	bear: 'Медведь',
	seal: 'Тюлень',
	confused: 'Недоумение',
	happy: 'Радость',
	cute: 'Милота',
	crying: 'Плач',
	cool: 'Крутой',
	love: 'Любовь',
	excited: 'Восторг',
	sad: 'Грусть',
	angry: 'Злость',
	kiss: 'Поцелуй',
	hug: 'Обнимашки',
	cat: 'Котик',
	dog: 'Собачка',
	bunny: 'Зайчик',
	surprised: 'Удивление',
	fish: 'Рыбка',
	give: 'Дай',
	pointing: 'Указывает',
	fighting: 'Боевой настрой',
	dancing: 'Танец',
	shocked: 'Шок',
	singing: 'Пение',
	goodbye: 'Пока',
	hello: 'Привет',
	curious: 'Любопытство',
	content: 'Довольство',
	friends: 'Друзья',
	embarrassed: 'Смущение',
	blush: 'Румянец',
	suspicious: 'Подозрение',
	smirk: 'Ухмылка',
	confident: 'Уверенность',
	bigGrin: 'Широкая улыбка',
	wink: 'Подмигивание',
	tongueOut: 'Показать язык',
	neutral: 'Без эмоций',
	skeptical: 'Сомнение',
	heart: 'Сердечко',
	brokenHeart: 'Разбитое сердце',
	cheer: 'Ура',
	sleepy: 'Сон',
	thinking: 'Раздумье',
	salute: 'Есть!',
	magic: 'Волшебство',
	tired: 'Усталость'
}

/**
 * Слова для поиска по ключу подписи: синонимы и формы, которыми люди
 * описывают эмоцию («грустный», «плачет», «кот»). Поиск идёт по началу
 * слова, поэтому хватает основы.
 */
const NAME_KEYWORDS: Record<string, string> = {
	lennyFace: 'ленни lenny намёк хитрый',
	shrug: 'пожимает плечами не знаю всё равно ну и ладно',
	tableFlip: 'стол переворот ярость бесит',
	tableUnflip: 'стол спокойствие',
	disapproval: 'осуждение неодобрение взгляд серьёзный',
	bear: 'медведь мишка животные милый',
	seal: 'тюлень животные',
	confused: 'недоумение не понимаю растерянность',
	happy: 'радость счастье улыбка весёлый веселый довольный',
	cute: 'милый милые няшка кавай',
	crying: 'плач плачет слёзы слезы грустный грусть',
	cool: 'крутой очки',
	love: 'любовь влюблён влюблен сердце сердечко милый',
	excited: 'восторг радость ура вау',
	sad: 'грусть грустный печаль тоска',
	angry: 'злость злой бесит ярость гнев',
	kiss: 'поцелуй целую любовь',
	hug: 'обнимашки обнимаю объятия любовь',
	cat: 'кот котик кошка животные мяу',
	dog: 'собака собачка пёс пес щенок животные',
	bunny: 'заяц зайчик кролик животные милый',
	surprised: 'удивление вау ого',
	fish: 'рыба рыбка животные',
	give: 'дай дать отдай',
	pointing: 'указывает ты',
	fighting: 'борьба бой драка настрой',
	dancing: 'танец танцы музыка',
	shocked: 'шок испуг ужас',
	singing: 'пение песня музыка',
	goodbye: 'пока до свидания прощание',
	hello: 'привет здравствуй машет',
	curious: 'любопытство интересно',
	content: 'довольный спокойствие',
	friends: 'друзья дружба вместе',
	embarrassed: 'смущение неловко',
	blush: 'румянец смущение стесняюсь милый',
	suspicious: 'подозрение подозрительный',
	smirk: 'ухмылка хитрый',
	confident: 'уверенность подмигивание',
	bigGrin: 'смех улыбка радость',
	wink: 'подмигивание шутка',
	tongueOut: 'язык дразнит шутка',
	neutral: 'без эмоций нейтральный',
	skeptical: 'сомнение скепсис',
	heart: 'сердце сердечко любовь',
	brokenHeart: 'разбитое сердце грусть',
	cheer: 'ура радость победа',
	sleepy: 'сон спать сплю устал',
	thinking: 'думаю раздумье хм',
	salute: 'есть честь привет',
	magic: 'волшебство магия',
	tired: 'усталость устал грусть'
}

const e = (text: string, name: string): Emoticon => ({ text, name })

export const EMOTICON_CATEGORIES: EmoticonCategory[] = [
	{
		id: 'popular',
		label: 'Популярные',
		emoticons: [
			e('( ͡° ͜ʖ ͡°)', 'lennyFace'),
			e('¯\\_(ツ)_/¯', 'shrug'),
			e('(╯°□°）╯︵ ┻━┻', 'tableFlip'),
			e('ಠ_ಠ', 'disapproval'),
			e('ʕ•ᴥ•ʔ', 'bear'),
			e('(˶ᵔ ᵕ ᵔ˶)', 'cute'),
			e('(≧▽≦)', 'excited'),
			e('(╥﹏╥)', 'crying'),
			e('(▀̿Ĺ̯▀̿ ̿)', 'cool'),
			e('(っ◔◡◔)っ ♥', 'hug'),
			e('ฅ^•ﻌ•^ฅ', 'cat'),
			e('૮ ˶ᵔ ᵕ ᵔ˶ ა', 'dog')
		]
	},
	{
		id: 'classic',
		label: 'Классические',
		emoticons: [
			e(':-)', 'happy'),
			e(':)', 'happy'),
			e(':-D', 'bigGrin'),
			e(';-)', 'wink'),
			e(':-(', 'sad'),
			e(":'(", 'crying'),
			e(':-P', 'tongueOut'),
			e(':-O', 'surprised'),
			e(':-|', 'neutral'),
			e(':-/', 'skeptical'),
			e('B-)', 'cool'),
			e('<3', 'heart'),
			e('</3', 'brokenHeart'),
			e(':-*', 'kiss'),
			e('>:(', 'angry'),
			e('\\o/', 'cheer'),
			e('^_^', 'happy'),
			e('-_-', 'tired'),
			e('o_O', 'confused'),
			e('XD', 'bigGrin')
		]
	},
	{
		id: 'joy',
		label: 'Радость',
		emoticons: [
			e('(^▽^)', 'happy'),
			e('(＾◡＾)', 'happy'),
			e('(´∀｀)', 'happy'),
			e('(◕‿◕)', 'happy'),
			e('(｡◕‿◕｡)', 'happy'),
			e('٩(◕‿◕)۶', 'happy'),
			e('(⌒‿⌒)', 'content'),
			e('(*^▽^*)', 'happy'),
			e('ヾ(＾-＾)ノ', 'hello'),
			e('ヽ(・∀・)ﾉ', 'excited'),
			e('＼(＾▽＾)／', 'excited'),
			e('(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', 'excited'),
			e('(ﾉ´ヮ`)ﾉ*: ･ﾟ', 'excited'),
			e('ヽ(*≧ω≦)ノ', 'excited'),
			e('(☆▽☆)', 'excited'),
			e('o(^▽^)o', 'excited'),
			e('(๑˃̵ᴗ˂̵)و', 'fighting'),
			e('ᕕ( ᐛ )ᕗ', 'happy')
		]
	},
	{
		id: 'cute',
		label: 'Милые',
		emoticons: [
			e('(˶ᵔ ᵕ ᵔ˶)', 'cute'),
			e('(⸝⸝ᵕᴗᵕ⸝⸝)', 'blush'),
			e('ପ(๑•ᴗ•๑)ଓ', 'cute'),
			e('(✿◠‿◠)', 'cute'),
			e('(◍•ᴗ•◍)', 'cute'),
			e('(๑>ᴗ<๑)', 'cute'),
			e('(o・ω・o)', 'curious'),
			e('(｡•̀ᴗ-)✧', 'confident'),
			e('٩(｡•́‿•̀｡)۶', 'happy'),
			e('(*¯︶¯*)', 'content'),
			e('(｡・//ε//・｡)', 'blush'),
			e('ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧', 'confident')
		]
	},
	{
		id: 'love',
		label: 'Любовь и сердечки',
		emoticons: [
			e('(♥‿♥)', 'love'),
			e('(´♡‿♡`)', 'love'),
			e('(｡♥‿♥｡)', 'love'),
			e('(灬♥ω♥灬)', 'love'),
			e('(*˘︶˘*).｡.:*♡', 'love'),
			e('♡＾▽＾♡', 'love'),
			e('(˘∀˘)/(μ‿μ) ❤', 'love'),
			e('(づ￣ ³￣)づ', 'kiss'),
			e('( ˘ ³˘)♥', 'kiss'),
			e('(っ˘з(˘⌣˘ )', 'kiss'),
			e('(´ ε ` )♡', 'kiss'),
			e('(⊃｡•́‿•̀｡)⊃', 'hug'),
			e('(づ｡◕‿‿◕｡)づ', 'hug'),
			e('(っ◔◡◔)っ ♥', 'hug'),
			e('ʕっ•ᴥ•ʔっ', 'hug'),
			e('♡(˃͈ દ ˂͈ ༶ )', 'love'),
			e('<3', 'heart'),
			e('</3', 'brokenHeart')
		]
	},
	{
		id: 'sad',
		label: 'Грустные',
		emoticons: [
			e('(╥﹏╥)', 'crying'),
			e('(╥_╥)', 'crying'),
			e('(ಥ﹏ಥ)', 'crying'),
			e('(T_T)', 'crying'),
			e('(ToT)', 'crying'),
			e('ㅠ_ㅠ', 'crying'),
			e('｡ﾟ(ﾟ´Д｀ﾟ)ﾟ｡', 'crying'),
			e('(´；ω；｀)', 'crying'),
			e('( ╥ω╥ )', 'crying'),
			e('(இ﹏இ`｡)', 'crying'),
			e('இдஇ', 'crying'),
			e('(ノ_<。)', 'crying'),
			e('(｡•́︿•̀｡)', 'sad'),
			e('(っ˘̩╭╮˘̩)っ', 'sad'),
			e('(´;︵;`)', 'sad'),
			e('(;_;)', 'sad'),
			e('(._.)', 'sad'),
			e('(>_<)', 'sad'),
			e('(´-ω-`)', 'tired')
		]
	},
	{
		id: 'angry',
		label: 'Злые',
		emoticons: [
			e('(╬ಠ益ಠ)', 'angry'),
			e('(ノಠ益ಠ)ノ', 'angry'),
			e('ლ(ಠ益ಠლ)', 'angry'),
			e('(＃｀Д´)', 'angry'),
			e('(｀皿´＃)', 'angry'),
			e('ヽ(`Д´)ノ', 'angry'),
			e('ヽ(ｏ`皿′ｏ)ﾉ', 'angry'),
			e('(╬ Ò﹏Ó)', 'angry'),
			e('(•̀へ •́ ╮ )', 'angry'),
			e('(눈_눈)', 'suspicious'),
			e('(¬_¬)', 'disapproval'),
			e('ಠ_ಠ', 'disapproval'),
			e('凸(-_-)凸', 'angry'),
			e('(╯°□°)╯', 'angry'),
			e('(╯°□°）╯︵ ┻━┻', 'tableFlip'),
			e('ʕノ•ᴥ•ʔノ ︵ ┻━┻', 'tableFlip'),
			e('┬─┬ノ( º _ ºノ)', 'tableUnflip')
		]
	},
	{
		id: 'animals',
		label: 'Животные',
		emoticons: [
			e('(=^･ω･^=)', 'cat'),
			e('(=^･ｪ･^=)', 'cat'),
			e('ฅ^•ﻌ•^ฅ', 'cat'),
			e('ฅ(＾・ω・＾ฅ)', 'cat'),
			e('(^._.^)ﾉ', 'cat'),
			e('(＾• ω •＾)', 'cat'),
			e('/ᐠ｡ꞈ｡ᐟ\\', 'cat'),
			e('ᓚᘏᗢ', 'cat'),
			e('=^..^=', 'cat'),
			e('ʕ•ᴥ•ʔ', 'bear'),
			e('ʕっ•ᴥ•ʔっ', 'bear'),
			e('ᶘᵒᴥᵒᶅ', 'seal'),
			e('U･ω･U', 'dog'),
			e('▼・ᴥ・▼', 'dog'),
			e('( ͡• ᴥ ͡•)', 'dog'),
			e('૮ ˶ᵔ ᵕ ᵔ˶ ა', 'dog'),
			e('૮₍ ˶•⤙•˶ ₎ა', 'bunny'),
			e('<(°)#)><', 'fish')
		]
	},
	{
		id: 'misc',
		label: 'Действия и разное',
		emoticons: [
			e('φ(゜▽゜*)♪', 'singing'),
			e('♪~ ᕕ(ᐛ)ᕗ', 'dancing'),
			e('(￣▽￣)ノ', 'goodbye'),
			e('(｀・ω・´)ゞ', 'salute'),
			e('＼(~o~)／', 'surprised'),
			e('(･o･;)', 'surprised'),
			e('(⊙_⊙)', 'shocked'),
			e('Σ(°△°|||)︴', 'shocked'),
			e('(屮ﾟДﾟ)屮', 'shocked'),
			e('(〃￣︶￣)人(￣︶￣〃)', 'friends'),
			e('(￣ω￣;)', 'embarrassed'),
			e('¯\\(°_o)/¯', 'confused'),
			e('(￣～￣;)', 'thinking'),
			e('(－_－) zzZ', 'sleepy'),
			e('༼ つ ◕_◕ ༽つ', 'give'),
			e('ヽ༼ຈل͜ຈ༽ﾉ', 'excited'),
			e('☜(ﾟヮﾟ☜)', 'pointing'),
			e('(☝ ՞ਊ՞)☝', 'pointing'),
			e("(ง'̀-'́)ง", 'fighting'),
			e('(∩^o^)⊃━☆', 'magic'),
			e('( ⚆ _ ⚆ )', 'suspicious'),
			e('(ㆆ_ㆆ)', 'suspicious'),
			e('(¬‿¬)', 'smirk'),
			e('(ノ°∀°)ノ', 'excited')
		]
	}
]

export function emoticonLabel(name: string): string {
	return EMOTICON_LABELS[name] ?? name
}

/** Все смайлики без повторов: один и тот же может лежать в двух категориях. */
export function allEmoticons(): Emoticon[] {
	const seen = new Set<string>()
	const result: Emoticon[] = []
	for (const category of EMOTICON_CATEGORIES) {
		for (const emoticon of category.emoticons) {
			if (seen.has(emoticon.text)) continue
			seen.add(emoticon.text)
			result.push(emoticon)
		}
	}
	return result
}

function normalize(value: string): string {
	return value.toLowerCase().replace(/ё/g, 'е').trim()
}

/**
 * Поиск по-русски: по подписи, синонимам и названию категории. Каждое
 * слово запроса должно совпасть с началом какого-нибудь слова, так что
 * «грустн», «кот» и «котик» работают. Запрос из символов
 * («^_^», «T_T») ищется внутри самого смайлика.
 */
export function searchEmoticons(query: string): Emoticon[] {
	const q = normalize(query)
	if (!q) return allEmoticons()

	const terms = q.split(/\s+/)
	const hasLetters = /[a-zа-я]/.test(q)

	const result: Emoticon[] = []
	const seen = new Set<string>()
	for (const category of EMOTICON_CATEGORIES) {
		for (const emoticon of category.emoticons) {
			if (seen.has(emoticon.text)) continue
			const words = normalize(
				[
					emoticonLabel(emoticon.name),
					NAME_KEYWORDS[emoticon.name] ?? '',
					category.label
				].join(' ')
			).split(/[\s,]+/)

			const byWords =
				hasLetters &&
				terms.every(term => words.some(word => word.startsWith(term)))
			const byText = emoticon.text.toLowerCase().includes(q)

			if (byWords || byText) {
				seen.add(emoticon.text)
				result.push(emoticon)
			}
		}
	}
	return result
}
