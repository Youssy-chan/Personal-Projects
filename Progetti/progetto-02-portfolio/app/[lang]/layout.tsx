import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import '../globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Portfolio — Full-Stack Developer',
    template: '%s | Portfolio Dev',
  },
  description:
    'Portfolio personale di uno sviluppatore Full-Stack. React, Next.js, TypeScript, Node.js. 10 progetti dimostrativi per recruiter.',
  keywords: ['portfolio', 'sviluppatore', 'full-stack', 'React', 'Next.js', 'TypeScript'],
  authors: [{ name: 'Developer' }],
  creator: 'Developer',
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://portfolio.dev',
    title: 'Portfolio — Full-Stack Developer',
    description: 'Portfolio personale con 10 progetti dimostrativi.',
    siteName: 'Portfolio Dev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio — Full-Stack Developer',
    description: 'Portfolio personale con 10 progetti dimostrativi.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

import { getDictionary, Locale } from '@/lib/dictionary'

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dict = getDictionary(lang)

  return (
    <html
      lang={lang}
      className={`${inter.variable} ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[#0f172a] text-[#f8fafc] antialiased">
        <Navbar lang={lang} dict={dict} />
        <main>{children}</main>
        <Footer lang={lang} dict={dict} />
      </body>
    </html>
  )
}
