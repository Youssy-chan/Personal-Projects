import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { HiCalendar, HiEye, HiArrowLeft, HiUser } from 'react-icons/hi'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CommentSection } from '@/components/blog/CommentSection'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  })
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, excerpt: true },
  })
  if (!post) return { title: '404' }
  return {
    title: post.title,
    description: post.excerpt || undefined,
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params

  // Increment views
  const post = await prisma.post.update({
    where: { slug },
    data: { views: { increment: 1 } },
    include: {
      author: true,
      category: true,
      tags: true,
      comments: {
        where: { approved: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!post || !post.published) notFound()

  const date = post.publishedAt
    ? new Intl.DateTimeFormat('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(post.publishedAt))
    : ''

  // Get prev/next posts
  const allPosts = await prisma.post.findMany({
    where: { published: true },
    select: { id: true, title: true, slug: true },
    orderBy: { publishedAt: 'desc' },
  })
  const idx = allPosts.findIndex((p) => p.id === post.id)
  const prevPost = idx > 0 ? allPosts[idx - 1] : null
  const nextPost = idx < allPosts.length - 1 ? allPosts[idx + 1] : null

  return (
    <div className="min-h-screen pt-24">
      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Back */}
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-colors mb-8 group"
        >
          <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Torna agli articoli
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Link href={`/categories/${post.category.slug}`} className="category-badge">
              {post.category.name}
            </Link>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-[#94a3b8] text-lg leading-relaxed mb-6">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-[#64748b]">
            <span className="flex items-center gap-1.5">
              <HiUser size={16} />
              {post.author.name}
            </span>
            <span className="flex items-center gap-1.5">
              <HiCalendar size={16} />
              {date}
            </span>
            <span className="flex items-center gap-1.5">
              <HiEye size={16} />
              {post.views} letture
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <Link key={tag.id} href={`/tags/${tag.slug}`} className="tag-badge">
                {tag.name}
              </Link>
            ))}
          </div>
        </header>

        {/* Content */}
        <div className="glass rounded-2xl p-6 md:p-10 mb-12">
          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Comments */}
        <CommentSection postId={post.id} comments={post.comments} />

        {/* Prev/Next */}
        <div className="border-t border-white/5 mt-12 pt-8 grid sm:grid-cols-2 gap-4">
          {prevPost ? (
            <Link
              href={`/posts/${prevPost.slug}`}
              className="group glass rounded-xl p-5 hover:border-indigo-500/40 transition-all"
            >
              <p className="text-xs text-[#64748b] mb-1">← Precedente</p>
              <p className="font-semibold text-[#94a3b8] group-hover:text-white transition-colors text-sm">
                {prevPost.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {nextPost && (
            <Link
              href={`/posts/${nextPost.slug}`}
              className="group glass rounded-xl p-5 hover:border-indigo-500/40 transition-all text-right"
            >
              <p className="text-xs text-[#64748b] mb-1">Successivo →</p>
              <p className="font-semibold text-[#94a3b8] group-hover:text-white transition-colors text-sm">
                {nextPost.title}
              </p>
            </Link>
          )}
        </div>
      </article>
    </div>
  )
}
