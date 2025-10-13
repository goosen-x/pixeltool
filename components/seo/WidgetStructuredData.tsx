import { Widget } from '@/lib/constants/widgets'
import Script from 'next/script'
import { getToolSpecificSchema } from '@/lib/seo/widget-schemas'
import { getWidgetFAQs } from '@/lib/constants/widgets'

interface WidgetStructuredDataProps {
	widget: Widget
	locale: string
	title: string
	description: string
}

export function WidgetStructuredData({
	widget,
	locale,
	title,
	description
}: WidgetStructuredDataProps) {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
	const url = `${baseUrl}/tools/${widget.path}`

	// SoftwareApplication schema for tools
	const softwareApplicationSchema = {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		'@id': url,
		name: title,
		description: description,
		url: url,
		applicationCategory: 'WebApplication',
		applicationSubCategory: getCategoryName(widget.category),
		operatingSystem: 'Web Browser',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		},
		author: {
			'@type': 'Organization',
			name: 'PixelTool',
			url: baseUrl
		},
		datePublished: '2024-01-01',
		dateModified: new Date().toISOString(),
		keywords: widget.tags?.join(', ') || '',
		inLanguage: locale,
		isAccessibleForFree: true,
		featureList: widget.tags || [],
		softwareVersion: '1.0'
	}

	// WebPage schema for SEO
	const webPageSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${url}#webpage`,
		url: url,
		name: `${title} - Online Tool`,
		description: description,
		breadcrumb: {
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Home',
					item: baseUrl
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Tools',
					item: `${baseUrl}/tools`
				},
				{
					'@type': 'ListItem',
					position: 3,
					name: title,
					item: url
				}
			]
		},
		mainEntity: {
			'@id': url
		},
		isPartOf: {
			'@type': 'WebSite',
			name: 'PixelTool',
			url: baseUrl
		}
	}

	// HowTo schema for instructional tools
	const howToSchema = {
		'@context': 'https://schema.org',
		'@type': 'HowTo',
		name: `How to use ${title}`,
		description: `Step-by-step guide on using the ${title} tool`,
		step: getHowToSteps(widget.translationKey)
	}

	// FAQPage schema if widget has FAQs
	const widgetFAQs = getWidgetFAQs(widget.translationKey)
	const faqSchema =
		widgetFAQs.length > 0 || (widget.faqs && widget.faqs.length > 0)
			? {
					'@context': 'https://schema.org',
					'@type': 'FAQPage',
					mainEntity: [
						...widgetFAQs,
						...(widget.faqs?.map(faq => ({
							'@type': 'Question',
							name: faq.question,
							acceptedAnswer: {
								'@type': 'Answer',
								text: faq.answer
							}
						})) || [])
					]
				}
			: null

	// Get additional schemas
	const additionalSchemas = getToolSpecificSchema(
		widget,
		locale,
		title,
		description,
		url,
		baseUrl
	)

	return (
		<>
			<Script
				id={`structured-data-software-${widget.id}`}
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(softwareApplicationSchema)
				}}
			/>
			<Script
				id={`structured-data-webpage-${widget.id}`}
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(webPageSchema)
				}}
			/>
			{howToSchema && (
				<Script
					id={`structured-data-howto-${widget.id}`}
					type='application/ld+json'
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(howToSchema)
					}}
				/>
			)}
			{faqSchema && (
				<Script
					id={`structured-data-faq-${widget.id}`}
					type='application/ld+json'
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(faqSchema)
					}}
				/>
			)}
			{additionalSchemas.map((schema, index) => (
				<Script
					key={`additional-schema-${index}`}
					id={`structured-data-additional-${widget.id}-${index}`}
					type='application/ld+json'
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(schema)
					}}
				/>
			))}
		</>
	)
}

function getCategoryName(category: string): string {
	const categories: Record<string, string> = {
		css: 'CSS Development Tools',
		html: 'HTML Development Tools',
		javascript: 'JavaScript Development Tools',
		text: 'Text Processing Tools',
		generators: 'Generator & Randomizer Tools',
		security: 'Security & Encoding Tools',
		tools: 'Utility Tools'
	}
	return categories[category] || 'Utility Tools'
}

