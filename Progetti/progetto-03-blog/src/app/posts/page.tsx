import { prisma } from '@/lib/prisma'
import { ArticleCard } from '@/components/blog/ArticleCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tutti gli Articoli',
  description: 'Sfoglia tutti gli articoli del blog su sviluppo web, TypeScript, React e backend.',
}

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: true,
      category: true,
      tags: true,
      _count: { select: { comments: { where: { approved: true } } } },
    },
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-2xl mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            Blog
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Tutti gli <span className="gradient-text">articoli</span>
          </h1>
          <p className="text-[#94a3b8] leading-relaxed">
            {posts.length} articoli pubblicati su sviluppo web, TypeScript, React e molto altro.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#64748b] text-lg">Nessun articolo pubblicato ancora.</p>
          </div>
        )}
      </div>
    </div>
  )
}
