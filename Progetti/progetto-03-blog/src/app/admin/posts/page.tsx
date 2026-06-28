import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { HiPencil, HiTrash, HiCheck, HiX } from 'react-icons/hi'

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    include: {
      category: true,
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Gestione Articoli</h1>
        <Link
          href="/admin/posts/new"
          className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-glow"
        >
          + Nuovo articolo
        </Link>
      </div>

      <div className="glass rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white/5 text-[#94a3b8] uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Titolo</th>
              <th className="px-6 py-4 font-medium">Categoria</th>
              <th className="px-6 py-4 font-medium text-center">Stato</th>
              <th className="px-6 py-4 font-medium text-center">Commenti</th>
              <th className="px-6 py-4 font-medium text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-white max-w-[300px] truncate">
                  {post.title}
                </td>
                <td className="px-6 py-4">
                  <span className="category-badge text-[10px]">{post.category.name}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  {post.published ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                      <HiCheck size={14} /> Pubblicato
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium">
                      <HiX size={14} /> Bozza
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center text-[#94a3b8]">
                  {post._count.comments}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="inline-flex p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                    aria-label="Modifica"
                  >
                    <HiPencil size={16} />
                  </Link>
                  <button
                    className="inline-flex p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    aria-label="Elimina"
                  >
                    <HiTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className="text-center py-12 text-[#64748b]">
            Nessun articolo trovato. Crea il tuo primo post!
          </div>
        )}
      </div>
    </div>
  )
}
