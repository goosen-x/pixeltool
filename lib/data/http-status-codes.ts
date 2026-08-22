export type HttpStatusClass = '1xx' | '2xx' | '3xx' | '4xx' | '5xx'

export interface HttpStatusCode {
	code: number
	title: string
	description: string
}

export const HTTP_STATUS_CLASS_LABELS: Record<HttpStatusClass, string> = {
	'1xx': 'Информационные',
	'2xx': 'Успешно',
	'3xx': 'Редиректы',
	'4xx': 'Ошибка клиента',
	'5xx': 'Ошибка сервера'
}

export function statusClassOf(code: number): HttpStatusClass {
	return `${Math.floor(code / 100)}xx` as HttpStatusClass
}

export const HTTP_STATUS_CODES: HttpStatusCode[] = [
	{
		code: 100,
		title: 'Continue',
		description:
			'Сервер получил заголовки запроса, клиент может отправлять тело запроса дальше.'
	},
	{
		code: 101,
		title: 'Switching Protocols',
		description:
			'Сервер согласился сменить протокол по запросу клиента — например, на WebSocket.'
	},
	{
		code: 103,
		title: 'Early Hints',
		description:
			'Предварительные заголовки, пока сервер готовит основной ответ — браузер может заранее начать загрузку ресурсов.'
	},
	{
		code: 200,
		title: 'OK',
		description: 'Запрос выполнен успешно, тело ответа содержит результат.'
	},
	{
		code: 201,
		title: 'Created',
		description:
			'Запрос выполнен, и в результате создан новый ресурс — типичный ответ на POST.'
	},
	{
		code: 202,
		title: 'Accepted',
		description:
			'Запрос принят к обработке, но она ещё не завершена — обычно для асинхронных задач.'
	},
	{
		code: 204,
		title: 'No Content',
		description:
			'Запрос выполнен успешно, но отвечать нечем — тело ответа пустое. Частый ответ на DELETE.'
	},
	{
		code: 206,
		title: 'Partial Content',
		description:
			'Сервер отдал только часть ресурса по запросу Range — используется при докачке файлов и стриминге видео.'
	},
	{
		code: 301,
		title: 'Moved Permanently',
		description:
			'Ресурс окончательно переехал на новый адрес, указанный в заголовке Location. Поисковики переносят вес страницы на новый URL.'
	},
	{
		code: 302,
		title: 'Found',
		description:
			'Временный редирект — ресурс сейчас доступен по другому адресу, но исходный URL остаётся действующим.'
	},
	{
		code: 304,
		title: 'Not Modified',
		description:
			'Ресурс не изменился с последнего запроса — браузер может использовать закэшированную версию.'
	},
	{
		code: 307,
		title: 'Temporary Redirect',
		description:
			'Как 302, но строго запрещает менять метод запроса — POST останется POST после перехода.'
	},
	{
		code: 308,
		title: 'Permanent Redirect',
		description: 'Как 301, но, в отличие от него, запрещает менять метод запроса.'
	},
	{
		code: 400,
		title: 'Bad Request',
		description:
			'Сервер не смог разобрать запрос — обычно из-за неверного синтаксиса или некорректных данных.'
	},
	{
		code: 401,
		title: 'Unauthorized',
		description:
			'Запрос требует аутентификации — нужно передать корректные учётные данные или токен.'
	},
	{
		code: 403,
		title: 'Forbidden',
		description:
			'Сервер понял запрос, но отказывается его выполнять — доступ к ресурсу запрещён, даже с верной авторизацией.'
	},
	{
		code: 404,
		title: 'Not Found',
		description: 'Сервер не нашёл ресурс по указанному адресу.'
	},
	{
		code: 405,
		title: 'Method Not Allowed',
		description:
			'HTTP-метод запроса не поддерживается для этого ресурса — например, POST на страницу, принимающую только GET.'
	},
	{
		code: 408,
		title: 'Request Timeout',
		description: 'Сервер не дождался полного запроса от клиента за отведённое время.'
	},
	{
		code: 409,
		title: 'Conflict',
		description:
			'Запрос конфликтует с текущим состоянием ресурса — например, при попытке создать уже существующую запись.'
	},
	{
		code: 410,
		title: 'Gone',
		description:
			'Ресурс раньше существовал, но был окончательно удалён и не появится снова — в отличие от 404 это осознанный факт.'
	},
	{
		code: 413,
		title: 'Payload Too Large',
		description: 'Тело запроса превышает лимит, который сервер готов принять.'
	},
	{
		code: 415,
		title: 'Unsupported Media Type',
		description: 'Сервер не умеет обрабатывать формат данных, указанный в запросе.'
	},
	{
		code: 422,
		title: 'Unprocessable Entity',
		description:
			'Запрос синтаксически верен, но данные внутри не прошли валидацию по смыслу.'
	},
	{
		code: 429,
		title: 'Too Many Requests',
		description:
			'Превышен лимит числа запросов за период времени — сработал rate limiting.'
	},
	{
		code: 500,
		title: 'Internal Server Error',
		description:
			'Общая ошибка на стороне сервера без уточнения причины — что-то пошло не так в его коде.'
	},
	{
		code: 501,
		title: 'Not Implemented',
		description: 'Сервер не поддерживает функциональность, нужную для выполнения запроса.'
	},
	{
		code: 502,
		title: 'Bad Gateway',
		description:
			'Сервер, работавший как прокси или шлюз, получил некорректный ответ от вышестоящего сервера.'
	},
	{
		code: 503,
		title: 'Service Unavailable',
		description:
			'Сервер временно не может обработать запрос — перегружен или на обслуживании.'
	},
	{
		code: 504,
		title: 'Gateway Timeout',
		description:
			'Сервер-шлюз не дождался ответа от вышестоящего сервера за отведённое время.'
	}
]
