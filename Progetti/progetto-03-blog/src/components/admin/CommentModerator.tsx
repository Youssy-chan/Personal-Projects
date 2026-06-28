'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Comment, Post } from '@prisma/client'
import { HiCheck, HiX, HiTrash } from 'react-icons/hi'

type CommentWithPost = Comment & { post: { title: string, slug: string } }

export function CommentModerator({ comments }: { comments: CommentWithPost[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpdate = async (id: string, approved: boolean) => {
    setLoading(id)
    try {
      await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved })
      })
      router.refresh()
    } catch (e) {
      console.error(e)
    }
    setLoading(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo commento?')) return
    setLoading(id)
    try {
      await fetch(`/api/comments/${id}`, { method: 'DELETE' })
      router.refresh()
    } catch (e) {
      console.error(e)
    }
    setLoading(null)
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <div key={comment.id} className="glass rounded-xl p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-semibold text-white">{comment.authorName}</span>
              <span className="text-xs text-[#64748b]">{comment.authorEmail}</span>
              {!comment.approved && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium">In attesa</span>
              )}
            </div>
            <p className="text-[#94a3b8] text-sm mb-2">{comment.content}</p>
            <p className="text-xs text-[#64748b]">
              Articolo: <a href={`/posts/${comment.post.slug}`} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">{comment.post.title}</a>
            </p>
          </div>
          
          <div className="flex gap-2">
            {!comment.approved ? (
              <button
                onClick={() => handleUpdate(comment.id, true)}
                disabled={loading === comment.id}
                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                title="Approva"
              >
                <HiCheck size={18} />
              </button>
            ) : (
              <button
                onClick={() => handleUpdate(comment.id, false)}
                disabled={loading === comment.id}
                className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
                title="Rifiuta (Nascondi)"
              >
                <HiX size={18} />
              </button>
            )}
            <button
              onClick={() => handleDelete(comment.id)}
              disabled={loading === comment.id}
              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              title="Elimina"
            >
              <HiTrash size={18} />
            </button>
          </div>
        </div>
      ))}

      {comments.length === 0 && (
        <div className="text-center py-12 text-[#64748b] glass rounded-xl">
          Nessun commento trovato.
        </div>
      )}
    </div>
  )
}
