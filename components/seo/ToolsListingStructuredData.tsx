import Script from 'next/script'
import { widgets } from '@/lib/constants/widgets'

interface ToolsListingStructuredDataProps {
  locale: string
  totalTools: number
}

export function ToolsListingStructuredData({ locale, totalTools }: ToolsListingStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com'
  const url = `${baseUrl}/${locale}/tools`
  
  // CollectionPage schema for tools listing
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    url: url,
    name: 'Free Online Developer Tools',
    description: 'Collection of free online tools for developers, designers, and content creators. No registration required.',
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
          item: url
        }
      ]
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalTools,
      itemListElement: widgets.slice(0, 10).map((widget, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: widget.translationKey,
          url: `${baseUrl}/${locale}/tools/${widget.path}`,
          applicationCategory: 'WebApplication'
        }
      }))
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'DevTools Hub',
      url: baseUrl
    }
  }

  // Organization schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}#organization`,
    name: 'DevTools Hub',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.png`,
      width: 512,
      height: 512
    },
    sameAs: [
      'https://twitter.com/devtoolshub',
      'https://github.com/devtoolshub'
    ]
  }

  // WebSite schema with search action
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}#website`,
    url: baseUrl,
    name: 'DevTools Hub',
    description: 'Free online tools for developers',
    publisher: {
      '@id': `${baseUrl}#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/${locale}/tools?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: locale
  }

  return (
    <>
      <Script
        id="structured-data-collection"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema)
        }}
      />
      <Script
        id="structured-data-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <Script
        id="structured-data-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
    </>
  )
}