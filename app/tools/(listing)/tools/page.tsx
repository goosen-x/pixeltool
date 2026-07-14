import {
	CategoryPage,
	buildCategoryMetadata
} from '@/components/tools/CategoryPage'

export const metadata = buildCategoryMetadata('tools')

export default function Page() {
	return <CategoryPage category='tools' />
}
