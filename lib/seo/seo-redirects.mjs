// SEO Redirects Configuration
//
// Старая интернационализация (/ru/*, /en/*) была удалена — эти URL теперь 404,
// но у них накоплена поисковая история. Редиректим их на новые пути без
// языкового префикса, чтобы сохранить SEO-вес и позиции.
// Слаги инструментов/статей не менялись, поэтому достаточно снять префикс.
// statusCode: 301 (а не permanent:true → 308) — канонический «Moved
// Permanently», однозначно поддерживается Яндексом, на который завязан трафик.
export const SEO_REDIRECTS = [
	{ source: '/ru/:path*', destination: '/:path*', statusCode: 301 },
	{ source: '/en/:path*', destination: '/:path*', statusCode: 301 },
	{ source: '/ru', destination: '/', statusCode: 301 },
	{ source: '/en', destination: '/', statusCode: 301 },

	// Из заголовка и слага статьи про clamp() убран год: он устаревал каждый
	// январь, хотя содержание вечнозелёное. Старый URL успел проиндексироваться,
	// поэтому ведём его на новый, а не оставляем 404.
	{
		source: '/blog/css-clamp-complete-guide-2025',
		destination: '/blog/css-clamp-complete-guide',
		statusCode: 301
	},

	// Склейка дублей: две пары страниц конкурировали друг с другом за один и тот
	// же спрос. /js-validator и /javascript-syntax-checker имели буквально
	// одинаковый заголовок «JavaScript валидатор»; json-yaml-formatter дублировал
	// json-tools, чей YAML переехал туда отдельной вкладкой. Оставили сильную
	// страницу из каждой пары, слабую ведём на неё.
	{
		source: '/tools/js-validator',
		destination: '/tools/javascript-syntax-checker',
		statusCode: 301
	},
	{
		source: '/tools/json-yaml-formatter',
		destination: '/tools/json-tools',
		statusCode: 301
	},

	// Виджет перепозиционирован под «проверка html» (1071 показов/мес против 187
	// у «html дерево»): к дереву добавились W3C-валидация и анализ семантики/a11y.
	// Слаг html-tree-visualizer → html-checker, старый ведём на новый.
	{
		source: '/tools/html-tree-visualizer',
		destination: '/tools/html-checker',
		statusCode: 301
	},

	// Категория «Утилиты» получила осмысленный слаг: /tools/tools дублировал
	// сегмент и выглядел странно. Старый URL был в sitemap, ведём его на новый.
	{
		source: '/tools/tools',
		destination: '/tools/utilities',
		statusCode: 301
	},

	// js-minifier удалён: спрос на минификацию JS мизерный (<150/мес). Старый URL
	// был в sitemap — ведём на ближайший по смыслу JS-инструмент.
	{
		source: '/tools/js-minifier',
		destination: '/tools/javascript-syntax-checker',
		statusCode: 301
	}
]
