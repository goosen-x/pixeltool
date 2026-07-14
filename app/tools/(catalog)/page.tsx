import { ToolsExplorer } from '@/components/tools/ToolsExplorer'
import { CategoryContent } from '@/components/tools/CategoryContent'
import { CatalogStructuredData } from '@/components/seo/CatalogStructuredData'

export default function ToolsPage() {
	return (
		<div className='container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8'>
			<CatalogStructuredData category='' />
			<ToolsExplorer category='' />
			<CategoryContent category='' />
		</div>
	)
}
