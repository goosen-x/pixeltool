import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowRight, Code2, Palette, Zap, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('HomePage')
  
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            PixelTool
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href={`/${locale}/tools`}>
              <Button size="lg" className="gap-2">
                {t('hero.exploreTools')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            {t('features.title')}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <Code2 className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 font-semibold">{t('features.developers.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('features.developers.description')}
              </p>
            </Card>
            <Card className="p-6">
              <Palette className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 font-semibold">{t('features.designers.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('features.designers.description')}
              </p>
            </Card>
            <Card className="p-6">
              <Zap className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 font-semibold">{t('features.fast.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('features.fast.description')}
              </p>
            </Card>
            <Card className="p-6">
              <Globe className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 font-semibold">{t('features.accessible.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('features.accessible.description')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold">
            {t('cta.title')}
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            {t('cta.description')}
          </p>
          <Link href={`/${locale}/projects`}>
            <Button size="lg" variant="outline" className="gap-2">
              {t('cta.viewAllTools')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}