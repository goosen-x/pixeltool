import fs from 'fs'
import path from 'path'

const widgetFolders = [
	'bezier-curve',
	'color-converter',
	'css-specificity',
	'flexbox-generator',
	'grid-generator',
	'html-tree',
	'password-generator',
	'qr-generator',
	'speed-test',
	'svg-encoder',
	'utm-builder',
	'youtube-thumbnail'
]

const layoutTemplate = (
	widgetFolder: string,
	metadataKey: string
) => `import { generateWidgetMetadata } from '@/lib/seo/generate-widget-metadata'
import { WidgetSchema } from '@/components/seo/WidgetSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateWidgetMetadata('${metadataKey}', locale as 'en' | 'ru')
}

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.vercel.app'
  const url = \`\${BASE_URL}/\${locale}/projects/${widgetFolder}\`
  
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

// Fix layout files
widgetFolders.forEach(folder => {
	const layoutPath = path.join(
		process.cwd(),
		'app',
		'[locale]',
		'(other)',
		'projects',
		folder,
		'layout.tsx'
	)

	if (fs.existsSync(layoutPath)) {
		fs.writeFileSync(layoutPath, layoutTemplate(folder, folder))
		console.log(`Fixed layout for ${folder}`)
	}
})

console.log('Layout files fixed!')
