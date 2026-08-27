export interface TimezoneCity {
	/** IANA-идентификатор, ключ для Intl.DateTimeFormat({ timeZone }) */
	id: string
	nameRu: string
	countryRu: string
}

/**
 * Кураторский список городов, не полный список ~400 IANA-зон: под задачу
 * «сравнить время с другим городом» нужны узнаваемые названия, а не голые
 * идентификаторы вроде Asia/Yekaterinburg без контекста. Сначала все 11
 * часовых поясов России (в порядке с запада на восток), затем страны СНГ,
 * затем крупные мировые города.
 */
export const TIMEZONE_CITIES: TimezoneCity[] = [
	{ id: 'Europe/Kaliningrad', nameRu: 'Калининград', countryRu: 'Россия' },
	{ id: 'Europe/Moscow', nameRu: 'Москва', countryRu: 'Россия' },
	{ id: 'Europe/Samara', nameRu: 'Самара', countryRu: 'Россия' },
	{ id: 'Asia/Yekaterinburg', nameRu: 'Екатеринбург', countryRu: 'Россия' },
	{ id: 'Asia/Omsk', nameRu: 'Омск', countryRu: 'Россия' },
	{ id: 'Asia/Novosibirsk', nameRu: 'Новосибирск', countryRu: 'Россия' },
	{ id: 'Asia/Krasnoyarsk', nameRu: 'Красноярск', countryRu: 'Россия' },
	{ id: 'Asia/Irkutsk', nameRu: 'Иркутск', countryRu: 'Россия' },
	{ id: 'Asia/Yakutsk', nameRu: 'Якутск', countryRu: 'Россия' },
	{ id: 'Asia/Vladivostok', nameRu: 'Владивосток', countryRu: 'Россия' },
	{ id: 'Asia/Magadan', nameRu: 'Магадан', countryRu: 'Россия' },
	{
		id: 'Asia/Kamchatka',
		nameRu: 'Петропавловск-Камчатский',
		countryRu: 'Россия'
	},

	{ id: 'Europe/Minsk', nameRu: 'Минск', countryRu: 'Беларусь' },
	{ id: 'Europe/Kyiv', nameRu: 'Киев', countryRu: 'Украина' },
	{ id: 'Asia/Almaty', nameRu: 'Алматы', countryRu: 'Казахстан' },
	{ id: 'Asia/Tashkent', nameRu: 'Ташкент', countryRu: 'Узбекистан' },
	{ id: 'Asia/Bishkek', nameRu: 'Бишкек', countryRu: 'Киргизия' },
	{ id: 'Asia/Dushanbe', nameRu: 'Душанбе', countryRu: 'Таджикистан' },
	{ id: 'Asia/Yerevan', nameRu: 'Ереван', countryRu: 'Армения' },
	{ id: 'Asia/Baku', nameRu: 'Баку', countryRu: 'Азербайджан' },
	{ id: 'Asia/Tbilisi', nameRu: 'Тбилиси', countryRu: 'Грузия' },

	{ id: 'UTC', nameRu: 'Всемирное время (UTC)', countryRu: '' },
	{ id: 'Europe/London', nameRu: 'Лондон', countryRu: 'Великобритания' },
	{ id: 'Europe/Paris', nameRu: 'Париж', countryRu: 'Франция' },
	{ id: 'Europe/Berlin', nameRu: 'Берлин', countryRu: 'Германия' },
	{ id: 'Europe/Madrid', nameRu: 'Мадрид', countryRu: 'Испания' },
	{ id: 'Europe/Rome', nameRu: 'Рим', countryRu: 'Италия' },
	{ id: 'Europe/Istanbul', nameRu: 'Стамбул', countryRu: 'Турция' },
	{ id: 'Africa/Cairo', nameRu: 'Каир', countryRu: 'Египет' },
	{ id: 'Asia/Jerusalem', nameRu: 'Тель-Авив', countryRu: 'Израиль' },
	{ id: 'Asia/Dubai', nameRu: 'Дубай', countryRu: 'ОАЭ' },

	{ id: 'America/New_York', nameRu: 'Нью-Йорк', countryRu: 'США' },
	{ id: 'America/Chicago', nameRu: 'Чикаго', countryRu: 'США' },
	{ id: 'America/Denver', nameRu: 'Денвер', countryRu: 'США' },
	{ id: 'America/Los_Angeles', nameRu: 'Лос-Анджелес', countryRu: 'США' },
	{ id: 'America/Toronto', nameRu: 'Торонто', countryRu: 'Канада' },
	{ id: 'America/Mexico_City', nameRu: 'Мехико', countryRu: 'Мексика' },
	{ id: 'America/Sao_Paulo', nameRu: 'Сан-Паулу', countryRu: 'Бразилия' },
	{
		id: 'America/Argentina/Buenos_Aires',
		nameRu: 'Буэнос-Айрес',
		countryRu: 'Аргентина'
	},

	{ id: 'Asia/Kolkata', nameRu: 'Дели', countryRu: 'Индия' },
	{ id: 'Asia/Bangkok', nameRu: 'Бангкок', countryRu: 'Таиланд' },
	{ id: 'Asia/Singapore', nameRu: 'Сингапур', countryRu: 'Сингапур' },
	{ id: 'Asia/Hong_Kong', nameRu: 'Гонконг', countryRu: 'Гонконг' },
	{ id: 'Asia/Shanghai', nameRu: 'Пекин', countryRu: 'Китай' },
	{ id: 'Asia/Seoul', nameRu: 'Сеул', countryRu: 'Республика Корея' },
	{ id: 'Asia/Tokyo', nameRu: 'Токио', countryRu: 'Япония' },
	{ id: 'Australia/Sydney', nameRu: 'Сидней', countryRu: 'Австралия' },
	{ id: 'Pacific/Auckland', nameRu: 'Окленд', countryRu: 'Новая Зеландия' }
]

export function getTimezoneCity(id: string): TimezoneCity | undefined {
	return TIMEZONE_CITIES.find(city => city.id === id)
}
