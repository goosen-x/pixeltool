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

export interface Container {
	id: string
	name: string
	/** Объём в миллилитрах. */
	ml: number
	hint?: string
}

/**
 * Гранёный стакан — не одна ёмкость, а две: до риски 200 мл, до краёв 250.
 * В рецептах почти всегда имеют в виду 200, но спрашивают про оба, поэтому
 * они разведены явно, а не спрятаны за одним названием.
 */
export const CONTAINERS: Container[] = [
	{ id: 'glass-250', name: 'Стакан 250 мл', ml: 250, hint: 'тонкий, до краёв' },
	{
		id: 'glass-200',
		name: 'Гранёный стакан 200 мл',
		ml: 200,
		hint: 'до риски'
	},
	{
		id: 'tablespoon',
		name: 'Столовая ложка',
		ml: 15,
		hint: 'с небольшой горкой'
	},
	{ id: 'teaspoon', name: 'Чайная ложка', ml: 5, hint: 'с небольшой горкой' },
	{ id: 'dessertspoon', name: 'Десертная ложка', ml: 10 }
]

export interface Product {
	id: string
	name: string
	/** Насыпная плотность, г/мл. */
	density: number
	group: 'Сыпучие' | 'Жидкости' | 'Молочное' | 'Прочее'
}

export const PRODUCTS: Product[] = [
	{ id: 'flour', name: 'Мука пшеничная', density: 0.64, group: 'Сыпучие' },
	{ id: 'sugar', name: 'Сахар-песок', density: 0.8, group: 'Сыпучие' },
	{
		id: 'sugar-powder',
		name: 'Сахарная пудра',
		density: 0.6,
		group: 'Сыпучие'
	},
	{ id: 'salt', name: 'Соль', density: 1.28, group: 'Сыпучие' },
	{ id: 'rice', name: 'Рис', density: 0.96, group: 'Сыпучие' },
	{ id: 'buckwheat', name: 'Гречка', density: 0.84, group: 'Сыпучие' },
	{ id: 'semolina', name: 'Манная крупа', density: 0.8, group: 'Сыпучие' },
	{ id: 'oatmeal', name: 'Овсяные хлопья', density: 0.36, group: 'Сыпучие' },
	{ id: 'starch', name: 'Крахмал', density: 0.64, group: 'Сыпучие' },
	{ id: 'cocoa', name: 'Какао-порошок', density: 0.6, group: 'Сыпучие' },
	{
		id: 'breadcrumbs',
		name: 'Панировочные сухари',
		density: 0.5,
		group: 'Сыпучие'
	},
	{ id: 'water', name: 'Вода', density: 1.0, group: 'Жидкости' },
	{ id: 'milk', name: 'Молоко', density: 1.03, group: 'Жидкости' },
	{ id: 'oil', name: 'Растительное масло', density: 0.92, group: 'Жидкости' },
	{ id: 'honey', name: 'Мёд', density: 1.3, group: 'Жидкости' },
	{
		id: 'condensed',
		name: 'Сгущённое молоко',
		density: 1.28,
		group: 'Молочное'
	},
	{ id: 'sourcream', name: 'Сметана', density: 1.0, group: 'Молочное' },
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
	return product.density * container.ml
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

	if (whole === 0) return fraction || '0'
	if (rest === 0) return String(whole)
	return `${whole} ${fraction}`
}

/** Все ёмкости для одного продукта — строки таблицы на странице. */
export function tableFor(
	product: Product
): { container: Container; grams: number }[] {
	return CONTAINERS.map(container => ({
		container,
		grams: gramsIn(product, container)
	}))
}
