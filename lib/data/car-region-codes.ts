/**
 * Коды регионов на автомобильных номерах России.
 *
 * Источник — приказ МВД России от 05.10.2017 № 766 (ред. от 02.05.2023) в
 * изложении русской Википедии, статья «Регистрационные знаки транспортных
 * средств в России»; таблица снята 28.08.2026.
 *
 * `formerCodes` — коды, которые за регионом числились, но больше не
 * выдаются. Почти все они достались упразднённым автономным округам
 * (Таймырский, Эвенкийский, Усть-Ордынский Бурятский, Коми-Пермяцкий,
 * Агинский Бурятский, Корякский) и позже были переназначены другим
 * субъектам — поэтому один и тот же код может встретиться дважды: как
 * бывший у одного региона и как действующий у другого. Для поиска по номеру
 * это важно: на дорогах ездят машины и со старыми кодами.
 */

export interface CarRegion {
	/** Субъект РФ. */
	region: string
	/** Федеральный округ; «—» там, где округ не назначен. */
	district: string
	/** Действующие коды. */
	codes: string[]
	/** Коды, закреплённые за регионом ранее и снятые с выдачи. */
	formerCodes?: string[]
}

export const CAR_REGIONS: CarRegion[] = [
	{
		region: 'Адыгея',
		district: 'Южный',
		codes: ['01']
	},
	{
		region: 'Башкортостан',
		district: 'Приволжский',
		codes: ['02', '102', '702']
	},
	{
		region: 'Бурятия',
		district: 'Дальневосточный',
		codes: ['03']
	},
	{
		region: 'Республика Алтай',
		district: 'Сибирский',
		codes: ['04']
	},
	{
		region: 'Дагестан',
		district: 'Северо-Кавказский',
		codes: ['05', '105']
	},
	{
		region: 'Ингушетия',
		district: 'Северо-Кавказский',
		codes: ['06']
	},
	{
		region: 'Кабардино-Балкария',
		district: 'Северо-Кавказский',
		codes: ['07']
	},
	{
		region: 'Калмыкия',
		district: 'Южный',
		codes: ['08']
	},
	{
		region: 'Карачаево-Черкесия',
		district: 'Северо-Кавказский',
		codes: ['09']
	},
	{
		region: 'Карелия',
		district: 'Северо-Западный',
		codes: ['10']
	},
	{
		region: 'Республика Коми',
		district: 'Северо-Западный',
		codes: ['11']
	},
	{
		region: 'Марий Эл',
		district: 'Приволжский',
		codes: ['12']
	},
	{
		region: 'Мордовия',
		district: 'Приволжский',
		codes: ['13', '113']
	},
	{
		region: 'Якутия',
		district: 'Дальневосточный',
		codes: ['14']
	},
	{
		region: 'Северная Осетия — Алания',
		district: 'Северо-Кавказский',
		codes: ['15']
	},
	{
		region: 'Татарстан',
		district: 'Приволжский',
		codes: ['16', '116', '716']
	},
	{
		region: 'Тыва',
		district: 'Сибирский',
		codes: ['17']
	},
	{
		region: 'Удмуртия',
		district: 'Приволжский',
		codes: ['18']
	},
	{
		region: 'Хакасия',
		district: 'Сибирский',
		codes: ['19']
	},
	{
		region: 'Чувашия',
		district: 'Приволжский',
		codes: ['21', '121']
	},
	{
		region: 'Алтайский край',
		district: 'Сибирский',
		codes: ['22', '122']
	},
	{
		region: 'Краснодарский край',
		district: 'Южный',
		codes: ['23', '93', '123', '193', '323']
	},
	{
		region: 'Красноярский край',
		district: 'Сибирский',
		codes: ['24', '124', '224'],
		formerCodes: ['84', '88']
	},
	{
		region: 'Приморский край',
		district: 'Дальневосточный',
		codes: ['25', '125']
	},
	{
		region: 'Ставропольский край',
		district: 'Северо-Кавказский',
		codes: ['26', '126']
	},
	{
		region: 'Хабаровский край',
		district: 'Дальневосточный',
		codes: ['27']
	},
	{
		region: 'Амурская область',
		district: 'Дальневосточный',
		codes: ['28']
	},
	{
		region: 'Архангельская область',
		district: 'Северо-Западный',
		codes: ['29']
	},
	{
		region: 'Астраханская область',
		district: 'Южный',
		codes: ['30']
	},
	{
		region: 'Белгородская область',
		district: 'Центральный',
		codes: ['31', '131']
	},
	{
		region: 'Брянская область',
		district: 'Центральный',
		codes: ['32']
	},
	{
		region: 'Владимирская область',
		district: 'Центральный',
		codes: ['33', '133']
	},
	{
		region: 'Волгоградская область',
		district: 'Южный',
		codes: ['34', '134']
	},
	{
		region: 'Вологодская область',
		district: 'Северо-Западный',
		codes: ['35']
	},
	{
		region: 'Воронежская область',
		district: 'Центральный',
		codes: ['36', '136']
	},
	{
		region: 'Ивановская область',
		district: 'Центральный',
		codes: ['37']
	},
	{
		region: 'Иркутская область',
		district: 'Сибирский',
		codes: ['38', '138'],
		formerCodes: ['85']
	},
	{
		region: 'Калининградская область',
		district: 'Северо-Западный',
		codes: ['39', '91']
	},
	{
		region: 'Калужская область',
		district: 'Центральный',
		codes: ['40']
	},
	{
		region: 'Камчатский край',
		district: 'Дальневосточный',
		codes: ['41'],
		formerCodes: ['82']
	},
	{
		region: 'Кемеровская область — Кузбасс',
		district: 'Сибирский',
		codes: ['42', '142']
	},
	{
		region: 'Кировская область',
		district: 'Приволжский',
		codes: ['43']
	},
	{
		region: 'Костромская область',
		district: 'Центральный',
		codes: ['44']
	},
	{
		region: 'Курганская область',
		district: 'Уральский',
		codes: ['45']
	},
	{
		region: 'Курская область',
		district: 'Центральный',
		codes: ['46']
	},
	{
		region: 'Ленинградская область',
		district: 'Северо-Западный',
		codes: ['47', '147']
	},
	{
		region: 'Липецкая область',
		district: 'Центральный',
		codes: ['48']
	},
	{
		region: 'Магаданская область',
		district: 'Дальневосточный',
		codes: ['49']
	},
	{
		region: 'Московская область',
		district: 'Центральный',
		codes: ['50', '90', '150', '190', '250', '550', '750', '790']
	},
	{
		region: 'Мурманская область',
		district: 'Северо-Западный',
		codes: ['51']
	},
	{
		region: 'Нижегородская область',
		district: 'Приволжский',
		codes: ['52', '152', '252']
	},
	{
		region: 'Новгородская область',
		district: 'Северо-Западный',
		codes: ['53']
	},
	{
		region: 'Новосибирская область',
		district: 'Сибирский',
		codes: ['54', '154']
	},
	{
		region: 'Омская область',
		district: 'Сибирский',
		codes: ['55', '155']
	},
	{
		region: 'Оренбургская область',
		district: 'Приволжский',
		codes: ['56', '156']
	},
	{
		region: 'Орловская область',
		district: 'Центральный',
		codes: ['57']
	},
	{
		region: 'Пензенская область',
		district: 'Приволжский',
		codes: ['58']
	},
	{
		region: 'Пермский край',
		district: 'Приволжский',
		codes: ['59', '159'],
		formerCodes: ['81']
	},
	{
		region: 'Псковская область',
		district: 'Северо-Западный',
		codes: ['60']
	},
	{
		region: 'Ростовская область',
		district: 'Южный',
		codes: ['61', '161', '761']
	},
	{
		region: 'Рязанская область',
		district: 'Центральный',
		codes: ['62']
	},
	{
		region: 'Самарская область',
		district: 'Приволжский',
		codes: ['63', '163', '763']
	},
	{
		region: 'Саратовская область',
		district: 'Приволжский',
		codes: ['64', '164']
	},
	{
		region: 'Сахалинская область',
		district: 'Дальневосточный',
		codes: ['65']
	},
	{
		region: 'Свердловская область',
		district: 'Уральский',
		codes: ['66', '96', '166', '196']
	},
	{
		region: 'Смоленская область',
		district: 'Центральный',
		codes: ['67']
	},
	{
		region: 'Тамбовская область',
		district: 'Центральный',
		codes: ['68']
	},
	{
		region: 'Тверская область',
		district: 'Центральный',
		codes: ['69']
	},
	{
		region: 'Томская область',
		district: 'Сибирский',
		codes: ['70']
	},
	{
		region: 'Тульская область',
		district: 'Центральный',
		codes: ['71']
	},
	{
		region: 'Тюменская область',
		district: 'Уральский',
		codes: ['72', '172']
	},
	{
		region: 'Ульяновская область',
		district: 'Приволжский',
		codes: ['73', '173']
	},
	{
		region: 'Челябинская область',
		district: 'Уральский',
		codes: ['74', '174', '774']
	},
	{
		region: 'Забайкальский край',
		district: 'Дальневосточный',
		codes: ['75'],
		formerCodes: ['80']
	},
	{
		region: 'Ярославская область',
		district: 'Центральный',
		codes: ['76']
	},
	{
		region: 'Москва',
		district: 'Центральный',
		codes: [
			'77',
			'97',
			'99',
			'177',
			'197',
			'199',
			'777',
			'797',
			'799',
			'977',
			'997'
		]
	},
	{
		region: 'Санкт-Петербург',
		district: 'Северо-Западный',
		codes: ['78', '98', '178', '198', '778']
	},
	{
		region: 'Еврейская автономная область',
		district: 'Дальневосточный',
		codes: ['79']
	},
	{
		region: 'Донецкая Народная Республика',
		district: '—',
		codes: ['80', '180']
	},
	{
		region: 'Луганская Народная Республика',
		district: '—',
		codes: ['81', '181']
	},
	{
		region: 'Республика Крым',
		district: 'Южный',
		codes: ['82'],
		formerCodes: ['777']
	},
	{
		region: 'Ненецкий автономный округ',
		district: 'Северо-Западный',
		codes: ['83']
	},
	{
		region: 'Херсонская область',
		district: '—',
		codes: ['84', '184']
	},
	{
		region: 'Запорожская область',
		district: '—',
		codes: ['85', '185']
	},
	{
		region: 'Ханты-Мансийский автономный округ — Югра',
		district: 'Уральский',
		codes: ['86', '186']
	},
	{
		region: 'Чукотский автономный округ',
		district: 'Дальневосточный',
		codes: ['87']
	},
	{
		region: 'Ямало-Ненецкий автономный округ',
		district: 'Уральский',
		codes: ['89']
	},
	{
		region: 'Севастополь',
		district: 'Южный',
		codes: ['92']
	},
	{
		region: 'Байконур',
		district: '—',
		codes: ['94']
	},
	{
		region: 'Чеченская Республика',
		district: 'Северо-Кавказский',
		codes: ['95']
	}
]

export interface CodeMatch {
	code: string
	region: CarRegion
	/** true — код за регионом больше не выдаётся. */
	former: boolean
}

/**
 * Все совпадения по коду: обычно одно, но у переназначенных кодов их два —
 * действующий владелец и прежний.
 */
export function findByCode(code: string): CodeMatch[] {
	const normalized = code.trim()
	if (!normalized) return []

	const matches: CodeMatch[] = []
	for (const region of CAR_REGIONS) {
		if (region.codes.includes(normalized)) {
			matches.push({ code: normalized, region, former: false })
		}
		if (region.formerCodes?.includes(normalized)) {
			matches.push({ code: normalized, region, former: true })
		}
	}
	return matches
}

/** Поиск по названию региона — без учёта регистра и по подстроке. */
export function findByRegion(query: string): CarRegion[] {
	const needle = query.trim().toLowerCase()
	if (!needle) return []
	return CAR_REGIONS.filter(region =>
		region.region.toLowerCase().includes(needle)
	)
}
