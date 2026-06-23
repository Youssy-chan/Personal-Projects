import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['it', 'en']
const defaultLocale = 'it'

export function middleware(request: NextRequest) {
  // Ignoriamo le chiamate API e asset statici
  const { pathname } = request.nextUrl
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Verifica se l'URL contiene già una lingua supportata
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  // Se non c'è lingua, redirect in base a Accept-Language (semplificato) o default
  const acceptLanguage = request.headers.get('accept-language')
  const preferredLocale = acceptLanguage?.includes('en') ? 'en' : defaultLocale

  request.nextUrl.pathname = `/${preferredLocale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
  ],
}
