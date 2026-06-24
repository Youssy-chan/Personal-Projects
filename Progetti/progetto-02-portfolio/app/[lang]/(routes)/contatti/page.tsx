'use client'

import { useState, use } from 'react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { HiMail, HiLocationMarker } from 'react-icons/hi'
import { SiGithub } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa6'
import type { Locale } from '@/lib/dictionary'
import { getDictionary } from '@/lib/dictionary'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

const socials = [
  { icon: SiGithub, label: 'GitHub', href: 'https://github.com/Youssy-chan/Personal-Projects', handle: 'Youssy-chan' },
  { icon: FaLinkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/youssef-el-jihad-858775254', handle: 'youssef-el-jihad-858775254' },
]

export default function ContattiPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = use(params)
  const lang = (langParam as Locale) ?? 'it'
  const dict = getDictionary(lang)

  const subjects = [
    { value: 'job', label: dict.contactPage.form.subjects.job },
    { value: 'freelance', label: dict.contactPage.form.subjects.freelance },
    { value: 'project', label: dict.contactPage.form.subjects.project },
    { value: 'other', label: dict.contactPage.form.subjects.other },
  ]

  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || dict.contactPage.validation.error)
      }

      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000)
    } catch (error: any) {
      console.error('Submit error:', error)
      setStatus('error')
      setErrorMessage(error.message || dict.contactPage.validation.error)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-container mx-auto px-6">
        
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-display font-semibold uppercase tracking-wider mb-4">
            {dict.contactPage.badge}
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-6">
            {dict.contactPage.title1} <span className="gradient-text">{dict.contactPage.title2}</span>
          </h1>
          <p className="text-[#94a3b8] text-lg max-w-xl mx-auto">
            {dict.contactPage.description}
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 max-w-5xl mx-auto">
          
          {/* Info & Socials */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatedSection delay={0.1}>
              <div className="p-6 rounded-2xl glass border flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                  <HiMail size={20} />
                </div>
                <div>
                  <p className="font-display font-semibold text-white mb-0.5">{dict.contactPage.email}</p>
                  <a href="mailto:yousselji03@gmail.com" className="text-[#94a3b8] hover:text-indigo-300 transition-colors duration-200 text-sm">
                    yousselji03@gmail.com
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-2xl glass border flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 shrink-0">
                  <HiLocationMarker size={20} />
                </div>
                <div>
                  <p className="font-display font-semibold text-white mb-0.5">{dict.contactPage.location}</p>
                  <p className="text-[#94a3b8] text-sm">{dict.contactPage.locationValue}</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <h3 className="font-display font-semibold text-white mb-4 pl-2">{dict.contactPage.social}</h3>
              <div className="space-y-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-200 group"
                  >
                    <s.icon className="text-[#94a3b8] group-hover:text-indigo-400 transition-colors" size={20} />
                    <div>
                      <p className="text-white font-medium text-sm">{s.label}</p>
                      <p className="text-[#64748b] text-xs">{s.handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Form */}
          <AnimatedSection delay={0.3} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="p-8 rounded-2xl glass border flex flex-col gap-5">
              
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-[#c7c4d7]">{dict.contactPage.form.name}</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#0b0f10] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-[#64748b] focus:outline-none focus:border-indigo-500/50 transition-colors"
                    placeholder={dict.contactPage.form.namePlaceholder}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-[#c7c4d7]">{dict.contactPage.form.email}</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#0b0f10] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-[#64748b] focus:outline-none focus:border-indigo-500/50 transition-colors"
                    placeholder={dict.contactPage.form.emailPlaceholder}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-[#c7c4d7]">{dict.contactPage.form.subject}</label>
                <select
                  id="subject"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-[#0b0f10] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none"
                >
                  <option value="" disabled>{dict.contactPage.form.subjectPlaceholder}</option>
                  {subjects.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label htmlFor="message" className="text-sm font-medium text-[#c7c4d7]">{dict.contactPage.form.message}</label>
                  <span className="text-xs text-[#64748b]">{form.message.length}/500 {dict.contactPage.form.chars}</span>
                </div>
                <textarea
                  id="message"
                  required
                  maxLength={500}
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-[#0b0f10] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-[#64748b] focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
                  placeholder={dict.contactPage.form.messagePlaceholder}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="mt-2 w-full py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-glow-sm hover:shadow-glow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? dict.contactPage.form.loading : dict.contactPage.form.submit}
              </button>

              {status === 'success' && (
                <div className="mt-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
                  {dict.contactPage.validation.success}
                </div>
              )}

              {status === 'error' && (
                <div className="mt-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {errorMessage}
                </div>
              )}
            </form>
          </AnimatedSection>
        </div>

      </div>
    </div>
  )
}
