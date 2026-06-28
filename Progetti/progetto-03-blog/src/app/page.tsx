import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ArticleCard } from '@/components/blog/ArticleCard'
import { HiArrowRight } from 'react-icons/hi'

export default async function HomePage() {
  const [latestPosts, categories, tags, totalPosts] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      include: {
        author: true,
        category: true,
        tags: true,
        _count: { select: { comments: { where: { approved: true } } } },
      },
      orderBy: { publishedAt: 'desc' },
      take: 6,
    }),
    prisma.category.findMany({
      include: { _count: { select: { posts: { where: { published: true } } } } },
      orderBy: { name: 'asc' },
    }),
    prisma.tag.findMany({
      include: { _count: { select: { posts: { where: { published: true } } } } },
      orderBy: { name: 'asc' },
    }),
    prisma.post.count({ where: { published: true } }),
  ])

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6">
            Blog Tecnico
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Codice, idee e{' '}
            <span className="gradient-text">appunti di sviluppo</span>
          </h1>
          <p className="text-[#94a3b8] text-lg md:text-xl leading-relaxed mb-8">
            Articoli su sviluppo web, TypeScript, React, Next.js e backend.
            Tutorial pratici e note dai miei progetti.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-200 shadow-glow"
            >
              Leggi gli articoli
              <HiArrowRight />
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/10 hover:border-indigo-500/40 text-[#94a3b8] hover:text-white font-semibold transition-all duration-200"
            >
              Esplora categorie
            </Link>
          </div>
        </div>
      </section>

      {/* Latest posts */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">
            Ultimi <span className="gradient-text">articoli</span>
          </h2>
          <Link
            href="/posts"
            className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
          >
            Vedi tutti ({totalPosts})
            <HiArrowRight size={14} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {latestPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>

        {/* Sidebar-style sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Categories */}
          <div className="glass rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4">Categorie</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <span className="text-[#94a3b8] group-hover:text-white transition-colors text-sm">
                    {cat.name}
                  </span>
                  <span className="text-xs text-[#64748b] bg-white/5 px-2 py-0.5 rounded-full">
                    {cat._count.posts}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Tags cloud */}
          <div className="glass rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4">Tag popolari</h3>
            <div className="flex flex-wrap gap-2">
              {tags
                .filter((t) => t._count.posts > 0)
                .map((tag) => (
                  <Link key={tag.id} href={`/tags/${tag.slug}`} className="tag-badge">
                    {tag.name}
                    <span className="text-[#64748b] ml-1">({tag._count.posts})</span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
