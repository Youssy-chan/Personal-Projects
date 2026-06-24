import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getProjectById, getProjects } from '@/lib/projects'
import { SiGithub } from 'react-icons/si'
import { HiExternalLink, HiArrowLeft } from 'react-icons/hi'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { getDictionary, Locale } from '@/lib/dictionary'

interface Props {
  params: Promise<{ lang: string; id: string }>
}

export async function generateStaticParams() {
  const projects = getProjects('it')
  return projects.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam, id } = await params
  const lang = (langParam as Locale) ?? 'it'
  const project = getProjectById(id, lang)
  if (!project) return { title: '404' }
  return {
    title: project.title,
    description: project.shortDesc,
  }
}

const statusConfig: Record<string, Record<string, { label: string, class: string }>> = {
  it: {
    completato: { label: 'Completato', class: 'status-completato' },
    wip: { label: 'In corso', class: 'status-wip' },
    pianificato: { label: 'Pianificato', class: 'status-pianificato' },
  },
  en: {
    completato: { label: 'Completed', class: 'status-completato' },
    wip: { label: 'In progress', class: 'status-wip' },
    pianificato: { label: 'Planned', class: 'status-pianificato' },
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { lang: langParam, id } = await params
  const lang = (langParam as Locale) ?? 'it'
  const project = getProjectById(id, lang)
  const dict = getDictionary(lang)
  const projects = getProjects(lang)

  if (!project) notFound()

  const status = statusConfig[lang][project.status]

  // Next/prev project
  const currentIndex = projects.findIndex((p) => p.id === id)
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-container mx-auto px-6 py-16">
        {/* Back link */}
        <AnimatedSection>
          <Link
            href={`/${lang}/progetti`}
            className="inline-flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-colors duration-200 mb-10 group"
          >
            <HiArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
            {dict.projectDetail.back}
          </Link>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-display text-5xl font-black text-white/10">{project.number}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold font-display ${status.class}`}>
                  {status.label}
                </span>
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-black leading-tight mb-4">
                {project.title}
              </h1>
              <p className="text-[#94a3b8] text-lg leading-relaxed mb-8">
                {project.shortDesc}
              </p>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 mb-10">
                {project.tech.map((t) => (
                  <span key={t} className="tech-badge text-sm px-3 py-1.5">{t}</span>
                ))}
              </div>
            </AnimatedSection>

            {/* Markdown description */}
            <AnimatedSection delay={0.15}>
              <div className="glass rounded-2xl p-8 prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.description}
                </ReactMarkdown>
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <AnimatedSection delay={0.2} direction="right">
              {/* Links */}
              <div className="glass rounded-xl p-6 space-y-3">
                <h3 className="font-display font-semibold text-white mb-4">{dict.projectDetail.links}</h3>
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 hover:border-indigo-500/40 text-[#94a3b8] hover:text-white transition-all duration-200 text-sm"
                  >
                    <SiGithub size={16} />
                    {dict.projectDetail.repo}
                  </a>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/3 border border-white/5 text-[#64748b] text-sm cursor-not-allowed">
                    <SiGithub size={16} />
                    {dict.projectDetail.noRepo}
                  </div>
                )}
                {project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 hover:border-indigo-500/50 text-indigo-300 hover:text-white transition-all duration-200 text-sm"
                  >
                    <HiExternalLink size={16} />
                    {dict.projectDetail.demo}
                  </a>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/3 border border-white/5 text-[#64748b] text-sm cursor-not-allowed">
                    <HiExternalLink size={16} />
                    {dict.projectDetail.noDemo}
                  </div>
                )}
              </div>

              {/* Highlights */}
              <div className="glass rounded-xl p-6 mt-6">
                <h3 className="font-display font-semibold text-white mb-4">{dict.projectDetail.highlights}</h3>
                <ul className="space-y-3">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                      <span className="text-indigo-400 mt-0.5 flex-shrink-0">→</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Category */}
              <div className="glass rounded-xl p-6 mt-6">
                <h3 className="font-display font-semibold text-white mb-3">{dict.projectDetail.category}</h3>
                <span className="tech-badge capitalize text-sm">{project.category}</span>
              </div>
            </AnimatedSection>
          </aside>
        </div>

        {/* Prev/Next navigation */}
        <div className="border-t border-white/5 mt-16 pt-8 grid sm:grid-cols-2 gap-4">
          {prevProject ? (
            <Link
              href={`/${lang}/progetti/${prevProject.id}`}
              className="group glass rounded-xl p-5 hover:border-indigo-500/40 transition-all duration-200"
            >
              <p className="text-xs text-[#64748b] mb-1">← {dict.projectDetail.prev}</p>
              <p className="font-display font-semibold text-[#94a3b8] group-hover:text-white transition-colors duration-200">
                {prevProject.title}
              </p>
            </Link>
          ) : <div />}
          {nextProject && (
            <Link
              href={`/${lang}/progetti/${nextProject.id}`}
              className="group glass rounded-xl p-5 hover:border-indigo-500/40 transition-all duration-200 text-right"
            >
              <p className="text-xs text-[#64748b] mb-1">{dict.projectDetail.next} →</p>
              <p className="font-display font-semibold text-[#94a3b8] group-hover:text-white transition-colors duration-200">
                {nextProject.title}
              </p>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
