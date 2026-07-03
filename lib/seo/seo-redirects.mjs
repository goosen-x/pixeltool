// SEO Redirects Configuration
//
// Старая интернационализация (/ru/*, /en/*) была удалена — эти URL теперь 404,
// но у них накоплена поисковая история. 301/308-редиректим их на новые пути
// без языкового префикса, чтобы сохранить SEO-вес и позиции.
// Слаги инструментов/статей не менялись, поэтому достаточно снять префикс.
export const SEO_REDIRECTS = [
	{ source: '/ru/:path*', destination: '/:path*', permanent: true },
	{ source: '/en/:path*', destination: '/:path*', permanent: true },
	{ source: '/ru', destination: '/', permanent: true },
	{ source: '/en', destination: '/', permanent: true }
]
