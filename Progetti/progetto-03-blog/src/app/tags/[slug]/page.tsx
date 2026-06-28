import { prisma } from '@/lib/prisma'
import { ArticleCard } from '@/components/blog/ArticleCard'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { HiArrowLeft, HiHashtag } from 'react-icons/hi'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tag = await prisma.tag.findUnique({
    where: { slug },
    select: { name: true },
  })
  if (!tag) return { title: '404' }
  return {
    title: `Tag: #${tag.name}`,
    description: `Articoli taggati con #${tag.name}`,
  }
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params
  
  const tag = await prisma.tag.findUnique({
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

  if (!tag) notFound()

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-colors mb-8 group"
        >
          <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Torna agli articoli
        </Link>

        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <HiHashtag size={24} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold">
              {tag.name}
            </h1>
          </div>
          <p className="text-[#64748b] text-lg">
            {tag.posts.length} {tag.posts.length === 1 ? 'articolo trovato' : 'articoli trovati'} con questo tag
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tag.posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>

        {tag.posts.length === 0 && (
          <div className="text-center py-20 glass rounded-xl">
            <p className="text-[#64748b] text-lg">Nessun articolo con questo tag.</p>
          </div>
        )}
      </div>
    </div>
  )
}
