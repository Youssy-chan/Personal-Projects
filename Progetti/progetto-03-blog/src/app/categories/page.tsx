import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { Metadata } from 'next'
import { HiFolder } from 'react-icons/hi'

export const metadata: Metadata = {
  title: 'Categorie',
  description: 'Esplora tutti gli articoli del blog divisi per categorie.',
}

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { posts: { where: { published: true } } } },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-2xl mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            Blog
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Tutte le <span className="gradient-text">categorie</span>
          </h1>
          <p className="text-[#94a3b8] leading-relaxed">
            Esplora i contenuti divisi per argomenti. Scegli ciò che ti interessa di più.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="glass rounded-xl p-6 hover:border-indigo-500/40 hover:bg-white/[0.02] transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                  <HiFolder size={20} />
                </div>
                <span className="px-3 py-1 rounded-full bg-white/5 text-[#94a3b8] text-xs font-medium">
                  {category._count.posts} {category._count.posts === 1 ? 'articolo' : 'articoli'}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-indigo-300 transition-colors">
                {category.name}
              </h2>
              {category.description && (
                <p className="text-[#64748b] text-sm leading-relaxed">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
