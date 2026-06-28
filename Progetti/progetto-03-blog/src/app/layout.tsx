import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'DevBlog — Youssef El Jihad',
    template: '%s | DevBlog',
  },
  description: 'Blog tecnico su sviluppo web, TypeScript, React, Next.js e backend. Articoli, tutorial e note di progetto.',
  keywords: ['blog', 'sviluppo web', 'TypeScript', 'React', 'Next.js', 'tutorial'],
  authors: [{ name: 'Youssef El Jihad' }],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'DevBlog — Youssef El Jihad',
    description: 'Blog tecnico su sviluppo web moderno.',
    siteName: 'DevBlog',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
