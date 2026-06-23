'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import type { Dictionary, Locale } from '@/lib/dictionary'

interface Props {
  lang: Locale
  dict: Dictionary
}

export function Navbar({ lang, dict }: Props) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/progetti`, label: dict.nav.projects },
    { href: `/${lang}/#about`, label: dict.nav.about },
    { href: `/${lang}/contatti`, label: dict.nav.contact },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0f172a]/90 backdrop-blur-xl border-b border-white/5 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav
        className="max-w-container mx-auto px-6 h-16 flex items-center justify-between"
        aria-label="Navigazione principale"
      >
        {/* Logo */}
        <Link
          href={`/${lang}`}
          className="font-display font-bold text-xl flex items-center gap-2 group"
          aria-label="Portfolio — torna all'inizio"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-glow-sm group-hover:shadow-glow-md transition-all duration-300">
            &lt;/&gt;
          </span>
          <span className="gradient-text">dev.portfolio</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {navLinks.map((link) => {
            const isActive = link.href === `/${lang}`
              ? pathname === `/${lang}` || pathname === `/${lang}/`
              : pathname.startsWith(link.href) && link.href !== `/${lang}`
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* CTA + hamburger + lang switch */}
        <div className="flex items-center gap-3">
          <Link
            href={pathname.replace(`/${lang}`, lang === 'it' ? '/en' : '/it')}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-white/10 hover:border-indigo-500/50 hover:bg-white/5 transition-all text-xs font-semibold uppercase"
          >
            {lang === 'it' ? 'EN' : 'IT'}
          </Link>
          <Link
            href={`/${lang}/contatti`}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all duration-200 shadow-glow-sm hover:shadow-glow-md"
          >
            {dict.nav.cta}
          </Link>

          <button
            id="hamburger-btn"
            className="md:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
          >
            <span
              className={`block w-5 h-[2px] bg-white rounded transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-[7px]' : ''
              }`}
            />
            <span
              className={`block w-5 h-[2px] bg-white rounded transition-all duration-300 ${
                menuOpen ? 'opacity-0 scale-x-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-[2px] bg-white rounded transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-[7px]' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/5"
          >
            <ul className="px-6 py-4 flex flex-col gap-4" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-2 text-[#94a3b8] hover:text-white text-base font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={pathname.replace(`/${lang}`, lang === 'it' ? '/en' : '/it')}
                  className="block text-center py-2 text-[#94a3b8] border border-white/10 rounded-lg font-medium"
                >
                  {lang === 'it' ? 'Switch to English' : 'Passa all\'Italiano'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/contatti`}
                  className="block text-center px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold"
                >
                  {dict.nav.cta}
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
