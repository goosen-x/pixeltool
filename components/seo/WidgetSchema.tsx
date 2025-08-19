interface WidgetSchemaProps {
	name: string
	description: string
	url: string
	imageUrl?: string
	dateModified?: string
}

export function WidgetSchema({
	name,
	description,
	url,
	imageUrl,
	dateModified = new Date().toISOString()
}: WidgetSchemaProps) {
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: name,
		description: description,
		url: url,
		applicationCategory: 'DeveloperApplication',
		operatingSystem: 'Any',
		browserRequirements: 'Requires JavaScript enabled',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		},
		dateModified: dateModified,
		author: {
			'@type': 'Person',
			name: 'Dmitry Borisenko',
			url: 'https://portfolio.vercel.app'
		},
		publisher: {
			'@type': 'Person',
			name: 'Dmitry Borisenko',
			url: 'https://portfolio.vercel.app'
		},
		...(imageUrl && {
			image: imageUrl,
			thumbnailUrl: imageUrl
		})
	}

	return (
		<script
			type='application/ld+json'
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	)
}
