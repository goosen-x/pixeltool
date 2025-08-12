import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowRight, Code2, Palette, Zap, Globe, Sparkles, Terminal, Layers, Gauge } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/global/Logo'
import { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}


export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('HomePage')
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-20 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>
        
        <div className="mx-auto max-w-6xl">
          {/* Logo and Title */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <Logo size={80} className="animate-pulse" />
          </div>
          
          <h1 className="text-center mb-6 text-6xl sm:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              PixelTool
            </span>
          </h1>
          
          <p className="mx-auto mb-4 max-w-3xl text-center text-xl sm:text-2xl text-foreground/80 font-medium">
            {t('hero.subtitle')}
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              50+ Tools
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Zap className="w-4 h-4 mr-2" />
              No Installation
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Globe className="w-4 h-4 mr-2" />
              100% Free
            </Badge>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/tools`}>
              <Button size="lg" className="gap-2 text-lg px-8 h-14 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                {t('hero.exploreTools')}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href={`/${locale}/tools`}>
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 h-14 rounded-xl">
                <Terminal className="h-5 w-5" />
                {t('hero.browseCategories')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Layers className="w-3 h-3 mr-2" />
              Features
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-8">
                <div className="mb-6 inline-flex p-3 rounded-2xl bg-primary/10 text-primary">
                  <Code2 className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-heading font-bold">{t('features.developers.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('features.developers.description')}
                </p>
              </div>
            </Card>
            
            <Card className="group relative overflow-hidden border-2 hover:border-purple-500/50 transition-all hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-8">
                <div className="mb-6 inline-flex p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                  <Palette className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-heading font-bold">{t('features.designers.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('features.designers.description')}
                </p>
              </div>
            </Card>
            
            <Card className="group relative overflow-hidden border-2 hover:border-green-500/50 transition-all hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-8">
                <div className="mb-6 inline-flex p-3 rounded-2xl bg-green-500/10 text-green-500">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-heading font-bold">{t('features.fast.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('features.fast.description')}
                </p>
              </div>
            </Card>
            
            <Card className="group relative overflow-hidden border-2 hover:border-blue-500/50 transition-all hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-8">
                <div className="mb-6 inline-flex p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-heading font-bold">{t('features.accessible.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('features.accessible.description')}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-heading font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground font-medium">Professional Tools</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-heading font-bold text-purple-500 mb-2">100K+</div>
              <div className="text-muted-foreground font-medium">Monthly Users</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-heading font-bold text-green-500 mb-2">99.9%</div>
              <div className="text-muted-foreground font-medium">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-heading font-bold text-blue-500 mb-2">0ms</div>
              <div className="text-muted-foreground font-medium">Server Delay</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-32 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-6">
            <Gauge className="w-3 h-3 mr-2" />
            Get Started
          </Badge>
          <h2 className="mb-6 text-4xl sm:text-5xl font-heading font-bold">
            {t('cta.title')}
          </h2>
          <p className="mb-12 text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/tools`}>
              <Button size="lg" className="gap-2 text-lg px-8 h-14 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                {t('cta.viewAllTools')}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}