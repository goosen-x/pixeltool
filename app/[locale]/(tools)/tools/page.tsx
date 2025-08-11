import { getTranslations } from 'next-intl/server'
import { WidgetSearch } from '@/components/tools/WidgetSearch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
	Sparkles, 
	Search,
	Filter,
	Layers,
	Code2,
	Palette,
	Gauge,
	Shield
} from 'lucide-react'
import Link from 'next/link'

export default async function ProjectsPage({
	params
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const t = await getTranslations('projectsPage')

	return (
		<section className="container mx-auto px-4 py-8 sm:py-12">
			<WidgetSearch locale={locale} />
		</section>
	)
}