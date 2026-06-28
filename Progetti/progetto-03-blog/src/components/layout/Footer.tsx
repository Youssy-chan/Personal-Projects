import Link from 'next/link'
import { SiGithub } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa6'

const socials = [
  { icon: SiGithub, href: 'https://github.com/Youssy-chan/Personal-Projects', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/youssef-el-jihad-858775254', label: 'LinkedIn' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0d12]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                {'</>'}
              </span>
              <span className="font-bold gradient-text">DevBlog</span>
            </Link>
            <p className="text-[#64748b] text-sm leading-relaxed">
              Blog tecnico su sviluppo web, TypeScript, React e backend. Articoli e tutorial per sviluppatori.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-sm text-[#94a3b8] uppercase tracking-wider mb-4">
              Navigazione
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Articoli', href: '/posts' },
                { label: 'Categorie', href: '/categories' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#64748b] hover:text-[#94a3b8] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="font-semibold text-sm text-[#94a3b8] uppercase tracking-wider mb-4">
              Connettiti
            </h4>
            <div className="flex gap-3">
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
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#64748b] text-sm">
            © {new Date().getFullYear()} DevBlog. Tutti i diritti riservati.
          </p>
          <p className="text-[#64748b] text-sm">
            Costruito con{' '}
            <span className="text-indigo-400">Next.js</span>,{' '}
            <span className="text-violet-400">Prisma</span> &{' '}
            <span className="text-indigo-400">PostgreSQL</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
