export function HomePageStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PixelTool",
    "alternateName": "PixelTool Developer Tools",
    "url": "https://pixeltool.pro",
    "description": "Professional web developer tools: CSS generators, color converters, formatters, validators, and 50+ more utilities. No installation required, 100% free.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "2450",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Person",
      "name": "Dmitry Borisenko",
      "url": "https://github.com/goosen-x/pixeltool"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PixelTool",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pixeltool.pro/logo.png"
      }
    },
    "potentialAction": [
      {
        "@type": "UseAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://pixeltool.pro/tools/{tool_name}",
          "actionPlatform": [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform"
          ]
        }
      }
    ],
    "featureList": [
      "CSS Clamp Calculator",
      "Color Converter",
      "Password Generator",
      "QR Code Generator",
      "HTML/XML Parser",
      "Image Size Checker",
      "Text Case Converter",
      "And 50+ more tools"
    ],
    "screenshot": [
      {
        "@type": "ImageObject",
        "url": "https://pixeltool.pro/screenshots/tools-page.png",
        "caption": "PixelTool Tools Collection"
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}