function getHowToSteps(translationKey: string): any[] {
	// Basic steps that apply to most tools
	const basicSteps = [
		{
			'@type': 'HowToStep',
			name: 'Open the tool',
			text: 'Navigate to the tool page in your web browser'
		},
		{
			'@type': 'HowToStep',
			name: 'Enter your data',
			text: 'Input the required information into the provided fields'
		},
		{
			'@type': 'HowToStep',
			name: 'Process the data',
			text: 'Click the calculate, generate, or convert button'
		},
		{
			'@type': 'HowToStep',
			name: 'Get results',
			text: 'View and copy the results for your use'
		}
	]

	// Tool-specific steps can be added here based on translationKey
	const toolSpecificSteps: Record<string, any[]> = {
		percentageCalculator: [
			{
				'@type': 'HowToStep',
				name: 'Select calculation type',
				text: 'Choose from percentage of number, find total, or percentage change'
			},
			{
				'@type': 'HowToStep',
				name: 'Enter values',
				text: 'Input the numbers you want to calculate'
			},
			{
				'@type': 'HowToStep',
				name: 'View results',
				text: 'See the calculated result with formula explanation'
			}
		],
		qrGenerator: [
			{
				'@type': 'HowToStep',
				name: 'Select QR code type',
				text: 'Choose URL, WiFi, Text, or App Store link'
			},
			{
				'@type': 'HowToStep',
				name: 'Enter content',
				text: 'Input the data you want to encode'
			},
			{
				'@type': 'HowToStep',
				name: 'Customize appearance',
				text: 'Adjust size, color, and error correction level'
			},
			{
				'@type': 'HowToStep',
				name: 'Download QR code',
				text: 'Save the generated QR code as PNG or SVG'
			}
		],
		passwordGenerator: [
			{
				'@type': 'HowToStep',
				name: 'Choose password type',
				text: 'Select between random password or passphrase generation'
			},
			{
				'@type': 'HowToStep',
				name: 'Set parameters',
				text: 'Adjust length and character types (uppercase, lowercase, numbers, symbols)'
			},
			{
				'@type': 'HowToStep',
				name: 'Generate password',
				text: 'Click generate button or use Ctrl+R shortcut'
			},
			{
				'@type': 'HowToStep',
				name: 'Copy password',
				text: 'Click copy button or use Ctrl+C to copy the generated password'
			}
		],
		colorConverter: [
			{
				'@type': 'HowToStep',
				name: 'Select color',
				text: 'Use color picker or enter color value in any format'
			},
			{
				'@type': 'HowToStep',
				name: 'Choose input format',
				text: 'Select HEX, RGB, HSL, or other color format'
			},
			{
				'@type': 'HowToStep',
				name: 'View conversions',
				text: 'See instant conversion to all supported formats'
			},
			{
				'@type': 'HowToStep',
				name: 'Copy values',
				text: 'Click on any format to copy the converted value'
			}
		],
		base64Encoder: [
			{
				'@type': 'HowToStep',
				name: 'Choose operation',
				text: 'Select encode or decode mode'
			},
			{
				'@type': 'HowToStep',
				name: 'Input data',
				text: 'Enter text or upload file for encoding/decoding'
			},
			{
				'@type': 'HowToStep',
				name: 'Process',
				text: 'Click encode/decode button or use keyboard shortcuts'
			},
			{
				'@type': 'HowToStep',
				name: 'Copy or download',
				text: 'Copy result to clipboard or download as file'
			}
		],
		jsonTools: [
			{
				'@type': 'HowToStep',
				name: 'Paste JSON',
				text: 'Paste your JSON data into the editor'
			},
			{
				'@type': 'HowToStep',
				name: 'Select operation',
				text: 'Choose format, validate, minify, or convert'
			},
			{
				'@type': 'HowToStep',
				name: 'Process JSON',
				text: 'Click the action button to process your JSON'
			},
			{
				'@type': 'HowToStep',
				name: 'View results',
				text: 'See formatted output with syntax highlighting'
			}
		],
		cssClampCalculator: [
			{
				'@type': 'HowToStep',
				name: 'Set minimum size',
				text: 'Enter the minimum font size or spacing value'
			},
			{
				'@type': 'HowToStep',
				name: 'Set maximum size',
				text: 'Enter the maximum font size or spacing value'
			},
			{
				'@type': 'HowToStep',
				name: 'Define viewport range',
				text: 'Set minimum and maximum viewport widths'
			},
			{
				'@type': 'HowToStep',
				name: 'Copy CSS',
				text: 'Copy the generated clamp() CSS function'
			}
		]
	}

	return toolSpecificSteps[translationKey] || basicSteps
}
