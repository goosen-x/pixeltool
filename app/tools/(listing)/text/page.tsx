import {
	CategoryPage,
	buildCategoryMetadata
} from '@/components/tools/CategoryPage'

export const metadata = buildCategoryMetadata('text')

export default function Page() {
	return <CategoryPage category='text' />
}
