import {
	CategoryPage,
	buildCategoryMetadata
} from '@/components/tools/CategoryPage'

export const metadata = buildCategoryMetadata('css')

export default function Page() {
	return <CategoryPage category='css' />
}
