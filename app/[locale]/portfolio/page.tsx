import { SectionMain } from '@/components/homepage/SectionMain/SectionMain'
import { SectionTechStack } from '@/components/homepage/SectionTechStack/SectionTechStack'
import { SectionProjects } from '@/components/homepage/SectionProjects/SectionProjects'
import { SectionExperience } from '@/components/homepage/SectionExperience/SectionExperience'
import { SectionBlog } from '@/components/homepage/SectionBlog/SectionBlog'
import { SectionContact } from '@/components/homepage/SectionContact/SectionContact'
import { Header } from '@/components/layout/Header/Header'
import { Footer } from '@/components/layout/Footer/Footer'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params
  
  return (
    <>
      <Header locale={locale} />
      <main className="min-h-screen">
        <div className="container mx-auto px-4">
          <SectionMain />
          <SectionTechStack />
          <SectionProjects />
          <SectionExperience />
          <SectionBlog locale={locale} />
          <SectionContact />
        </div>
      </main>
      <Footer />
    </>
  )
}