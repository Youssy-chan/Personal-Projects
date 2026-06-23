import Link from 'next/link'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { HiArrowRight, HiMail } from 'react-icons/hi'
import type { Dictionary, Locale } from '@/lib/dictionary'

interface Props {
  lang: Locale
  dict: Dictionary
}

export function CtaSection({ lang, dict }: Props) {
  return (
    <section className="section-gap border-t border-white/5 relative overflow-hidden">
      {/* BG glow */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-transparent to-violet-950/20 pointer-events-none"
      />
      <div
        aria-hidden
        className="hero-orb w-[400px] h-[400px] bg-indigo-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ opacity: 0.08 }}
      />

      <div className="relative z-10 max-w-container mx-auto px-6 text-center">
        <AnimatedSection className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-display font-semibold uppercase tracking-wider mb-6">
            {dict.cta.badge}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            {dict.cta.title1}{' '}
            <span className="gradient-text">{dict.cta.title2}</span>
          </h2>
          <p className="text-[#94a3b8] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {dict.cta.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${lang}/contatti`}
              className="inline-flex items-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg transition-all duration-200 shadow-glow-sm hover:shadow-glow-md group"
            >
              <HiMail size={20} />
              {dict.cta.button}
              <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              href={`/${lang}/progetti`}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold text-lg transition-all duration-200"
            >
              {dict.cta.explore}
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
