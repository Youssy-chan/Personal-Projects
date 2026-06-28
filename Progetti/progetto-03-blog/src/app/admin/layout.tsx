import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { HiHome, HiDocumentText, HiChat, HiLogout } from 'react-icons/hi'

const adminNav = [
  { label: 'Dashboard', href: '/admin', icon: HiHome },
  { label: 'Articoli', href: '/admin/posts', icon: HiDocumentText },
  { label: 'Commenti', href: '/admin/comments', icon: HiChat },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0d12] p-6 hidden lg:block">
        <div className="mb-8">
          <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Admin Panel</p>
          <p className="text-sm text-white font-semibold">{session.user?.name}</p>
          <p className="text-xs text-[#64748b]">{session.user?.email}</p>
        </div>

        <nav className="space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5 mt-8">
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
          >
            <HiLogout size={18} />
            Esci
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-6 lg:p-10 overflow-auto">
        {children}
      </div>
    </div>
  )
}
