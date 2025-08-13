import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowRight, Code2, Palette, Zap, Globe, Sparkles, Terminal, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HomePageStructuredData } from '@/components/seo/HomePageStructuredData'
import { OnlineUsers } from '@/components/global/OnlineUsers'
import { RippleLoader } from '@/components/global/RippleLoader'
import { HomePageTracker } from '@/components/analytics/HomePageTracker'
import { SectionWidgetsCarousel } from '@/components/homepage/SectionWidgetsCarousel'
import { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  
  const metadata = {
    en: {
      title: 'PixelTool - Free Online Developer Tools & Utilities | 50+ Tools',
      description: 'Professional web developer tools collection: CSS generators, color converters, formatters, validators, and 50+ more utilities. No installation required, 100% free, works offline.',
      keywords: 'developer tools, online tools, CSS generator, color converter, code formatter, web development, programming utilities, free tools, password generator, QR code generator'
    },
    ru: {
      title: 'PixelTool - Бесплатные Онлайн Инструменты для Разработчиков | 50+ Инструментов',
      description: 'Профессиональная коллекция инструментов для веб-разработчиков: CSS генераторы, конвертеры цветов, форматировщики, валидаторы и 50+ утилит. Без установки, 100% бесплатно, работает офлайн.',
      keywords: 'инструменты разработчика, онлайн инструменты, CSS генератор, конвертер цветов, форматировщик кода, веб разработка, утилиты программирования, бесплатные инструменты'
    }
  }
  
  const currentMetadata = metadata[locale as keyof typeof metadata] || metadata.en
  
  return {
    title: currentMetadata.title,
    description: currentMetadata.description,
    keywords: currentMetadata.keywords,
    openGraph: {
      title: currentMetadata.title,
      description: currentMetadata.description,
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'PixelTool - Professional Developer Tools'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: currentMetadata.title,
      description: currentMetadata.description,
      images: ['/og-image.png']
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'ru': '/ru'
      }
    }
  }
}


export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('HomePage')
  
  return (
    <>
      <HomePageStructuredData />
      <HomePageTracker />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        {/* Hero Section */}
      <section className="relative px-4 pt-24 pb-32 sm:px-6 lg:px-8 overflow-hidden">
        {/* Enhanced Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-accent/20 to-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-full blur-3xl" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 -z-5">
          <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-primary/30 rounded-full animate-bounce [animation-delay:0s]" />
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce [animation-delay:1s]" />
          <div className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-primary/50 rounded-full animate-bounce [animation-delay:2s]" />
        </div>
        
        <div className="mx-auto max-w-7xl text-center">
          {/* Status Badge with Online Users */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <OnlineUsers />
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary">{t('hero.liveAndFree')}</span>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
          </div>

          {/* Main Title with ripple animation */}
          <div className="mb-8 flex justify-center items-center gap-8">
            <RippleLoader className="opacity-80 flex-shrink-0" />
            <h1 className="text-6xl sm:text-7xl lg:text-9xl font-heading font-black tracking-tight leading-none">
              PixelTool
            </h1>
          </div>
          
          {/* Enhanced subtitle */}
          <div className="mx-auto mb-6 max-w-4xl">
            <p className="text-2xl sm:text-3xl lg:text-4xl text-muted-foreground font-light mb-4 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <p className="text-lg sm:text-xl text-muted-foreground/80 max-w-2xl mx-auto">
              {t('hero.subtitle2')}
            </p>
          </div>
          
          {/* Enhanced feature badges */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {[
              { icon: Sparkles, label: t('hero.features.professionalTools'), color: 'from-primary to-accent' },
              { icon: Zap, label: t('hero.features.noInstallation'), color: 'from-yellow-500 to-orange-500' },
              { icon: Globe, label: t('hero.features.freeForever'), color: 'from-green-500 to-emerald-500' },
              { icon: Zap, label: t('hero.features.lightningFast'), color: 'from-blue-500 to-cyan-500' }
            ].map((item, idx) => (
              <div key={idx} className="group px-6 py-3 rounded-2xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${item.color}`}>
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href={`/${locale}/tools`}>
              <Button size="lg" className="group gap-3 text-xl px-10 h-16 rounded-2xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105">
                <Terminal className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                {t('hero.exploreTools')}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="https://github.com/goosen-x/pixeltool" target="_blank">
              <Button size="lg" variant="outline" className="gap-3 text-xl px-10 h-16 rounded-2xl bg-background/95 backdrop-blur-sm border-border hover:border-primary hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary/10 dark:hover:text-primary transition-all duration-300">
                <Code2 className="h-6 w-6" />
                {t('hero.viewOnGitHub')}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {[
              { number: '50+', label: t('hero.stats.toolsAvailable') },
              { number: '2.5K+', label: t('hero.stats.happyUsers') },
              { number: '99.9%', label: t('hero.stats.uptime') },
              { number: '0$', label: t('hero.stats.alwaysFree') }
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl bg-background/40 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-300 group">
                <div className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose PixelTool Section */}
      <section className="relative px-4 py-32 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-l from-accent/10 to-transparent rounded-full blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t('whyChoose.trustedBy')}</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t('whyChoose.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('whyChoose.subtitle')}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full p-8 rounded-3xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4">{t('whyChoose.feature1.title')}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('whyChoose.feature1.description')}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">{t('whyChoose.feature1.point1')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">{t('whyChoose.feature1.point2')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full p-8 rounded-3xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-accent/30 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-accent to-accent/80 flex items-center justify-center mb-6">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4">{t('whyChoose.feature2.title')}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('whyChoose.feature2.description')}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">{t('whyChoose.feature2.point1')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">{t('whyChoose.feature2.point2')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-green-500/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full p-8 rounded-3xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-green-500/30 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-green-500 to-green-500/80 flex items-center justify-center mb-6">
                  <Terminal className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4">{t('whyChoose.feature3.title')}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('whyChoose.feature3.description')}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">{t('whyChoose.feature3.point1')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">{t('whyChoose.feature3.point2')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-3xl" />
            <div className="relative p-8 md:p-12 rounded-3xl backdrop-blur-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                    2.5K+
                  </div>
                  <div className="text-sm text-muted-foreground">{t('whyChoose.stats.activeUsers')}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-accent to-green-500 bg-clip-text text-transparent mb-2">
                    50K+
                  </div>
                  <div className="text-sm text-muted-foreground">{t('whyChoose.stats.monthlyUsage')}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-2">
                    15+
                  </div>
                  <div className="text-sm text-muted-foreground">{t('whyChoose.stats.countries')}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-blue-500 to-primary bg-clip-text text-transparent mb-2">
                    24/7
                  </div>
                  <div className="text-sm text-muted-foreground">Доступность сервиса</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Widgets Carousel Section */}
      <SectionWidgetsCarousel />

    </main>
    </>
  )
}