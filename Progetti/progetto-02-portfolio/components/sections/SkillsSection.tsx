'use client'

import { AnimatedSection, StaggerContainer, staggerChild } from '@/components/ui/AnimatedSection'
import { motion } from 'framer-motion'
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiFramer,
  SiHtml5, SiCss, SiNodedotjs, SiExpress, SiPostgresql, SiPrisma,
  SiGit, SiGithubactions, SiDocker, SiVercel, SiFigma, SiPostman,
} from 'react-icons/si'
import { VscVscode } from 'react-icons/vsc'
import type { Dictionary, Locale } from '@/lib/dictionary'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiFramer,
  SiHtml5, SiCss, SiNodedotjs, SiExpress, SiPostgresql, SiPrisma,
  SiGit, SiGithubactions, SiDocker, SiVercel, SiFigma, SiPostman,
  VscVscode,
}

const levelColors = {
  expert: 'border-green-500/30 text-green-400',
  advanced: 'border-indigo-500/30 text-indigo-400',
  intermediate: 'border-violet-500/30 text-violet-400',
}

const levelLabels = {
  expert: 'Expert',
  advanced: 'Advanced',
  intermediate: 'Mid',
}

const skillGroups = [
  {
    label: 'Front-end',
    skills: [
      { name: 'React', icon: 'SiReact', level: 'expert' as const },
      { name: 'Next.js', icon: 'SiNextdotjs', level: 'expert' as const },
      { name: 'TypeScript', icon: 'SiTypescript', level: 'expert' as const },
      { name: 'Tailwind CSS', icon: 'SiTailwindcss', level: 'expert' as const },
      { name: 'Framer Motion', icon: 'SiFramer', level: 'advanced' as const },
      { name: 'HTML5', icon: 'SiHtml5', level: 'expert' as const },
      { name: 'CSS3', icon: 'SiCss', level: 'expert' as const },
    ],
  },
  {
    label: 'Back-end',
    skills: [
      { name: 'Node.js', icon: 'SiNodedotjs', level: 'advanced' as const },
      { name: 'Express', icon: 'SiExpress', level: 'advanced' as const },
      { name: 'PostgreSQL', icon: 'SiPostgresql', level: 'advanced' as const },
      { name: 'Prisma', icon: 'SiPrisma', level: 'intermediate' as const },
      { name: 'Postman', icon: 'SiPostman', level: 'advanced' as const },
    ],
  },
  {
    label: 'Tools & DevOps',
    skills: [
      { name: 'Git', icon: 'SiGit', level: 'expert' as const },
      { name: 'GitHub Actions', icon: 'SiGithubactions', level: 'intermediate' as const },
      { name: 'Docker', icon: 'SiDocker', level: 'intermediate' as const },
      { name: 'Vercel', icon: 'SiVercel', level: 'advanced' as const },
      { name: 'VS Code', icon: 'VscVscode', level: 'expert' as const },
      { name: 'Figma', icon: 'SiFigma', level: 'intermediate' as const },
    ],
  },
]

interface Props {
  lang: Locale
  dict: Dictionary
}

export function SkillsSection({ lang, dict }: Props) {
  return (
    <section id="skills" className="section-gap border-t border-white/5">
      <div className="max-w-container mx-auto px-6">
        <AnimatedSection className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-display font-semibold uppercase tracking-wider mb-4">
            {dict.skills.badge}
          </span>
          <h2 className="font-display text-4xl font-bold mb-4">
            {dict.skills.title1}{' '}
            <span className="gradient-text">{dict.skills.title2}</span>
          </h2>
          <p className="text-[#94a3b8] max-w-lg mx-auto">
            {dict.skills.description}
          </p>
        </AnimatedSection>

        <div className="space-y-12">
          {skillGroups.map((group) => (
            <AnimatedSection key={group.label}>
              <h3 className="font-display font-semibold text-sm text-[#64748b] uppercase tracking-wider mb-5">
                {group.label}
              </h3>
              <StaggerContainer className="flex flex-wrap gap-3">
                {group.skills.map((skill) => {
                  const Icon = iconMap[skill.icon]
                  return (
                    <motion.div
                      key={skill.name}
                      variants={staggerChild}
                      whileHover={{ y: -4, scale: 1.04 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl glass border hover:border-indigo-500/40 transition-all duration-200 cursor-default group"
                    >
                      {Icon && (
                        <Icon size={16} className="text-[#94a3b8] group-hover:text-indigo-400 transition-colors duration-200" />
                      )}
                      <span className="font-display font-medium text-sm text-[#c7c4d7] group-hover:text-white transition-colors duration-200">
                        {skill.name}
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${levelColors[skill.level]}`}>
                        {levelLabels[skill.level]}
                      </span>
                    </motion.div>
                  )
                })}
              </StaggerContainer>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
