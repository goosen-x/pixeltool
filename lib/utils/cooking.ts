/**
 * Кулинарные меры: граммы, стаканы, ложки.
 *
 * Источник истины — насыпная плотность продукта в граммах на миллилитр, а не
 * готовая таблица «сколько грамм в стакане». Так все ёмкости считаются из
 * одного числа и остаются согласованными между собой: если стакан муки 160 г,
 * то полстакана обязано быть 80, а столовая ложка — ровно своей долей. В
 * готовых таблицах эта согласованность обычно нарушена, потому что цифры
 * округляли независимо друг от друга.
 *
 * Плотности взяты по общепринятым кулинарным таблицам для продуктов «как
 * есть»: мука непросеянная и неутрамбованная, сахар-песок обычного помола.
 * Разброс между источниками у сыпучих доходит до десяти процентов и зависит
 * от того, насколько плотно продукт лежит, — об этом сказано на странице.
 */

export type SpoonKind = 'tbsp' | 'dsp' | 'tsp'

export interface Container {
	id: string
	name: string
	/** Как называть ёмкость для жидкостей, где горки не бывает. */
	plainName?: string
	/** Объём в миллилитрах. */
	ml: number
	hint?: string
	/** Ложка: для сыпучих вес берётся из таблицы, а не из объёма. */
	spoon?: SpoonKind
	/** Ложка с горкой. У жидкостей не бывает, для них такие строки скрыты. */
	heaped?: boolean
}

/**
 * Гранёный стакан — не одна ёмкость, а две: до ободка 200 мл, до краёв 250.
 * В рецептах почти всегда имеют в виду 200, но спрашивают про оба, поэтому
 * они разведены явно, а не спрятаны за одним названием.
 *
 * Ложки с горкой и без разведены так же: у муки это 25 и 15 граммов, разница
 * почти вдвое, и прятать её за одной строкой нельзя.
 */
export const CONTAINERS: Container[] = [
	{ id: 'glass-250', name: 'Стакан 250 мл', ml: 250, hint: 'тонкий, до краёв' },
	{
		id: 'glass-200',
		name: 'Гранёный стакан 200 мл',
		ml: 200,
		hint: 'до ободка'
	},
	{
		id: 'tablespoon',
		name: 'Столовая ложка с горкой',
		ml: 15,
		spoon: 'tbsp',
		heaped: true
	},
	{
		id: 'tablespoon-level',
		name: 'Столовая ложка без горки',
		plainName: 'Столовая ложка',
		ml: 15,
		spoon: 'tbsp'
	},
	{
		id: 'dessertspoon',
		name: 'Десертная ложка без горки',
		plainName: 'Десертная ложка',
		ml: 10,
		spoon: 'dsp'
	},
	{
		id: 'teaspoon',
		name: 'Чайная ложка с горкой',
		ml: 5,
		spoon: 'tsp',
		heaped: true
	},
	{
		id: 'teaspoon-level',
		name: 'Чайная ложка без горки',
		plainName: 'Чайная ложка',
		ml: 5,
		spoon: 'tsp'
	}
]

/** Граммы в ложке: [без горки, с горкой]. */
type SpoonPair = [number, number]

export interface Product {
	id: string
	name: string
	/** Насыпная плотность, г/мл. По ней считаются стаканы. */
	density: number
	group: 'Сыпучие' | 'Жидкости' | 'Молочное' | 'Прочее'
	/**
	 * Вес в ложках по кухонным таблицам. Из плотности ложку сыпучего не
	 * посчитать: ложку зачерпывают, и даже «без горки» в ней лежит выпуклая
	 * шапка. Плотность муки 0,64 дала бы 9,6 г на столовую ложку, а все
	 * справочники пишут 15 без горки и 25 с горкой. Нет поля — продукт
	 * жидкий, ложка считается по объёму.
	 */
	spoons?: { tbsp: SpoonPair; tsp: SpoonPair }
}

/*
 * Ложки сверены 25.11.2026 с таблицами РБК (rbc.ru/life), ВкусВилла и
 * классической таблицей мер «Книги о вкусной и здоровой пище». Где источники
 * расходятся, взято среднее и округлено до грамма.
 */
