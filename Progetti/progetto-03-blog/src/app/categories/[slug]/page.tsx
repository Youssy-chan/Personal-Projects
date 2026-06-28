import { prisma } from '@/lib/prisma'
import { ArticleCard } from '@/components/blog/ArticleCard'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { HiArrowLeft } from 'react-icons/hi'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, description: true },
  })
  if (!category) return { title: '404' }
  return {
    title: `Categoria: ${category.name}`,
    description: category.description || `Articoli nella categoria ${category.name}`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { published: true },
        include: {
          author: true,
          category: true,
          tags: true,
          _count: { select: { comments: { where: { approved: true } } } },
        },
        orderBy: { publishedAt: 'desc' },
      },
    },
  })

  if (!category) notFound()

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-colors mb-8 group"
        >
          <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Tutte le categorie
        </Link>

        <div className="max-w-2xl mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            Categoria
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-[#94a3b8] leading-relaxed text-lg">
              {category.description}
            </p>
          )}
          <p className="text-[#64748b] mt-4">
            {category.posts.length} {category.posts.length === 1 ? 'articolo trovato' : 'articoli trovati'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>

        {category.posts.length === 0 && (
          <div className="text-center py-20 glass rounded-xl">
            <p className="text-[#64748b] text-lg">Nessun articolo in questa categoria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
