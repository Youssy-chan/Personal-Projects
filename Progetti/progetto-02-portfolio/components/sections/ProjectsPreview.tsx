import Link from 'next/link'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { getProjects } from '@/lib/projects'
import { HiArrowRight } from 'react-icons/hi'
import type { Dictionary, Locale } from '@/lib/dictionary'

interface Props {
  lang: Locale
  dict: Dictionary
}

export function ProjectsPreview({ lang, dict }: Props) {
  const projects = getProjects(lang)
  const featured = projects.slice(0, 3)

  return (
    <section id="progetti" className="section-gap border-t border-white/5 bg-[#0b0f10]">
      <div className="max-w-container mx-auto px-6">
        <AnimatedSection className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-display font-semibold uppercase tracking-wider mb-3">
              {dict.projectsPreview.badge}
            </span>
            <h2 className="font-display text-4xl font-bold">
              {dict.projectsPreview.title1} <span className="gradient-text">{dict.projectsPreview.title2}</span>
            </h2>
          </div>
          <Link
            href={`/${lang}/progetti`}
            className="flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-200 group"
          >
            {dict.projectsPreview.viewAll}
            <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((project, i) => (
            <AnimatedSection key={project.id} delay={i * 0.1}>
              <ProjectCard project={project} lang={lang} dict={dict} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// CtaSection
export function CtaSection() {
  return null // definita nel file separato
}
