import {
	CategoryPage,
	buildCategoryMetadata
} from '@/components/tools/CategoryPage'

export const metadata = buildCategoryMetadata('html')

export default function Page() {
	return <CategoryPage category='html' />
}
