import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { HiDocumentText, HiChat, HiEye, HiPencil } from 'react-icons/hi'

export default async function AdminDashboard() {
  const [totalPosts, publishedPosts, totalComments, pendingComments, totalViews] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.comment.count(),
    prisma.comment.count({ where: { approved: false } }),
    prisma.post.aggregate({ _sum: { views: true } }),
  ])

  const recentPosts = await prisma.post.findMany({
    include: { category: true },
    orderBy: { updatedAt: 'desc' },
    take: 5,
  })

  const stats = [
    { label: 'Articoli totali', value: totalPosts, icon: HiDocumentText, color: 'text-indigo-400 bg-indigo-400/10' },
    { label: 'Pubblicati', value: publishedPosts, icon: HiEye, color: 'text-emerald-400 bg-emerald-400/10' },
    { label: 'Commenti', value: totalComments, icon: HiChat, color: 'text-violet-400 bg-violet-400/10' },
    { label: 'In attesa', value: pendingComments, icon: HiChat, color: 'text-amber-400 bg-amber-400/10' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          href="/admin/posts/new"
          className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-glow"
        >
          + Nuovo articolo
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-5">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-[#64748b]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Total views */}
      <div className="glass rounded-xl p-5 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-400/10 text-sky-400 flex items-center justify-center">
            <HiEye size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalViews._sum.views || 0}</p>
            <p className="text-sm text-[#64748b]">Visualizzazioni totali</p>
          </div>
        </div>
      </div>

      {/* Recent posts */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="font-bold">Articoli recenti</h2>
        </div>
        <div className="divide-y divide-white/5">
          {recentPosts.map((post) => (
            <div key={post.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-white truncate">{post.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="category-badge text-[10px]">{post.category.name}</span>
                  <span className={`text-xs ${post.published ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {post.published ? '● Pubblicato' : '○ Bozza'}
                  </span>
                </div>
              </div>
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className="text-[#64748b] hover:text-white transition-colors p-2"
              >
                <HiPencil size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
