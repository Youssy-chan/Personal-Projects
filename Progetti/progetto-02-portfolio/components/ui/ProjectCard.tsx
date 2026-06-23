'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { SiGithub } from 'react-icons/si'
import { HiExternalLink } from 'react-icons/hi'
import type { Project } from '@/lib/projects'
import type { Dictionary, Locale } from '@/lib/dictionary'

const statusLabels: Record<string, Record<Project['status'], string>> = {
  it: {
    completato: 'Completato',
    wip: 'In corso',
    pianificato: 'Pianificato',
  },
  en: {
    completato: 'Completed',
    wip: 'In progress',
    pianificato: 'Planned',
  }
}

interface ProjectCardProps {
  project: Project
  lang: Locale
  dict: Dictionary
}

export function ProjectCard({ project, lang, dict }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col rounded-xl overflow-hidden border border-white/8 bg-[#1d2022] hover:border-indigo-500/40 transition-all duration-300 hover:shadow-card-hover"
    >
      {/* Image area */}
      <div className={`relative h-44 bg-gradient-to-br ${project.imageGradient} flex items-center justify-center overflow-hidden`}>
        {/* Project number */}
        <span className="absolute top-4 left-4 font-display text-6xl font-black text-white/10 leading-none select-none">
          {project.number}
        </span>

        {/* Center icon/visual */}
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-2">
            <span className="font-display font-bold text-2xl text-white">{project.number}</span>
          </div>
        </div>

        {/* Status badge */}
        <span
          className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-semibold font-display tracking-wide status-${project.status}`}
        >
          {statusLabels[lang][project.status]}
        </span>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-all duration-300" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Tech badges */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((t) => (
            <span key={t} className="tech-badge">{t}</span>
          ))}
          {project.tech.length > 4 && (
            <span className="tech-badge">+{project.tech.length - 4}</span>
          )}
          <Link href={`/${lang}/progetti/${project.id}`} className="absolute inset-0 z-10">
            <span className="sr-only">{dict.projectDetail.viewDetails} {project.title}</span>
          </Link>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-[1rem] leading-snug text-white group-hover:text-indigo-200 transition-colors duration-200">
          {project.title}
        </h3>

        {/* Short desc */}
        <p className="text-[#94a3b8] text-sm leading-relaxed line-clamp-2 flex-1">
          {project.shortDesc}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <Link
            href={`/${lang}/progetti/${project.id}`}
            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center gap-1"
          >
            {dict.projectDetail.viewDetails} →
          </Link>

          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub — ${project.title}`}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center text-[#94a3b8] hover:text-white transition-all duration-200"
              >
                <SiGithub size={14} />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Demo — ${project.title}`}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-indigo-500/20 border border-white/8 hover:border-indigo-500/40 flex items-center justify-center text-[#94a3b8] hover:text-indigo-300 transition-all duration-200"
              >
                <HiExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
