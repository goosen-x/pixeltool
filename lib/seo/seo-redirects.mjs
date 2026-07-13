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
	}
]