export const PRODUCTS: Product[] = [
	{
		id: 'flour',
		name: 'Мука пшеничная',
		density: 0.64,
		group: 'Сыпучие',
		spoons: { tbsp: [15, 25], tsp: [5, 9] }
	},
	{
		id: 'sugar',
		name: 'Сахар-песок',
		density: 0.8,
		group: 'Сыпучие',
		spoons: { tbsp: [20, 25], tsp: [6, 9] }
	},
	{
		id: 'sugar-powder',
		name: 'Сахарная пудра',
		density: 0.72,
		group: 'Сыпучие',
		spoons: { tbsp: [18, 25], tsp: [6, 10] }
	},
	{
		id: 'salt',
		name: 'Соль',
		density: 1.28,
		group: 'Сыпучие',
		spoons: { tbsp: [25, 30], tsp: [7, 10] }
	},
	{
		id: 'rice',
		name: 'Рис',
		density: 0.94,
		group: 'Сыпучие',
		spoons: { tbsp: [18, 25], tsp: [6, 8] }
	},
	{
		id: 'buckwheat',
		name: 'Гречка',
		density: 0.84,
		group: 'Сыпучие',
		spoons: { tbsp: [18, 25], tsp: [6, 7] }
	},
	{
		id: 'semolina',
		name: 'Манная крупа',
		density: 0.8,
		group: 'Сыпучие',
		spoons: { tbsp: [12, 20], tsp: [4, 8] }
	},
	{
		id: 'oatmeal',
		name: 'Овсяные хлопья',
		density: 0.38,
		group: 'Сыпучие',
		spoons: { tbsp: [9, 14], tsp: [3, 4] }
	},
	{
		id: 'starch',
		name: 'Крахмал',
		density: 0.72,
		group: 'Сыпучие',
		spoons: { tbsp: [20, 30], tsp: [6, 10] }
	},
	{
		id: 'cocoa',
		name: 'Какао-порошок',
		density: 0.6,
		group: 'Сыпучие',
		spoons: { tbsp: [10, 20], tsp: [3, 7] }
	},
	{
		id: 'breadcrumbs',
		name: 'Панировочные сухари',
		density: 0.5,
		group: 'Сыпучие',
		spoons: { tbsp: [10, 15], tsp: [3, 5] }
	},
	{ id: 'water', name: 'Вода', density: 1.0, group: 'Жидкости' },
	{ id: 'milk', name: 'Молоко', density: 1.03, group: 'Жидкости' },
	{ id: 'oil', name: 'Растительное масло', density: 0.92, group: 'Жидкости' },
	{
		id: 'honey',
		name: 'Мёд',
		density: 1.4,
		group: 'Жидкости',
		spoons: { tbsp: [21, 30], tsp: [7, 10] }
	},
	{
		id: 'condensed',
		name: 'Сгущённое молоко',
		density: 1.28,
		group: 'Молочное',
		spoons: { tbsp: [20, 30], tsp: [7, 12] }
	},
	{
		id: 'sourcream',
		name: 'Сметана',
		density: 1.0,
		group: 'Молочное',
		spoons: { tbsp: [20, 25], tsp: [7, 10] }
	},
	{
		id: 'butter-melted',
		name: 'Масло сливочное топлёное',
		density: 0.96,
		group: 'Молочное'
	}
]

export function getProduct(id: string): Product | undefined {
	return PRODUCTS.find(p => p.id === id)
}

export function getContainer(id: string): Container | undefined {
	return CONTAINERS.find(c => c.id === id)
}

/** Сколько граммов продукта помещается в ёмкость. */
export function gramsIn(product: Product, container: Container): number {
	if (container.spoon && product.spoons) {
		if (container.spoon === 'dsp') {
			// Десертная ложка — 10 мл против 15 у столовой, своей строки в
			// таблицах у неё почти нигде нет.
			return (product.spoons.tbsp[0] * 10) / 15
		}
		const [level, heaped] = product.spoons[container.spoon]
		return container.heaped ? heaped : level
	}
	return product.density * container.ml
}

/** Ёмкости, которые имеют смысл для продукта: у жидкостей нет горки. */
export function containersOf(product: Product): Container[] {
	return product.spoons ? CONTAINERS : CONTAINERS.filter(c => !c.heaped)
}

/** Название ёмкости в контексте продукта: «без горки» у воды звучит странно. */
export function containerLabel(container: Container, product: Product): string {
	return !product.spoons && container.plainName
		? container.plainName
		: container.name
}

/**
 * Ёмкость, на которую переключиться, если выбранная не подходит продукту:
 * ложку с горкой у жидкости заменяем такой же ложкой без горки.
 */
export function fallbackContainer(
	container: Container,
	product: Product
): Container {
	if (containersOf(product).includes(container)) return container
	return (
		CONTAINERS.find(c => c.spoon === container.spoon && !c.heaped) ??
		CONTAINERS[0]
	)
}

/** Сколько ёмкостей нужно, чтобы набрать заданный вес. */
export function containersFor(
	grams: number,
	product: Product,
	container: Container
): number {
	const perContainer = gramsIn(product, container)
	return perContainer > 0 ? grams / perContainer : 0
}

/**
 * Дробное число ёмкостей человеческим языком: «2 стакана без четверти»
 * читается лучше, чем «1,76».
 *
 * Округляем до ближайшей четверти: мерить точнее стаканом всё равно нельзя,
 * и показывать сотые значило бы изображать точность, которой у метода нет.
 */
export function describeAmount(count: number): string {
	if (count <= 0) return '0'

	const quarters = Math.round(count * 4)
	const whole = Math.floor(quarters / 4)
	const rest = quarters % 4

	const fraction = ['', '¼', '½', '¾'][rest]

	if (whole === 0) return fraction || 'меньше ¼'
	if (rest === 0) return String(whole)
	return `${whole} ${fraction}`
}

/** Все ёмкости для одного продукта — строки таблицы на странице. */
export function tableFor(
	product: Product
): { container: Container; grams: number }[] {
	return containersOf(product).map(container => ({
		container,
		grams: gramsIn(product, container)
	}))
}

/**
 * Количество из поля ввода. Кроме «1,5» и «1.5» понимает дроби из рецептов:
 * «1/2» и «1 1/2». parseFloat прочитал бы «1/2» как единицу.
 */
export function parseAmount(raw: string): number | null {
	// «250 г», «2 ст» — единицу после числа отбрасываем.
	const text = raw
		.trim()
		.replace(',', '.')
		.replace(/\s*[a-zа-яё]+\.?$/i, '')
	const mixed = text.match(/^(?:(\d+(?:\.\d+)?)\s+)?(\d+)\s*\/\s*(\d+)$/)
	if (mixed) {
		const whole = mixed[1] ? Number(mixed[1]) : 0
		const den = Number(mixed[3])
		if (den === 0) return null
		return whole + Number(mixed[2]) / den
	}
	if (!/^\d*\.?\d+$|^\d+\.$/.test(text)) return null
	const value = Number(text)
	return Number.isFinite(value) ? value : null
}
