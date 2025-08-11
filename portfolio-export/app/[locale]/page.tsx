import { SectionMain } from '@/components/homepage/SectionMain/SectionMain'
import { SectionTechStack } from '@/components/homepage/SectionTechStack/SectionTechStack'
import { SectionProjects } from '@/components/homepage/SectionProjects/SectionProjects'
import { SectionExperience } from '@/components/homepage/SectionExperience/SectionExperience'
import { SectionBlog } from '@/components/homepage/SectionBlog/SectionBlog'
import { SectionContact } from '@/components/homepage/SectionContact/SectionContact'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  
  return (
    <main className="min-h-screen">
      <SectionMain />
      <SectionTechStack />
      <SectionProjects />
      <SectionExperience />
      <SectionBlog locale={locale} />
      <SectionContact />
    </main>
  )
}