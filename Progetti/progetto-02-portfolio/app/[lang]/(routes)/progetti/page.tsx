'use client'

import { useState, use } from 'react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { getProjects } from '@/lib/projects'
import { getDictionary, Locale } from '@/lib/dictionary'

export default function ProgettiPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = use(params)
  const lang = (langParam as Locale) ?? 'it'
  const dict = getDictionary(lang)
  const projects = getProjects(lang)

  const categories = [
    { id: 'all', label: dict.projectsPage.categories.all },
    { id: 'front-end', label: dict.projectsPage.categories.frontend },
    { id: 'full-stack', label: dict.projectsPage.categories.fullstack },
    { id: 'backend', label: dict.projectsPage.categories.backend },
    { id: 'devops', label: dict.projectsPage.categories.devops },
    { id: 'cms', label: dict.projectsPage.categories.cms },
  ] as const

  const [active, setActive] = useState<string>('all')

  const filteredProjects =
    active === 'all' ? projects : projects.filter((p) => p.category === active)

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-container mx-auto px-6 section-gap">
        {/* Header */}
        <AnimatedSection className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-display font-semibold uppercase tracking-wider mb-6">
            {dict.projectsPage.badge}
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            {dict.projectsPage.title1} <span className="gradient-text">{dict.projectsPage.title2}</span>
          </h1>
          <p className="text-[#94a3b8] text-lg leading-relaxed">
            {dict.projectsPage.description}
          </p>
        </AnimatedSection>

        {/* Filter tabs */}
        <AnimatedSection delay={0.1} className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold font-display transition-all duration-200 ${
                active === cat.id
                  ? 'bg-indigo-600 text-white shadow-glow-sm'
                  : 'bg-white/5 border border-white/8 text-[#94a3b8] hover:border-indigo-500/40 hover:text-white'
              }`}
            >
              {cat.label}
              {cat.id !== 'all' && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({projects.filter((p) => p.category === cat.id).length})
                </span>
              )}
            </button>
          ))}
        </AnimatedSection>

        {/* Projects grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project, i) => (
              <AnimatedSection key={project.id} delay={i * 0.05}>
                <ProjectCard project={project} lang={lang} dict={dict} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-[#64748b] text-lg">{dict.projectsPage.empty}</p>
          </div>
        )}
      </div>
    </div>
  )
}
