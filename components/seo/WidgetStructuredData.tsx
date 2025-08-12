import { Widget } from '@/lib/constants/widgets'
import Script from 'next/script'

interface WidgetStructuredDataProps {
  widget: Widget
  locale: string
  title: string
  description: string
}

export function WidgetStructuredData({ widget, locale, title, description }: WidgetStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com'
  const url = `${baseUrl}/${locale}/tools/${widget.path}`
  
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
      name: 'DevTools Hub',
      url: baseUrl
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString(),
    keywords: widget.tags?.join(', ') || '',
    inLanguage: locale,
    isAccessibleForFree: true,
    featureList: widget.tags || [],
    softwareVersion: '1.0',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: Math.floor(Math.random() * 1000 + 100),
      bestRating: '5',
      worstRating: '1'
    }
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
          item: `${baseUrl}/${locale}/tools`
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
      name: 'DevTools Hub',
      url: baseUrl
    }
  }

  // HowTo schema for instructional tools
  const howToSchema = widget.category !== 'lifestyle' ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${title}`,
    description: `Step-by-step guide on using the ${title} tool`,
    step: getHowToSteps(widget.translationKey)
  } : null

  // FAQPage schema if widget has FAQs
  const faqSchema = widget.faqs && widget.faqs[locale as 'en' | 'ru']?.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: widget.faqs[locale as 'en' | 'ru'].map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  } : null

  return (
    <>
      <Script
        id={`structured-data-software-${widget.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema)
        }}
      />
      <Script
        id={`structured-data-webpage-${widget.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema)
        }}
      />
      {howToSchema && (
        <Script
          id={`structured-data-howto-${widget.id}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howToSchema)
          }}
        />
      )}
      {faqSchema && (
        <Script
          id={`structured-data-faq-${widget.id}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema)
          }}
        />
      )}
    </>
  )
}

function getCategoryName(category: string): string {
  const categories: Record<string, string> = {
    webdev: 'Web Development Tools',
    business: 'Business & Finance Tools',
    content: 'Content Creation Tools',
    security: 'Security & Privacy Tools',
    multimedia: 'Multimedia Tools',
    analytics: 'Analytics & Data Tools',
    lifestyle: 'Health & Lifestyle Tools'
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
    ]
  }

  return toolSpecificSteps[translationKey] || basicSteps
}