import { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { getWidgetByPath } from '@/lib/constants/widgets'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { Metadata } from 'next'
import { getMessages } from 'next-intl/server'

type Props = {
  children: ReactNode
  params: Promise<{ locale: string; widget: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, widget: widgetPath } = await params
  const widget = getWidgetByPath(widgetPath)
  
  if (!widget) {
    return {}
  }

  const messages = await getMessages({ locale })
  const widgets = messages.widgets as any
  const title = widgets[widget.translationKey]?.title || widget.translationKey
  const description = widgets[widget.translationKey]?.description || ''
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
  const url = `${baseUrl}/${locale}/tools/${widget.path}`
  
  // Import SEO metadata if available
  const { widgetMetadata } = await import('@/lib/seo/widget-metadata')
  const seoData = widgetMetadata[widget.path]?.[locale as 'en' | 'ru']
  
  return {
    title: seoData?.title || `${title} | PixelTool`,
    description: seoData?.description || description,
    keywords: seoData?.keywords?.join(', ') || widget.tags?.join(', ') || '',
    authors: [{ name: 'Dmitry Borisenko' }],
    creator: 'PixelTool',
    publisher: 'PixelTool',
    
    openGraph: {
      title: seoData?.title || `${title} - Free Online Tool | PixelTool`,
      description: seoData?.description || description,
      url: url,
      siteName: 'PixelTool',
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      type: 'website',
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&locale=${locale}`,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    
    twitter: {
      card: 'summary_large_image',
      title: seoData?.title || `${title} - Free Online Tool`,
      description: seoData?.description || description,
      images: [`/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&locale=${locale}`],
      creator: '@pixeltool'
    },
    
    alternates: {
      canonical: url,
      languages: {
        'en': `${baseUrl}/en/tools/${widget.path}`,
        'ru': `${baseUrl}/ru/tools/${widget.path}`
      }
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  }
}

export default async function WidgetLayout({ children, params }: Props) {
  const { widget: widgetPath } = await params
  const widget = getWidgetByPath(widgetPath)
  
  if (!widget) {
    notFound()
  }
  
  return (
    <WidgetSEOWrapper widget={widget}>
      {children}
    </WidgetSEOWrapper>
  )
}