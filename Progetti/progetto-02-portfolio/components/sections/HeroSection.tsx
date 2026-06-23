'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { SiGithub } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa6'
import { HiArrowRight, HiDownload } from 'react-icons/hi'
import type { Dictionary, Locale } from '@/lib/dictionary'

const techStack = [
  'React', 'Next.js', 'TypeScript', 'Node.js',
  'Tailwind CSS', 'PostgreSQL', 'Framer Motion', 'Prisma',
]

interface Props {
  lang: Locale
  dict: Dictionary
}

export function HeroSection({ lang, dict }: Props) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
      aria-label="Sezione hero"
    >
      {/* Background orbs */}
      <div aria-hidden="true">
        <div className="hero-orb w-[600px] h-[600px] bg-indigo-600 -top-32 -right-32 animate-pulse-slow" />
        <div className="hero-orb w-[400px] h-[400px] bg-violet-700 bottom-0 -left-20" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-container mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
              {dict.hero.badge}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl lg:text-6xl font-black leading-tight mb-6"
            >
              {dict.hero.greeting}{' '}
              <span className="gradient-text">{dict.hero.developer}</span>
              <br />
              <span className="text-[#94a3b8] text-4xl lg:text-5xl font-bold">
                {dict.hero.role}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#94a3b8] text-lg leading-relaxed mb-8 max-w-lg"
            >
              {dict.hero.description}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <Link
                href={`/${lang}/progetti`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-200 shadow-glow-sm hover:shadow-glow-md group"
              >
                {dict.hero.viewProjects}
                <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <a
                href={`/cv-${lang}.pdf`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-transparent border border-white/15 hover:border-indigo-500/50 text-[#94a3b8] hover:text-white font-semibold transition-all duration-200"
              >
                <HiDownload />
                {dict.hero.downloadCv}
              </a>
            </motion.div>

            {/* Socials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex items-center gap-4"
            >
              <a
                href="https://github.com/Youssy-chan/Personal-Projects"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex items-center gap-2 text-[#64748b] hover:text-white transition-colors duration-200 text-sm"
              >
                <SiGithub size={18} />
                GitHub
              </a>
              <span className="w-px h-4 bg-white/10" />
              <a
                href="https://www.linkedin.com/in/youssef-el-jihad-858775254"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex items-center gap-2 text-[#64748b] hover:text-white transition-colors duration-200 text-sm"
              >
                <FaLinkedin size={18} />
                LinkedIn
              </a>
            </motion.div>
          </div>

          {/* Right — Code editor mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="hidden lg:block animate-float"
            aria-hidden="true"
          >
            <div className="glass rounded-2xl overflow-hidden shadow-card glow">
              {/* Window bar */}
              <div className="bg-[#272a2c] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-4 text-xs text-[#64748b] font-mono">portfolio.tsx</span>
              </div>
              {/* Code */}
              <div className="p-5 font-mono text-sm leading-relaxed">
                <p><span className="text-violet-400">import</span> <span className="text-[#94a3b8]">&#123; motion &#125;</span> <span className="text-violet-400">from</span> <span className="text-amber-300">'framer-motion'</span></p>
                <p className="mt-1"><span className="text-violet-400">import</span> <span className="text-[#94a3b8]">&#123; projects &#125;</span> <span className="text-violet-400">from</span> <span className="text-amber-300">'@/lib/projects'</span></p>
                <p className="mt-3 text-[#64748b]">{'// Portfolio personale — 10 progetti'}</p>
                <p className="mt-1">
                  <span className="text-violet-400">export default function</span>{' '}
                  <span className="text-indigo-300">Portfolio</span>
                  <span className="text-[#94a3b8]">() &#123;</span>
                </p>
                <p className="ml-4 text-[#94a3b8]"><span className="text-violet-400">return</span> (</p>
                <p className="ml-8"><span className="text-indigo-300">&lt;main</span> <span className="text-amber-300">className</span><span className="text-[#94a3b8]">=</span><span className="text-green-400">"portfolio"</span><span className="text-indigo-300">&gt;</span></p>
                <p className="ml-12"><span className="text-indigo-300">&lt;Hero</span> <span className="text-[#94a3b8]">/&gt;</span></p>
                <p className="ml-12"><span className="text-indigo-300">&lt;Skills</span> <span className="text-[#94a3b8]">/&gt;</span></p>
                <p className="ml-12"><span className="text-indigo-300">&lt;Projects</span> <span className="text-amber-300">items</span><span className="text-[#94a3b8]">=&#123;</span><span className="text-indigo-300">projects</span><span className="text-[#94a3b8]">&#125;</span> <span className="text-[#94a3b8]">/&gt;</span></p>
                <p className="ml-8"><span className="text-indigo-300">&lt;/main&gt;</span></p>
                <p className="ml-4 text-[#94a3b8]">)</p>
                <p className="text-[#94a3b8]">&#125;</p>
                <p className="mt-3 flex items-center gap-1">
                  <span className="inline-block w-2 h-4 bg-indigo-400 animate-pulse rounded-sm" />
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tech stack marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-20 border-t border-white/5 pt-8"
        >
          <p className="text-center text-xs text-[#64748b] uppercase tracking-widest font-display mb-6">
            {dict.hero.stack}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {techStack.map((tech) => (
              <span key={tech} className="tech-badge text-xs px-3 py-1">{tech}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
