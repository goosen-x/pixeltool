import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { buildWidgetMetadata } from '@/lib/seo/build-widget-metadata'

export const metadata: Metadata = buildWidgetMetadata('random-list-generator')

export default function ToolLayout({ children }: { children: ReactNode }) {
	return children
}
