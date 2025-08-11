import { CryptoDonation } from '@/components/global'
import { useTranslations } from 'next-intl'
import { unstable_setRequestLocale } from 'next-intl/server'

export default async function DonatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  unstable_setRequestLocale(locale)
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <CryptoDonation />
    </div>
  )
}