import Link from 'next/link'
import { SiGithub } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa6'
import type { Dictionary, Locale } from '@/lib/dictionary'

const socials = [
  { icon: SiGithub, href: 'https://github.com/Youssy-chan/Personal-Projects', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/youssef-el-jihad-858775254', label: 'LinkedIn' },
]

interface Props {
  lang: Locale
  dict: Dictionary
}

export function Footer({ lang, dict }: Props) {
  const footerLinks = [
    {
      title: dict.footer.nav,
      links: [
        { label: dict.nav.home, href: `/${lang}` },
        { label: dict.nav.projects, href: `/${lang}/progetti` },
        { label: dict.nav.about, href: `/${lang}/#about` },
        { label: dict.nav.contact, href: `/${lang}/contatti` },
      ],
    },
    {
      title: dict.footer.projects,
      links: [
        { label: 'Landing Page', href: `/${lang}/progetti/landing-page-lumino` },
        { label: 'Portfolio', href: `/${lang}/progetti/portfolio-personale` },
        { label: 'Blog Full-Stack', href: `/${lang}/progetti/blog-fullstack` },
        { label: 'API REST', href: `/${lang}/progetti/api-rest` },
      ],
    },
  ]

  return (
    <footer className="border-t border-white/5 bg-[#0b0f10]">
      <div className="max-w-container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={`/${lang}`} className="inline-flex items-center gap-2 mb-4 group">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                &lt;/&gt;
              </span>
              <span className="font-display font-bold text-xl gradient-text">dev.portfolio</span>
            </Link>
            <p className="text-[#94a3b8] text-sm leading-relaxed max-w-xs">
              {dict.footer.description}
            </p>
            <div className="flex gap-3 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-[#94a3b8] hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-sm text-[#94a3b8] uppercase tracking-wider mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5" role="list">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#64748b] hover:text-[#94a3b8] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#64748b] text-sm">© {new Date().getFullYear()} dev.portfolio. {dict.footer.rights}</p>
          <p className="text-[#64748b] text-sm">
            {dict.footer.builtWith}{' '}
            <span className="text-indigo-400">Next.js</span>,{' '}
            <span className="text-violet-400">TypeScript</span> &amp;{' '}
            <span className="text-indigo-400">Framer Motion</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
