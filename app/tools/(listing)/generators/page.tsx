import {
	CategoryPage,
	buildCategoryMetadata
} from '@/components/tools/CategoryPage'

export const metadata = buildCategoryMetadata('generators')

export default function Page() {
	return <CategoryPage category='generators' />
}
