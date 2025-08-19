import fs from 'fs'
import path from 'path'

const widgetMappings: Record<string, string> = {
	'clamp-calculator': 'css-clamp-calculator',
	'color-converter': 'color-converter',
	'bezier-curve': 'bezier-curve',
	'css-specificity': 'css-specificity',
	'flexbox-generator': 'flexbox-generator',
	'grid-generator': 'grid-generator',
	'html-tree': 'html-tree',
	'password-generator': 'password-generator',
	'qr-generator': 'qr-generator',
	'speed-test': 'speed-test',
	'svg-encoder': 'svg-encoder',
	'utm-builder': 'utm-builder',
	'youtube-thumbnail': 'youtube-thumbnail'
}

const createLayoutFile = (widgetFolder: string, metadataKey: string) => {
	const content = `import { generateWidgetMetadata } from '@/lib/seo/generate-widget-metadata'
import { WidgetSchema } from '@/components/seo/WidgetSchema'

export function generateMetadata({ params }: { params: { locale: string } }) {
  return generateWidgetMetadata('${metadataKey}', params.locale as 'en' | 'ru')
}

export default function Layout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.vercel.app'
  const url = \`\${BASE_URL}/\${params.locale}/projects/${widgetFolder}\`
  
  return (
    <>
      <WidgetSchema
        name="${metadataKey
					.split('-')
					.map(w => w.charAt(0).toUpperCase() + w.slice(1))
					.join(' ')}"
        description="Free online tool for developers and designers."
        url={url}
      />
      {children}
    </>
  )
}`

	return content
}

// Create layout files for all widgets
Object.entries(widgetMappings).forEach(([folder, metadataKey]) => {
	const layoutPath = path.join(
		process.cwd(),
		'app',
		'[locale]',
		'(other)',
		'projects',
		folder,
		'layout.tsx'
	)

	// Skip if layout already exists
	if (!fs.existsSync(layoutPath)) {
		fs.writeFileSync(layoutPath, createLayoutFile(folder, metadataKey))
		console.log(`Created layout for ${folder}`)
	} else {
		console.log(`Layout already exists for ${folder}`)
	}
})

console.log('Widget layouts creation complete!')
