import {
	CategoryPage,
	buildCategoryMetadata
} from '@/components/tools/CategoryPage'

export const metadata = buildCategoryMetadata('security')

export default function Page() {
	return <CategoryPage category='security' />
}
