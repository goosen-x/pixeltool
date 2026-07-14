import {
	CategoryPage,
	buildCategoryMetadata
} from '@/components/tools/CategoryPage'

export const metadata = buildCategoryMetadata('javascript')

export default function Page() {
	return <CategoryPage category='javascript' />
}
