'use client'

import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { HiCode, HiTerminal, HiLightningBolt, HiCloud } from 'react-icons/hi'
import type { Dictionary, Locale } from '@/lib/dictionary'

interface Props {
  lang: Locale
  dict: Dictionary
}

export function AboutSection({ lang, dict }: Props) {
  const highlights = [
    { icon: HiCode, title: dict.about.highlights.frontend.label, desc: dict.about.highlights.frontend.desc },
    { icon: HiTerminal, title: dict.about.highlights.backend.label, desc: dict.about.highlights.backend.desc },
    { icon: HiLightningBolt, title: dict.about.highlights.performance.label, desc: dict.about.highlights.performance.desc },
    { icon: HiCloud, title: dict.about.highlights.deploy.label, desc: dict.about.highlights.deploy.desc },
  ]

  const stats = [
    { label: dict.about.stats.projects, value: '10' },
    { label: dict.about.stats.tech, value: '15+' },
    { label: dict.about.stats.opensource, value: '100%' },
  ]

  return (
    <section id="about" className="section-gap border-t border-white/5 bg-[#0b0f10]">
      <div className="max-w-container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <AnimatedSection>
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-display font-semibold uppercase tracking-wider mb-4">
              {dict.about.badge}
            </span>
            <h2 className="font-display text-4xl font-bold mb-6">
              {dict.about.title1}{' '}
              <span className="gradient-text">{dict.about.title2}</span>
            </h2>
            <p className="text-[#94a3b8] leading-relaxed mb-4">
              {dict.about.p1}
            </p>
            <p className="text-[#94a3b8] leading-relaxed mb-8">
              {dict.about.p2} <strong className="text-white">{dict.about.p2bold}</strong>{dict.about.p2end}
            </p>

            <div className="flex gap-6">
              {stats.map((s, i) => (
                <>
                  {i > 0 && <div key={`sep-${i}`} className="w-px bg-white/10" />}
                  <div key={s.label}>
                    <p className="font-display text-3xl font-black gradient-text">{s.value}</p>
                    <p className="text-[#94a3b8] text-sm">{s.label}</p>
                  </div>
                </>
              ))}
            </div>
          </AnimatedSection>

          {/* Right — highlights grid */}
          <div className="grid grid-cols-2 gap-4">
            {highlights.map((item, i) => (
              <AnimatedSection key={item.label} delay={i * 0.1} direction="right">
                <div className="glass rounded-xl p-5 hover:border-indigo-500/30 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center mb-3 text-indigo-400 group-hover:bg-indigo-500/25 transition-all duration-300">
                    <item.icon size={20} />
                  </div>
                  <h3 className="font-display font-bold text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-[#64748b] text-xs leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
