import { widgetCategories } from './widgets'

export type CategoryKey = keyof typeof widgetCategories

export interface CategoryMeta {
	title: string
	description: string
	/** Левитирующая картинка в шапке. Лежит в public/images/categories/. */
	image: string
}

/**
 * Тексты и картинки категорий для шапки /tools.
 *
 * Ключ '' — состояние «все инструменты», когда фильтр не выбран.
 */
export const CATEGORY_META: Record<'' | CategoryKey, CategoryMeta> = {
	'': {
		title: 'Инструменты',
		description:
			'Полсотни инструментов для работы с кодом, текстом и данными. Всё считается прямо в браузере: файлы никуда не уходят, регистрация не нужна.',
		// Имя с суффиксом не случайно: под прежним all.png у Next осел старый
		// вариант картинки, и кэш оптимизатора отдавал его даже после замены файла.
		image: '/images/categories/all-laptop.png'
	},
	css: {
		title: 'CSS',
		description:
			'Соберите градиент, тень или сетку мышью и заберите готовый код. Плюс калькуляторы, которые считают то, что в голове считать неудобно: специфичность селектора, clamp(), кривую плавности.',
		image: '/images/categories/css.png'
	},
	html: {
		title: 'HTML',
		description:
			'Разберите чужую вёрстку по косточкам: дерево тегов, порядок заголовков, разметка Open Graph. Здесь же собирается фавикон — со всеми размерами и кодом для вставки.',
		image: '/images/categories/html.png'
	},
	javascript: {
		title: 'JavaScript',
		description:
			'Проверьте синтаксис, приведите JSON в человеческий вид, разберите JWT-токен или отладьте регулярное выражение с подсветкой совпадений.',
		image: '/images/categories/javascript.png'
	},
	text: {
		title: 'Текст',
		description:
			'Посчитать символы, сравнить две версии, сменить регистр, найти нужный символ или каомодзи. Мелкие операции, на которые иначе уходит обидно много времени.',
		image: '/images/categories/text.png'
	},
	generators: {
		title: 'Генераторы',
		description:
			'Пароль, UUID, QR-код, тестовые данные, случайное число. Всё, что нужно сгенерировать быстро и не задумываясь о том, как это устроено внутри.',
		image: '/images/categories/generators.png'
	},
	security: {
		title: 'Безопасность',
		description:
			'Надёжные пароли, разбор токенов, кодирование данных. Ничего не отправляется на сервер — считается на вашей машине, в браузере.',
		image: '/images/categories/security.png'
	},
	tools: {
		title: 'Утилиты',
		description:
			'То, что не укладывается в остальные разделы: таймер, конвертер единиц, UTM-разметка, подбор команд и жеребьёвка.',
		image: '/images/categories/tools.png'
	}
}
