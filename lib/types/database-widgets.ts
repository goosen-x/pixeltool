// Database types for widgets

export interface DbWidget {
	id: string
	slug: string
	icon: string | null
	category: string
	is_new: boolean
	is_popular: boolean
	created_at: Date
	updated_at: Date
}

export interface DbWidgetTranslation {
	id: number
	widget_id: string
	locale: 'en' | 'ru'
	title: string
	description: string
	created_at: Date
	updated_at: Date
}

export interface DbWidgetFaq {
	id: number
	widget_id: string
	locale: 'en' | 'ru'
	question: string
	answer: string
	sort_order: number
	created_at: Date
	updated_at: Date
}

export interface DbWidgetRelated {
	id: number
	widget_id: string
	related_widget_id: string
	created_at: Date
}

export interface DbWidgetTag {
	id: number
	widget_id: string
	tag: string
	created_at: Date
}

// Combined widget data with translations
export interface WidgetWithTranslations extends DbWidget {
	translations: DbWidgetTranslation[]
	faqs: DbWidgetFaq[]
	related: DbWidgetRelated[]
	tags: DbWidgetTag[]
}

// Helper type for localized widget data
export interface LocalizedWidget {
	id: string
	slug: string
	icon: string | null
	category: string
	title: string
	description: string
	is_new: boolean
	is_popular: boolean
	faqs: {
		question: string
		answer: string
	}[]
	related_ids: string[]
	tags: string[]
}
