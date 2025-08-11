import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function MainPage({ params }: Props) {
  const { locale } = await params
  // Redirect from (main) to the actual home page
  redirect(`/${locale}`)
}