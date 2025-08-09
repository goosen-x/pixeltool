import { Metadata } from 'next'
import { widgetMetadata } from './widget-metadata'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.vercel.app'

export function generateWidgetMetadata(
  widgetKey: string,
  locale: 'en' | 'ru' | 'he'
): Metadata {
  const metadata = widgetMetadata[widgetKey]?.[locale]
  
  if (!metadata) {
    return {}
  }

  const url = `${BASE_URL}/${locale}/projects/${widgetKey}`
  const canonicalUrl = `${BASE_URL}/en/projects/${widgetKey}`

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords.join(', '),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `${BASE_URL}/en/projects/${widgetKey}`,
        'ru': `${BASE_URL}/ru/projects/${widgetKey}`,
        'he': `${BASE_URL}/he/projects/${widgetKey}`,
      }
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: url,
      siteName: 'Developer Tools & Widgets',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}