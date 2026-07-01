import { NextRequest, NextResponse } from 'next/server'
import { JSDOM } from 'jsdom'

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url)
	const url = searchParams.get('url')

	if (!url) {
		return NextResponse.json(
			{ error: 'URL parameter is required' },
			{ status: 400 }
		)
	}

	try {
		// Validate URL format
		const parsedUrl = new URL(url)
		if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
			return NextResponse.json(
				{ error: 'URL must use HTTP or HTTPS protocol' },
				{ status: 400 }
			)
		}

		// Fetch the webpage
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

		const response = await fetch(url, {
			signal: controller.signal,
			headers: {
				'User-Agent':
					'Mozilla/5.0 (compatible; OpenGraphValidator/1.0; +https://pixeltool.pro)'
			}
		})

		clearTimeout(timeoutId)

		if (!response.ok) {
			return NextResponse.json(
				{
					error: `Failed to fetch URL: ${response.status} ${response.statusText}`
				},
				{ status: 400 }
			)
		}

		const html = await response.text()

		// Parse HTML with JSDOM
		const dom = new JSDOM(html)
		const document = dom.window.document

		// Extract Open Graph tags
		const ogTags: Record<string, string> = {}
		const metaTags = document.querySelectorAll('meta[property^="og:"]')
		metaTags.forEach((tag: Element) => {
			const property = tag.getAttribute('property')
			const content = tag.getAttribute('content')
			if (property && content) {
				ogTags[property] = content
			}
		})

		// Extract Twitter Card tags
		const twitterTags: Record<string, string> = {}
		const twitterMetaTags = document.querySelectorAll('meta[name^="twitter:"]')
		twitterMetaTags.forEach((tag: Element) => {
			const name = tag.getAttribute('name')
			const content = tag.getAttribute('content')
			if (name && content) {
				twitterTags[name] = content
			}
		})

		// Extract additional meta tags
		const additionalTags: Record<string, string> = {}
		const allMetaTags = document.querySelectorAll('meta')
		allMetaTags.forEach((tag: Element) => {
			const property = tag.getAttribute('property')
			const name = tag.getAttribute('name')
			const content = tag.getAttribute('content')

			if (content) {
				if (
					property &&
					!property.startsWith('og:') &&
					!property.startsWith('twitter:')
				) {
					additionalTags[property] = content
				} else if (name && !name.startsWith('twitter:')) {
					additionalTags[name] = content
				}
			}
		})

		// Extract basic HTML data
		const title = document.querySelector('title')?.textContent || ''
		const description =
			document
				.querySelector('meta[name="description"]')
				?.getAttribute('content') || ''
		const canonicalUrl =
			document.querySelector('link[rel="canonical"]')?.getAttribute('href') ||
			''

		const htmlData = {
			title,
			description,
			canonicalUrl,
			url: response.url // Final URL after redirects
		}

		// Analyze image accessibility if og:image is present
		let imageData = null
		if (ogTags['og:image']) {
			try {
				const imageUrl = new URL(ogTags['og:image'], url)
				const imageResponse = await fetch(imageUrl.toString(), {
					method: 'HEAD',
					signal: AbortSignal.timeout(5000)
				})

				imageData = {
					accessible: imageResponse.ok,
					contentType: imageResponse.headers.get('content-type'),
					contentLength: imageResponse.headers.get('content-length')
				}
			} catch {
				imageData = {
					accessible: false,
					error: 'Failed to verify image accessibility'
				}
			}
		}

		return NextResponse.json({
			ogTags,
			twitterTags,
			additionalTags,
			htmlData,
			imageData,
			fetchedAt: new Date().toISOString()
		})
	} catch (error) {
		console.error('OpenGraph validation error:', error)

		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				return NextResponse.json(
					{ error: 'Request timeout - the webpage took too long to respond' },
					{ status: 408 }
				)
			}

			return NextResponse.json(
				{ error: `Failed to validate URL: ${error.message}` },
				{ status: 500 }
			)
		}

		return NextResponse.json(
			{ error: 'An unexpected error occurred' },
			{ status: 500 }
		)
	}
}
