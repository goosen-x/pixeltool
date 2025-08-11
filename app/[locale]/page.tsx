import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  // Redirect from /[locale] to /[locale]/projects
  redirect(`/${locale}/projects`)
}