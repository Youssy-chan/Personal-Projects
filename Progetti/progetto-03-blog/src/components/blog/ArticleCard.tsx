import Link from 'next/link'
import type { Post, Category, Tag, User } from '@prisma/client'
import { HiCalendar, HiEye, HiChat } from 'react-icons/hi'

type PostWithRelations = Post & {
  author: User
  category: Category
  tags: Tag[]
  _count?: { comments: number }
}

export function ArticleCard({ post }: { post: PostWithRelations }) {
  const date = post.publishedAt
    ? new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(post.publishedAt))
    : 'Bozza'

  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <article className="rounded-xl border border-white/8 bg-[#1a1f2e] hover:border-indigo-500/40 transition-all duration-300 overflow-hidden shadow-glow-hover">
        {/* Cover image / gradient */}
        <div className={`h-48 bg-gradient-to-br from-indigo-900/60 to-violet-900/60 relative`}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f2e] to-transparent" />
          <div className="absolute bottom-4 left-4">
            <span className="category-badge">{post.category.name}</span>
          </div>
        </div>

        <div className="p-6">
          <h2 className="font-bold text-lg text-white mb-2 group-hover:text-indigo-300 transition-colors line-clamp-2">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-[#94a3b8] text-sm leading-relaxed mb-4 line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag.id} className="tag-badge text-xs">
                {tag.name}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-[#64748b] text-xs">
            <span className="flex items-center gap-1">
              <HiCalendar size={14} />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <HiEye size={14} />
              {post.views}
            </span>
            {post._count?.comments !== undefined && (
              <span className="flex items-center gap-1">
                <HiChat size={14} />
                {post._count.comments}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
